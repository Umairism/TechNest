import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function updateOrder(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.order.update({
    where: { id: String(formData.get("id")) },
    data: {
      status: String(formData.get("status")) as any,
      paymentStatus: String(formData.get("paymentStatus")) as any,
      trackingId: String(formData.get("trackingId") || "") || null,
      notes: String(formData.get("notes") || "") || null,
    },
  });
  revalidatePath("/admin/orders");
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { user: true, payment: true, items: { include: { product: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders & Transactions</h1>
          <p className="mt-1 text-muted-foreground">Manage fulfillment, payments, refunds, tracking, and invoices.</p>
        </div>
        <Button asChild variant="outline">
          <a href="/api/admin/orders?limit=100">Export JSON</a>
        </Button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Operations</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/60 align-top">
                  <td className="p-4 font-medium">{order.orderNumber}<div className="text-xs text-muted-foreground">{order.createdAt.toLocaleString()}</div></td>
                  <td className="p-4">{order.user.name || order.user.email}<div className="text-xs text-muted-foreground">{order.user.phone}</div></td>
                  <td className="p-4">{order.items.length}</td>
                  <td className="p-4 capitalize">{order.paymentMethod} / {order.paymentStatus}</td>
                  <td className="p-4">PKR {order.totalAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <form action={updateOrder} className="grid min-w-[520px] grid-cols-5 gap-2">
                      <input type="hidden" name="id" value={order.id} />
                      <select name="status" defaultValue={order.status} className="rounded-md border border-border bg-background px-2 py-1">
                        {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <select name="paymentStatus" defaultValue={order.paymentStatus} className="rounded-md border border-border bg-background px-2 py-1">
                        {["unpaid", "paid", "failed", "refunded"].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <input name="trackingId" defaultValue={order.trackingId || ""} placeholder="Tracking" className="rounded-md border border-border bg-background px-2 py-1" />
                      <input name="notes" defaultValue={order.notes || ""} placeholder="Notes" className="rounded-md border border-border bg-background px-2 py-1" />
                      <Button type="submit" size="sm">Save</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
