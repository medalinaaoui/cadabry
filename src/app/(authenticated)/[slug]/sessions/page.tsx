import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

type Props = { params: Promise<{ slug: string }> };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "text-accent bg-accent/10" },
  COMPLETED: { label: "Completed", cls: "text-success bg-success/10" },
  ABANDONED: { label: "Abandoned", cls: "text-muted bg-muted/10" },
};

export default async function SessionsPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Coding Sessions</h1>
      <p className="mt-1 text-sm text-muted">
        Continuity between sessions — so the next one starts where this one ended.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + Start a session
        </summary>
        <form action={startSession} className="space-y-4 px-4 py-4">
          <Field label="Objective" name="objective" type="text" placeholder="Finish onboarding persistence" required />
          <Button type="submit" variant="primary">Start session</Button>
        </form>
      </details>

      <div className="mt-6 space-y-5">
        {project.codingSessions.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No sessions yet. Start one before your next build.</p>
          </div>
        ) : (
          project.codingSessions.map((session) => {
            const meta = STATUS_META[session.status] ?? STATUS_META.ACTIVE;
            return (
              <div key={session.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{session.objective}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${meta.cls}`}>{meta.label}</span>
                      {session._count.prompts > 0 && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">{session._count.prompts} prompts</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-subtle">
                      {session.startedAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      {session.endedAt && ` → ${session.endedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                    </p>
                    {session.notes && <p className="mt-2 text-sm text-muted">{session.notes}</p>}
                    {session.discoveries && (
                      <p className="mt-1 text-xs text-subtle">🗒 Discoveries: {session.discoveries}</p>
                    )}
                    {session.whatChanged && (
                      <p className="mt-1 text-xs text-subtle">Changed: {session.whatChanged}</p>
                    )}
                    {session.nextTask && (
                      <div className="mt-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-accent">
                        Next: {session.nextTask}
                      </div>
                    )}
                  </div>
                </div>

                {session.status === "ACTIVE" && (
                  <details className="mt-3 rounded-xl border border-line bg-surface px-3 py-2 text-xs text-muted">
                    <summary className="cursor-pointer">End session (quick review)</summary>
                    <form action={endSession} className="mt-3 space-y-3">
                      <input type="hidden" name="id" value={session.id} />
                      <TextField label="What did we finish?" name="notes" rows={2} />
                      <TextField label="What still doesn't work?" name="whatChanged" rows={2} />
                      <TextField label="Discoveries" name="discoveries" rows={2} />
                      <Field label="What should happen next?" name="nextTask" type="text" placeholder="Next task for the project" />
                      <div className="rounded-xl border border-line bg-surface-raised p-3">
                        <label className="flex items-center gap-2 text-xs text-muted">
                          <input type="checkbox" name="makeDecision" className="accent-[var(--accent)]" />
                          Record a decision made this session
                        </label>
                        <div className="mt-2 space-y-2">
                          <Field label="Decision title" name="decisionTitle" type="text" placeholder="Use Prisma instead of Drizzle" />
                          <Field label="Decision" name="decisionBody" type="text" placeholder="What we decided" />
                        </div>
                      </div>
                      <Button type="submit" variant="secondary">Complete session</Button>
                    </form>
                  </details>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
