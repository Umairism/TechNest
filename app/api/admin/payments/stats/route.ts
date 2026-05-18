import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PaymentService } from "@/lib/services/payment.service";

/**
 * GET /api/admin/payments/stats
 * Get payment statistics (Admin only)
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
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [paymentStats, orderStats, codStats, mobileMoneyStats] = await Promise.all([
      PaymentService.getPaymentStats(startDate, new Date()),
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          totalAmount: true,
        },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: {
          method: "cod",
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: {
          method: {
            in: ["jazzcash", "easypaisa"],
          },
          createdAt: {
            gte: startDate,
          },
        },
        _sum: {
          amount: true,
        },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        paymentStats,
        orderStats: {
          total: orderStats._count,
          totalRevenue: orderStats._sum.totalAmount || 0,
        },
        codStats: {
          count: codStats._count,
          amount: codStats._sum.amount || 0,
        },
        mobileMoneyStats: {
          count: mobileMoneyStats._count,
          amount: mobileMoneyStats._sum.amount || 0,
        },
        period: {
          startDate,
          endDate: new Date(),
          days,
        },
      },
    });
  } catch (error) {
    console.error("[Admin Payment Stats API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payment statistics" },
      { status: 500 }
    );
  }
}
