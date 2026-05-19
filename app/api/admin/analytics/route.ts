import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const [orders, users, topProducts, payments] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
      prisma.orderItem.groupBy({ by: ["productId"], _sum: { quantity: true, total: true }, orderBy: { _sum: { total: "desc" } }, take: 10 }),
      prisma.payment.groupBy({ by: ["status"], _sum: { amount: true }, _count: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        users,
        topProducts,
        payments,
        revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: orders.length ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      },
    });
  } catch (error) {
    return apiError(error, "Admin Analytics API");
  }
}
