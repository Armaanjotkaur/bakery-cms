import { NextResponse } from "next/server";

// Cheap presence-only check for fast redirects. This can be bypassed by a
// forged cookie, so every admin route handler and the admin layout also call
// getSession() (full JWT verify) server-side as the real gate.
export function proxy(request) {
  const hasSession = request.cookies.has("session");
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
