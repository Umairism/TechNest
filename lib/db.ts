import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  // During build time, DATABASE_URL might not be available
  // but pages marked with force-dynamic shouldn't be evaluated
  if (!databaseUrl && process.env.NODE_ENV === "production") {
    console.warn("DATABASE_URL not set - Prisma will fail for database queries");
  }

  // Use a fallback empty URL for build time - actual pages won't execute this
  const url = databaseUrl || "postgresql://dummy:dummy@localhost:5432/dummy";

  return new PrismaClient({
    adapter: new PrismaPg(url),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ||
  createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
