import Link from "next/link";
import { AlertTriangle, ArrowRight, ChevronLeft, Pencil } from "lucide-react";
import { requireProject } from "@/features/projects/queries";
import { ProjectNav } from "@/components/shell/project-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectStatus, timeAgo } from "@/features/projects/display";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project } = await requireProject(slug);
  return { title: project.name };
}

/**
 * Every screen inside a project shares this chrome: who the project is, what
 * state it's in, the one action that matters, and the section nav. Individual
 * pages render only their own content.
 */
export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { project } = await requireProject(slug);
  const meta = projectStatus(project.status);
  const counts = project._count;

  const sections = [
    { path: "", label: "Brain" },
    { path: "resume", label: "Resume" },
    { path: "queue", label: "Queue", count: counts.queueItems },
    { path: "features", label: "Features", count: counts.features },
    { path: "milestones", label: "Milestones", count: counts.milestones },
    { path: "bugs", label: "Bugs", count: counts.bugs },
    { path: "decisions", label: "Decisions", count: counts.decisions },
    { path: "notes", label: "Notes", count: counts.notes },
    { path: "inspirations", label: "Inspiration", count: counts.inspirations },
    { path: "commands", label: "Commands", count: counts.commands },
    { path: "env", label: "Env", count: counts.environmentVariables },
    { path: "sessions", label: "Sessions", count: counts.codingSessions },
    { path: "timeline", label: "Timeline" },
    { path: "export", label: "Export" },
  ];

  return (
    <div className="mx-auto w-full max-w-(--page-max)">
      <div className="animate-fade-up">
        <Link
          href="/"
          className="eyebrow -ml-1 inline-flex items-center gap-1 rounded-md py-0.5 pl-1 pr-2
            transition-colors hover:text-accent"
        >
          <ChevronLeft className="h-3 w-3" />
          Universe
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="flex items-center gap-2.5 text-title-1 text-foreground">
                {project.icon && (
                  <span aria-hidden="true" className="text-title-2">
                    {project.icon}
                  </span>
                )}
                {project.name}
              </h1>
              <Badge tone={meta.tone} dot>
                {meta.label}
              </Badge>
            </div>

            {project.oneLineDescription && (
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                {project.oneLineDescription}
              </p>
            )}

            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-subtle">
              <span>
                Last activity{" "}
                <time dateTime={project.lastActivityAt?.toISOString()}>
                  {timeAgo(project.lastActivityAt)}
                </time>
              </span>
              {project.currentBlocker && (
                <span className="inline-flex items-center gap-1.5 text-danger">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  Blocked
                </span>
              )}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button asChild variant="ghost">
              <Link href={`/${project.slug}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button asChild variant="primary">
              <Link href={`/${project.slug}/resume`}>
                Resume building
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <ProjectNav slug={project.slug} sections={sections} />
      </div>

      <div className="mt-7 border-t border-line-subtle pt-7">{children}</div>
    </div>
  );
}
