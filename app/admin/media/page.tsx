import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function addAsset(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.mediaAsset.create({
    data: {
      filename: String(formData.get("filename")),
      originalName: String(formData.get("originalName") || formData.get("filename")),
      url: String(formData.get("url")),
      mimeType: String(formData.get("mimeType") || "image/webp"),
      size: Number(formData.get("size") || 0),
      folder: String(formData.get("folder") || "library"),
      altText: String(formData.get("altText") || ""),
      optimized: formData.get("optimized") === "on",
    },
  });
  revalidatePath("/admin/media");
}

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 80 });

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card className="p-5">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">Register, organize, optimize, and reuse images, videos, and documents.</p>
        <form action={addAsset} className="mt-5 space-y-3">
          <input name="filename" required placeholder="filename.webp" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="url" required placeholder="https://..." className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="folder" placeholder="Folder" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="altText" placeholder="Alt text" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <input name="size" type="number" placeholder="Size in bytes" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <label className="flex items-center gap-2 text-sm"><input name="optimized" type="checkbox" /> Optimized</label>
          <Button type="submit" className="w-full">Add asset</Button>
        </form>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            {asset.mimeType.startsWith("image") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset.url} alt={asset.altText || asset.filename} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-secondary text-sm text-muted-foreground">{asset.mimeType}</div>
            )}
            <div className="p-4">
              <p className="truncate font-medium">{asset.filename}</p>
              <p className="text-xs text-muted-foreground">{asset.folder || "library"} · {(asset.size / 1024).toFixed(1)} KB</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
