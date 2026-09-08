"use server";

import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";

export type CaptureResult = { ok: boolean; error?: string };

/**
 * Quick capture: always persists as an Idea (projectId is optional in the
 * schema), with the chosen type recorded in `body` for later triage.
 */
export async function quickCapture(formData: FormData): Promise<CaptureResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) return { ok: false, error: "Not signed in." };

  const actor = await verifySessionToken(token);
  if (!actor) return { ok: false, error: "Session expired." };

  const title = (formData.get("title") as string).trim();
  const rawType = (formData.get("type") as string) || "idea";
  const projectId = (formData.get("projectId") as string) || null;

  if (!title) return { ok: false, error: "Title is required." };

  // Validate project ownership if provided
  if (projectId) {
    const project = await db.project.findFirst({
      where: { id: projectId, ownerId: actor.userId },
      select: { id: true },
    });
    if (!project) return { ok: false, error: "Project not found." };
  }

  const body = `Captured as ${rawType}${projectId ? " (linked to project)" : " (inbox)"}`;

  await db.idea.create({
    data: {
      ownerId: actor.userId,
      projectId,
      title,
      body,
      status: "INBOX",
      priority: 0,
    },
  });

  await db.activity.create({
    data: {
      ownerId: actor.userId,
      actorUserId: actor.userId,
      projectId: projectId || null,
      type: "THOUGHT_CAPTURED",
      subjectKind: "IDEA",
      summary: `Captured ${rawType}: ${title.slice(0, 80)}`,
    },
  });

  return { ok: true };
}
