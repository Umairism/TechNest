import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { InventoryService } from "@/lib/services/inventory.service";
import { apiError, getPagination, paginatedResponse, requireAdmin, writeAuditLog } from "@/lib/admin";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional().nullable(),
  brand: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  specifications: z.any().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  hidden: z.boolean().optional(),
  draft: z.boolean().optional(),
  active: z.boolean().optional(),
  status: z.enum(["pending", "approved", "rejected", "published", "draft", "hidden", "out_of_stock"]).optional(),
  tags: z.array(z.string()).optional(),
  variants: z.any().optional(),
});

/**
 * POST /api/admin/products
 * Create new product (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const parsed = productSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const body = parsed.data;

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product slug already exists" },
        { status: 400 }
      );
    }

    // Check if SKU is unique
    if (body.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: body.sku },
      });
      if (existingSku) {
        return NextResponse.json(
          { success: false, error: "SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        categoryId: body.categoryId,
        price: body.price,
        originalPrice: body.originalPrice || null,
        brand: body.brand,
        sku: body.sku || `SKU-${Date.now()}`,
        images: body.images || [],
        specifications: body.specifications || {},
        tags: body.tags || [],
        variants: body.variants,
        featured: body.featured || false,
        trending: body.trending || false,
        hidden: body.hidden || false,
        draft: body.draft || false,
        active: body.active ?? true,
        status: body.status || "published",
        publishedAt: body.status === "published" || !body.status ? new Date() : null,
      },
    });

    // Initialize inventory
    await InventoryService.initializeInventory(product.id, body.stock || 0);
    await writeAuditLog({
      actorId: session?.user.id,
      action: "product.create",
      entity: "Product",
      entityId: product.id,
      request,
    });

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error, "Admin Products API");
  }
}

/**
 * GET /api/admin/products
 * Get all products (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPagination(request);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const sort = searchParams.get("sort") || "createdAt";
    const direction = searchParams.get("direction") === "asc" ? "asc" : "desc";

    let where: any = {};
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      };
    }
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        inventory: true,
      },
      take: limit,
      skip,
      orderBy: { [sort]: direction },
    });

    const total = await prisma.product.count({ where });

    return paginatedResponse(products, page, limit, total);
  } catch (error) {
    return apiError(error, "Admin Products GET API");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];
    const action = body.action as string;

    if (!ids.length || !action) {
      return NextResponse.json({ success: false, error: "ids and action are required" }, { status: 400 });
    }

    const data: any = {};
    if (action === "approve") data.status = "approved";
    if (action === "publish") {
      data.status = "published";
      data.active = true;
      data.hidden = false;
      data.draft = false;
      data.publishedAt = new Date();
    }
    if (action === "reject") data.status = "rejected";
    if (action === "hide") {
      data.status = "hidden";
      data.hidden = true;
      data.active = false;
    }
    if (action === "draft") {
      data.status = "draft";
      data.draft = true;
      data.active = false;
    }
    if (action === "category" && body.categoryId) data.categoryId = body.categoryId;
    if (action === "stock" && Number.isFinite(Number(body.stock))) data.stock = Number(body.stock);

    if (!Object.keys(data).length) {
      return NextResponse.json({ success: false, error: "Unsupported bulk action" }, { status: 400 });
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data,
    });

    await writeAuditLog({
      actorId: session?.user.id,
      action: `product.bulk.${action}`,
      entity: "Product",
      metadata: { ids, data },
      request,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return apiError(error, "Admin Products Bulk API");
  }
}
