import { NextResponse } from "next/server";
import { GoogleCallback } from "@kartikgangil/watchman_js";
import { createSession, isAdminEmail } from "@/lib/auth";

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;
  const result = await GoogleCallback(
    code,
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const email = result?.user?.email;
  if (!email || !isAdminEmail(email)) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  await createSession({ email, name: result.user.name });
  return NextResponse.redirect(new URL("/admin", request.url));
}
