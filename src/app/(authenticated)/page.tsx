import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { PlusCircle, ArrowRight } from "lucide-react";

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

function statusColor(status: string): string {
  const map: Record<string, string> = {
    IDEA: "text-subtle",
    PLANNING: "text-cobalt-400",
    BUILDING: "text-accent",
    BLOCKED: "text-danger",
    PAUSED: "text-muted",
    SHIPPED: "text-success",
    ARCHIVED: "text-subtle",
  };
  return map[status] ?? "text-subtle";
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const projects = await getProjects(actor.userId);

  return (
    <div className="mx-auto max-w-[var(--page-max)]">
      {/* Header area */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"} in your universe
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong"
        >
          <PlusCircle className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface py-24">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cobalt-500/10">
            <PlusCircle className="h-7 w-7 text-cobalt-400" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Your universe is empty</h2>
          <p className="mt-1 max-w-xs text-center text-sm text-muted">
            Create your first project and start building with AI.
          </p>
          <Link
            href="/projects/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong"
          >
            Create your first project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Project grid */}
      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${project.slug}`}
              className="group relative rounded-2xl border border-line bg-surface p-5 transition-all duration-base hover:border-line-strong hover:bg-surface-raised hover:shadow-md"
            >
              {/* Status indicator */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(project.status)} bg-current/10`}
                >
                  {project.status}
                </span>
                <span className="ml-auto text-xs text-subtle">
                  {project._count.queueItems > 0 && `${project._count.queueItems} queued`}
                </span>
              </div>

              {/* Project name + description */}
              <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                {project.name}
              </h3>
              {project.oneLineDescription && (
                <p className="mt-1 text-sm text-muted line-clamp-2">
                  {project.oneLineDescription}
                </p>
              )}

              {/* Current task */}
              {project.currentTask && (
                <p className="mt-3 text-xs text-subtle line-clamp-1">
                  Building: {project.currentTask}
                </p>
              )}

              {/* Blocker indicator */}
              {project.currentBlocker && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-danger">
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                  Blocked
                </div>
              )}

              {/* Progress bar */}
              {project.progress > 0 && (
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${Math.min(project.progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer info */}
              <div className="mt-3 flex items-center gap-3 text-xs text-subtle">
                {project.lastActivityAt && (
                  <span>
                    {timeAgo(project.lastActivityAt)}
                  </span>
                )}
                {project._count.bugs > 0 && (
                  <span className="text-danger">{project._count.bugs} bugs</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
