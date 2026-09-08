import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type Props = { params: Promise<{ slug: string }> };

const STATUS_META: Record<string, { label: string; cls: string }> = {
  PLANNED: { label: "Planned", cls: "text-subtle bg-subtle/10" },
  IN_PROGRESS: { label: "In progress", cls: "text-accent bg-accent/10" },
  BLOCKED: { label: "Blocked", cls: "text-danger bg-danger/10" },
  DONE: { label: "Done", cls: "text-success bg-success/10" },
  CANCELLED: { label: "Cancelled", cls: "text-muted bg-muted/10" },
};

export default async function MilestonesPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Milestones</h1>
      <p className="mt-1 text-sm text-muted">
        Big moments on the way to shipping — dates are optional.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New milestone
        </summary>
        <form action={addMilestone} className="space-y-4 px-4 py-4">
          <Field label="Name" name="name" type="text" placeholder="MVP" required />
          <Field label="Description" name="description" type="text" placeholder="Core loop working for early users" />
          <Field label="Target date (optional)" name="targetDate" type="date" />
          <Button type="submit" variant="primary">Add milestone</Button>
        </form>
      </details>

      <div className="mt-6 space-y-4">
        {project.milestones.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No milestones yet. Prototype → MVP → Launch, that kind of thing.</p>
          </div>
        ) : (
          project.milestones.map((m) => {
            const meta = STATUS_META[m.status] ?? STATUS_META.PLANNED;
            return (
              <div key={m.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{m.name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${meta.cls}`}>{meta.label}</span>
                      {m._count.features > 0 && (
                        <span className="rounded-full bg-cobalt-400/10 px-2 py-0.5 text-[10px] text-cobalt-400">{m._count.features} features</span>
                      )}
                    </div>
                    {m.description && <p className="mt-1 text-sm text-muted">{m.description}</p>}
                    {m.targetDate && <p className="mt-1 text-xs text-subtle">Target: {m.targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>}
                  </div>
                </div>
                <form action={updateStatus} className="mt-2 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={m.id} />
                  {[
                    { value: "IN_PROGRESS", label: "Start", cls: "text-accent bg-accent/10 border-accent/30" },
                    { value: "DONE", label: "Complete", cls: "text-success bg-success/10 border-success/30" },
                  ].map((btn) => (
                    m.status === "DONE" ? null : (
                      <button key={btn.value} type="submit" name="status" value={btn.value}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${btn.cls}`}>
                        {btn.label}
                      </button>
                    )
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
