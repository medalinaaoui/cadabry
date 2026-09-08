"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { requireActor } from "./queries";
import { uniqueSlug } from "./slug";
import { purgeProject } from "./purge";
import { projectStatuses } from "./schemas";

export type ProjectActionResult = { ok: boolean; message: string };

/** Owner-scoped project lookup. Every action starts here. */
async function ownedProject(slug: string) {
  const actor = await requireActor();
  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    select: { id: true, name: true, slug: true, status: true, archivedAt: true },
  });
  return { actor, project };
}

async function logActivity(input: {
  ownerId: string;
  actorUserId: string;
  projectId?: string | null;
  type: string;
  subjectId?: string | null;
  summary: string;
}) {
  await db.activity.create({
    data: {
      ownerId: input.ownerId,
      actorUserId: input.actorUserId,
      projectId: input.projectId ?? null,
      type: input.type,
      subjectKind: "PROJECT",
      subjectId: input.subjectId ?? null,
      summary: input.summary,
    },
  });
}

/* ------------------------------------------------------------------ status - */

export async function setProjectStatus(formData: FormData): Promise<ProjectActionResult> {
  const slug = String(formData.get("slug") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!projectStatuses.includes(status as (typeof projectStatuses)[number])) {
    return { ok: false, message: "Unknown status." };
  }

  const { actor, project } = await ownedProject(slug);
  if (!project) return { ok: false, message: "Project not found." };
  if (project.status === status) return { ok: true, message: "Already there." };

  await db.project.update({
    where: { id: project.id },
    data: { status: status as (typeof projectStatuses)[number], lastActivityAt: new Date() },
  });

  await logActivity({
    ownerId: actor.userId,
    actorUserId: actor.userId,
    projectId: project.id,
    subjectId: project.id,
    type: "PROJECT_STATUS_CHANGED",
    summary: `Moved "${project.name}" to ${status.toLowerCase()}`,
  });

  revalidatePath("/", "layout");
  return { ok: true, message: `Status set to ${status.toLowerCase()}.` };
}

/* ----------------------------------------------------------------- archive - */

/**
 * Archiving is the reversible half of "get this out of my way": the project
 * leaves the universe and the sidebar but keeps every record. Deleting is the
 * other half, and it is not reversible.
 */
export async function archiveProject(formData: FormData): Promise<ProjectActionResult> {
  const slug = String(formData.get("slug") ?? "");
  const { actor, project } = await ownedProject(slug);
  if (!project) return { ok: false, message: "Project not found." };

  await db.project.update({
    where: { id: project.id },
    data: { archivedAt: new Date(), status: "ARCHIVED" },
  });

  await logActivity({
    ownerId: actor.userId,
    actorUserId: actor.userId,
    projectId: project.id,
    subjectId: project.id,
    type: "PROJECT_ARCHIVED",
    summary: `Archived "${project.name}"`,
  });

  revalidatePath("/", "layout");
  return { ok: true, message: `"${project.name}" archived.` };
}

export async function restoreProject(formData: FormData): Promise<ProjectActionResult> {
  const slug = String(formData.get("slug") ?? "");
  const { actor, project } = await ownedProject(slug);
  if (!project) return { ok: false, message: "Project not found." };

  await db.project.update({
    where: { id: project.id },
    data: { archivedAt: null, status: "PAUSED", lastActivityAt: new Date() },
  });

  await logActivity({
    ownerId: actor.userId,
    actorUserId: actor.userId,
    projectId: project.id,
    subjectId: project.id,
    type: "PROJECT_RESTORED",
    summary: `Restored "${project.name}"`,
  });

  revalidatePath("/", "layout");
  return { ok: true, message: `"${project.name}" is back in orbit.` };
}

/* --------------------------------------------------------------- duplicate - */

/**
 * Duplicates the *brain* — identity, positioning, stack, boundaries, rules,
 * commands and env keys — but not the history. A copy is a fresh start with a
 * proven shape, so decisions, bugs, sessions and activity stay behind.
 */
export async function duplicateProject(formData: FormData): Promise<ProjectActionResult> {
  const slug = String(formData.get("slug") ?? "");
  const actor = await requireActor();

  const source = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      technologies: true,
      rules: true,
      boundaries: true,
      commands: true,
      environmentVariables: true,
    },
  });
  if (!source) return { ok: false, message: "Project not found." };

  const name = `${source.name} copy`;
  const newSlug = await uniqueSlug(actor.userId, name);

  const created = await db.project.create({
    data: {
      ownerId: actor.userId,
      name,
      slug: newSlug,
      oneLineDescription: source.oneLineDescription,
      description: source.description,
      icon: source.icon,
      color: source.color,
      projectType: source.projectType,
      repositoryUrl: source.repositoryUrl,
      stagingUrl: source.stagingUrl,
      localFolderPath: source.localFolderPath,
      productStatement: source.productStatement,
      problem: source.problem,
      targetUser: source.targetUser,
      desiredOutcome: source.desiredOutcome,
      valueProposition: source.valueProposition,
      status: "IDEA",
      importance: source.importance,
      progress: 0,
      lastActivityAt: new Date(),
      technologies: {
        create: source.technologies.map((row) => ({
          ownerId: actor.userId,
          technologyId: row.technologyId,
          category: row.category,
          version: row.version,
          note: row.note,
          sortOrder: row.sortOrder,
        })),
      },
      rules: {
        create: source.rules.map((row) => ({
          ownerId: actor.userId,
          category: row.category,
          content: row.content,
          priority: row.priority,
          enabled: row.enabled,
        })),
      },
      boundaries: {
        create: source.boundaries.map((row) => ({
          ownerId: actor.userId,
          kind: row.kind,
          content: row.content,
          sortOrder: row.sortOrder,
        })),
      },
      commands: {
        create: source.commands.map((row) => ({
          ownerId: actor.userId,
          name: row.name,
          commandText: row.commandText,
          description: row.description,
          category: row.category,
          sortOrder: row.sortOrder,
        })),
      },
      environmentVariables: {
        create: source.environmentVariables.map((row) => ({
          ownerId: actor.userId,
          name: row.name,
          description: row.description,
          required: row.required,
          environment: row.environment,
          acquisitionNote: row.acquisitionNote,
          note: row.note,
          configured: false,
        })),
      },
    },
    select: { id: true, slug: true },
  });

  await logActivity({
    ownerId: actor.userId,
    actorUserId: actor.userId,
    projectId: created.id,
    subjectId: created.id,
    type: "PROJECT_DUPLICATED",
    summary: `Duplicated "${source.name}" into "${name}"`,
  });

  revalidatePath("/", "layout");
  redirect(`/${created.slug}`);
}

/* ------------------------------------------------------------------ delete - */

export async function deleteProject(formData: FormData): Promise<ProjectActionResult> {
  const slug = String(formData.get("slug") ?? "");
  const confirmation = String(formData.get("confirm") ?? "").trim();

  const { actor, project } = await ownedProject(slug);
  if (!project) return { ok: false, message: "Project not found." };

  // Typing the name is the only guard between here and permanent loss.
  if (confirmation.toLowerCase() !== project.name.trim().toLowerCase()) {
    return { ok: false, message: `Type “${project.name}” exactly to confirm.` };
  }

  try {
    await purgeProject(actor.userId, project.id);
  } catch {
    return {
      ok: false,
      message:
        "Something outside this project still references it — usually a prompt queued from another project. Archive it instead, or clear that reference first.",
    };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: `"${project.name}" deleted.` };
}
