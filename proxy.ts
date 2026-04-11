import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Check for the better-auth session cookie
  // This is a fast, edge-friendly check to prevent logged-in users from viewing auth pages
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  if (sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Filter proxy to run only on login and signup paths
  matcher: ["/login/:path*", "/signup/:path*"],
};
