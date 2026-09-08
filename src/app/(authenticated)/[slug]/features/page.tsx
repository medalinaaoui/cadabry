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
  PLANNED: { label: "Planned", cls: "text-subtle bg-subtle/10" },
  IN_PROGRESS: { label: "Building", cls: "text-accent bg-accent/10" },
  BLOCKED: { label: "Blocked", cls: "text-danger bg-danger/10" },
  DONE: { label: "Shipped", cls: "text-success bg-success/10" },
  CANCELLED: { label: "Cancelled", cls: "text-muted bg-muted/10" },
};

export default async function FeaturesPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      features: {
        orderBy: [{ status: "asc" }, { priority: "desc" }, { sortOrder: "asc" }],
      },
      milestones: { select: { id: true, name: true, status: true }, orderBy: { sortOrder: "asc" } },
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
    const priority = Math.min(5, Math.max(0, parseInt(formData.get("priority") as string, 10) || 0));

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

    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

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

    const feature = await db.feature.findFirst({ where: { id, ownerId: actor.userId } });
    if (!feature) redirect(`/${slug}/features`);

    await db.feature.update({
      where: { id: feature.id },
      data: { status: status as "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" },
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Features</h1>
      <p className="mt-1 text-sm text-muted">
        A backlog optimized for vibe coding.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New feature
        </summary>
        <form action={addFeature} className="space-y-4 px-4 py-4">
          <Field label="Name" name="title" type="text" placeholder="Onboarding persistence" required />
          <TextField label="Description" name="body" rows={2} placeholder="What should this do?" />
          <Field label="Reason" name="reason" type="text" placeholder="Why does this matter?" />
          <TextField label="Acceptance criteria" name="criteria" rows={2} placeholder="- user can save and reload" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="milestoneId" className="text-sm text-muted">Milestone</label>
              <select id="milestoneId" name="milestoneId" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
                <option value="">— None —</option>
                {project.milestones.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="priority" className="text-sm text-muted">Priority (0–5)</label>
              <select id="priority" name="priority" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
                {[0, 1, 2, 3, 4, 5].map((p) => <option key={p} value={p}>{p}{p === 5 ? " — must" : p === 4 ? " — high" : p === 0 ? " — low" : ""}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary">Add feature</Button>
        </form>
      </details>

      <div className="mt-6 space-y-4">
        {project.features.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No features yet. What should this project do?</p>
          </div>
        ) : (
          project.features.map((f) => {
            const meta = STATUS_META[f.status] ?? STATUS_META.PLANNED;
            return (
              <div key={f.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${meta.cls}`}>{meta.label}</span>
                      {f.priority >= 4 && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">P{f.priority}</span>}
                    </div>
                    {f.body && <p className="mt-1 text-sm text-muted">{f.body}</p>}
                    {f.reason && <p className="mt-1 text-xs text-subtle">Why: {f.reason}</p>}
                    {f.acceptanceCriteria && (
                      <p className="mt-1 text-xs text-subtle">Done when: {f.acceptanceCriteria}</p>
                    )}
                  </div>
                </div>

                <form action={updateFeature} className="mt-2 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={f.id} />
                  {[
                    { value: "IN_PROGRESS", label: "Start", cls: "text-accent bg-accent/10 border-accent/30" },
                    { value: "BLOCKED", label: "Block", cls: "text-danger bg-danger/10 border-danger/30" },
                    { value: "DONE", label: "Ship", cls: "text-success bg-success/10 border-success/30" },
                  ].map((btn) => (
                    <button key={btn.value} type="submit" name="status" value={btn.value}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${btn.cls}`}>
                      {btn.label}
                    </button>
                  ))}
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
