import { NextResponse } from "next/server";
import { GithubCallback } from "@kartikgangil/watchman_js";
import { createSession, isAdminEmail } from "@/lib/auth";

// Note: watchman_js requests GitHub's "user" scope only (not "user:email"),
// so `email` on the /user response is null unless the account has a public email.
export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const result = await GithubCallback(
    code,
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET
  );

  const email = result?.user?.email;
  if (!email) {
    return NextResponse.redirect(new URL("/login?error=no_email", request.url));
  }
  if (!isAdminEmail(email)) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  await createSession({ email, name: result.user.name || result.user.login });
  return NextResponse.redirect(new URL("/admin", request.url));
}
