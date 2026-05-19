import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function updateUser(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: String(formData.get("id")) },
    data: {
      role: String(formData.get("role")) as any,
      status: String(formData.get("status")) as any,
    },
  });
  revalidatePath("/admin/users");
}

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true, reviews: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="mt-1 text-muted-foreground">Assign roles, suspend accounts, verify vendors, and inspect customer activity.</p>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/60">
                  <td className="p-4">
                    <div className="font-medium">{user.name || "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4 capitalize">{user.status.replace("_", " ")}</td>
                  <td className="p-4">{user._count.orders}</td>
                  <td className="p-4">{user.createdAt.toLocaleDateString()}</td>
                  <td className="p-4">
                    <form action={updateUser} className="flex justify-end gap-2">
                      <input type="hidden" name="id" value={user.id} />
                      <select name="role" defaultValue={user.role} className="rounded-md border border-border bg-background px-2 py-1">
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                      <select name="status" defaultValue={user.status} className="rounded-md border border-border bg-background px-2 py-1">
                        <option value="active">Active</option>
                        <option value="pending_verification">Pending verification</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                      </select>
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
