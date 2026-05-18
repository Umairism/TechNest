import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PaymentMethod } from "@prisma/client";
import { PaymentService } from "@/lib/services/payment.service";
import { InventoryService } from "@/lib/services/inventory.service";

/**
 * GET /api/orders
 * Fetch user's orders
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("[Orders API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create new order
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
    const {
      paymentMethod,
      shippingAddress,
      billingAddress,
      cartItems,
    }: {
      paymentMethod: PaymentMethod;
      shippingAddress: any;
      billingAddress?: any;
      cartItems: Array<{ productId: string; quantity: number }>;
    } = body;

    // Validate input
    if (!paymentMethod || !shippingAddress || !cartItems?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Verify and reserve items
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      // Check stock
      await InventoryService.reserveStock(item.productId, item.quantity);

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    // Calculate taxes
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const shippingCost = 200; // Fixed shipping cost in PKR
    const totalAmount = subtotal + tax + shippingCost;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        paymentMethod,
        status: "pending",
        paymentStatus: "unpaid",
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Create payment record
    const payment = await PaymentService.createPayment(
      order.id,
      totalAmount,
      paymentMethod
    );

    // If COD, payment is ready to process
    if (paymentMethod === "cod") {
      const codResult = await PaymentService.processCOD(order.id);

      return NextResponse.json({
        success: true,
        data: {
          order,
          payment,
          message: codResult.message,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        payment,
        message: "Order created. Please complete payment.",
      },
    });
  } catch (error) {
    console.error("[Orders API] Error:", error);

    // Release reserved stock on error
    const body = await request.json();
    if (body.cartItems) {
      for (const item of body.cartItems) {
        try {
          await InventoryService.releaseStock(item.productId, item.quantity);
        } catch (e) {
          console.error("Error releasing stock:", e);
        }
      }
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
