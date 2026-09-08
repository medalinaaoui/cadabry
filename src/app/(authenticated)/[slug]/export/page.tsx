import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Row, Stack } from "@/components/ui/page";

type Props = { params: Promise<{ slug: string }> };

const EXPORTS = [
  { id: "project-context", file: "PROJECT_CONTEXT.md", desc: "Product, state, stack, decisions, boundaries — everything an agent needs to understand the project." },
  { id: "agent-handoff", file: "AGENT_HANDOFF.md", desc: "For switching coding agents: current state, active task, bugs, next actions." },
  { id: "roadmap", file: "ROADMAP.md", desc: "Milestones and features, past and planned." },
  { id: "decisions", file: "DECISIONS.md", desc: "Full decision log." },
  { id: "todo", file: "TODO.md", desc: "Current task, next task, queued prompts, open bugs." },
];

export default async function ExportPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    select: { id: true, name: true, slug: true },
  });
  if (!project) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Export project context</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Markdown files you can drop straight into a repo, a docs folder, or an
          agent&apos;s context window.
        </p>
      </div>

      <Stack className="space-y-2">
        {EXPORTS.map((item) => (
          <Row key={item.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-mono text-title-3 text-foreground">{item.file}</h3>
                <p className="mt-1 max-w-(--reading-max) text-caption text-muted">
                  {item.desc}
                </p>
              </div>
              <a
                href={`/${project.slug}/export/${item.id}.md`}
                download
                className="press inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border
                  border-line bg-surface-raised px-4 text-body font-semibold text-foreground
                  transition-colors hover:border-line-strong hover:bg-overlay"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </a>
            </div>
          </Row>
        ))}
      </Stack>
    </div>
  );
}
