import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, getPagination, paginatedResponse, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { page, limit, skip } = getPagination(request);
    const unread = request.nextUrl.searchParams.get("unread");
    const where = unread === "true" ? { read: false } : {};

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.notification.count({ where }),
    ]);

    return paginatedResponse(notifications, page, limit, total);
  } catch (error) {
    return apiError(error, "Admin Notifications GET API");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [];
    await prisma.notification.updateMany({ where: { id: { in: ids } }, data: { read: Boolean(body.read) } });
    await writeAuditLog({ actorId: session?.user.id, action: "notification.update", entity: "Notification", metadata: { ids, read: body.read }, request });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Admin Notifications PATCH API");
  }
}
