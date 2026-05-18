import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PaymentService } from "@/lib/services/payment.service";
import { InventoryService } from "@/lib/services/inventory.service";

/**
 * POST /api/payments/cod/confirm
 * Confirm Cash on Delivery (COD) payment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, payment: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (order.paymentMethod !== "cod") {
      return NextResponse.json(
        { success: false, error: "Order is not COD" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "confirmed",
        paymentStatus: "unpaid", // COD is unpaid until collected
      },
    });

    // Confirm inventory (move from reserved to sold)
    for (const item of order.items) {
      await InventoryService.confirmSale(item.productId, item.quantity);
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order confirmed. We will deliver your items soon!",
    });
  } catch (error) {
    console.error("[COD Payment API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
