import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

/**
 * CSRF protection: validates the Origin header on state-changing requests.
 * Allows same-origin and direct navigation (no Origin header).
 */
export function middleware(request: NextRequest) {
  if (ALLOWED_METHODS.includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin) {
      const host = request.headers.get("host");
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { ok: false, error: "Forbidden." },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
