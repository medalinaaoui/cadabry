import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Terminal } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, FieldShell, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure } from "@/components/ui/disclosure";
import { workStatus } from "@/features/projects/display";

type Props = { params: Promise<{ slug: string }> };

export default async function SessionsPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { codingSessions: { orderBy: { startedAt: "desc" }, include: { _count: { select: { prompts: true, features: true } } } } },
  });
  if (!project) notFound();

  async function startSession(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const objective = (formData.get("objective") as string).trim();
    if (!objective) redirect(`/${slug}/sessions?error=Objective+required`);

    const session = await db.codingSession.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        objective,
        status: "ACTIVE",
      },
      select: { id: true },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        codingSessionId: session.id,
        type: "SESSION_STARTED",
        subjectKind: "CODING_SESSION",
        summary: `Session started: ${objective.slice(0, 80)}`,
      },
    });
    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

    redirect(`/${slug}/sessions`);
  }

  async function endSession(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const notes = (formData.get("notes") as string).trim();
    const discoveries = (formData.get("discoveries") as string).trim();
    const whatChanged = (formData.get("whatChanged") as string).trim();
    const nextTask = (formData.get("nextTask") as string).trim();
    const makeDecision = (formData.get("makeDecision") as string) === "on";
    const decisionTitle = (formData.get("decisionTitle") as string).trim();
    const decisionBody = (formData.get("decisionBody") as string).trim();

    const session = await db.codingSession.findFirst({ where: { id, ownerId: actor.userId } });
    if (!session) redirect(`/${slug}/sessions`);
    const sessionNonNull = session;

    await db.codingSession.update({
      where: { id: sessionNonNull.id },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
        notes: notes || null,
        discoveries: discoveries || null,
        whatChanged: whatChanged || null,
        nextTask,
      },
    });

    // If a decision was made, record it in the Decision Log
    if (makeDecision && decisionTitle && decisionBody) {
      await db.decision.create({
        data: {
          ownerId: actor.userId,
          projectId: project!.id,
          codingSessionId: sessionNonNull.id,
          title: decisionTitle,
          decision: decisionBody,
          status: "ACCEPTED",
          decidedAt: new Date(),
        },
      });
    }

    // If next task given, update project
    if (nextTask) {
      await db.project.update({
        where: { id: project!.id },
        data: { nextTask, lastActivityAt: new Date() },
      });
    }

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        codingSessionId: sessionNonNull.id,
        type: "SESSION_COMPLETED",
        subjectKind: "CODING_SESSION",
        summary: `Session completed: ${sessionNonNull.objective.slice(0, 80)}`,
      },
    });

    redirect(`/${slug}/sessions`);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Coding sessions</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Close a session properly and the next one starts where this one ended. The
          review at the end is what feeds the next resume packet.
        </p>
      </div>

      <CreateDisclosure label="Start a session">
        <form action={startSession} className="space-y-4">
          <Field
            label="Objective"
            name="objective"
            type="text"
            placeholder="Finish onboarding persistence"
            required
            hint="One sentence. What does done look like for this sitting?"
          />
          <Button type="submit" variant="primary">
            Start session
          </Button>
        </form>
      </CreateDisclosure>

      {project.codingSessions.length === 0 ? (
        <EmptyState
          icon={<Terminal className="h-5 w-5" />}
          title="No sessions logged"
          description="Start one before your next build so there's a record of what changed and why."
        />
      ) : (
        <Stack className="space-y-3">
          {project.codingSessions.map((session) => {
            const meta = workStatus(session.status);
            return (
              <Row key={session.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-title-3 text-foreground">{session.objective}</h3>
                  <Badge tone={meta.tone} dot={session.status === "ACTIVE"}>
                    {meta.label}
                  </Badge>
                  {session._count.prompts > 0 && (
                    <Badge tone="cobalt">
                      {session._count.prompts} prompt
                      {session._count.prompts === 1 ? "" : "s"}
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-caption text-subtle">
                  <time dateTime={session.startedAt.toISOString()}>
                    {session.startedAt.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                  {session.endedAt && (
                    <>
                      {" → "}
                      <time dateTime={session.endedAt.toISOString()}>
                        {session.endedAt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </>
                  )}
                </p>

                <DataList
                  className="mt-3"
                  items={[
                    { label: "Finished", value: session.notes },
                    { label: "Still broken", value: session.whatChanged },
                    { label: "Discoveries", value: session.discoveries },
                  ]}
                />

                {session.nextTask && (
                  <p className="mt-3 rounded-xl border border-accent/25 bg-accent/8 px-3.5 py-2.5 text-caption text-accent">
                    <span className="font-semibold">Next · </span>
                    {session.nextTask}
                  </p>
                )}

                {session.status === "ACTIVE" && (
                  <details className="mt-4 rounded-xl border border-line bg-well">
                    <summary
                      className="cursor-pointer list-none px-4 py-3 text-caption font-semibold
                        text-muted transition-colors hover:text-foreground
                        [&::-webkit-details-marker]:hidden"
                    >
                      End session — quick review
                    </summary>
                    <form
                      action={endSession}
                      className="space-y-4 border-t border-line-subtle px-4 py-4"
                    >
                      <input type="hidden" name="id" value={session.id} />
                      <TextField label="What did we finish?" name="notes" rows={2} />
                      <TextField label="What still doesn't work?" name="whatChanged" rows={2} />
                      <TextField label="Discoveries" name="discoveries" rows={2} />
                      <Field
                        label="What should happen next?"
                        name="nextTask"
                        type="text"
                        placeholder="Becomes the project's next task"
                      />

                      <div className="rounded-xl border border-line bg-surface p-4">
                        <FieldShell label="Decision">
                          <label className="flex items-center gap-2.5 text-body text-muted">
                            <input
                              type="checkbox"
                              name="makeDecision"
                              className="h-4 w-4 accent-[var(--accent)]"
                            />
                            Record a decision made this session
                          </label>
                        </FieldShell>
                        <div className="mt-4 space-y-4">
                          <Field
                            label="Decision title"
                            name="decisionTitle"
                            type="text"
                            placeholder="Use Prisma instead of Drizzle"
                          />
                          <Field
                            label="Decision"
                            name="decisionBody"
                            type="text"
                            placeholder="What was decided"
                          />
                        </div>
                      </div>

                      <Button type="submit" variant="primary">
                        Complete session
                      </Button>
                    </form>
                  </details>
                )}
              </Row>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
