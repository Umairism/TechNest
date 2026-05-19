import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function saveSetting(formData: FormData) {
  "use server";
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  await prisma.adminSetting.upsert({
    where: { group_key: { group: String(formData.get("group")), key: String(formData.get("key")) } },
    update: { value: String(formData.get("value")) },
    create: { group: String(formData.get("group")), key: String(formData.get("key")), value: String(formData.get("value")) },
  });
  revalidatePath("/admin/settings");
}

export default async function SettingsPage() {
  const settings = await prisma.adminSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
  const groups = ["general", "commerce", "security", "seo_marketing", "email", "shipping", "tax", "api"];

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <Card className="p-5">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Centralized configuration for branding, commerce, security, SEO, integrations, and operational switches.</p>
        <form action={saveSetting} className="mt-5 space-y-3">
          <select name="group" className="w-full rounded-md border border-border bg-background px-3 py-2">
            {groups.map((group) => <option key={group} value={group}>{group.replace("_", " ")}</option>)}
          </select>
          <input name="key" required placeholder="setting_key" className="w-full rounded-md border border-border bg-background px-3 py-2" />
          <textarea name="value" required placeholder="Value or JSON string" className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2" />
          <Button type="submit" className="w-full">Save setting</Button>
        </form>
      </Card>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr><th className="p-4">Group</th><th className="p-4">Key</th><th className="p-4">Value</th><th className="p-4">Updated</th></tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id} className="border-b border-border/60">
                <td className="p-4 capitalize">{setting.group.replace("_", " ")}</td>
                <td className="p-4 font-medium">{setting.key}</td>
                <td className="max-w-lg truncate p-4 text-muted-foreground">{JSON.stringify(setting.value)}</td>
                <td className="p-4">{setting.updatedAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
