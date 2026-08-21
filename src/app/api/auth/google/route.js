import { NextResponse } from "next/server";
import { GoogleLogin } from "@kartikgangil/watchman_js";

export async function GET(request) {
  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;
  const url = await GoogleLogin(process.env.GOOGLE_CLIENT_ID, redirectUri);
  return NextResponse.redirect(url);
}
