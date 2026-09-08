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
  INBOX: { label: "Inbox", cls: "text-subtle bg-subtle/10" },
  ACTIVE: { label: "Active", cls: "text-danger bg-danger/10" },
  PLANNED: { label: "Planned", cls: "text-cobalt-400 bg-cobalt-400/10" },
  RESOLVED: { label: "Resolved", cls: "text-success bg-success/10" },
  ARCHIVED: { label: "Archived", cls: "text-muted bg-muted/10" },
};

export default async function BugsPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { bugs: { orderBy: [{ severity: "desc" }, { updatedAt: "desc" }] } },
  });
  if (!project) notFound();

  async function addBug(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const symptoms = (formData.get("symptoms") as string).trim();
    const reproduction = (formData.get("reproduction") as string).trim();
    const expected = (formData.get("expected") as string).trim();
    const actual = (formData.get("actual") as string).trim();
    const severity = Math.min(5, Math.max(0, parseInt(formData.get("severity") as string, 10) || 1));

    if (!title) redirect(`/${slug}/bugs?error=Title+required`);

    await db.bug.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        title,
        symptoms: symptoms || null,
        reproduction: reproduction || null,
        expectedBehavior: expected || null,
        actualBehavior: actual || null,
        severity,
        status: "ACTIVE",
      },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        type: "BUG_CREATED",
        subjectKind: "BUG",
        summary: `Bug: ${title.slice(0, 80)}`,
      },
    });

    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

    redirect(`/${slug}/bugs`);
  }

  async function resolveOrReopen(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const action = formData.get("action") as string;
    const resolution = (formData.get("resolution") as string).trim();

    const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
    if (!bug) redirect(`/${slug}/bugs`);
    const bugNonNull = bug;

    if (action === "resolve") {
      await db.bug.update({
        where: { id: bugNonNull.id },
        data: { status: "RESOLVED", resolution: resolution || bugNonNull.resolution, rootCause: resolution || bugNonNull.rootCause },
      });
      await db.activity.create({
        data: {
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project!.id,
          type: "BUG_RESOLVED",
          subjectKind: "BUG",
          summary: `Resolved: ${bugNonNull.title.slice(0, 80)}`,
        },
      });
    } else if (action === "reopen") {
      await db.bug.update({ where: { id: bugNonNull.id }, data: { status: "ACTIVE" } });
    }

    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

    redirect(`/${slug}/bugs`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Bugs &amp; Debugging Memory</h1>
      <p className="mt-1 text-sm text-muted">
        Track problems, and remember how you fixed them.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + Report a bug
        </summary>
        <form action={addBug} className="space-y-4 px-4 py-4">
          <Field label="Title" name="title" type="text" placeholder="Auth redirect fails on Safari" required />
          <TextField label="Symptoms" name="symptoms" rows={2} placeholder="What goes wrong?" />
          <TextField label="Reproduction steps" name="reproduction" rows={2} placeholder="1. Open on Safari 2. ..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expected" name="expected" type="text" placeholder="Should redirect to dashboard" />
            <Field label="Actual" name="actual" type="text" placeholder="Redirects to login" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="severity" className="text-sm text-muted">Severity (1–5)</label>
            <select id="severity" name="severity" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
              {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} — {s >= 4 ? "critical" : s === 3 ? "major" : "minor"}</option>)}
            </select>
          </div>
          <Button type="submit" variant="primary">Report bug</Button>
        </form>
      </details>

      <div className="mt-6 space-y-4">
        {project.bugs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No bugs tracked. Keep it that way.</p>
          </div>
        ) : (
          project.bugs.map((bug) => {
            const meta = STATUS_META[bug.status] ?? STATUS_META.INBOX;
            return (
              <div key={bug.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{bug.title}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${meta.cls}`}>{meta.label}</span>
                      {bug.severity > 0 && (
                        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] text-danger">S{bug.severity}</span>
                      )}
                    </div>
                    {bug.symptoms && <p className="mt-1 text-sm text-muted">{bug.symptoms}</p>}
                    {bug.expectedBehavior && bug.actualBehavior && (
                      <p className="mt-1 text-xs text-subtle">Expected: {bug.expectedBehavior} · Actual: {bug.actualBehavior}</p>
                    )}
                    {bug.reproduction && <p className="mt-1 text-xs text-subtle">Repro: {bug.reproduction}</p>}
                    {bug.status === "RESOLVED" && bug.resolution && (
                      <div className="mt-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-xs text-success">
                        Fixed: {bug.resolution}
                      </div>
                    )}
                  </div>
                </div>

                {bug.status !== "RESOLVED" && bug.status !== "ARCHIVED" ? (
                  <form action={resolveOrReopen} className="mt-3 flex gap-2">
                    <input type="hidden" name="id" value={bug.id} />
                    <input type="text" name="resolution" placeholder="How it was fixed (root cause)" className="flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-subtle" />
                    <button type="submit" name="action" value="resolve" className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                      Resolve
                    </button>
                  </form>
                ) : bug.status === "RESOLVED" ? (
                  <form action={resolveOrReopen} className="mt-3">
                    <input type="hidden" name="id" value={bug.id} />
                    <button type="submit" name="action" value="reopen" className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground">
                      Reopen
                    </button>
                  </form>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
