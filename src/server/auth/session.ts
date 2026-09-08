import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { Prisma, UserRole } from "@/server/generated/prisma/client";
import { db } from "@/server/db";
import type { AuthActor, IssuedSession } from "./types";

// The __Host- prefix mandates Secure + HTTPS, which is correct in production but
// blocks cookies on plain-http localhost during development/verification. Keep the
// hardened name in production and fall back to an unprefixed name elsewhere.
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-cadabry_session" : "cadabry_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const TOUCH_INTERVAL_MS = 1000 * 60 * 60 * 24;

type DbClient = typeof db | Prisma.TransactionClient;

export const sessionCookieOptions = (expiresAt: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  expires: expiresAt,
});

export function digestSessionToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function issueSession(
  client: DbClient,
  user: { id: string; role: UserRole; displayName: string },
  metadata: { userAgentHash?: string; ipHash?: string } = {},
): Promise<IssuedSession> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const session = await client.authSession.create({
    data: {
      userId: user.id,
      tokenDigest: digestSessionToken(token),
      expiresAt,
      userAgentHash: metadata.userAgentHash,
      ipHash: metadata.ipHash,
    },
    select: { id: true },
  });
  return {
    token,
    expiresAt,
    actor: { userId: user.id, sessionId: session.id, role: user.role, displayName: user.displayName },
  };
}

export async function verifySessionToken(token: string, now = new Date()): Promise<AuthActor | null> {
  if (token.length < 40 || token.length > 128) return null;
  const session = await db.authSession.findUnique({
    where: { tokenDigest: digestSessionToken(token) },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
      lastSeenAt: true,
      user: { select: { id: true, role: true, displayName: true, disabledAt: true } },
    },
  });
  if (!session || session.revokedAt || session.expiresAt <= now || session.user.disabledAt) return null;
  if (now.getTime() - session.lastSeenAt.getTime() >= TOUCH_INTERVAL_MS) {
    void db.authSession.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { lastSeenAt: now },
    }).catch(() => undefined);
  }
  return { userId: session.user.id, sessionId: session.id, role: session.user.role, displayName: session.user.displayName };
}

export async function revokeSession(sessionId: string, userId: string): Promise<void> {
  await db.authSession.updateMany({ where: { id: sessionId, userId, revokedAt: null }, data: { revokedAt: new Date() } });
}

export async function revokeAllSessions(userId: string): Promise<number> {
  const result = await db.authSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  return result.count;
}
