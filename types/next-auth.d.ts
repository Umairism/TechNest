import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "vendor" | "moderator" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "customer" | "vendor" | "moderator" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "customer" | "vendor" | "moderator" | "admin";
  }
}
