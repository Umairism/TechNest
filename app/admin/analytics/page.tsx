import { BarChart3, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";

export default async function AnalyticsPage() {
  const [orders, users, revenue, topProducts, payments] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.order.aggregate({ where: { paymentStatus: "paid" }, _sum: { totalAmount: true } }),
    prisma.orderItem.groupBy({ by: ["productId"], _sum: { quantity: true, total: true }, orderBy: { _sum: { total: "desc" } }, take: 8 }),
    prisma.payment.groupBy({ by: ["status"], _sum: { amount: true }, _count: true }),
  ]);

  const productIds = topProducts.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true } });
  const names = new Map(products.map((product) => [product.id, product.name]));
  const totalRevenue = revenue._sum.totalAmount || 0;
  const conversionRate = users.length ? (orders.length / users.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
        <p className="mt-1 text-muted-foreground">Revenue, conversion, user growth, product performance, and transaction health.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total revenue" value={`PKR ${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Orders" value={orders.length.toLocaleString()} icon={ShoppingCart} />
        <StatCard title="Users" value={users.length.toLocaleString()} icon={Users} />
        <StatCard title="Conversion" value={`${conversionRate.toFixed(1)}%`} icon={TrendingUp} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">Best-selling Products</h2>
          </div>
          <div className="space-y-3">
            {topProducts.map((item) => {
              const width = Math.min(100, (item._sum.total || 0) / Math.max(1, totalRevenue) * 100);
              return (
                <div key={item.productId}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{names.get(item.productId) || "Unknown product"}</span>
                    <span>PKR {(item._sum.total || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded bg-secondary"><div className="h-2 rounded bg-accent" style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Payment Health</h2>
          <div className="mt-4 space-y-3">
            {payments.map((payment) => (
              <div key={payment.status} className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="capitalize">{payment.status}</span>
                <span>{payment._count} · PKR {(payment._sum.amount || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
