import { NextResponse } from "next/server";
import { GithubLogin } from "@kartikgangil/watchman_js";

export async function GET(request) {
  const redirectUri = `${request.nextUrl.origin}/api/auth/github/callback`;
  const url = await GithubLogin(redirectUri, process.env.GITHUB_CLIENT_ID);
  return NextResponse.redirect(url);
}
