import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { GitBranch } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, FieldShell, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
import { workStatus } from "@/features/projects/display";
import { RecordControls } from "@/components/ui/record-controls";
import { deleteDecisionRecord, updateDecisionRecord } from "@/features/projects/record-actions";

type Props = { params: Promise<{ slug: string }> };

export default async function DecisionsPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      decisions: { orderBy: [{ status: "asc" }, { decidedAt: "desc" }] },
    },
  });
  if (!project) notFound();

  async function addDecision(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const decision = (formData.get("decision") as string).trim();
    const reasoning = (formData.get("reasoning") as string).trim();
    const alternatives = (formData.get("alternatives") as string).trim();
    const affectedSystem = (formData.get("affectedSystem") as string).trim();
    const reversible = (formData.get("reversible") as string) === "on";

    if (!title || !decision) redirect(`/${slug}/decisions?error=Title+and+decision+required`);

    await db.decision.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        title,
        decision,
        reasoning: reasoning || null,
        alternatives: alternatives || null,
        affectedSystem: affectedSystem || null,
        reversible,
        status: "ACCEPTED",
        decidedAt: new Date(),
      },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        type: "DECISION_CREATED",
        subjectKind: "DECISION",
        summary: `Decision: ${title.slice(0, 80)}`,
      },
    });

    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

    redirect(`/${slug}/decisions`);
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

    const existing = await db.decision.findFirst({ where: { id, ownerId: actor.userId } });
    if (!existing) redirect(`/${slug}/decisions`);

    await db.decision.update({
      where: { id: existing.id },
      data: { status: status as "PROPOSED" | "ACCEPTED" | "SUPERSEDED" | "REJECTED" },
    });
    redirect(`/${slug}/decisions`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Decision log</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Why the project is the way it is. Accepted decisions become context in every
          generated prompt, so an agent won&apos;t quietly undo them.
        </p>
      </div>

      <CreateDisclosure label="Record a decision">
        <form action={addDecision} className="space-y-4">
          <Field
            label="Title"
            name="title"
            type="text"
            placeholder="Use Prisma instead of Drizzle"
            required
          />
          <TextField
            label="Decision"
            name="decision"
            rows={2}
            placeholder="What was decided, stated as an instruction an agent can follow"
            required
          />
          <TextField
            label="Reasoning"
            name="reasoning"
            rows={2}
            placeholder="The thinking behind it"
          />
          <Field
            label="Alternatives considered"
            name="alternatives"
            type="text"
            placeholder="Drizzle, Kysely"
          />
          <Field
            label="Affected system"
            name="affectedSystem"
            type="text"
            placeholder="Data layer"
          />
          <FieldShell label="Reversibility">
            <label className="flex items-center gap-2.5 text-body text-muted">
              <input
                type="checkbox"
                name="reversible"
                defaultChecked
                className="h-4 w-4 accent-[var(--accent)]"
              />
              This decision can be revisited later
            </label>
          </FieldShell>
          <Button type="submit" variant="primary">
            Record decision
          </Button>
        </form>
      </CreateDisclosure>

      {project.decisions.length === 0 ? (
        <EmptyState
          icon={<GitBranch className="h-5 w-5" />}
          title="No decisions logged"
          description="The first time you wonder why something was built a certain way, this is the page you'll wish you had filled in."
        />
      ) : (
        <Stack>
          {project.decisions.map((decision) => {
            const meta = workStatus(decision.status);
            return (
              <Row key={decision.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-title-3 text-foreground">{decision.title}</h3>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  <Badge tone={decision.reversible ? "quiet" : "danger"}>
                    {decision.reversible ? "Reversible" : "Locked"}
                  </Badge>
                </div>

                <p className="mt-2 max-w-(--reading-max) text-body text-ink-100">
                  {decision.decision}
                </p>

                <DataList
                  className="mt-3"
                  items={[
                    { label: "Reasoning", value: decision.reasoning },
                    { label: "Alternatives", value: decision.alternatives },
                    { label: "Affects", value: decision.affectedSystem },
                  ]}
                />

                {decision.status !== "ACCEPTED" && decision.status !== "REJECTED" && (
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={decision.id} />
                    <RowActions>
                      <RowButton name="status" value="ACCEPTED" tone="success">
                        Accept
                      </RowButton>
                      <RowButton name="status" value="REJECTED" tone="danger">
                        Reject
                      </RowButton>
                    </RowActions>
                  </form>
                )}
                <RecordControls
                  id={decision.id}
                  name={decision.title}
                  editAction={updateDecisionRecord}
                  deleteAction={deleteDecisionRecord}
                >
                  <Field label="Title" name="title" defaultValue={decision.title} required />
                  <TextField label="Decision" name="decision" rows={2} defaultValue={decision.decision} required />
                  <TextField label="Reasoning" name="reasoning" rows={2} defaultValue={decision.reasoning ?? ""} />
                  <Field label="Alternatives considered" name="alternatives" defaultValue={decision.alternatives ?? ""} />
                  <Field label="Affected system" name="affectedSystem" defaultValue={decision.affectedSystem ?? ""} />
                  <FieldShell label="Reversibility">
                    <label className="flex items-center gap-2.5 text-body text-muted">
                      <input type="checkbox" name="reversible" defaultChecked={decision.reversible} className="h-4 w-4 accent-[var(--accent)]" />
                      This decision can be revisited later
                    </label>
                  </FieldShell>
                </RecordControls>
              </Row>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
