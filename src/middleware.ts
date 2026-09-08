import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifySessionForMiddleware,
  SESSION_COOKIE_NAME,
} from "@/server/auth/middleware/session";
import { isSetupAvailableForMiddleware } from "@/server/auth/middleware/setup";

const AUTH_PATHS = ["/login", "/setup"];

export const config = {
  matcher: "/((?!api|_next|_vercel|favicon|.*\\..*).*)",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) return NextResponse.next();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = token ? await verifySessionForMiddleware(token, envUrl) : null;

  // Authenticated user on auth pages → go home
  if (session && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Unauthenticated user trying auth pages → let through
  if (!session && AUTH_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Unauthenticated user → determine destination
  if (!session) {
    const setupAvailable = await isSetupAvailableForMiddleware(envUrl);
    const dest = setupAvailable ? "/setup" : "/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Authenticated — attach actor headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-actor-id", session.userId);
  requestHeaders.set("x-actor-display-name", session.displayName);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
