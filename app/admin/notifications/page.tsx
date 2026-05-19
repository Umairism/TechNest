import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function markRead(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await prisma.notification.update({ where: { id: String(formData.get("id")) }, data: { read: true } });
  revalidatePath("/admin/notifications");
}

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const reviews = await prisma.productReview.findMany({
    where: { status: "pending" },
    include: { product: true, user: true },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h1 className="text-2xl font-bold">Notifications & Alerts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Orders, product approval requests, vendor registrations, low stock, and system alerts.</p>
        </div>
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs capitalize">{notification.type.replace("_", " ")}</span>
                  <span className="text-xs text-muted-foreground">{notification.createdAt.toLocaleString()}</span>
                </div>
                <p className="mt-2 font-medium">{notification.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
              </div>
              {!notification.read ? (
                <form action={markRead}>
                  <input type="hidden" name="id" value={notification.id} />
                  <Button type="submit" size="sm" variant="outline">Mark read</Button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Moderation Queue</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pending product reviews and user-generated submissions.</p>
        <div className="mt-4 space-y-3">
          {reviews.length ? reviews.map((review) => (
            <div key={review.id} className="rounded-md border border-border p-3">
              <p className="text-sm font-medium">{review.product.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{review.user.email} · {review.rating}/5</p>
              <p className="mt-2 text-sm">{review.comment || review.title}</p>
            </div>
          )) : <p className="text-sm text-muted-foreground">No pending reviews.</p>}
        </div>
      </Card>
    </div>
  );
}
