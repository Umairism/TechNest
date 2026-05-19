import Link from "next/link";
import { BarChart3, Bell, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [products, pendingProducts, users, orders, openOrders, revenue, lowStock, alerts] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "pending" } }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["pending", "confirmed", "processing", "shipped"] } } }),
      prisma.order.aggregate({ where: { paymentStatus: "paid" }, _sum: { totalAmount: true } }),
      prisma.product.findMany({
        where: { OR: [{ stock: { lte: 5 } }, { inventory: { is: { quantity: { lte: 5 } } } }] },
        take: 6,
        orderBy: { stock: "asc" },
      }),
      prisma.notification.findMany({ take: 6, orderBy: { createdAt: "desc" } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="mt-1 text-muted-foreground">
            Live operational snapshot for catalog, orders, revenue, and moderation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Add product</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/settings">Platform settings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Revenue" value={`PKR ${(revenue._sum.totalAmount || 0).toLocaleString()}`} detail="Paid order revenue" icon={DollarSign} />
        <StatCard title="Orders" value={orders.toLocaleString()} detail={`${openOrders} still active`} icon={ShoppingCart} />
        <StatCard title="Products" value={products.toLocaleString()} detail={`${pendingProducts} awaiting approval`} icon={Package} />
        <StatCard title="Users" value={users.toLocaleString()} detail="All customer and staff accounts" icon={Users} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">Track fulfillment and payment movement.</p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders">Manage</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="py-3 font-medium">Order</th>
                  <th className="py-3 font-medium">Customer</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60">
                    <td className="py-3 font-medium">{order.orderNumber}</td>
                    <td className="py-3 text-muted-foreground">{order.user.name || order.user.email}</td>
                    <td className="py-3 capitalize">{order.status}</td>
                    <td className="py-3 text-right">PKR {order.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold">Alerts</h2>
            </div>
            <div className="space-y-3">
              {alerts.length ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="rounded-md border border-border p-3">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No alerts yet.</p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold">Low Stock Watch</h2>
            </div>
            <div className="space-y-3">
              {lowStock.length ? (
                lowStock.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-md border border-border p-3">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-amber-500">{product.stock} left</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Inventory looks healthy.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
