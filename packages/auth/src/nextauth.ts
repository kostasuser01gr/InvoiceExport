import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@invoice-suite/db/client";

export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER || "",
        from: process.env.EMAIL_FROM || "noreply@example.com",
      }),
    ],
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    callbacks: {
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.sub!;
        }
        return session;
      },
    },
  };
}
