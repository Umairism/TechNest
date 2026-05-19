import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { apiError, getPagination, paginatedResponse, requireAdmin, writeAuditLog } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { page, limit, skip } = getPagination(request);
    const search = request.nextUrl.searchParams.get("search");
    const role = request.nextUrl.searchParams.get("role");
    const status = request.nextUrl.searchParams.get("status");
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          city: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { orders: true, reviews: true } },
          orders: { select: { totalAmount: true }, take: 20 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(users, page, limit, total);
  } catch (error) {
    return apiError(error, "Admin Users GET API");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { session, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, error: "User id is required" }, { status: 400 });

    const data: any = {};
    if (body.role) data.role = body.role;
    if (body.status) data.status = body.status;
    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.password) data.password = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.update({
      where: { id: body.id },
      data,
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    await writeAuditLog({ actorId: session?.user.id, action: "user.update", entity: "User", entityId: user.id, metadata: data, request });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return apiError(error, "Admin Users PATCH API");
  }
}
