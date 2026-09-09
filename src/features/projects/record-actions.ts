"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { requireActor } from "./queries";

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const optional = (data: FormData, key: string) => text(data, key) || null;
const boundedInt = (data: FormData, key: string, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.parseInt(text(data, key), 10) || min));

function refreshAll() {
  revalidatePath("/", "layout");
}

export async function updatePromptRecord(data: FormData) {
  const actor = await requireActor();
  const id = text(data, "id");
  const title = text(data, "title");
  const content = text(data, "content");
  if (!title || !content) return;

  const prompt = await db.prompt.findFirst({
    where: { id, ownerId: actor.userId },
    include: { currentVersion: true, versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
  });
  if (!prompt) return;

  await db.$transaction(async (tx) => {
    let currentVersionId = prompt.currentVersionId;
    if (content !== prompt.currentVersion?.content) {
      const version = await tx.promptVersion.create({
        data: {
          ownerId: actor.userId,
          promptId: prompt.id,
          versionNumber: (prompt.versions[0]?.versionNumber ?? 0) + 1,
          content,
          changeNote: "Edited from prompt library",
          createdById: actor.userId,
        },
      });
      currentVersionId = version.id;
    }
    await tx.prompt.update({
      where: { id: prompt.id },
      data: {
        title,
        category: optional(data, "category"),
        notes: optional(data, "notes"),
        projectId: optional(data, "projectId"),
        reusable: data.get("reusable") === "on",
        favorite: data.get("favorite") === "on",
        currentVersionId,
      },
    });
  });
  refreshAll();
}

export async function deletePromptRecord(data: FormData) {
  const actor = await requireActor();
  const prompt = await db.prompt.findFirst({ where: { id: text(data, "id"), ownerId: actor.userId } });
  if (!prompt) return;
  await db.$transaction(async (tx) => {
    await tx.codingSessionPrompt.deleteMany({ where: { ownerId: actor.userId, promptId: prompt.id } });
    await tx.promptQueueItem.deleteMany({ where: { ownerId: actor.userId, promptId: prompt.id } });
    await tx.prompt.update({ where: { id: prompt.id }, data: { currentVersionId: null } });
    await tx.prompt.delete({ where: { id: prompt.id } });
  });
  refreshAll();
}

export async function updateFeatureRecord(data: FormData) {
  const actor = await requireActor();
  const title = text(data, "title");
  if (!title) return;
  await db.feature.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: {
      title,
      body: optional(data, "body"),
      reason: optional(data, "reason"),
      acceptanceCriteria: optional(data, "criteria"),
      milestoneId: optional(data, "milestoneId"),
      priority: boundedInt(data, "priority", 0, 5),
    },
  });
  refreshAll();
}

export async function deleteFeatureRecord(data: FormData) {
  const actor = await requireActor();
  const id = text(data, "id");
  const feature = await db.feature.findFirst({ where: { id, ownerId: actor.userId } });
  if (!feature) return;
  await db.$transaction(async (tx) => {
    await tx.featureDependency.deleteMany({ where: { ownerId: actor.userId, OR: [{ featureId: id }, { dependsOnFeatureId: id }] } });
    await tx.codingSessionFeature.deleteMany({ where: { ownerId: actor.userId, featureId: id } });
    await tx.promptQueueItem.updateMany({ where: { ownerId: actor.userId, featureId: id }, data: { featureId: null } });
    await tx.bug.updateMany({ where: { ownerId: actor.userId, featureId: id }, data: { featureId: null } });
    await tx.prompt.updateMany({ where: { ownerId: actor.userId, featureId: id }, data: { featureId: null } });
    await tx.feature.delete({ where: { id } });
  });
  refreshAll();
}

export async function updateMilestoneRecord(data: FormData) {
  const actor = await requireActor();
  const name = text(data, "name");
  if (!name) return;
  const target = optional(data, "targetDate");
  await db.milestone.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: { name, description: optional(data, "description"), targetDate: target ? new Date(target) : null },
  });
  refreshAll();
}

export async function deleteMilestoneRecord(data: FormData) {
  const actor = await requireActor();
  const id = text(data, "id");
  const milestone = await db.milestone.findFirst({ where: { id, ownerId: actor.userId } });
  if (!milestone) return;
  await db.$transaction(async (tx) => {
    await tx.feature.updateMany({ where: { ownerId: actor.userId, milestoneId: id }, data: { milestoneId: null } });
    await tx.promptQueueItem.updateMany({ where: { ownerId: actor.userId, milestoneId: id }, data: { milestoneId: null } });
    await tx.milestone.delete({ where: { id } });
  });
  refreshAll();
}

export async function updateBugRecord(data: FormData) {
  const actor = await requireActor();
  const title = text(data, "title");
  if (!title) return;
  await db.bug.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: {
      title,
      symptoms: optional(data, "symptoms"),
      reproduction: optional(data, "reproduction"),
      expectedBehavior: optional(data, "expected"),
      actualBehavior: optional(data, "actual"),
      suspectedCause: optional(data, "suspectedCause"),
      severity: boundedInt(data, "severity", 1, 5),
    },
  });
  refreshAll();
}

export async function deleteBugRecord(data: FormData) {
  const actor = await requireActor();
  const id = text(data, "id");
  const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
  if (!bug) return;
  await db.$transaction(async (tx) => {
    await tx.promptQueueItem.updateMany({ where: { ownerId: actor.userId, bugId: id }, data: { bugId: null } });
    await tx.bug.delete({ where: { id } });
  });
  refreshAll();
}

export async function updateDecisionRecord(data: FormData) {
  const actor = await requireActor();
  const title = text(data, "title");
  const decision = text(data, "decision");
  if (!title || !decision) return;
  await db.decision.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: {
      title,
      decision,
      reasoning: optional(data, "reasoning"),
      alternatives: optional(data, "alternatives"),
      affectedSystem: optional(data, "affectedSystem"),
      reversible: data.get("reversible") === "on",
    },
  });
  refreshAll();
}

export async function deleteDecisionRecord(data: FormData) {
  const actor = await requireActor();
  const id = text(data, "id");
  const decision = await db.decision.findFirst({ where: { id, ownerId: actor.userId } });
  if (!decision) return;
  await db.$transaction(async (tx) => {
    await tx.decision.updateMany({ where: { ownerId: actor.userId, supersededById: id }, data: { supersededById: null } });
    await tx.decision.delete({ where: { id } });
  });
  refreshAll();
}

export async function updateNoteRecord(data: FormData) {
  const actor = await requireActor();
  const title = text(data, "title");
  const body = text(data, "body");
  if (!title || !body) return;
  await db.note.updateMany({ where: { id: text(data, "id"), ownerId: actor.userId }, data: { title, body } });
  refreshAll();
}

export async function deleteNoteRecord(data: FormData) {
  const actor = await requireActor();
  await db.note.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
  refreshAll();
}

export async function updateInspirationRecord(data: FormData) {
  const actor = await requireActor();
  const title = text(data, "title");
  if (!title) return;
  await db.inspiration.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: {
      title,
      kind: text(data, "kind") as "LINK" | "IMAGE" | "SCREENSHOT" | "VIDEO" | "TEXT" | "OTHER",
      canonicalUrl: optional(data, "url"),
      textSnippet: optional(data, "textSnippet"),
      note: optional(data, "note"),
      inspiredDetail: optional(data, "inspiredDetail"),
    },
  });
  refreshAll();
}

export async function deleteInspirationRecord(data: FormData) {
  const actor = await requireActor();
  await db.inspiration.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
  refreshAll();
}

export async function updateCommandRecord(data: FormData) {
  const actor = await requireActor();
  const name = text(data, "name");
  const commandText = text(data, "commandText");
  if (!name || !commandText) return;
  await db.command.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: { name, commandText, description: optional(data, "description"), category: optional(data, "category") },
  });
  refreshAll();
}

export async function deleteCommandRecord(data: FormData) {
  const actor = await requireActor();
  await db.command.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
  refreshAll();
}

export async function updateEnvironmentRecord(data: FormData) {
  const actor = await requireActor();
  const name = text(data, "name");
  if (!name) return;
  await db.environmentVariable.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: {
      name,
      environment: text(data, "environment") || "development",
      description: optional(data, "description"),
      acquisitionNote: optional(data, "acquisitionNote"),
      note: optional(data, "note"),
      required: data.get("required") === "on",
    },
  });
  refreshAll();
}

export async function deleteEnvironmentRecord(data: FormData) {
  const actor = await requireActor();
  await db.environmentVariable.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
  refreshAll();
}

export async function updateSessionRecord(data: FormData) {
  const actor = await requireActor();
  const objective = text(data, "objective");
  if (!objective) return;
  await db.codingSession.updateMany({
    where: { id: text(data, "id"), ownerId: actor.userId },
    data: {
      objective,
      notes: optional(data, "notes"),
      whatChanged: optional(data, "whatChanged"),
      discoveries: optional(data, "discoveries"),
      nextTask: optional(data, "nextTask"),
    },
  });
  refreshAll();
}

export async function deleteSessionRecord(data: FormData) {
  const actor = await requireActor();
  const id = text(data, "id");
  const session = await db.codingSession.findFirst({ where: { id, ownerId: actor.userId } });
  if (!session) return;
  await db.$transaction(async (tx) => {
    await tx.activity.updateMany({ where: { ownerId: actor.userId, codingSessionId: id }, data: { codingSessionId: null } });
    await tx.bug.updateMany({ where: { ownerId: actor.userId, codingSessionId: id }, data: { codingSessionId: null } });
    await tx.decision.updateMany({ where: { ownerId: actor.userId, codingSessionId: id }, data: { codingSessionId: null } });
    await tx.codingSession.delete({ where: { id } });
  });
  refreshAll();
}

export async function updateActivityRecord(data: FormData) {
  const actor = await requireActor();
  const summary = text(data, "summary");
  if (!summary) return;
  await db.activity.updateMany({ where: { id: text(data, "id"), ownerId: actor.userId }, data: { summary } });
  refreshAll();
}

export async function deleteActivityRecord(data: FormData) {
  const actor = await requireActor();
  await db.activity.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
  refreshAll();
}
