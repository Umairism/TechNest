import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, getPagination, paginatedResponse, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { page, limit, skip } = getPagination(request);
    const type = request.nextUrl.searchParams.get("type");
    const where = type ? { type: type as any } : {};

    const [items, total] = await Promise.all([
      prisma.siteContent.findMany({ where, orderBy: { updatedAt: "desc" }, skip, take: limit }),
      prisma.siteContent.count({ where }),
    ]);

    return paginatedResponse(items, page, limit, total);
  } catch (error) {
    return apiError(error, "Admin Content GET API");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const content = await prisma.siteContent.upsert({
      where: { key: body.key },
      update: {
        type: body.type,
        title: body.title,
        body: body.body,
        data: body.data || {},
        imageUrl: body.imageUrl,
        active: body.active ?? true,
        publishedAt: body.active ? new Date() : null,
      },
      create: {
        key: body.key,
        type: body.type,
        title: body.title,
        body: body.body,
        data: body.data || {},
        imageUrl: body.imageUrl,
        active: body.active ?? true,
        publishedAt: body.active ? new Date() : null,
      },
    });

    await writeAuditLog({ actorId: session?.user.id, action: "content.upsert", entity: "SiteContent", entityId: content.id, request });
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return apiError(error, "Admin Content POST API");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Content id is required" }, { status: 400 });

    await prisma.siteContent.delete({ where: { id } });
    await writeAuditLog({ actorId: session?.user.id, action: "content.delete", entity: "SiteContent", entityId: id, request });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Admin Content DELETE API");
  }
}
