import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function saveContent(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.siteContent.upsert({
    where: { key: String(formData.get("key")) },
    update: {
      type: String(formData.get("type")) as any,
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      active: formData.get("active") === "on",
      publishedAt: formData.get("active") === "on" ? new Date() : null,
    },
    create: {
      key: String(formData.get("key")),
      type: String(formData.get("type")) as any,
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      data: {},
      active: formData.get("active") === "on",
      publishedAt: formData.get("active") === "on" ? new Date() : null,
    },
  });
  revalidatePath("/admin/content");
}

export default async function ContentPage() {
  const items = await prisma.siteContent.findMany({ orderBy: { updatedAt: "desc" } });
  const types = ["hero", "banner", "featured_section", "testimonial", "faq", "about", "contact", "footer", "navigation", "announcement", "seo", "social"];

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="p-5">
        <h1 className="text-2xl font-bold">Website CMS</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edit homepage, announcements, SEO, FAQs, footer, and support content without code changes.</p>
        <form action={saveContent} className="mt-5 space-y-3">
          <input name="key" required placeholder="unique-content-key" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <select name="type" className="w-full rounded-md border border-border bg-background px-3 py-2">
            {types.map((type) => <option key={type} value={type}>{type.replace("_", " ")}</option>)}
          </select>
          <input name="title" placeholder="Title" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <textarea name="body" placeholder="Body / copy" className="min-h-32 w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="imageUrl" placeholder="Image URL" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <label className="flex items-center gap-2 text-sm"><input name="active" type="checkbox" defaultChecked /> Published</label>
          <Button type="submit" className="w-full">Save content</Button>
        </form>
      </Card>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr><th className="p-4">Key</th><th className="p-4">Type</th><th className="p-4">Title</th><th className="p-4">Status</th><th className="p-4">Updated</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/60">
                <td className="p-4 font-medium">{item.key}</td>
                <td className="p-4 capitalize">{item.type.replace("_", " ")}</td>
                <td className="p-4">{item.title || "Untitled"}</td>
                <td className="p-4">{item.active ? "Published" : "Draft"}</td>
                <td className="p-4">{item.updatedAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
