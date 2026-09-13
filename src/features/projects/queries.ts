import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { db } from "@/server/db";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/server/auth/session";

/**
 * Resolve the signed-in owner, or bounce to /login.
 *
 * Wrapped in React's cache so the layout and the page it wraps verify the
 * session once per request instead of once per component.
 */
export const requireActor = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  return actor;
});

/**
 * The project header every screen under /[slug] needs: identity, state, and
 * the counts the section nav shows as badges. Cached for the same reason.
 */
export const getProjectSummary = cache(async (ownerId: string, slug: string) => {
  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId, slug } },
    select: {
      id: true,
      name: true,
      slug: true,
      oneLineDescription: true,
      status: true,
      progress: true,
      color: true,
      icon: true,
      productionUrl: true,
      currentTask: true,
      currentBlocker: true,
      lastActivityAt: true,
      archivedAt: true,
      _count: {
        select: {
          features: true,
          queueItems: { where: { status: "QUEUED" } },
          bugs: { where: { status: { in: ["ACTIVE", "INBOX"] } } },
          decisions: true,
          milestones: true,
          notes: true,
          inspirations: true,
          commands: true,
          environmentVariables: true,
          codingSessions: true,
        },
      },
    },
  });

  return project;
});

/** Project summary or a 404 — the guard every /[slug] screen starts with. */
export async function requireProject(slug: string) {
  const actor = await requireActor();
  const project = await getProjectSummary(actor.userId, slug);
  if (!project) notFound();
  return { actor, project };
}

export type ProjectSummary = NonNullable<Awaited<ReturnType<typeof getProjectSummary>>>;
