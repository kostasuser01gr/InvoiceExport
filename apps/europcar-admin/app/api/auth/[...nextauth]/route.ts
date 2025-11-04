import NextAuth from "next-auth";
import { getAuthOptions } from "@invoice-suite/auth/nextauth";

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
