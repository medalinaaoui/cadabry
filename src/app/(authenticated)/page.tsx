import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowRight, Layers, Plus } from "lucide-react";
import { db } from "@/server/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { Universe } from "@/components/universe/universe";
import type { UniverseProject } from "@/components/universe/project-node";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projectStatus, timeAgo } from "@/features/projects/display";

export const metadata = { title: "Universe" };

async function getProjects(ownerId: string) {
  return db.project.findMany({
    where: { ownerId, archivedAt: null },
    orderBy: [{ lastActivityAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      oneLineDescription: true,
      status: true,
      importance: true,
      progress: true,
      color: true,
      icon: true,
      lastActivityAt: true,
      currentTask: true,
      currentBlocker: true,
      _count: {
        select: {
          queueItems: { where: { status: "QUEUED" } },
          bugs: { where: { status: "ACTIVE" } },
        },
      },
    },
  });
}

export default async function UniversePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const rows = await getProjects(actor.userId);

  const projects: UniverseProject[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    oneLineDescription: row.oneLineDescription,
    status: row.status,
    importance: row.importance,
    progress: row.progress,
    color: row.color,
    icon: row.icon,
    currentTask: row.currentTask,
    currentBlocker: row.currentBlocker,
    lastActivityAt: row.lastActivityAt,
    queuedCount: row._count.queueItems,
    bugCount: row._count.bugs,
  }));

  // The one project worth resuming: most recently touched, still in flight.
  const resumable = projects.find((p) =>
    ["BUILDING", "PLANNING", "BLOCKED"].includes(p.status),
  );

  const totalQueued = projects.reduce((sum, p) => sum + p.queuedCount, 0);
  const blocked = projects.filter((p) => p.status === "BLOCKED" || p.currentBlocker).length;

  return (
    <PageShell>
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your universe</p>
          <h1 className="mt-1.5 text-title-1 text-foreground">
            {projects.length === 0
              ? "Nothing in orbit yet"
              : `${projects.length} ${projects.length === 1 ? "project" : "projects"} in orbit`}
          </h1>
          {projects.length > 0 && (
            <p className="mt-2 text-body text-muted">
              {totalQueued > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cobalt-400" aria-hidden="true" />
                  {totalQueued} prompt{totalQueued === 1 ? "" : "s"} queued
                </span>
              )}
              {totalQueued > 0 && blocked > 0 && <span className="px-2 text-subtle">·</span>}
              {blocked > 0 && (
                <span className="inline-flex items-center gap-1.5 text-danger">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  {blocked} blocked
                </span>
              )}
              {totalQueued === 0 && blocked === 0 && "Everything is clear. Pick a star."}
            </p>
          )}
        </div>

        <Button asChild variant={projects.length === 0 ? "primary" : "secondary"}>
          <Link href="/projects/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </header>

      {resumable && <ResumeCard project={resumable} />}

      <Universe projects={projects} />
    </PageShell>
  );
}

/**
 * The signature action. Cadabry's whole premise is that reopening a project
 * shouldn't cost twenty minutes of remembering, so the single most useful
 * control on the home screen is "pick up exactly where you stopped".
 */
function ResumeCard({ project }: { project: UniverseProject }) {
  const meta = projectStatus(project.status);

  return (
    <div className="glass mb-6 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="eyebrow">Pick up where you left off</p>
            <Badge tone={meta.tone} dot>
              {meta.label}
            </Badge>
          </div>

          <h2 className="mt-2 text-title-2 text-foreground">{project.name}</h2>

          {project.currentTask ? (
            <p className="mt-1.5 max-w-(--reading-max) text-body text-ink-100">
              {project.currentTask}
            </p>
          ) : project.oneLineDescription ? (
            <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
              {project.oneLineDescription}
            </p>
          ) : null}

          {project.currentBlocker && (
            <p className="mt-2.5 flex items-start gap-2 text-caption text-danger">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Blocked: {project.currentBlocker}</span>
            </p>
          )}

          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-subtle">
            <span>
              Last touched{" "}
              <time dateTime={project.lastActivityAt?.toISOString()}>
                {timeAgo(project.lastActivityAt)}
              </time>
            </span>
            {project.queuedCount > 0 && (
              <span className="text-cobalt-400">
                {project.queuedCount} prompt{project.queuedCount === 1 ? "" : "s"} ready to send
              </span>
            )}
          </p>

          {project.progress > 0 && (
            <Progress
              value={project.progress}
              label={`${project.name} progress`}
              className="mt-4 max-w-xs"
            />
          )}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button asChild variant="primary" size="lg">
            <Link href={`/${project.slug}/resume`}>
              Resume building
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/${project.slug}`}>Open brain</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
