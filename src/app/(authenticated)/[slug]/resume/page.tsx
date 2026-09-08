import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { compileContext } from "@/features/context/compiler";
import { projectHealth } from "@/features/projects/health";
import { CopyButton } from "@/components/ui/copy-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ResumePage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Resume Building</h1>
      <p className="mt-1 text-sm text-muted">
        A ready-to-copy context packet for your coding agent.
      </p>

      {/* Health banner */}
      <div className={`mt-6 flex items-center gap-3 rounded-xl border px-4 py-3 ${
        health.tone === "red" ? "border-danger/20 bg-danger/5"
          : health.tone === "gold" ? "border-accent/20 bg-accent/5"
          : health.tone === "green" ? "border-success/20 bg-success/5"
          : "border-cobalt-400/20 bg-cobalt-400/5"
      }`}>
        <span className={`h-2.5 w-2.5 rounded-full ${
          health.tone === "red" ? "bg-danger"
            : health.tone === "gold" ? "bg-accent"
            : health.tone === "green" ? "bg-success"
            : "bg-cobalt-400"
        }`} />
        <div className="text-sm">
          <span className="font-semibold text-foreground">{health.label}.</span>{" "}
          <span className="text-muted">{health.reason}</span>
        </div>
      </div>

      {/* Packet stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 rounded-2xl border border-line bg-surface p-4 text-sm">
        <div>
          <div className="text-xl font-bold text-foreground">{packet.included.length}</div>
          <div className="text-xs text-muted">sources included</div>
        </div>
        <div>
          <div className="text-xl font-bold text-accent">{(packet.characterCount / 1000).toFixed(1)}k</div>
          <div className="text-xs text-muted">characters</div>
        </div>
        <div>
          <div className="text-xl font-bold text-subtle">{packet.omitted.length}</div>
          <div className="text-xs text-muted">omitted (irrelevant/over budget)</div>
        </div>
      </div>

      {/* Copy action */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-subtle">
          Paste this into your agent to continue exactly where you stopped.
        </p>
        <CopyButton text={packet.markdown} />
      </div>

      {/* Prompt body */}
      <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-well p-5 text-xs leading-relaxed text-foreground">
        {packet.markdown}
      </pre>

      {/* Omitted sources */}
      {packet.omitted.length > 0 && (
        <details className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
          <summary className="cursor-pointer text-muted">View omitted sources ({packet.omitted.length})</summary>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-subtle">
            {packet.omitted.map((o) => (
              <li key={o.id} className="text-muted">{o.id} — {o.reason}</li>
              ))}
          </ul>
        </details>
      )}
    </div>
  );
}
