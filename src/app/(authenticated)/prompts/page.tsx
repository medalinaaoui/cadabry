import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { BareInput, Field, FieldShell, SelectField, TextField } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
import { cn } from "@/lib/cn";
import { RecordControls } from "@/components/ui/record-controls";
import { deletePromptRecord, updatePromptRecord } from "@/features/projects/record-actions";

export const metadata = { title: "Prompt library" };

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
          // No ownerId here: it is a relation scalar of the prompt→version
          // relation, so Prisma inherits it from the parent and rejects it
          // being passed again.
          create: {
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
    <PageShell>
      <PageHeader
        title="Prompt library"
        description="Prompts are first-class here, not scraps in a notes app. Save the ones that worked, then queue them onto a project."
      />

      <CreateDisclosure label="New prompt" className="mb-6">
        <form action={createPrompt} className="space-y-4">
          <Field
            label="Title"
            name="title"
            type="text"
            placeholder="Add a Stripe customer portal"
            required
          />
          <TextField
            label="Content"
            name="content"
            placeholder="Paste the prompt here…"
            rows={7}
            required
            className="font-mono text-caption"
          />
          <FormGrid>
            <SelectField label="Category" name="category" defaultValue="Custom">
              {PROMPT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
            <SelectField label="Project" name="projectId" defaultValue="">
              <option value="">No project (reusable)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </SelectField>
          </FormGrid>
          <Button type="submit" variant="primary">
            Save prompt
          </Button>
        </form>
      </CreateDisclosure>

      {/*
        A plain GET form: search survives a reload, is linkable, and works with
        no JavaScript. The category chips below carry the query along.
      */}
      <form method="get" role="search" className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <label htmlFor="prompt-search" className="sr-only">
            Search prompts by title
          </label>
          <BareInput
            id="prompt-search"
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search prompts…"
            className="pl-10"
          />
        </div>
        {category && <input type="hidden" name="category" value={category} />}
        <Button type="submit">Search</Button>
        {(q || category) && (
          <Button asChild variant="ghost">
            <Link href="/prompts">Clear</Link>
          </Button>
        )}
      </form>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {[null, ...PROMPT_CATEGORIES].map((c) => {
          const active = c === (category ?? null);
          const params = new URLSearchParams();
          if (c) params.set("category", c);
          if (q) params.set("q", q);
          const query = params.toString();
          return (
            <Link
              key={c ?? "all"}
              href={query ? `/prompts?${query}` : "/prompts"}
              aria-current={active ? "true" : undefined}
              className={cn(
                "press inline-flex h-8 items-center rounded-full px-3 text-caption font-semibold",
                "transition-colors duration-(--duration-fast)",
                active
                  ? "bg-cobalt-500/18 text-cobalt-300"
                  : "border border-line text-muted hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {c ?? "All"}
            </Link>
          );
        })}
      </div>

      {prompts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title={q || category ? "No prompts match" : "No prompts yet"}
          description={
            q || category
              ? "Try a different search, or clear the filters."
              : "Save the prompts that actually worked. Future you will not remember them."
          }
        />
      ) : (
        <Stack className="space-y-2">
          {prompts.map((prompt) => (
            <Row key={prompt.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-title-3 text-foreground">{prompt.title}</h2>
                    <Badge tone="cobalt">{prompt.category}</Badge>
                    {prompt.project && <Badge tone="quiet">{prompt.project.name}</Badge>}
                    {prompt._count.queueItems > 0 && (
                      <Badge tone="gold">Queued ×{prompt._count.queueItems}</Badge>
                    )}
                  </div>

                  <p className="mt-2 line-clamp-2 max-w-(--reading-max) text-caption text-subtle">
                    {prompt.currentVersion?.content}
                  </p>
                </div>

                <CopyButton
                  text={prompt.currentVersion?.content ?? ""}
                  label="Copy"
                  className="shrink-0"
                />
              </div>
              <RecordControls
                id={prompt.id}
                name={prompt.title}
                editAction={updatePromptRecord}
                deleteAction={deletePromptRecord}
              >
                <Field label="Title" name="title" defaultValue={prompt.title} required />
                <TextField label="Content" name="content" rows={8} defaultValue={prompt.currentVersion?.content ?? ""} required className="font-mono text-caption" />
                <FormGrid>
                  <SelectField label="Category" name="category" defaultValue={prompt.category ?? "Custom"}>
                    {PROMPT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </SelectField>
                  <SelectField label="Project" name="projectId" defaultValue={prompt.projectId ?? ""}>
                    <option value="">No project (reusable)</option>
                    {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </SelectField>
                </FormGrid>
                <Field label="Notes" name="notes" defaultValue={prompt.notes ?? ""} />
                <FieldShell label="Library options">
                  <div className="flex flex-wrap gap-5 text-body text-muted">
                    <label className="flex items-center gap-2"><input type="checkbox" name="favorite" defaultChecked={prompt.favorite} /> Favorite</label>
                    <label className="flex items-center gap-2"><input type="checkbox" name="reusable" defaultChecked={prompt.reusable} /> Reusable</label>
                  </div>
                </FieldShell>
              </RecordControls>
            </Row>
          ))}
        </Stack>
      )}
    </PageShell>
  );
}
