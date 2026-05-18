import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { InventoryService } from "@/lib/services/inventory.service";

/**
 * POST /api/admin/products
 * Create new product (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      categoryId,
      price,
      originalPrice,
      brand,
      sku,
      images,
      specifications,
      stock,
      featured,
    } = body;

    // Validate required fields
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product slug already exists" },
        { status: 400 }
      );
    }

    // Check if SKU is unique
    if (sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku },
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
        name,
        slug,
        description,
        categoryId,
        price,
        originalPrice,
        brand,
        sku: sku || `SKU-${Date.now()}`,
        images: images || [],
        specifications: specifications || {},
        featured: featured || false,
        active: true,
      },
    });

    // Initialize inventory
    await InventoryService.initializeInventory(product.id, stock || 0);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Admin Products API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
