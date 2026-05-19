import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { session, response: null };
}

export function getPagination(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(params.get("limit") || 20)));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function paginatedResponse<T>(data: T[], page: number, limit: number, total: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function writeAuditLog(input: {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  request?: NextRequest;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: (input.metadata || {}) as Prisma.InputJsonValue,
      ipAddress: input.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: input.request?.headers.get("user-agent") || undefined,
    },
  });
}

export function apiError(error: unknown, label: string) {
  console.error(`[${label}]`, error);
  return NextResponse.json(
    { success: false, error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
