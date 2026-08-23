import { NextResponse } from "next/server";
import { GithubCallback } from "@kartikgangil/watchman_js";
import { createSession, isAdminEmail } from "@/lib/auth";

export async function GET(request) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", request.url)
    );
  }

  try {
    // Exchange GitHub authorization code for user + access token
    const result = await GithubCallback(
      code,
      process.env.GITHUB_CLIENT_ID,
      process.env.GITHUB_CLIENT_SECRET
    );

    const accessToken = result?.accessToken;

    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/login?error=github_token_failed", request.url)
      );
    }

    // GitHub's /user endpoint can return email: null
    // when the user's email is private.
    // So fetch the user's email addresses separately.
    const emailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
        },
      }
    );

    if (!emailResponse.ok) {
      console.error(
        "GitHub email API failed:",
        emailResponse.status,
        await emailResponse.text()
      );

      return NextResponse.redirect(
        new URL("/login?error=email_fetch_failed", request.url)
      );
    }

    const emails = await emailResponse.json();

    // Prefer the primary verified email
    const primaryEmail =
      emails.find((item) => item.primary && item.verified)?.email ||
      emails.find((item) => item.verified)?.email;

    if (!primaryEmail) {
      return NextResponse.redirect(
        new URL("/login?error=no_verified_email", request.url)
      );
    }

    // Only allow the configured admin email
    if (!isAdminEmail(primaryEmail)) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url)
      );
    }

    // Create our normal Bakery CMS session
    await createSession({
      email: primaryEmail,
      name: result?.user?.name || result?.user?.login || "",
    });

    return NextResponse.redirect(new URL("/admin", request.url));
  } catch (error) {
    console.error("GitHub login error:", error);

    return NextResponse.redirect(
      new URL("/login?error=github_login_failed", request.url)
    );
  }
}