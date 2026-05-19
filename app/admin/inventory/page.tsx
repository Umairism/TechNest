import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function updateStock(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const productId = String(formData.get("productId"));
  const quantity = Number(formData.get("quantity") || 0);
  await prisma.inventory.upsert({
    where: { productId },
    update: { quantity },
    create: { productId, quantity },
  });
  await prisma.product.update({ where: { id: productId }, data: { stock: quantity, status: quantity > 0 ? "published" : "out_of_stock" } });
  revalidatePath("/admin/inventory");
}

export default async function InventoryPage() {
  const products = await prisma.product.findMany({ include: { inventory: true, category: true }, orderBy: { stock: "asc" }, take: 150 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Control</h1>
        <p className="mt-1 text-muted-foreground">Monitor stock, reservations, sell-through, and low-stock risks.</p>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Reserved</th><th className="p-4">Sold</th><th className="p-4">Stock</th><th className="p-4 text-right">Update</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/60">
                <td className="p-4 font-medium">{product.name}<div className="text-xs text-muted-foreground">{product.sku}</div></td>
                <td className="p-4">{product.category.name}</td>
                <td className="p-4">{product.inventory?.reserved || 0}</td>
                <td className="p-4">{product.inventory?.sold || 0}</td>
                <td className="p-4">{product.inventory?.quantity ?? product.stock}</td>
                <td className="p-4">
                  <form action={updateStock} className="flex justify-end gap-2">
                    <input type="hidden" name="productId" value={product.id} />
                    <input name="quantity" type="number" defaultValue={product.inventory?.quantity ?? product.stock} className="w-24 rounded-md border border-border bg-background px-2 py-1" />
                    <Button type="submit" size="sm">Save</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
