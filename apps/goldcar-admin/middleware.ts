import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAllowlisted } from "@invoice-suite/auth/guard";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const email = token?.email;

  // Allow auth routes
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check allowlist for all other routes
  if (!isAllowlisted(email)) {
    return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|favicon.ico).*)"],
};
