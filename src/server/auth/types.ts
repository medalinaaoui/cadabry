import type { UserRole } from "@/server/generated/prisma/enums";

export type AuthActor = Readonly<{
  userId: string;
  sessionId: string;
  role: UserRole;
  displayName: string;
}>;

export type IssuedSession = Readonly<{
  token: string;
  expiresAt: Date;
  actor: AuthActor;
}>;
