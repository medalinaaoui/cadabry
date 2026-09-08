import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProject(ownerId: string, slug: string) {
  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId, slug } },
    select: {
      id: true,
      name: true,
      slug: true,
      oneLineDescription: true,
      description: true,
      icon: true,
      color: true,
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
      status: true,
      importance: true,
      progress: true,
      lastActivityAt: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          features: true,
          prompts: true,
          queueItems: { where: { status: "QUEUED" } },
          bugs: { where: { status: { in: ["ACTIVE", "INBOX"] } } },
          decisions: true,
          codingSessions: { where: { status: "ACTIVE" } },
          ideas: true,
          inspirations: true,
          notes: true,
        },
      },
      technologies: {
        select: {
          category: true,
          technology: { select: { name: true } },
          version: true,
        },
        orderBy: { sortOrder: "asc" },
      },
      boundaries: {
        select: { kind: true, content: true },
        orderBy: { sortOrder: "asc" },
      },
      milestones: {
        select: { id: true, name: true, status: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
        take: 10,
      },
    },
  });
  return project;
}

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  IDEA: { label: "Idea", color: "text-subtle bg-subtle/10", dot: "bg-subtle" },
  PLANNING: { label: "Planning", color: "text-cobalt-400 bg-cobalt-400/10", dot: "bg-cobalt-400" },
  BUILDING: { label: "Building", color: "text-accent bg-accent/10", dot: "bg-accent" },
  BLOCKED: { label: "Blocked", color: "text-danger bg-danger/10", dot: "bg-danger" },
  PAUSED: { label: "Paused", color: "text-muted bg-muted/10", dot: "bg-muted" },
  SHIPPED: { label: "Shipped", color: "text-success bg-success/10", dot: "bg-success" },
  ARCHIVED: { label: "Archived", color: "text-subtle bg-subtle/10", dot: "bg-subtle" },
};

export default async function ProjectPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;
  const project = await getProject(actor.userId, slug);
  if (!project) notFound();

  const statusMeta = STATUS_META[project.status] ?? STATUS_META.IDEA;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
          ← Projects
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {project.name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${statusMeta.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                {statusMeta.label}
              </span>
            </div>
            {project.oneLineDescription && (
              <p className="mt-2 text-muted">{project.oneLineDescription}</p>
            )}
          </div>

          {/* Resume Building action */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${project.slug}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              Edit
            </Link>
            <ResumeBuildingButton project={project} />
          </div>
        </div>
      </div>

      {/* Project tabs */}
      <nav className="mb-8 flex flex-wrap gap-1 rounded-xl bg-surface p-1" aria-label="Project sections">
        {[
          { href: `/${project.slug}`, label: "Overview", active: true },
          { href: `/${project.slug}/queue`, label: `Queue${project._count.queueItems > 0 ? ` · ${project._count.queueItems}` : ""}`, active: false },
          { href: `/${project.slug}/features`, label: "Features", active: false },
          { href: `/${project.slug}/decisions`, label: "Decisions", active: false },
          { href: `/${project.slug}/bugs`, label: `Bugs${project._count.bugs > 0 ? ` · ${project._count.bugs}` : ""}`, active: false },
          { href: `/${project.slug}/notes`, label: "Notes", active: false },
          { href: `/${project.slug}/inspirations`, label: "Inspirations", active: false },
          { href: `/${project.slug}/sessions`, label: "Sessions", active: false },
          { href: `/${project.slug}/timeline`, label: "Timeline", active: false },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tab.active
                ? "bg-cobalt-500/15 text-cobalt-400"
                : "text-muted hover:bg-surface-raised hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Project health + quick stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Features" value={project._count.features} />
        <StatCard label="Queued Prompts" value={project._count.queueItems} accent={project._count.queueItems > 0} />
        <StatCard label="Active Bugs" value={project._count.bugs} danger={project._count.bugs > 0} />
        <StatCard label="Decisions" value={project._count.decisions} />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-8">
          {/* What are we building? */}
          {project.productStatement && (
            <Section title="Product statement">
              <p className="text-sm text-foreground leading-relaxed">{project.productStatement}</p>
            </Section>
          )}

          {/* Problem / target user */}
          <Section title="Context">
            <div className="space-y-3 text-sm">
              {project.problem && (
                <div>
                  <span className="text-subtle">Problem: </span>
                  <span className="text-foreground">{project.problem}</span>
                </div>
              )}
              {project.targetUser && (
                <div>
                  <span className="text-subtle">Target user: </span>
                  <span className="text-foreground">{project.targetUser}</span>
                </div>
              )}
              {project.desiredOutcome && (
                <div>
                  <span className="text-subtle">Outcome: </span>
                  <span className="text-foreground">{project.desiredOutcome}</span>
                </div>
              )}
            </div>
          </Section>

          {/* Current state */}
          <Section title="Current state">
            <div className="space-y-3 text-sm">
              {project.currentTask && (
                <div>
                  <span className="text-subtle">Building: </span>
                  <span className="text-accent">{project.currentTask}</span>
                </div>
              )}
              {project.nextTask && (
                <div>
                  <span className="text-subtle">Next: </span>
                  <span className="text-foreground">{project.nextTask}</span>
                </div>
              )}
              {project.currentBlocker && (
                <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  <span className="text-sm text-danger">{project.currentBlocker}</span>
                </div>
              )}
              {project.whatWorks && (
                <div>
                  <span className="text-subtle">What works: </span>
                  <span className="text-foreground">{project.whatWorks}</span>
                </div>
              )}
              {project.whatIsBroken && (
                <div>
                  <span className="text-subtle">Broken: </span>
                  <span className="text-danger">{project.whatIsBroken}</span>
                </div>
              )}
            </div>
          </Section>

          {/* Tech brain */}
          {project.technologies.length > 0 && (
            <Section title="Tech stack">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={`${t.category}-${t.technology.name}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface-raised px-2.5 py-1 text-xs text-muted"
                  >
                    {t.technology.name}
                    {t.version && <span className="text-subtle">v{t.version}</span>}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Boundaries */}
          {project.boundaries.length > 0 && (
            <Section title="Product boundaries">
              <div className="space-y-3">
                {["GOAL", "NON_GOAL", "CONSTRAINT"].map((kind) => {
                  const items = project.boundaries.filter((b) => b.kind === kind);
                  if (items.length === 0) return null;
                  return (
                    <div key={kind}>
                      <h4 className="mb-1 text-xs font-medium uppercase text-subtle">
                        {kind === "GOAL" ? "Goals" : kind === "NON_GOAL" ? "Non-goals" : "Constraints"}
                      </h4>
                      <ul className="space-y-1">
                        {items.map((b, i) => (
                          <li key={i} className="text-sm text-foreground">
                            {kind === "NON_GOAL" ? (
                              <span className="text-danger/80">✗ {b.content}</span>
                            ) : kind === "CONSTRAINT" ? (
                              <span className="text-muted">! {b.content}</span>
                            ) : (
                              <span>✓ {b.content}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Milestones */}
          {project.milestones.length > 0 && (
            <Section title="Milestones">
              <div className="space-y-2">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 text-sm">
                    <span className={`h-2 w-2 rounded-full ${
                      m.status === "DONE" ? "bg-success"
                        : m.status === "IN_PROGRESS" ? "bg-accent"
                        : m.status === "BLOCKED" ? "bg-danger"
                        : "bg-line"
                    }`} />
                    <span className={
                      m.status === "DONE" ? "text-muted line-through"
                        : m.status === "IN_PROGRESS" ? "text-accent"
                        : "text-foreground"
                    }>{m.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Links */}
          {(project.repositoryUrl || project.productionUrl || project.stagingUrl || project.localFolderPath) && (
            <Section title="Links">
              <div className="space-y-2 text-sm">
                {project.repositoryUrl && (
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer"
                     className="block text-cobalt-400 hover:text-cobalt-300 truncate">
                    Repository
                  </a>
                )}
                {project.productionUrl && (
                  <a href={project.productionUrl} target="_blank" rel="noopener noreferrer"
                     className="block text-cobalt-400 hover:text-cobalt-300 truncate">
                    Production
                  </a>
                )}
                {project.stagingUrl && (
                  <a href={project.stagingUrl} target="_blank" rel="noopener noreferrer"
                     className="block text-cobalt-400 hover:text-cobalt-300 truncate">
                    Staging
                  </a>
                )}
                {project.localFolderPath && (
                  <div className="text-muted truncate" title={project.localFolderPath}>
                    {project.localFolderPath.split("/").pop()}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Progress */}
          <Section title="Progress">
            {project.progress > 0 && (
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(project.progress, 100)}%` }} />
              </div>
            )}
            <div className="space-y-1 text-xs text-subtle">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>
              {project.lastActivityAt && (
                <div className="flex justify-between">
                  <span>Last activity</span>
                  <span>{formatDate(project.lastActivityAt)}</span>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">{title}</h3>
      {children}
    </div>
  );
}

function StatCard({ label, value, accent, danger }: { label: string; value: number; accent?: boolean; danger?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className={`text-2xl font-bold ${accent ? "text-accent" : danger ? "text-danger" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-muted">{label}</div>
    </div>
  );
}

function ResumeBuildingButton({ project }: { project: { slug: string; currentTask: string | null; currentBlocker: string | null } }) {
  return (
    <Link
      href={`/${project.slug}/resume`}
      className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong shadow-glow-gold"
    >
      Resume Building
    </Link>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
