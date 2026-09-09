import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Flag } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
import { workStatus } from "@/features/projects/display";
import { RecordControls } from "@/components/ui/record-controls";
import { deleteMilestoneRecord, updateMilestoneRecord } from "@/features/projects/record-actions";

type Props = { params: Promise<{ slug: string }> };

export default async function MilestonesPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      milestones: {
        include: { _count: { select: { features: true } } },
        orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
      },
    },
  });
  if (!project) notFound();

  async function addMilestone(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim();
    const targetDate = (formData.get("targetDate") as string) || null;

    if (!name) redirect(`/${slug}/milestones?error=Name+required`);

    const maxSort = await db.milestone.aggregate({
      where: { ownerId: actor.userId, projectId: project!.id },
      _max: { sortOrder: true },
    });

    await db.milestone.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        name,
        description: description || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
        status: "PLANNED",
      },
    });
    redirect(`/${slug}/milestones`);
  }

  async function updateStatus(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    const milestone = await db.milestone.findFirst({ where: { id, ownerId: actor.userId } });
    if (!milestone) redirect(`/${slug}/milestones`);

    await db.milestone.update({
      where: { id: milestone.id },
      data: { status: status as "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" },
    });
    if (status === "DONE") {
      await db.activity.create({
        data: {
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project!.id,
          type: "MILESTONE_REACHED",
          subjectKind: "MILESTONE",
          summary: `Milestone reached: ${milestone.name.slice(0, 80)}`,
        },
      });
    }
    redirect(`/${slug}/milestones`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Milestones</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          The big moments on the way to shipping. Dates are optional — the sequence is
          the point.
        </p>
      </div>

      <CreateDisclosure label="New milestone">
        <form action={addMilestone} className="space-y-4">
          <Field label="Name" name="name" type="text" placeholder="MVP" required />
          <Field
            label="Description"
            name="description"
            type="text"
            placeholder="Core loop working end to end for early users"
          />
          <Field label="Target date" name="targetDate" type="date" hint="Optional." />
          <Button type="submit" variant="primary">
            Add milestone
          </Button>
        </form>
      </CreateDisclosure>

      {project.milestones.length === 0 ? (
        <EmptyState
          icon={<Flag className="h-5 w-5" />}
          title="No milestones yet"
          description="Prototype → MVP → Launch. Naming the stops makes an unfinished project feel finishable."
        />
      ) : (
        <Stack as="ol" className="space-y-2">
          {project.milestones.map((milestone) => {
            const meta = workStatus(milestone.status);
            const done = milestone.status === "DONE";
            return (
              <Row key={milestone.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={
                      done
                        ? "text-title-3 text-subtle line-through"
                        : "text-title-3 text-foreground"
                    }
                  >
                    {milestone.name}
                  </h3>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  {milestone._count.features > 0 && (
                    <Badge tone="cobalt">
                      {milestone._count.features} feature
                      {milestone._count.features === 1 ? "" : "s"}
                    </Badge>
                  )}
                </div>

                {milestone.description && (
                  <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                    {milestone.description}
                  </p>
                )}

                {milestone.targetDate && (
                  <p className="mt-1.5 text-caption text-subtle">
                    <span className="eyebrow mr-1.5">Target</span>
                    <time dateTime={milestone.targetDate.toISOString()}>
                      {milestone.targetDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                )}

                {!done && milestone.status !== "CANCELLED" && (
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={milestone.id} />
                    <RowActions>
                      {milestone.status !== "IN_PROGRESS" && (
                        <RowButton name="status" value="IN_PROGRESS" tone="accent">
                          Start
                        </RowButton>
                      )}
                      <RowButton name="status" value="DONE" tone="success">
                        Complete
                      </RowButton>
                    </RowActions>
                  </form>
                )}
                <RecordControls
                  id={milestone.id}
                  name={milestone.name}
                  editAction={updateMilestoneRecord}
                  deleteAction={deleteMilestoneRecord}
                >
                  <Field label="Name" name="name" defaultValue={milestone.name} required />
                  <Field label="Description" name="description" defaultValue={milestone.description ?? ""} />
                  <Field
                    label="Target date"
                    name="targetDate"
                    type="date"
                    defaultValue={milestone.targetDate?.toISOString().slice(0, 10) ?? ""}
                  />
                </RecordControls>
              </Row>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
