import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Ban, Check, CircleAlert, Folder } from "lucide-react";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { DataList } from "@/components/ui/page";
import { Progress } from "@/components/ui/progress";
import { workStatus } from "@/features/projects/display";

async function getBrain(ownerId: string, slug: string) {
  return db.project.findUnique({
    where: { ownerId_slug: { ownerId, slug } },
    select: {
      slug: true,
      description: true,
      projectType: true,
      repositoryUrl: true,
      productionUrl: true,
      stagingUrl: true,
      localFolderPath: true,
      productStatement: true,
      problem: true,
      targetUser: true,
      desiredOutcome: true,
      valueProposition: true,
      whatWorks: true,
      partiallyBuilt: true,
      whatIsBroken: true,
      currentBlocker: true,
      currentTask: true,
      nextTask: true,
      progress: true,
      createdAt: true,
      updatedAt: true,
      technologies: {
        select: { category: true, version: true, technology: { select: { name: true } } },
        orderBy: { sortOrder: "asc" },
      },
      boundaries: { select: { kind: true, content: true }, orderBy: { sortOrder: "asc" } },
      milestones: {
        select: { id: true, name: true, status: true },
        orderBy: { sortOrder: "asc" },
        take: 10,
      },
    },
  });
}

const BOUNDARY_GROUPS = [
  { kind: "GOAL", label: "Goals", icon: Check, tone: "text-success" },
  { kind: "NON_GOAL", label: "Non-goals", icon: Ban, tone: "text-danger" },
  { kind: "CONSTRAINT", label: "Constraints", icon: CircleAlert, tone: "text-cobalt-400" },
  { kind: "ASSUMPTION", label: "Assumptions", icon: CircleAlert, tone: "text-subtle" },
  { kind: "FUTURE_IDEA", label: "Future ideas", icon: CircleAlert, tone: "text-subtle" },
] as const;

export default async function ProjectBrainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actor = await requireActor();
  const project = await getBrain(actor.userId, slug);
  if (!project) notFound();

  const links = [
    { label: "Repository", href: project.repositoryUrl },
    { label: "Production", href: project.productionUrl },
    { label: "Staging", href: project.stagingUrl },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        {/*
          Current state leads. When you reopen a project after a week, "what
          was I doing" is the only question that matters first.
        */}
        <Panel>
          <PanelHeader title="Current state" />

          <div className="space-y-3">
            <StateLine label="Now building" value={project.currentTask} tone="accent" />
            <StateLine label="Next up" value={project.nextTask} />
            <StateLine label="What works" value={project.whatWorks} />
            <StateLine label="Partially built" value={project.partiallyBuilt} />
            <StateLine label="Broken" value={project.whatIsBroken} tone="danger" />

            {project.currentBlocker && (
              <p className="flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger/8 px-3.5 py-3">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <span className="text-body text-danger">
                  <span className="font-semibold">Blocked · </span>
                  {project.currentBlocker}
                </span>
              </p>
            )}

            {!project.currentTask &&
              !project.nextTask &&
              !project.whatWorks &&
              !project.whatIsBroken &&
              !project.currentBlocker && (
                <p className="text-caption text-subtle">
                  Nothing recorded yet.{" "}
                  <Link href={`/${slug}/edit`} className="text-cobalt-400 underline underline-offset-2 hover:text-cobalt-300">
                    Fill in the current state
                  </Link>{" "}
                  so a resume packet has something to say.
                </p>
              )}
          </div>
        </Panel>

        {(project.productStatement || project.description) && (
          <Panel>
            <PanelHeader title="What we're building" />
            <p className="max-w-(--reading-max) text-body text-ink-100">
              {project.productStatement ?? project.description}
            </p>
          </Panel>
        )}

        {(project.problem || project.targetUser || project.desiredOutcome || project.valueProposition) && (
          <Panel>
            <PanelHeader title="Why we're building it" />
            <DataList
              items={[
                { label: "Problem", value: project.problem },
                { label: "Target user", value: project.targetUser },
                { label: "Desired outcome", value: project.desiredOutcome },
                { label: "Value proposition", value: project.valueProposition },
              ]}
            />
          </Panel>
        )}

        {project.technologies.length > 0 && (
          <Panel>
            <PanelHeader
              title="Tech brain"
              count={project.technologies.length}
              description="The stack an agent must not quietly replace."
            />
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li key={`${tech.category}-${tech.technology.name}`}>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line
                      bg-well px-2.5 py-1.5 text-caption text-ink-100"
                  >
                    {tech.technology.name}
                    {tech.version && <span className="text-subtle">{tech.version}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {project.boundaries.length > 0 && (
          <Panel>
            <PanelHeader
              title="Product boundaries"
              description="Non-goals are what stop an agent expanding the scope on its own."
            />
            <div className="space-y-5">
              {BOUNDARY_GROUPS.map((group) => {
                const items = project.boundaries.filter((b) => b.kind === group.kind);
                if (items.length === 0) return null;
                return (
                  <div key={group.kind}>
                    <h3 className="eyebrow mb-2">{group.label}</h3>
                    <ul className="space-y-1.5">
                      {items.map((boundary, i) => (
                        <li key={i} className="flex items-start gap-2 text-body text-ink-100">
                          <group.icon
                            className={`mt-1 h-3.5 w-3.5 shrink-0 ${group.tone}`}
                            aria-hidden="true"
                          />
                          {boundary.content}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
      </div>

      <aside className="space-y-6">
        <Panel>
          <PanelHeader title="Progress" />
          <Progress value={project.progress} label="Project progress" />
          <dl className="mt-4 space-y-1.5 text-caption">
            <Meta label="Type" value={project.projectType} />
            <Meta label="Created" value={formatDate(project.createdAt)} />
            <Meta label="Updated" value={formatDate(project.updatedAt)} />
          </dl>
        </Panel>

        {project.milestones.length > 0 && (
          <Panel>
            <PanelHeader title="Milestones" count={project.milestones.length} />
            <ul className="space-y-2.5">
              {project.milestones.map((milestone) => {
                const meta = workStatus(milestone.status);
                return (
                  <li key={milestone.id} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: meta.hue }}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        milestone.status === "DONE"
                          ? "text-body text-subtle line-through"
                          : "text-body text-ink-100"
                      }
                    >
                      {milestone.name}
                      <span className="sr-only"> — {meta.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        )}

        {(links.length > 0 || project.localFolderPath) && (
          <Panel>
            <PanelHeader title="Links" />
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-body text-cobalt-400
                      transition-colors hover:text-cobalt-300"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
              {project.localFolderPath && (
                <li className="flex items-start gap-1.5 text-caption text-muted">
                  <Folder className="mt-0.5 h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
                  <code className="wrap-anywhere">{project.localFolderPath}</code>
                </li>
              )}
            </ul>
          </Panel>
        )}
      </aside>
    </div>
  );
}

function StateLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | null;
  tone?: "accent" | "danger";
}) {
  if (!value) return null;
  return (
    <p className="text-body">
      <span className="eyebrow mr-2">{label}</span>
      <span
        className={
          tone === "accent" ? "text-accent" : tone === "danger" ? "text-danger" : "text-ink-100"
        }
      >
        {value}
      </span>
    </p>
  );
}

function Meta({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-subtle">{label}</dt>
      <dd className="text-ink-100">{value}</dd>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
