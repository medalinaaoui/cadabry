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
  PROPOSED: { label: "Proposed", cls: "text-subtle bg-subtle/10" },
  ACCEPTED: { label: "Accepted", cls: "text-success bg-success/10" },
  SUPERSEDED: { label: "Superseded", cls: "text-muted bg-muted/10" },
  REJECTED: { label: "Rejected", cls: "text-danger bg-danger/10" },
};

export default async function DecisionsPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Decision Log</h1>
      <p className="mt-1 text-sm text-muted">
        Why the project is the way it is — so agents never forget.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + Record a decision
        </summary>
        <form action={addDecision} className="space-y-4 px-4 py-4">
          <Field label="Title" name="title" type="text" placeholder="Use Prisma instead of Drizzle" required />
          <TextField label="Decision" name="decision" rows={2} placeholder="What we decided and why it matters for agents" required />
          <TextField label="Reasoning" name="reasoning" rows={2} placeholder="The thinking behind it" />
          <Field label="Alternatives considered" name="alternatives" type="text" placeholder="e.g. Drizzle, Kysely" />
          <Field label="Affected system" name="affectedSystem" type="text" placeholder="e.g. data layer" />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="reversible" defaultChecked className="accent-[var(--accent)]" />
            Reversible
          </label>
          <Button type="submit" variant="primary">Record decision</Button>
        </form>
      </details>

      <div className="mt-6 space-y-4">
        {project.decisions.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No decisions logged yet.</p>
          </div>
        ) : (
          project.decisions.map((d) => {
            const meta = STATUS_META[d.status] ?? STATUS_META.PROPOSED;
            return (
              <div key={d.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{d.title}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${meta.cls}`}>{meta.label}</span>
                      {d.reversible ? (
                        <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] text-subtle">reversible</span>
                      ) : (
                        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] text-danger">locked</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-foreground">{d.decision}</p>
                    {d.reasoning && <p className="mt-1 text-xs text-muted">Why: {d.reasoning}</p>}
                    {d.alternatives && <p className="mt-1 text-xs text-subtle">Considered: {d.alternatives}</p>}
                    {d.affectedSystem && <p className="mt-1 text-xs text-subtle">Affects: {d.affectedSystem}</p>}
                  </div>
                  {d.status !== "ACCEPTED" && d.status !== "REJECTED" && (
                    <form action={updateStatus} className="shrink-0">
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" name="status" value="ACCEPTED" className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                        Accept
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
