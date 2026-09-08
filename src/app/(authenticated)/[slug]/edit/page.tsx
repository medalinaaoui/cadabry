import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

type Props = { params: Promise<{ slug: string }> };

const STATUSES = ["IDEA", "PLANNING", "BUILDING", "BLOCKED", "PAUSED", "SHIPPED", "ARCHIVED"];
const BOUNDARY_KINDS = ["GOAL", "NON_GOAL", "ASSUMPTION", "CONSTRAINT", "FUTURE_IDEA"];

export default async function EditProjectPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      boundaries: { orderBy: { sortOrder: "asc" } },
      technologies: { include: { technology: true } },
    },
  });
  if (!project) notFound();

  async function saveBrain(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const oneLine = (formData.get("oneLine") as string).trim();
    const description = (formData.get("description") as string).trim();
    const productStatement = (formData.get("productStatement") as string).trim();
    const problem = (formData.get("problem") as string).trim();
    const targetUser = (formData.get("targetUser") as string).trim();
    const desiredOutcome = (formData.get("desiredOutcome") as string).trim();
    const valueProposition = (formData.get("valueProposition") as string).trim();
    const whatWorks = (formData.get("whatWorks") as string).trim();
    const partiallyBuilt = (formData.get("partiallyBuilt") as string).trim();
    const whatBroken = (formData.get("whatBroken") as string).trim();
    const blocker = (formData.get("blocker") as string).trim();
    const currentTask = (formData.get("currentTask") as string).trim();
    const nextTask = (formData.get("nextTask") as string).trim();
    const status = (formData.get("status") as string) || project!.status;
    const repositoryUrl = (formData.get("repositoryUrl") as string).trim();
    const productionUrl = (formData.get("productionUrl") as string).trim();
    const stagingUrl = (formData.get("stagingUrl") as string).trim();
    const localPath = (formData.get("localPath") as string).trim();
    const progress = Math.min(100, Math.max(0, parseInt(formData.get("progress") as string, 10) || 0));

    await db.project.update({
      where: { id: project!.id },
      data: {
        oneLineDescription: oneLine || null,
        description: description || null,
        productStatement: productStatement || null,
        problem: problem || null,
        targetUser: targetUser || null,
        desiredOutcome: desiredOutcome || null,
        valueProposition: valueProposition || null,
        whatWorks: whatWorks || null,
        partiallyBuilt: partiallyBuilt || null,
        whatIsBroken: whatBroken || null,
        currentBlocker: blocker || null,
        currentTask: currentTask || null,
        nextTask: nextTask || null,
        status: status as "IDEA" | "PLANNING" | "BUILDING" | "BLOCKED" | "PAUSED" | "SHIPPED" | "ARCHIVED",
        repositoryUrl: repositoryUrl || null,
        productionUrl: productionUrl || null,
        stagingUrl: stagingUrl || null,
        localFolderPath: localPath || null,
        progress,
        lastActivityAt: new Date(),
      },
    });

    // Boundaries: delete and re-create from textareas
    const goals = (formData.get("boundaryGoals") as string).split("\n").map((s) => s.trim()).filter(Boolean);
    const nonGoals = (formData.get("boundaryNonGoals") as string).split("\n").map((s) => s.trim()).filter(Boolean);
    const constraints = (formData.get("boundaryConstraints") as string).split("\n").map((s) => s.trim()).filter(Boolean);
    const assumptions = (formData.get("boundaryAssumptions") as string).split("\n").map((s) => s.trim()).filter(Boolean);
    const futureIdeas = (formData.get("boundaryFuture") as string).split("\n").map((s) => s.trim()).filter(Boolean);

    await db.projectBoundary.deleteMany({ where: { ownerId: actor.userId, projectId: project!.id } });
    const all = [
      ...goals.map((c) => ({ kind: "GOAL" as const, content: c })),
      ...nonGoals.map((c) => ({ kind: "NON_GOAL" as const, content: c })),
      ...constraints.map((c) => ({ kind: "CONSTRAINT" as const, content: c })),
      ...assumptions.map((c) => ({ kind: "ASSUMPTION" as const, content: c })),
      ...futureIdeas.map((c) => ({ kind: "FUTURE_IDEA" as const, content: c })),
    ];
    for (let i = 0; i < all.length; i += 1) {
      await db.projectBoundary.create({
        data: {
          ownerId: actor.userId,
          projectId: project!.id,
          kind: all[i].kind,
          content: all[i].content,
          sortOrder: i,
        },
      });
    }

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        type: "PROJECT_UPDATED",
        subjectKind: "PROJECT",
        summary: `Updated Project Brain for "${project!.name}"`,
      },
    });

    redirect(`/${slug}`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Project Brain</h1>
      <p className="mt-1 text-sm text-muted">
        The structured source of truth agents read to understand this project.
      </p>

      <form action={saveBrain} className="mt-8 space-y-6">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Identity</h2>
          <div className="mt-4 space-y-4">
            <Field label="One-line description" name="oneLine" type="text" placeholder="What is this, briefly?" defaultValue={project.oneLineDescription ?? ""} />
            <TextField label="Detailed description" name="description" rows={3} defaultValue={project.description ?? ""} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="status" className="text-sm text-muted">Status</label>
                <select id="status" name="status" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
                  {STATUSES.map((s) => <option key={s} value={s} defaultValue={project.status}>{s.replaceAll("_", " ").toLowerCase()}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="progress" className="text-sm text-muted">Progress (0–100%)</label>
                <input id="progress" name="progress" type="number" min={0} max={100} defaultValue={project.progress}
                       className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">What are we building?</h2>
          <div className="mt-4 space-y-4">
            <TextField label="Product statement" name="productStatement" rows={2} defaultValue={project.productStatement ?? ""} placeholder="An app for agency owners that analyzes Meta ad creatives..." />
            <TextField label="Problem" name="problem" rows={2} defaultValue={project.problem ?? ""} />
            <Field label="Target user" name="targetUser" type="text" defaultValue={project.targetUser ?? ""} />
            <TextField label="Desired outcome" name="desiredOutcome" rows={2} defaultValue={project.desiredOutcome ?? ""} />
            <TextField label="Value proposition" name="valueProposition" rows={2} defaultValue={project.valueProposition ?? ""} />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Current state</h2>
          <div className="mt-4 space-y-4">
            <TextField label="What already works" name="whatWorks" rows={2} defaultValue={project.whatWorks ?? ""} />
            <TextField label="Partially built" name="partiallyBuilt" rows={2} defaultValue={project.partiallyBuilt ?? ""} />
            <TextField label="What's broken" name="whatBroken" rows={2} defaultValue={project.whatIsBroken ?? ""} />
            <TextField label="Current blocker" name="blocker" rows={1} defaultValue={project.currentBlocker ?? ""} />
            <TextField label="Current task" name="currentTask" rows={2} defaultValue={project.currentTask ?? ""} />
            <TextField label="Next task" name="nextTask" rows={2} defaultValue={project.nextTask ?? ""} />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Links</h2>
          <div className="mt-4 space-y-4">
            <Field label="Repository URL" name="repositoryUrl" type="url" defaultValue={project.repositoryUrl ?? ""} />
            <Field label="Production URL" name="productionUrl" type="url" defaultValue={project.productionUrl ?? ""} />
            <Field label="Staging URL" name="stagingUrl" type="url" defaultValue={project.stagingUrl ?? ""} />
            <Field label="Local folder path" name="localPath" type="text" defaultValue={project.localFolderPath ?? ""} placeholder="/Users/me/projects/my-app" />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Product boundaries</h2>
          <p className="mt-1 text-xs text-muted">One item per line. Non-goals prevent agents from expanding scope.</p>
          <div className="mt-4 space-y-4">
            <TextField label="Goals" name="boundaryGoals" rows={3} defaultValue={project.boundaries.filter((b) => b.kind === "GOAL").map((b) => b.content).join("\n")} />
            <TextField label="Non-goals" name="boundaryNonGoals" rows={3} defaultValue={project.boundaries.filter((b) => b.kind === "NON_GOAL").map((b) => b.content).join("\n")} />
            <TextField label="Constraints" name="boundaryConstraints" rows={3} defaultValue={project.boundaries.filter((b) => b.kind === "CONSTRAINT").map((b) => b.content).join("\n")} />
            <TextField label="Assumptions" name="boundaryAssumptions" rows={2} defaultValue={project.boundaries.filter((b) => b.kind === "ASSUMPTION").map((b) => b.content).join("\n")} />
            <TextField label="Future ideas" name="boundaryFuture" rows={2} defaultValue={project.boundaries.filter((b) => b.kind === "FUTURE_IDEA").map((b) => b.content).join("\n")} />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/${project.slug}`}>
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary">Save Project Brain</Button>
        </div>
      </form>
    </div>
  );
}
