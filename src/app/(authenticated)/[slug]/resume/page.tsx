import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers } from "lucide-react";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { CopyButton } from "@/components/ui/copy-button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { EmptyState } from "@/components/ui/page";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Resume is a two-step ritual: open the folder, copy the prompt that's next
 * in the queue. Everything else the old packet compiled lives in Export, so
 * this page stays out of the way of actually building.
 */
export default async function ResumePage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    select: {
      slug: true,
      localFolderPath: true,
      queueItems: {
        where: { status: "QUEUED" },
        include: { prompt: { include: { currentVersion: { select: { content: true } } } } },
        orderBy: { position: "asc" },
        take: 1,
      },
    },
  });
  if (!project) notFound();

  const nextPrompt = project.queueItems[0] ?? null;
  const promptContent = nextPrompt?.prompt.currentVersion?.content ?? "";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Resume building</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Copy the folder path, open the project, then paste the prompt that&apos;s
          next up. That&apos;s the whole ritual.
        </p>
      </div>

      <Panel>
        <PanelHeader
          title="Local folder"
          description="Where this project lives on your machine."
        />
        {project.localFolderPath ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <code
              className="wrap-anywhere min-w-0 flex-1 rounded-xl border border-line-subtle
                bg-well px-3.5 py-2.5 text-caption text-ink-100"
            >
              {project.localFolderPath}
            </code>
            <CopyButton text={project.localFolderPath} label="Copy path" />
          </div>
        ) : (
          <p className="text-caption text-subtle">
            No folder path saved yet.{" "}
            <Link
              href={`/${slug}/edit`}
              className="text-cobalt-400 underline underline-offset-2 hover:text-cobalt-300"
            >
              Add it in Edit
            </Link>{" "}
            and it shows up here, ready to copy.
          </p>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="Context"
          description="The next queued prompt — only that."
        />
        {nextPrompt ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="min-w-0 text-title-3 text-foreground">
                {nextPrompt.prompt.title}
              </h3>
              {promptContent && (
                <CopyButton text={promptContent} label="Copy prompt" variant="primary" size="sm" />
              )}
            </div>
            {promptContent && (
              <pre
                tabIndex={0}
                role="region"
                aria-label="Next queued prompt"
                className="wrap-anywhere max-h-96 overflow-auto rounded-xl border border-line-subtle
                  bg-well p-4 font-mono text-caption leading-relaxed text-ink-100"
              >
                {promptContent}
              </pre>
            )}
          </div>
        ) : (
          <EmptyState
            icon={<Layers className="h-5 w-5" />}
            title="Nothing queued"
            description="Queue a prompt and the next one up shows here, ready to copy."
            action={
              <Link
                href={`/${slug}/queue`}
                className="text-cobalt-400 underline underline-offset-2 hover:text-cobalt-300"
              >
                Open the queue
              </Link>
            }
          />
        )}
      </Panel>
    </div>
  );
}
