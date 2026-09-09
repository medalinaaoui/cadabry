"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { uniqueSlug } from "@/features/projects/slug";
import {
  buildStartingPrompt,
  listBriefItems,
  technologyCategory,
  type ProjectBrief,
} from "@/features/projects/project-brief";

const briefSchema = z.object({
  name: z.string().trim().min(1).max(200),
  oneLineDescription: z.string().trim().max(300),
  productStatement: z.string().trim().max(5_000),
  problem: z.string().trim().max(5_000),
  targetUser: z.string().trim().max(2_000),
  desiredOutcome: z.string().trim().max(2_000),
  projectType: z.string().trim().max(100),
  stage: z.string().trim().max(100),
  platforms: z.array(z.string().trim().max(100)).max(10),
  features: z.string().trim().max(10_000),
  firstRelease: z.string().trim().max(5_000),
  nonGoals: z.string().trim().max(5_000),
  stackPreset: z.string().trim().max(100),
  technologies: z.array(z.string().trim().max(100)).max(30),
  stackNotes: z.string().trim().max(5_000),
  integrations: z.string().trim().max(5_000),
  dataNeeds: z.string().trim().max(5_000),
  authNeeds: z.string().trim().max(500),
  monetization: z.string().trim().max(500),
  designDirection: z.string().trim().max(5_000),
  references: z.string().trim().max(5_000),
  qualityPriorities: z.array(z.string().trim().max(100)).max(10),
  deployment: z.string().trim().max(1_000),
  constraints: z.string().trim().max(5_000),
});

export async function createOnboardedProject(formData: FormData) {
  const actor = await requireActor();
  const rawBrief = String(formData.get("brief") ?? "");

  let decoded: unknown;
  try {
    decoded = JSON.parse(rawBrief);
  } catch {
    redirect("/projects/new?error=The+project+brief+could+not+be+read");
  }

  const parsed = briefSchema.safeParse(decoded);
  if (!parsed.success) redirect("/projects/new?error=Check+the+project+name+and+try+again");

  const brief: ProjectBrief = parsed.data;
  const slug = await uniqueSlug(actor.userId, brief.name);
  const profile = await db.builderProfile.findUnique({
    where: { ownerId: actor.userId },
    include: { rules: { where: { enabled: true }, orderBy: { priority: "desc" } } },
  });
  const prompt = buildStartingPrompt(
    brief,
    profile?.defaultAgent ?? "your coding agent",
    profile?.rules.map((rule) => `${rule.category}: ${rule.content}`) ?? [],
  );
  const features = listBriefItems(brief.features).slice(0, 30);
  const nonGoals = listBriefItems(brief.nonGoals).slice(0, 20);

  await db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        ownerId: actor.userId,
        name: brief.name,
        slug,
        oneLineDescription: brief.oneLineDescription || null,
        productStatement: brief.productStatement || brief.oneLineDescription || null,
        problem: brief.problem || null,
        targetUser: brief.targetUser || null,
        desiredOutcome: brief.desiredOutcome || null,
        projectType: brief.projectType || null,
        status:
          brief.stage === "Already in development"
            ? "BUILDING"
            : brief.stage === "New idea" || !brief.stage
              ? "IDEA"
              : "PLANNING",
        importance: 0,
        progress: 0,
        currentTask: "Turn the launch brief into the first working vertical slice",
        lastActivityAt: new Date(),
      },
      select: { id: true },
    });

    if (brief.technologies.length > 0) {
      const existing = await tx.technology.findMany({
        where: { ownerId: actor.userId, name: { in: brief.technologies } },
        select: { id: true, name: true },
      });
      const technologyIds = new Map(existing.map((technology) => [technology.name, technology.id]));

      for (const name of brief.technologies) {
        if (technologyIds.has(name)) continue;
        const technology = await tx.technology.create({
          data: { ownerId: actor.userId, name, category: technologyCategory(name) },
          select: { id: true },
        });
        technologyIds.set(name, technology.id);
      }

      await tx.projectTechnology.createMany({
        data: brief.technologies.map((name, index) => ({
          ownerId: actor.userId,
          projectId: project.id,
          technologyId: technologyIds.get(name)!,
          category: technologyCategory(name),
          sortOrder: index,
        })),
      });
    }

    if (features.length > 0) {
      await tx.feature.createMany({
        data: features.map((title, index) => ({
          ownerId: actor.userId,
          projectId: project.id,
          title,
          priority: index < 3 ? 4 : 3,
          sortOrder: index,
        })),
      });
    }

    const boundaries = [
      ...(brief.firstRelease ? [{ kind: "GOAL" as const, content: brief.firstRelease }] : []),
      ...nonGoals.map((content) => ({ kind: "NON_GOAL" as const, content })),
      ...(brief.constraints ? [{ kind: "CONSTRAINT" as const, content: brief.constraints }] : []),
    ];
    if (boundaries.length > 0) {
      await tx.projectBoundary.createMany({
        data: boundaries.map((boundary, index) => ({
          ownerId: actor.userId,
          projectId: project.id,
          ...boundary,
          sortOrder: index,
        })),
      });
    }

    const savedPrompt = await tx.prompt.create({
      data: {
        ownerId: actor.userId,
        projectId: project.id,
        title: `Start building ${brief.name}`,
        category: "Project launch",
        status: "READY",
        versions: {
          create: {
            versionNumber: 1,
            content: prompt,
            changeNote: "Generated from the new-project brief",
            createdById: actor.userId,
          },
        },
      },
      select: { id: true },
    });
    const version = await tx.promptVersion.findUniqueOrThrow({
      where: { promptId_versionNumber: { promptId: savedPrompt.id, versionNumber: 1 } },
      select: { id: true },
    });
    await tx.prompt.update({
      where: { id: savedPrompt.id },
      data: { currentVersionId: version.id },
    });
    await tx.promptQueueItem.create({
      data: {
        ownerId: actor.userId,
        projectId: project.id,
        promptId: savedPrompt.id,
        promptVersionId: version.id,
        position: 1,
      },
    });
    await tx.activity.createMany({
      data: [
        {
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project.id,
          type: "PROJECT_CREATED",
          subjectKind: "PROJECT",
          subjectId: project.id,
          summary: `Created project "${brief.name}" from a launch brief`,
        },
        {
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project.id,
          type: "PROMPT_QUEUED",
          subjectKind: "PROMPT",
          subjectId: savedPrompt.id,
          summary: "Queued the generated starting prompt",
        },
      ],
    });
  });

  revalidatePath("/", "layout");
  redirect(`/${slug}/resume`);
}
