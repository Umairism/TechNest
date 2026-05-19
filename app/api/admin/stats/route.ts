import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, apiError } from "@/lib/admin";

type BestSellerRow = {
  productId: string;
  _sum: {
    quantity: number | null;
    total: number | null;
  };
};

type ProductNameRow = {
  id: string;
  name: string;
};

type DailyRevenueRow = {
  createdAt: Date;
  _sum: {
    totalAmount: number | null;
  };
};

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [
      totalProducts,
      pendingProducts,
      lowStockProducts,
      totalUsers,
      totalOrders,
      openOrders,
      revenueResult,
      recentOrders,
      recentNotifications,
      bestSellers,
      dailyRevenue,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "pending" } }),
      prisma.product.count({ where: { OR: [{ stock: { lte: 5 } }, { inventory: { is: { quantity: { lte: 5 } } } }] } }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["pending", "confirmed", "processing", "shipped"] } } }),
      prisma.order.aggregate({
        where: { paymentStatus: "paid" },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.notification.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: since }, paymentStatus: "paid" },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;
    const productIds = (bestSellers as BestSellerRow[]).map((item: BestSellerRow) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const productById = new Map(
      (products as ProductNameRow[]).map((product: ProductNameRow) => [product.id, product.name])
    );

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        pendingProducts,
        lowStockProducts,
        totalUsers,
        totalOrders,
        openOrders,
        totalRevenue,
        conversionRate: totalUsers ? Number(((totalOrders / totalUsers) * 100).toFixed(2)) : 0,
        recentOrders,
        recentNotifications,
        bestSellers: (bestSellers as BestSellerRow[]).map((item: BestSellerRow) => ({
          productId: item.productId,
          name: productById.get(item.productId) || "Unknown product",
          quantity: item._sum.quantity || 0,
          revenue: item._sum.total || 0,
        })),
        dailyRevenue: (dailyRevenue as DailyRevenueRow[]).map((item: DailyRevenueRow) => ({
          date: item.createdAt.toISOString().slice(0, 10),
          revenue: item._sum.totalAmount || 0,
        })),
      },
    });
  } catch (error) {
    return apiError(error, "Admin Stats API");
  }
}
