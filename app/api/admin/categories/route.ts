import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, getPagination, paginatedResponse, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { page, limit, skip } = getPagination(request);
    const search = request.nextUrl.searchParams.get("search");
    const where = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }, { slug: { contains: search, mode: "insensitive" as const } }] }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: { parent: true, _count: { select: { products: true, children: true } } },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    return paginatedResponse(categories, page, limit, total);
  } catch (error) {
    return apiError(error, "Admin Categories GET API");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        parentId: body.parentId || null,
        bannerUrl: body.bannerUrl,
        thumbnailUrl: body.thumbnailUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        sortOrder: Number(body.sortOrder || 0),
        featured: Boolean(body.featured),
      },
    });

    await writeAuditLog({ actorId: session?.user.id, action: "category.create", entity: "Category", entityId: category.id, request });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return apiError(error, "Admin Categories POST API");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });

    const category = await prisma.category.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        parentId: body.parentId || null,
        bannerUrl: body.bannerUrl,
        thumbnailUrl: body.thumbnailUrl,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        sortOrder: Number(body.sortOrder || 0),
        featured: Boolean(body.featured),
      },
    });

    await writeAuditLog({ actorId: session?.user.id, action: "category.update", entity: "Category", entityId: category.id, request });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return apiError(error, "Admin Categories PATCH API");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    await writeAuditLog({ actorId: session?.user.id, action: "category.delete", entity: "Category", entityId: id, request });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "Admin Categories DELETE API");
  }
}
