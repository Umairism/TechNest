import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const settings = await prisma.adminSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return apiError(error, "Admin Settings GET API");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const entries = Array.isArray(body.settings) ? body.settings : [body];
    const settings = [];

    for (const entry of entries) {
      settings.push(
        await prisma.adminSetting.upsert({
          where: { group_key: { group: entry.group, key: entry.key } },
          update: { value: entry.value, encrypted: Boolean(entry.encrypted) },
          create: { group: entry.group, key: entry.key, value: entry.value, encrypted: Boolean(entry.encrypted) },
        })
      );
    }

    await writeAuditLog({ actorId: session?.user.id, action: "settings.update", entity: "AdminSetting", metadata: { count: settings.length }, request });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return apiError(error, "Admin Settings POST API");
  }
}
