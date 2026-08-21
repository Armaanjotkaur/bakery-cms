import { cookies } from "next/headers";
import { GenToken, VerifyToken } from "@kartikgangil/watchman_js";

const SESSION_COOKIE = "session";
const SESSION_TTL = "7d";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function createSession(user) {
  const token = await GenToken(
    { email: user.email, name: user.name || "" },
    { expiresIn: SESSION_TTL },
    process.env.SESSION_SECRET
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return await VerifyToken(token, process.env.SESSION_SECRET);
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase();
}
