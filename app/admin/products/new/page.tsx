import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function createProduct(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const product = await prisma.product.create({
    data: {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      description: String(formData.get("description")),
      sku: String(formData.get("sku") || `SKU-${Date.now()}`),
      categoryId: String(formData.get("categoryId")),
      price: Number(formData.get("price") || 0),
      originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
      brand: String(formData.get("brand") || ""),
      images: String(formData.get("images") || "").split("\n").map((image) => image.trim()).filter(Boolean),
      tags: String(formData.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
      stock: Number(formData.get("stock") || 0),
      featured: formData.get("featured") === "on",
      trending: formData.get("trending") === "on",
      hidden: formData.get("hidden") === "on",
      draft: formData.get("status") === "draft",
      active: formData.get("status") === "published",
      status: String(formData.get("status")) as any,
      publishedAt: formData.get("status") === "published" ? new Date() : null,
    },
  });

  await prisma.inventory.create({ data: { productId: product.id, quantity: product.stock } });
  redirect("/admin/products");
}

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="p-6">
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="mt-1 text-muted-foreground">Create catalog items with pricing, inventory, tags, workflow status, and media.</p>
        <form action={createProduct} className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="name" required placeholder="Product name" className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="slug" required placeholder="product-slug" className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="sku" placeholder="SKU" className="rounded-md border border-border bg-background px-3 py-2" />
          <select name="categoryId" required className="rounded-md border border-border bg-background px-3 py-2">
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input name="price" required type="number" min="0" step="0.01" placeholder="Price" className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="originalPrice" type="number" min="0" step="0.01" placeholder="Original price" className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="brand" placeholder="Brand" className="rounded-md border border-border bg-background px-3 py-2" />
          <input name="stock" type="number" min="0" placeholder="Stock" className="rounded-md border border-border bg-background px-3 py-2" />
          <select name="status" defaultValue="published" className="rounded-md border border-border bg-background px-3 py-2">
            {["pending", "approved", "rejected", "published", "draft", "hidden", "out_of_stock"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input name="tags" placeholder="Tags, comma separated" className="rounded-md border border-border bg-background px-3 py-2" />
          <textarea name="description" required placeholder="Description" className="min-h-32 rounded-md border border-border bg-background px-3 py-2 md:col-span-2" />
          <textarea name="images" placeholder="Image URLs, one per line" className="min-h-24 rounded-md border border-border bg-background px-3 py-2 md:col-span-2" />
          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input name="trending" type="checkbox" /> Trending</label>
            <label className="flex items-center gap-2 text-sm"><input name="hidden" type="checkbox" /> Hidden</label>
          </div>
          <Button type="submit" className="md:col-span-2">Create product</Button>
        </form>
      </Card>
    </div>
  );
}
