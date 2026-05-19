import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function updateProduct(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const id = String(formData.get("id"));
  const stock = Number(formData.get("stock") || 0);
  await prisma.product.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      description: String(formData.get("description")),
      sku: String(formData.get("sku")),
      categoryId: String(formData.get("categoryId")),
      price: Number(formData.get("price") || 0),
      originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
      brand: String(formData.get("brand") || ""),
      images: String(formData.get("images") || "").split("\n").map((image) => image.trim()).filter(Boolean),
      tags: String(formData.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
      stock,
      featured: formData.get("featured") === "on",
      trending: formData.get("trending") === "on",
      hidden: formData.get("hidden") === "on",
      draft: formData.get("status") === "draft",
      active: formData.get("status") === "published",
      status: String(formData.get("status")) as any,
      publishedAt: formData.get("status") === "published" ? new Date() : null,
    },
  });
  await prisma.inventory.upsert({ where: { productId: id }, update: { quantity: stock }, create: { productId: id, quantity: stock } });
  redirect("/admin/products");
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { inventory: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) redirect("/admin/products");

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="p-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <form action={updateProduct} className="mt-6 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={product.id} />
          <input name="name" required defaultValue={product.name} className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="slug" required defaultValue={product.slug} className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="sku" defaultValue={product.sku} className="rounded-md border border-border bg-background px-3 py-2" />
          <select name="categoryId" required defaultValue={product.categoryId} className="rounded-md border border-border bg-background px-3 py-2">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input name="price" required type="number" min="0" step="0.01" defaultValue={product.price} className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="originalPrice" type="number" min="0" step="0.01" defaultValue={product.originalPrice || ""} className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="brand" defaultValue={product.brand || ""} className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="stock" type="number" min="0" defaultValue={product.inventory?.quantity ?? product.stock} className="rounded-md border border-border bg-background px-3 py-2" />
          <select name="status" defaultValue={product.status} className="rounded-md border border-border bg-background px-3 py-2">
            {["pending", "approved", "rejected", "published", "draft", "hidden", "out_of_stock"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input name="tags" defaultValue={product.tags.join(", ")} className="rounded-md border border-border bg-background px-3 py-2" />
          <textarea name="description" required defaultValue={product.description} className="min-h-32 rounded-md border border-border bg-background px-3 py-2 md:col-span-2" />
          <textarea name="images" defaultValue={product.images.join("\n")} className="min-h-24 rounded-md border border-border bg-background px-3 py-2 md:col-span-2" />
          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input name="trending" type="checkbox" defaultChecked={product.trending} /> Trending</label>
            <label className="flex items-center gap-2 text-sm"><input name="hidden" type="checkbox" defaultChecked={product.hidden} /> Hidden</label>
          </div>
          <Button type="submit" className="md:col-span-2">Save product</Button>
        </form>
      </Card>
    </div>
  );
}
