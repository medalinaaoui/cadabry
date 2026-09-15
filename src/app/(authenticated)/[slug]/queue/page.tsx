import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Layers } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, RowButton } from "@/components/ui/disclosure";
import { workStatus } from "@/features/projects/display";
import { Field, TextField } from "@/components/ui/field";
import { PROMPT_CATEGORIES } from "@/features/projects/prompt-categories";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function QueuePage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: {
      queueItems: {
        include: {
          prompt: { include: { currentVersion: { select: { content: true } } } },
        },
        orderBy: [{ status: "asc" }, { position: "asc" }],
      },
      prompts: {
        where: { status: "READY", archivedAt: null },
        select: { id: true, title: true },
        orderBy: { updatedAt: "desc" },
        take: 50,
      },
    },
  });

  if (!project) notFound();

  async function enqueuePrompt(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const promptId = formData.get("promptId") as string;
    if (!promptId) redirect(`/${slug}/queue?error=Select+a+prompt`);

    const prompt = await db.prompt.findFirst({
      where: { id: promptId, ownerId: actor.userId },
      include: { currentVersion: true },
    });
    if (!prompt?.currentVersion) redirect(`/${slug}/queue?error=Prompt+not+found`);

    const maxPos = await db.promptQueueItem.aggregate({
      where: { ownerId: actor.userId, projectId: project!.id },
      _max: { position: true },
    });

    await db.promptQueueItem.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        promptId: prompt.id,
        promptVersionId: prompt.currentVersion.id,
        status: "QUEUED",
        position: (maxPos._max.position ?? 0) + 1,
      },
    });

    await db.project.update({
      where: { id: project!.id },
      data: { lastActivityAt: new Date() },
    });

    redirect(`/${slug}/queue`);
  }

  async function createPromptAndEnqueue(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const content = (formData.get("content") as string).trim();
    const category = (formData.get("category") as string) || "Custom";

    if (!title || !content) redirect(`/${slug}/queue?error=Title+and+content+are+required`);

    const prompt = await db.prompt.create({
      data: {
        ownerId: actor.userId,
        title,
        category,
        projectId: project!.id,
        status: "READY",
        versions: {
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

    const version = await db.promptVersion.findUniqueOrThrow({
      where: { promptId_versionNumber: { promptId: prompt.id, versionNumber: 1 } },
      select: { id: true },
    });

    const maxPos = await db.promptQueueItem.aggregate({
      where: { ownerId: actor.userId, projectId: project!.id },
      _max: { position: true },
    });

    await db.promptQueueItem.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        promptId: prompt.id,
        promptVersionId: version.id,
        status: "QUEUED",
        position: (maxPos._max.position ?? 0) + 1,
      },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        type: "PROMPT_CREATED",
        subjectKind: "PROMPT",
        subjectId: prompt.id,
        summary: `Created prompt "${title}"`,
      },
    });

    await db.project.update({
      where: { id: project!.id },
      data: { lastActivityAt: new Date() },
    });

    redirect(`/${slug}/queue`);
  }

  async function updateQueueStatus(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const itemId = formData.get("itemId") as string;
    const status = formData.get("status") as string;

    if (!itemId || !status) redirect(`/${slug}/queue`);
    const item = await db.promptQueueItem.findFirst({
      where: { id: itemId, ownerId: actor.userId },
    });
    if (!item) redirect(`/${slug}/queue`);

    await db.promptQueueItem.update({
      where: { id: item.id },
      data: {
        status: status as "QUEUED" | "SENT" | "COMPLETED" | "FAILED" | "CANCELLED",
        sentAt: status === "SENT" ? new Date() : item.sentAt,
        completedAt: status === "COMPLETED" ? new Date() : item.completedAt,
      },
    });

    await db.project.update({
      where: { id: project!.id },
      data: { lastActivityAt: new Date() },
    });

    redirect(`/${slug}/queue`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Next prompt queue</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Not tasks — the actual prompts you plan to send next. Line them up now so
          tomorrow&apos;s session starts with a copy instead of a blank page.
        </p>
      </div>

      <CreateDisclosure label="Queue a prompt">
        <div className="space-y-5">
          <input
            type="radio"
            id="queue-mode-existing"
            name="queueMode"
            defaultChecked
            className="peer/existing sr-only"
          />
          <input type="radio" id="queue-mode-new" name="queueMode" className="peer/new sr-only" />

          <div className="flex gap-1.5" role="tablist">
            <label
              htmlFor="queue-mode-existing"
              className="press cursor-pointer rounded-full border border-line px-3 py-1.5 text-caption
                font-semibold text-muted transition-colors duration-(--duration-fast)
                hover:text-foreground peer-checked/existing:border-transparent
                peer-checked/existing:bg-cobalt-500/18 peer-checked/existing:text-cobalt-300"
            >
              Existing prompt
            </label>
            <label
              htmlFor="queue-mode-new"
              className="press cursor-pointer rounded-full border border-line px-3 py-1.5 text-caption
                font-semibold text-muted transition-colors duration-(--duration-fast)
                hover:text-foreground peer-checked/new:border-transparent
                peer-checked/new:bg-cobalt-500/18 peer-checked/new:text-cobalt-300"
            >
              New prompt
            </label>
          </div>

          <div className="hidden peer-checked/existing:block">
            <form action={enqueuePrompt} className="space-y-4">
              <SelectField
                label="Prompt"
                name="promptId"
                required
                defaultValue=""
                disabled={project.prompts.length === 0}
                hint={
                  project.prompts.length === 0
                    ? "No ready prompts on this project yet."
                    : undefined
                }
              >
                <option value="">Select a saved prompt…</option>
                {project.prompts.map((prompt) => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.title}
                  </option>
                ))}
              </SelectField>

              {project.prompts.length === 0 && (
                <p className="text-caption text-subtle">
                  Save one in the{" "}
                  <Link href="/prompts" className="text-cobalt-400 underline underline-offset-2 hover:text-cobalt-300">
                    Prompt Library
                  </Link>{" "}
                  and mark it Ready, then it shows up here.
                </p>
              )}

              <Button type="submit" variant="primary" disabled={project.prompts.length === 0}>
                Add to queue
              </Button>
            </form>
          </div>

          <div className="hidden peer-checked/new:block">
            <form action={createPromptAndEnqueue} className="space-y-4">
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
              <SelectField label="Category" name="category" defaultValue="Custom">
                {PROMPT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
              <Button type="submit" variant="primary">
                Create and queue
              </Button>
            </form>
          </div>
        </div>
      </CreateDisclosure>

      {project.queueItems.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-5 w-5" />}
          title="Nothing queued"
          description="Plan your next coding session by queueing the prompts you already know you'll need."
        />
      ) : (
        <Stack as="ol" className="space-y-2">
          {project.queueItems.map((item, index) => {
            const meta = workStatus(item.status);
            const content = item.prompt.currentVersion?.content ?? "";
            return (
              <Row key={item.id} className="p-4">
                <div className="flex items-start gap-3.5">
                  <span
                    className="tabular mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full
                      border border-line bg-well text-micro font-semibold text-subtle"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-title-3 text-foreground">{item.prompt.title}</h3>
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </div>

                    {content && (
                      <p className="mt-1.5 line-clamp-2 text-caption text-subtle">{content}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {content && (
                        <CopyButton text={content} label="Copy prompt" size="sm" />
                      )}

                      {item.status === "QUEUED" && (
                        <form action={updateQueueStatus} className="contents">
                          <input type="hidden" name="itemId" value={item.id} />
                          <RowButton name="status" value="SENT">
                            Mark sent
                          </RowButton>
                          <RowButton name="status" value="COMPLETED" tone="success">
                            Completed
                          </RowButton>
                          <RowButton name="status" value="FAILED" tone="danger">
                            Failed
                          </RowButton>
                        </form>
                      )}

                      {item.status === "SENT" && (
                        <form action={updateQueueStatus} className="contents">
                          <input type="hidden" name="itemId" value={item.id} />
                          <RowButton name="status" value="COMPLETED" tone="success">
                            Completed
                          </RowButton>
                          <RowButton name="status" value="FAILED" tone="danger">
                            Failed
                          </RowButton>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </Row>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
