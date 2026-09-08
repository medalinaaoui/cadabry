import "server-only";
import { Prisma, UserRole } from "@/server/generated/prisma/client";
import { db } from "@/server/db";
import { AuthError } from "./errors";
import { hashPassword, verifyPassword } from "./password";
import { issueSession } from "./session";
import type { IssuedSession } from "./types";

const DUMMY_PASSWORD_HASH = "$argon2id$v=19$m=19456,t=2,p=1$qunKr07dp5l0A+N/W4/HBw$jZGYLBK9yYb01+PDpevxEgDYcmE7UcsuOVbNehD00uE";

export type OwnerSetupInput = { displayName: string; email: string; password: string };

function normalizeInput(input: OwnerSetupInput): OwnerSetupInput {
  const normalized = { displayName: input.displayName.trim(), email: input.email.trim().toLowerCase(), password: input.password };
  if (normalized.displayName.length < 1 || normalized.displayName.length > 100 || normalized.email.length > 320 || !normalized.email.includes("@") || normalized.password.length < 12 || normalized.password.length > 1024) {
    throw new AuthError("INVALID_INPUT");
  }
  return normalized;
}

export async function isOwnerSetupAvailable(): Promise<boolean> {
  const installation = await db.appInstallation.findUnique({ where: { key: "primary" }, select: { ownerUserId: true } });
  return !installation?.ownerUserId;
}

export async function setupOwner(input: OwnerSetupInput): Promise<IssuedSession> {
  const value = normalizeInput(input);
  const passwordHash = await hashPassword(value.password);
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await db.$transaction(async (tx) => {
        await tx.$executeRaw`INSERT INTO app_installation (key) VALUES ('primary') ON CONFLICT (key) DO NOTHING`;
        const rows = await tx.$queryRaw<Array<{ owner_user_id: string | null; setup_completed_at: Date | null }>>`SELECT owner_user_id, setup_completed_at FROM app_installation WHERE key = 'primary' FOR UPDATE`;
        if (rows[0]?.owner_user_id || rows[0]?.setup_completed_at) throw new AuthError("SETUP_ALREADY_COMPLETED");
        const owner = await tx.user.create({ data: { email: value.email, displayName: value.displayName, passwordHash, role: UserRole.OWNER }, select: { id: true, displayName: true, role: true } });
        await tx.appInstallation.update({ where: { key: "primary" }, data: { ownerUserId: owner.id, setupCompletedAt: new Date() } });
        await tx.activity.create({ data: { ownerId: owner.id, actorUserId: owner.id, type: "OWNER_SETUP_COMPLETED", subjectKind: "USER", subjectId: owner.id, summary: "Initial owner setup completed" } });
        return issueSession(tx, owner);
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5_000, timeout: 15_000 });
    } catch (error) {
      if (error instanceof AuthError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new AuthError("SETUP_ALREADY_COMPLETED");
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2034" || attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 25));
    }
  }
  throw new Error("Unreachable owner setup retry state");
}

export async function authenticateWithPassword(email: string, password: string): Promise<IssuedSession> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.user.findFirst({ where: { email: normalizedEmail, disabledAt: null }, select: { id: true, displayName: true, role: true, passwordHash: true } });
  const passwordIsValid = await verifyPassword(user?.passwordHash ?? DUMMY_PASSWORD_HASH, password);
  if (!user || !passwordIsValid) throw new AuthError("INVALID_CREDENTIALS");
  return issueSession(db, user);
}
