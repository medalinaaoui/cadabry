import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const PROMPT_CATEGORIES = [
  "Starter", "Feature", "Debug", "Refactor", "UI", "Database", "Security",
  "Performance", "Testing", "Deployment", "Architecture", "Code Review",
  "Research", "Custom",
];

export default async function PromptLibrary({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; project?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { category, q, project } = await searchParams;

  const where = {
    ownerId: actor.userId,
    archivedAt: null as null | undefined,
    ...(category ? { category } : {}),
    ...(project ? { projectId: project } : {}),
    ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const prompts = await db.prompt.findMany({
    where,
    include: {
      project: { select: { name: true } },
      currentVersion: { select: { content: true, versionNumber: true } },
      _count: { select: { queueItems: true } },
    },
    orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
    take: 100,
  });

  const projects = await db.project.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  async function createPrompt(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const content = (formData.get("content") as string).trim();
    const category = (formData.get("category") as string) || "Custom";
    const projectId = (formData.get("projectId") as string) || null;

    if (!title || !content) redirect("/prompts?error=Title+and+content+are+required");

    const prompt = await db.prompt.create({
      data: {
        ownerId: actor.userId,
        title,
        category,
        projectId,
        status: "READY",
        versions: {
          create: {
            ownerId: actor.userId,
            versionNumber: 1,
            content,
            createdById: actor.userId,
          },
        },
      },
      select: { id: true },
    });

    await db.prompt.update({
      where: { id: prompt.id },
      data: { currentVersion: { connect: { promptId_versionNumber: { promptId: prompt.id, versionNumber: 1 } } } },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId,
        type: "PROMPT_CREATED",
        subjectKind: "PROMPT",
        subjectId: prompt.id,
        summary: `Created prompt "${title}"`,
      },
    });

    redirect("/prompts");
  }

  return (
    <div className="mx-auto max-w-[var(--page-max)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Prompt Library</h1>
          <p className="mt-1 text-sm text-muted">
            Reusable prompts that become your agent&apos;s memory.
          </p>
        </div>
      </div>

      {/* Create form (collapsible section) */}
      <details className="mb-8 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New prompt
        </summary>
        <form action={createPrompt} className="space-y-4 px-4 py-4">
          <Field label="Title" name="title" type="text" placeholder="e.g. Add Stripe customer portal" required />
          <TextField label="Content" name="content" placeholder="Paste your prompt here..." rows={6} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm text-muted">Category</label>
              <select id="category" name="category" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
                {PROMPT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="projectId" className="text-sm text-muted">Project</label>
              <select id="projectId" name="projectId" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
                <option value="">— None (global) —</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary">Save prompt</Button>
        </form>
      </details>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <Link href="/prompts" className={`rounded-full px-3 py-1 text-xs ${!category ? "bg-accent/15 text-accent" : "bg-surface text-muted hover:bg-surface-raised"}`}>All</Link>
        {PROMPT_CATEGORIES.map((c) => (
          <Link key={c} href={`/prompts?category=${c}`} className={`rounded-full px-3 py-1 text-xs ${category === c ? "bg-accent/15 text-accent" : "bg-surface text-muted hover:bg-surface-raised"}`}>
            {c}
          </Link>
        ))}
      </div>

      {/* List */}
      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface py-20">
          <h2 className="text-lg font-semibold text-foreground">No prompts yet</h2>
          <p className="mt-1 max-w-sm text-center text-sm text-muted">
            Save prompts you&apos;ve used or create new ones above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{prompt.title}</h3>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-cobalt-400 bg-cobalt-400/10">
                      {prompt.category}
                    </span>
                    {prompt.project && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-muted bg-surface-raised">
                        {prompt.project.name}
                      </span>
                    )}
                    {prompt._count.queueItems > 0 && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10">
                        queued ×{prompt._count.queueItems}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-w-md truncate text-xs text-subtle">
                    {prompt.currentVersion?.content}
                  </p>
                </div>
                <CopyButton text={prompt.currentVersion?.content ?? ""} label="Copy" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
