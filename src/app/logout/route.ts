import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken, revokeSession, SESSION_COOKIE_NAME } from "@/server/auth/session";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      revokeSession(session.sessionId, session.userId).catch(() => {});
    }
  }

  // Resolve against the incoming request so this works on any host, not just
  // localhost. A hardcoded origin here breaks logout in production.
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
