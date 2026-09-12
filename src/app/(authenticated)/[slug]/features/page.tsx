import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Sparkles } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import {
  CreateDisclosure,
  FormGrid,
  RowActions,
  RowButton,
} from "@/components/ui/disclosure";
import { workStatus } from "@/features/projects/display";
import { RecordControls } from "@/components/ui/record-controls";
import { CopyButton } from "@/components/ui/copy-button";
import {
  deleteFeatureRecord,
  updateFeatureRecord,
} from "@/features/projects/record-actions";
import { featureToPrompt } from "@/features/projects/prompts";

type Props = { params: Promise<{ slug: string }> };

export default async function FeaturesPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      features: {
        orderBy: [
          { status: "asc" },
          { priority: "desc" },
          { sortOrder: "asc" },
        ],
      },
      milestones: {
        select: { id: true, name: true, status: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  if (!project) notFound();

  async function addFeature(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const body = (formData.get("body") as string).trim();
    const reason = (formData.get("reason") as string).trim();
    const criteria = (formData.get("criteria") as string).trim();
    const milestoneId = (formData.get("milestoneId") as string) || null;
    const priority = Math.min(
      5,
      Math.max(0, parseInt(formData.get("priority") as string, 10) || 0)
    );

    if (!title) redirect(`/${slug}/features?error=Title+required`);

    await db.feature.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        title,
        body: body || null,
        reason: reason || null,
        acceptanceCriteria: criteria || null,
        milestoneId,
        priority,
        status: "PLANNED",
      },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        type: "FEATURE_CREATED",
        subjectKind: "FEATURE",
        summary: `Feature: ${title.slice(0, 80)}`,
      },
    });

    await db.project.update({
      where: { id: project!.id },
      data: { lastActivityAt: new Date() },
    });

    redirect(`/${slug}/features`);
  }

  async function updateFeature(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const status = formData.get("status") as string;

    const feature = await db.feature.findFirst({
      where: { id, ownerId: actor.userId },
    });
    if (!feature) redirect(`/${slug}/features`);

    await db.feature.update({
      where: { id: feature.id },
      data: {
        status: status as
          | "PLANNED"
          | "IN_PROGRESS"
          | "BLOCKED"
          | "DONE"
          | "CANCELLED",
      },
    });

    if (status === "DONE") {
      await db.activity.create({
        data: {
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project!.id,
          type: "FEATURE_COMPLETED",
          subjectKind: "FEATURE",
          summary: `Shipped: ${feature.title.slice(0, 80)}`,
        },
      });
    }

    redirect(`/${slug}/features`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Features</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          A backlog shaped for AI-assisted building: each feature carries the
          reason it exists and the criteria that say it&apos;s done.
        </p>
      </div>

      <CreateDisclosure label="New feature">
        <form action={addFeature} className="space-y-4">
          <Field
            label="Name"
            name="title"
            type="text"
            placeholder="Onboarding persistence"
            required
          />
          <TextField
            label="Description"
            name="body"
            rows={2}
            placeholder="What should this do?"
          />
          <Field
            label="Reason"
            name="reason"
            type="text"
            placeholder="Why does this matter?"
            hint="An agent that knows the why makes better calls than one that only knows the what."
          />
          <TextField
            label="Acceptance criteria"
            name="criteria"
            rows={2}
            placeholder="- user can save and reload"
          />
          <FormGrid>
            <SelectField label="Milestone" name="milestoneId" defaultValue="">
              <option value="">No milestone</option>
              {project.milestones.map((milestone) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.name}
                </option>
              ))}
            </SelectField>
            <SelectField label="Priority" name="priority" defaultValue="0">
              {[0, 1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  {p}
                  {p === 5
                    ? " — must ship"
                    : p === 4
                    ? " — high"
                    : p === 0
                    ? " — low"
                    : ""}
                </option>
              ))}
            </SelectField>
          </FormGrid>
          <Button type="submit" variant="primary">
            Add feature
          </Button>
        </form>
      </CreateDisclosure>

      {project.features.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="No features yet"
          description="What should this project actually do? Add the first one and it becomes context for every prompt you generate."
        />
      ) : (
        <Stack>
          {project.features.map((feature) => {
            const meta = workStatus(feature.status);
            return (
              <Row key={feature.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-title-3 text-foreground">
                    {feature.title}
                  </h3>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  {feature.priority >= 4 && (
                    <Badge tone="gold">P{feature.priority}</Badge>
                  )}
                </div>

                {feature.body && (
                  <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                    {feature.body}
                  </p>
                )}
                {feature.reason && (
                  <p className="mt-1.5 text-caption text-subtle">
                    <span className="eyebrow mr-1.5">Why</span>
                    {feature.reason}
                  </p>
                )}
                {feature.acceptanceCriteria && (
                  <p className="mt-1 text-caption text-subtle">
                    <span className="eyebrow mr-1.5">Done when</span>
                    {feature.acceptanceCriteria}
                  </p>
                )}

                <RowActions>
                  {feature.status !== "DONE" &&
                    feature.status !== "CANCELLED" && (
                      <>
                        {feature.status !== "IN_PROGRESS" && (
                          <form action={updateFeature}>
                            <input type="hidden" name="id" value={feature.id} />
                            <RowButton
                              name="status"
                              value="IN_PROGRESS"
                              tone="accent"
                            >
                              Start building
                            </RowButton>
                          </form>
                        )}
                        {feature.status !== "BLOCKED" && (
                          <form action={updateFeature}>
                            <input type="hidden" name="id" value={feature.id} />
                            <RowButton
                              name="status"
                              value="BLOCKED"
                              tone="danger"
                            >
                              Block
                            </RowButton>
                          </form>
                        )}
                        <form action={updateFeature}>
                          <input type="hidden" name="id" value={feature.id} />
                          <RowButton name="status" value="DONE" tone="success">
                            Ship
                          </RowButton>
                        </form>
                      </>
                    )}
                  <CopyButton
                    text={featureToPrompt(feature)}
                    label="Copy as prompt"
                    variant="secondary"
                    size="sm"
                  />
                </RowActions>
                <RecordControls
                  id={feature.id}
                  name={feature.title}
                  editAction={updateFeatureRecord}
                  deleteAction={deleteFeatureRecord}
                >
                  <Field
                    label="Name"
                    name="title"
                    defaultValue={feature.title}
                    required
                  />
                  <TextField
                    label="Description"
                    name="body"
                    rows={2}
                    defaultValue={feature.body ?? ""}
                  />
                  <Field
                    label="Reason"
                    name="reason"
                    defaultValue={feature.reason ?? ""}
                  />
                  <TextField
                    label="Acceptance criteria"
                    name="criteria"
                    rows={2}
                    defaultValue={feature.acceptanceCriteria ?? ""}
                  />
                  <FormGrid>
                    <SelectField
                      label="Milestone"
                      name="milestoneId"
                      defaultValue={feature.milestoneId ?? ""}
                    >
                      <option value="">No milestone</option>
                      {project.milestones.map((milestone) => (
                        <option key={milestone.id} value={milestone.id}>
                          {milestone.name}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      label="Priority"
                      name="priority"
                      defaultValue={String(feature.priority)}
                    >
                      {[0, 1, 2, 3, 4, 5].map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </SelectField>
                  </FormGrid>
                </RecordControls>
              </Row>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
