import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, getPagination, paginatedResponse, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { page, limit, skip } = getPagination(request);
    const folder = request.nextUrl.searchParams.get("folder");
    const where = folder ? { folder } : {};
    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.mediaAsset.count({ where }),
    ]);

    return paginatedResponse(assets, page, limit, total);
  } catch (error) {
    return apiError(error, "Admin Media GET API");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: body.filename,
        originalName: body.originalName || body.filename,
        url: body.url,
        mimeType: body.mimeType || "image/webp",
        size: Number(body.size || 0),
        folder: body.folder || "library",
        altText: body.altText,
        width: body.width ? Number(body.width) : null,
        height: body.height ? Number(body.height) : null,
        optimized: Boolean(body.optimized),
      },
    });

    await writeAuditLog({ actorId: session?.user.id, action: "media.create", entity: "MediaAsset", entityId: asset.id, request });
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    return apiError(error, "Admin Media POST API");
  }
}
