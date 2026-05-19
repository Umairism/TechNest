import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function createCategory(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.category.create({
    data: {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      parentId: String(formData.get("parentId") || "") || null,
      description: String(formData.get("description") || ""),
      bannerUrl: String(formData.get("bannerUrl") || ""),
      thumbnailUrl: String(formData.get("thumbnailUrl") || ""),
      seoTitle: String(formData.get("seoTitle") || ""),
      seoDescription: String(formData.get("seoDescription") || ""),
      sortOrder: Number(formData.get("sortOrder") || 0),
      featured: formData.get("featured") === "on",
    },
  });
  revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  await prisma.category.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/categories");
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { parent: true, _count: { select: { products: true, children: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card className="p-5">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create nested categories with banners and SEO metadata.</p>
        <form action={createCategory} className="mt-5 space-y-3">
          <input name="name" required placeholder="Category name" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="slug" required placeholder="category-slug" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <select name="parentId" className="w-full rounded-md border border-border bg-background px-3 py-2">
            <option value="">No parent</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <textarea name="description" placeholder="Description" className="min-h-20 w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="bannerUrl" placeholder="Banner URL" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="thumbnailUrl" placeholder="Thumbnail URL" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="seoTitle" placeholder="SEO title" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <textarea name="seoDescription" placeholder="SEO description" className="min-h-16 w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="sortOrder" type="number" placeholder="Sort order" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" /> Featured</label>
          <Button type="submit" className="w-full">Create category</Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Taxonomy</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Parent</th>
                <th className="p-4">Products</th>
                <th className="p-4">SEO</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border/60">
                  <td className="p-4 font-medium">{category.name}<div className="text-xs text-muted-foreground">{category.slug}</div></td>
                  <td className="p-4">{category.parent?.name || "Root"}</td>
                  <td className="p-4">{category._count.products}</td>
                  <td className="p-4">{category.seoTitle || "Not set"}</td>
                  <td className="p-4 text-right">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <Button type="submit" size="sm" variant="destructive">Delete</Button>
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
