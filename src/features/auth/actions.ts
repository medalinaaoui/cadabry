"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  revokeSession,
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from "@/server/auth/session";

/**
 * Sign out. A server action rather than a GET route so that signing out can
 * never be triggered by a prefetch or a link crawler.
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      // Best effort: the cookie is cleared either way, so a failed revoke
      // must not block the redirect.
      await revokeSession(session.sessionId, session.userId).catch(() => {});
    }
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  redirect("/login");
}
