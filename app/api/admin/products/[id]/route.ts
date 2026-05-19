import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, inventory: true, collections: true, productCategories: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return apiError(error, "Admin Product GET API");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const { id } = await params;
    const body = await request.json();
    const stock = Number(body.stock);
    const updateData: any = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      categoryId: body.categoryId,
      price: body.price === undefined ? undefined : Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      brand: body.brand,
      sku: body.sku,
      images: Array.isArray(body.images) ? body.images : undefined,
      specifications: body.specifications,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      variants: body.variants,
      featured: body.featured,
      trending: body.trending,
      hidden: body.hidden,
      draft: body.draft,
      active: body.active,
      status: body.status,
      rejectionReason: body.rejectionReason,
    };

    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);
    if (updateData.status === "published") updateData.publishedAt = new Date();

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { inventory: true, category: true },
    });

    if (Number.isFinite(stock)) {
      await prisma.inventory.upsert({
        where: { productId: id },
        update: { quantity: stock },
        create: { productId: id, quantity: stock },
      });
      await prisma.product.update({ where: { id }, data: { stock } });
    }

    await writeAuditLog({
      actorId: session?.user.id,
      action: "product.update",
      entity: "Product",
      entityId: id,
      metadata: updateData,
      request,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return apiError(error, "Admin Product PATCH API");
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    await writeAuditLog({
      actorId: session?.user.id,
      action: "product.delete",
      entity: "Product",
      entityId: id,
      request,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Admin Product DELETE API");
  }
}
