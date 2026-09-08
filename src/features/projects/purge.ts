import "server-only";

import { db } from "@/server/db";

/**
 * Every child table hangs off the project with either CASCADE or RESTRICT, and
 * the RESTRICT edges (activity → project, bug → feature, prompt → version,
 * queue item → prompt, decision → decision) would abort a plain delete. So the
 * rows come out in dependency order inside one transaction: either the whole
 * project disappears or nothing does.
 */
export async function purgeProject(ownerId: string, projectId: string) {
  const [featureRows, promptRows, milestoneRows, sessionRows] = await Promise.all([
    db.feature.findMany({ where: { ownerId, projectId }, select: { id: true } }),
    db.prompt.findMany({ where: { ownerId, projectId }, select: { id: true } }),
    db.milestone.findMany({ where: { ownerId, projectId }, select: { id: true } }),
    db.codingSession.findMany({ where: { ownerId, projectId }, select: { id: true } }),
  ]);
  const features = featureRows.map((r) => r.id);
  const prompts = promptRows.map((r) => r.id);
  const milestones = milestoneRows.map((r) => r.id);
  const sessions = sessionRows.map((r) => r.id);

  const orIfAny = <T>(ids: string[], build: () => T) => (ids.length > 0 ? [build()] : []);

  await db.$transaction([
    // 1. Activity holds a RESTRICT reference to the project itself.
    db.activity.deleteMany({ where: { ownerId, projectId } }),

    // 2. Queue items point at prompts, versions, features, milestones, ideas
    //    and bugs — they have to go before any of them.
    db.promptQueueItem.deleteMany({
      where: {
        ownerId,
        OR: [
          { projectId },
          ...orIfAny(prompts, () => ({ promptId: { in: prompts } })),
          ...orIfAny(features, () => ({ featureId: { in: features } })),
          ...orIfAny(milestones, () => ({ milestoneId: { in: milestones } })),
        ],
      },
    }),

    // 3. Session join rows reference prompts and features with RESTRICT.
    db.codingSessionPrompt.deleteMany({
      where: {
        ownerId,
        OR: [
          { codingSessionId: { in: sessions } },
          ...orIfAny(prompts, () => ({ promptId: { in: prompts } })),
        ],
      },
    }),
    db.codingSessionFeature.deleteMany({
      where: {
        ownerId,
        OR: [
          { codingSessionId: { in: sessions } },
          ...orIfAny(features, () => ({ featureId: { in: features } })),
        ],
      },
    }),

    // 4. Bugs reference features and sessions; decisions reference sessions and
    //    each other, so the supersession chain is cut before the rows go.
    db.bug.deleteMany({ where: { ownerId, projectId } }),
    db.decision.updateMany({ where: { ownerId, projectId }, data: { supersededById: null } }),
    db.decision.deleteMany({ where: { ownerId, projectId } }),
    db.codingSession.deleteMany({ where: { ownerId, projectId } }),

    // 5. A prompt pins its current version with RESTRICT — unpin, then drop
    //    versions, then the prompts themselves.
    db.prompt.updateMany({ where: { ownerId, projectId }, data: { currentVersionId: null } }),
    ...orIfAny(prompts, () =>
      db.promptVersion.deleteMany({ where: { ownerId, promptId: { in: prompts } } }),
    ),
    db.prompt.deleteMany({ where: { ownerId, projectId } }),

    // 6. Feature dependencies point both ways with RESTRICT on one side.
    ...orIfAny(features, () =>
      db.featureDependency.deleteMany({
        where: {
          ownerId,
          OR: [{ featureId: { in: features } }, { dependsOnFeatureId: { in: features } }],
        },
      }),
    ),
    db.feature.deleteMany({ where: { ownerId, projectId } }),
    db.milestone.deleteMany({ where: { ownerId, projectId } }),

    // 7. Everything still standing cascades from the project row.
    db.project.delete({ where: { id: projectId } }),
  ]);
}
