import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { compileContext } from "@/features/context/compiler";
import { projectHealth } from "@/features/projects/health";
import { requireActor } from "@/features/projects/queries";
import { CopyButton } from "@/components/ui/copy-button";
import { Panel, PanelHeader } from "@/components/ui/panel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ResumePage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      technologies: { include: { technology: true }, orderBy: { sortOrder: "asc" } },
      boundaries: { orderBy: { sortOrder: "asc" } },
      decisions: {
        where: { status: "ACCEPTED" },
        orderBy: { decidedAt: "desc" },
        take: 10,
      },
      features: {
        where: { status: { in: ["PLANNED", "IN_PROGRESS"] } },
        orderBy: [{ status: "asc" }, { priority: "desc" }],
        take: 10,
      },
      bugs: {
        where: { status: { in: ["INBOX", "ACTIVE"] } },
        orderBy: { severity: "desc" },
        take: 10,
      },
      queueItems: {
        where: { status: "QUEUED" },
        include: { prompt: { include: { currentVersion: true } } },
        orderBy: { position: "asc" },
        take: 10,
      },
      _count: { select: { bugs: { where: { status: { in: ["INBOX", "ACTIVE"] } } } } },
    },
  });

  if (!project) notFound();

  const health = projectHealth({
    status: project.status,
    lastActivity: project.lastActivityAt ?? project.updatedAt,
    blocker: project.currentBlocker,
    nextTask: project.nextTask,
    openBugs: project._count.bugs,
    totalFeatures: project.features.length,
    shippedFeatures: project.features.filter((f) => f.status === "DONE").length,
  });

  // Build the context packet
  const statement = project.productStatement || project.oneLineDescription || project.description || `${project.name} — see project for details.`;
  const techText = project.technologies.map((t) => `${t.category}: ${t.technology.name}${t.version ? `@${t.version}` : ""}`).join("\n");
  const currentTask = project.currentTask ? `Build: ${project.currentTask}\n${project.nextTask ? `Next: ${project.nextTask}` : ""}` : (project.nextTask ?? "No active task selected.");

  const sources = [
    {
      id: "task",
      title: "Current task",
      kind: "task" as const,
      relevant: true,
      content: currentTask,
    },
    {
      id: "state-works",
      title: "What already works",
      kind: "history" as const,
      relevant: true,
      content: project.whatWorks || "Nothing recorded yet.",
    },
    {
      id: "state-partial",
      title: "Partially built",
      kind: "history" as const,
      relevant: true,
      content: project.partiallyBuilt || "Nothing recorded.",
    },
    ...(project.currentBlocker ? [{ id: "blocker", title: "Known blocker", kind: "issue" as const, relevant: true, content: project.currentBlocker }] : []),
    ...project.decisions.map((d) => ({
      id: `decision-${d.id}`,
      title: `Decision: ${d.title}`,
      kind: "decision" as const,
      relevant: true,
      content: d.decision,
    })),
    ...project.boundaries.map((b) => ({
      id: `boundary-${b.id}`,
      title: `Boundary (${{ GOAL: "Goal", NON_GOAL: "Non-goal", CONSTRAINT: "Constraint", ASSUMPTION: "Assumption", FUTURE_IDEA: "Future idea" }[b.kind]})`,
      kind: "constraint" as const,
      relevant: true,
      content: b.content,
    })),
    ...project.features.map((f) => ({
      id: `feature-${f.id}`,
      title: `Feature: ${f.title}`,
      kind: "criteria" as const,
      relevant: true,
      content: f.acceptanceCriteria || f.body || f.title,
    })),
    ...project.bugs.map((b) => ({
      id: `bug-${b.id}`,
      title: `Bug: ${b.title}`,
      kind: "issue" as const,
      relevant: true,
      content: `${b.symptoms || ""}\n${b.reproduction ? `Reproduce: ${b.reproduction}` : ""}`.trim() || b.title,
    })),
    ...(techText ? [{ id: "tech", title: "Technology stack", kind: "architecture" as const, relevant: true, content: techText }] : []),
  ];

  const packet = compileContext({
    project: project.name,
    statement,
    sources,
    budget: 12000,
  });

  const toneClass: Record<typeof health.tone, string> = {
    red: "border-danger/25 bg-danger/8 text-danger",
    gold: "border-accent/25 bg-accent/8 text-accent",
    green: "border-success/25 bg-success/8 text-success",
    blue: "border-cobalt-400/25 bg-cobalt-400/8 text-cobalt-300",
    muted: "border-line bg-surface text-subtle",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0 space-y-5">
        <div>
          <h2 className="text-title-2 text-foreground">Resume building</h2>
          <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
            Everything your agent needs to continue — and nothing it doesn&apos;t. Relevant
            context beats maximum context.
          </p>
        </div>

        <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${toneClass[health.tone]}`}>
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
          <p className="text-body">
            <span className="font-semibold">{health.label}.</span>{" "}
            <span className="text-muted">{health.reason}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption text-subtle">
            Paste this into your agent to pick up exactly where you stopped.
          </p>
          <CopyButton text={packet.markdown} label="Copy context packet" variant="primary" />
        </div>

        {/* Focusable: a scrollable region must be reachable by keyboard. */}
        <pre
          tabIndex={0}
          role="region"
          aria-label="Generated context packet"
          className="max-h-[70vh] overflow-auto rounded-2xl border border-line-subtle bg-well p-5
            text-caption leading-relaxed text-ink-100"
        >
          {packet.markdown}
        </pre>

        {packet.omitted.length > 0 && (
          <details className="rounded-xl border border-line bg-surface px-4 py-3">
            <summary className="cursor-pointer text-caption text-muted marker:text-subtle">
              {packet.omitted.length} source{packet.omitted.length === 1 ? "" : "s"} left out
            </summary>
            <ul className="mt-3 space-y-1.5">
              {packet.omitted.map((omission) => (
                <li key={omission.id} className="flex gap-2 text-caption text-subtle">
                  <code className="text-ink-100">{omission.id}</code>
                  <span>— {omission.reason}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <aside className="space-y-5">
        <Panel>
          <PanelHeader title="Packet" description="What went in, and how big it is." />
          <dl className="space-y-3">
            <Stat label="Sources included" value={packet.included.length} tone="text-foreground" />
            <Stat
              label="Characters"
              value={`${(packet.characterCount / 1000).toFixed(1)}k`}
              tone="text-accent"
            />
            <Stat label="Left out" value={packet.omitted.length} tone="text-subtle" />
          </dl>
        </Panel>
      </aside>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className={`tabular text-title-2 font-semibold ${tone}`}>{value}</dd>
    </div>
  );
}
