import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";

type Context = { params: Promise<{ slug: string; doc: string }> };

export async function GET(_req: Request, { params }: Context) {
  const { slug, doc } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const actor = await verifySessionToken(token);
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await loadProject(actor.userId, slug);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const markdown = renderDoc(doc.replace(/\.md$/, ""), project);

  return new NextResponse(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="${doc}"`,
      "cache-control": "private, no-store",
    },
  });
}

async function loadProject(ownerId: string, slug: string) {
  return db.project.findUnique({
    where: { ownerId_slug: { ownerId, slug } },
    include: {
      technologies: { include: { technology: true }, orderBy: { sortOrder: "asc" } },
      boundaries: { orderBy: { sortOrder: "asc" } },
      decisions: { orderBy: { decidedAt: "desc" } },
      features: { orderBy: [{ status: "asc" }, { priority: "desc" }] },
      bugs: { orderBy: { severity: "desc" } },
      queueItems: { include: { prompt: true }, where: { status: "QUEUED" }, orderBy: { position: "asc" } },
      milestones: { orderBy: { sortOrder: "asc" } },
      commands: { orderBy: { sortOrder: "asc" } },
    },
  });
}

function renderDoc(docId: string, p: NonNullable<Awaited<ReturnType<typeof loadProject>>>): string {
  if (!p) return "";
  const lines: string[] = [];

  switch (docId) {
    case "project-context":
      lines.push(
        `# ${p.name}`,
        "",
        p.oneLineDescription ?? "",
        "",
        "## Product",
        p.productStatement ?? "—",
        "",
        `**Problem:** ${p.problem ?? "—"}`,
        `**Target user:** ${p.targetUser ?? "—"}`,
        `**Outcome:** ${p.desiredOutcome ?? "—"}`,
        "",
        "## Current state",
        `**Status:** ${p.status.replaceAll("_", " ").toLowerCase()}`,
        `**Progress:** ${p.progress}%`,
        `**Current task:** ${p.currentTask ?? "—"}`,
        `**Next task:** ${p.nextTask ?? "—"}`,
        `**Blocker:** ${p.currentBlocker ?? "none"}`,
        `**Works:** ${p.whatWorks ?? "—"}`,
        `**Broken:** ${p.whatIsBroken ?? "—"}`,
        "",
        "## Tech stack",
        ...p.technologies.map((t) => `- ${t.category}: ${t.technology.name}${t.version ? `@${t.version}` : ""}`),
        "",
        "## Boundaries",
        ...p.boundaries.map((b) => `- [${b.kind.replaceAll("_", " ").toLowerCase()}] ${b.content}`),
        "",
        "## Decisions",
        ...p.decisions.map((d) => `- **${d.title}** (${d.status.toLowerCase()}): ${d.decision}`),
      );
      break;

    case "agent-handoff":
      lines.push(
        `# Agent Handoff — ${p.name}`,
        "",
        p.productStatement ?? "",
        "",
        "## Current state",
        `**Task:** ${p.currentTask ?? "—"}`,
        `**Next:** ${p.nextTask ?? "—"}`,
        `**Blocker:** ${p.currentBlocker ?? "none"}`,
        "",
        "## Decisions you must preserve",
        ...(p.decisions.filter((d) => d.status === "ACCEPTED").map((d) => `- ${d.title}: ${d.decision}`) || ["— none —"]),
        "",
        "## Known bugs",
        ...(p.bugs.filter((b) => b.status !== "RESOLVED" && b.status !== "ARCHIVED").map((b) => `- ${b.title} (S${b.severity}): ${b.symptoms ?? ""}`) || ["— none —"]),
        "",
        "## Next actions",
        `1. ${p.nextTask ?? "Choose a next task"}`,
        ...p.queueItems.map((q) => `- [ ] ${q.prompt.title} (queued)`),
      );
      break;

    case "roadmap":
      lines.push(
        `# Roadmap — ${p.name}`,
        "",
        ...p.milestones.map((m) => `## ${m.name} [${m.status.replaceAll("_", " ").toLowerCase()}]${m.targetDate ? ` (target ${m.targetDate.toISOString().slice(0, 10)})` : ""}`),
        "",
        "## Features",
        ...p.features.map((f) => `- [${f.status === "DONE" ? "x" : " "}] ${f.title} [${f.status.replaceAll("_", " ").toLowerCase()}]`),
      );
      break;

    case "decisions":
      lines.push(
        `# Decisions — ${p.name}`,
        "",
        ...p.decisions.map((d) => `## ${d.title} [${d.status.toLowerCase()}]\n${d.decision}${d.reasoning ? `\n\nWhy: ${d.reasoning}` : ""}${d.alternatives ? `\nAlternatives: ${d.alternatives}` : ""}`),
      );
      break;

    case "todo":
      lines.push(
        `# TODO — ${p.name}`,
        "",
        `## Now\n- ${p.currentTask ?? "—"}`,
        "",
        `## Next\n- ${p.nextTask ?? "—"}`,
        "",
        "## Queued prompts",
        ...(p.queueItems.map((q) => `- [ ] ${q.prompt.title}`) || ["— none —"]),
        "",
        "## Open bugs",
        ...(p.bugs.filter((b) => b.status !== "RESOLVED" && b.status !== "ARCHIVED").map((b) => `- [ ] ${b.title}`) || ["— none —"]),
      );
      break;

    default:
      lines.push("# Not found", "", "Unknown export document.");
  }

  return lines.join("\n") + "\n";
}
