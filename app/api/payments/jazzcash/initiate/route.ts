import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PaymentService } from "@/lib/services/payment.service";

/**
 * POST /api/payments/jazzcash/initiate
 * Initiate JazzCash payment
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
    const { orderId, phoneNumber } = body;

    if (!orderId || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Order ID and phone number are required" },
        { status: 400 }
      );
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
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

    // Initiate payment
    const paymentResult = await PaymentService.initiateJazzCashPayment(
      orderId,
      order.totalAmount,
      phoneNumber,
      order.user.email || "",
      `${process.env.NEXT_PUBLIC_SITE_URL}/payment/jazzcash/return`
    );

    return NextResponse.json({
      success: true,
      data: paymentResult,
    });
  } catch (error) {
    console.error("[JazzCash Payment API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate JazzCash payment" },
      { status: 500 }
    );
  }
}
