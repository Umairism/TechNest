import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { InventoryService } from "@/lib/services/inventory.service";

/**
 * GET /api/admin/inventory
 * Get inventory stats and low stock items
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "all";

    let data;

    if (status === "low") {
      data = await InventoryService.getLowStockProducts();
    } else if (status === "out") {
      data = await InventoryService.getOutOfStockProducts();
    } else {
      // Get all inventory
      data = await InventoryService.getAllProducts();
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[Admin Inventory API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inventory
 * Update inventory
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
    const { productId, quantity } = body;

    if (!productId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    const updated = await InventoryService.updateStock(productId, quantity);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Inventory updated successfully",
    });
  } catch (error) {
    console.error("[Admin Inventory API] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update inventory" },
      { status: 500 }
    );
  }
}
