import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField } from "@/components/ui/field";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PROJECT_STATUS_ORDER, projectStatus } from "@/features/projects/display";

type Props = { params: Promise<{ slug: string }> };

export default async function EditProjectPage({ params }: Props) {
  const actor = await requireActor();
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
    <div className="max-w-3xl">
      <div>
        <h2 className="text-title-2 text-foreground">Edit project brain</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          The structured source of truth agents read. Everything here can end up in a
          generated prompt, so write it the way you&apos;d want an agent to read it.
        </p>
      </div>

      <form action={saveBrain} className="mt-7 space-y-5">
        <Panel>
          <PanelHeader title="Identity" />
          <div className="space-y-4">
            <Field
              label="One-line description"
              name="oneLine"
              type="text"
              placeholder="What is this, briefly?"
              defaultValue={project.oneLineDescription ?? ""}
            />
            <TextField
              label="Detailed description"
              name="description"
              rows={3}
              defaultValue={project.description ?? ""}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Status" name="status" defaultValue={project.status}>
                {PROJECT_STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {projectStatus(status).label}
                  </option>
                ))}
              </SelectField>
              <Field
                label="Progress"
                name="progress"
                type="number"
                min={0}
                max={100}
                defaultValue={project.progress}
                hint="0–100%."
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="What are we building?" />
          <div className="space-y-4">
            <TextField
              label="Product statement"
              name="productStatement"
              rows={2}
              defaultValue={project.productStatement ?? ""}
              placeholder="An app for agency owners that analyzes Meta ad creatives and identifies winning hooks."
            />
            <TextField
              label="Problem"
              name="problem"
              rows={2}
              defaultValue={project.problem ?? ""}
            />
            <Field
              label="Target user"
              name="targetUser"
              type="text"
              defaultValue={project.targetUser ?? ""}
            />
            <TextField
              label="Desired outcome"
              name="desiredOutcome"
              rows={2}
              defaultValue={project.desiredOutcome ?? ""}
            />
            <TextField
              label="Value proposition"
              name="valueProposition"
              rows={2}
              defaultValue={project.valueProposition ?? ""}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Current state"
            description="The part that makes resuming cheap. Keep it honest and current."
          />
          <div className="space-y-4">
            <TextField
              label="What already works"
              name="whatWorks"
              rows={2}
              defaultValue={project.whatWorks ?? ""}
            />
            <TextField
              label="Partially built"
              name="partiallyBuilt"
              rows={2}
              defaultValue={project.partiallyBuilt ?? ""}
            />
            <TextField
              label="What's broken"
              name="whatBroken"
              rows={2}
              defaultValue={project.whatIsBroken ?? ""}
            />
            <TextField
              label="Current blocker"
              name="blocker"
              rows={2}
              defaultValue={project.currentBlocker ?? ""}
            />
            <TextField
              label="Current task"
              name="currentTask"
              rows={2}
              defaultValue={project.currentTask ?? ""}
            />
            <TextField
              label="Next task"
              name="nextTask"
              rows={2}
              defaultValue={project.nextTask ?? ""}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Links" />
          <div className="space-y-4">
            <Field
              label="Repository URL"
              name="repositoryUrl"
              type="url"
              defaultValue={project.repositoryUrl ?? ""}
            />
            <Field
              label="Production URL"
              name="productionUrl"
              type="url"
              defaultValue={project.productionUrl ?? ""}
            />
            <Field
              label="Staging URL"
              name="stagingUrl"
              type="url"
              defaultValue={project.stagingUrl ?? ""}
            />
            <Field
              label="Local folder path"
              name="localPath"
              type="text"
              defaultValue={project.localFolderPath ?? ""}
              placeholder="/Users/me/projects/my-app"
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Product boundaries"
            description="One item per line. Non-goals are what stop an agent expanding the scope."
          />
          <div className="space-y-4">
            {(
              [
                ["Goals", "boundaryGoals", "GOAL", 3],
                ["Non-goals", "boundaryNonGoals", "NON_GOAL", 3],
                ["Constraints", "boundaryConstraints", "CONSTRAINT", 3],
                ["Assumptions", "boundaryAssumptions", "ASSUMPTION", 2],
                ["Future ideas", "boundaryFuture", "FUTURE_IDEA", 2],
              ] as const
            ).map(([label, name, kind, rows]) => (
              <TextField
                key={name}
                label={label}
                name={name}
                rows={rows}
                defaultValue={project.boundaries
                  .filter((b) => b.kind === kind)
                  .map((b) => b.content)
                  .join("\n")}
              />
            ))}
          </div>
        </Panel>

        <div className="flex justify-end gap-2 pt-1">
          <Button asChild variant="ghost">
            <Link href={`/${project.slug}`}>Cancel</Link>
          </Button>
          <Button type="submit" variant="primary">
            Save project brain
          </Button>
        </div>
      </form>
    </div>
  );
}
