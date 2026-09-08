import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

const EXPORTS = [
  { id: "project-context", file: "PROJECT_CONTEXT.md", desc: "Product, state, stack, decisions, boundaries — everything an agent needs to understand the project." },
  { id: "agent-handoff", file: "AGENT_HANDOFF.md", desc: "For switching coding agents: current state, active task, bugs, next actions." },
  { id: "roadmap", file: "ROADMAP.md", desc: "Milestones and features, past and planned." },
  { id: "decisions", file: "DECISIONS.md", desc: "Full decision log." },
  { id: "todo", file: "TODO.md", desc: "Current task, next task, queued prompts, open bugs." },
];

export default async function ExportPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    select: { id: true, name: true, slug: true },
  });
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Export Project Context</h1>
      <p className="mt-1 text-sm text-muted">
        One-click Markdown documents — for agents, docs, or your repo.
      </p>

      <div className="mt-8 space-y-4">
        {EXPORTS.map((exp) => (
          <div key={exp.id} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground font-mono">{exp.file}</h3>
                <p className="mt-1 text-sm text-muted">{exp.desc}</p>
              </div>
              <a
                href={`/${project.slug}/export/${exp.id}.md`}
                download
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
