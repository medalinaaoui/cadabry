import Link from "next/link";
import { Archive } from "lucide-react";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RestoreProjectButton } from "@/components/shell/restore-project-button";
import { ArchivedProjectMenu } from "@/components/shell/archived-project-menu";
import { timeAgo } from "@/features/projects/display";

export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const actor = await requireActor();

  const projects = await db.project.findMany({
    where: { ownerId: actor.userId, archivedAt: { not: null } },
    orderBy: { archivedAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      oneLineDescription: true,
      archivedAt: true,
      progress: true,
      _count: { select: { features: true, decisions: true, prompts: true } },
    },
  });

  return (
    <PageShell>
      <PageHeader
        eyebrow="Universe"
        eyebrowHref="/"
        title="Archive"
        description="Projects you've set down. Everything they know is still here — restore one to put it back in orbit, or delete it for good."
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={<Archive className="h-5 w-5" />}
          title="Nothing archived"
          description="Archiving a project hides it from the universe and the sidebar without losing a single record."
          action={
            <Button asChild variant="secondary">
              <Link href="/">Back to the universe</Link>
            </Button>
          }
        />
      ) : (
        <Stack>
          {projects.map((project) => (
            <Row key={project.id} interactive>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/${project.slug}`}
                      className="flex items-center gap-2 text-title-3 text-foreground
                        transition-colors hover:text-accent"
                    >
                      {project.icon && (
                        <span aria-hidden="true" className="text-body">
                          {project.icon}
                        </span>
                      )}
                      {project.name}
                    </Link>
                    <Badge tone="quiet">Archived {timeAgo(project.archivedAt)}</Badge>
                  </div>

                  {project.oneLineDescription && (
                    <p className="mt-1 max-w-(--reading-max) text-caption text-muted">
                      {project.oneLineDescription}
                    </p>
                  )}

                  <p className="tabular mt-2 flex flex-wrap gap-x-3 text-caption text-subtle">
                    <span>{project._count.features} features</span>
                    <span>{project._count.decisions} decisions</span>
                    <span>{project._count.prompts} prompts</span>
                    <span>{project.progress}% done</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <RestoreProjectButton slug={project.slug} />
                  <ArchivedProjectMenu slug={project.slug} name={project.name} />
                </div>
              </div>
            </Row>
          ))}
        </Stack>
      )}
    </PageShell>
  );
}
