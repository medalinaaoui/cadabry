import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

type Props = {
  params: Promise<{ slug: string }>;
};

const QUEUE_STATUS_LABELS: Record<string, string> = {
  QUEUED: "Queued",
  SENT: "Sent",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export default async function QueuePage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Next Prompt Queue
      </h1>
      <p className="mt-1 text-sm text-muted">
        Plan the prompts you&apos;ll send in your next session.
      </p>

      {/* Enqueue form */}
      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + Queue a prompt
        </summary>
        <form action={enqueuePrompt} className="space-y-4 px-4 py-4">
          <div className="space-y-1.5">
            <label htmlFor="promptId" className="text-sm text-muted">Prompt</label>
            <select id="promptId" name="promptId" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground" required>
              <option value="">Select a saved prompt...</option>
              {project.prompts.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          {project.prompts.length === 0 && (
            <p className="text-xs text-subtle">
              No ready prompts on this project yet. Save one in the{" "}
              <Link href="/prompts" className="text-cobalt-400 hover:text-cobalt-300">Prompt Library</Link> first.
            </p>
          )}
          <Button type="submit" variant="primary" disabled={project.prompts.length === 0}>
            Add to queue
          </Button>
        </form>
      </details>

      {/* Queue list */}
      <div className="mt-6 space-y-3">
        {project.queueItems.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">
              Nothing queued yet. Add prompts to plan your next session.
            </p>
          </div>
        ) : (
          project.queueItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    <Link href="/prompts" className="hover:underline">{item.prompt.title}</Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-subtle">
                    {item.prompt.currentVersion?.content}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                  item.status === "COMPLETED" ? "text-success bg-success/10"
                    : item.status === "FAILED" ? "text-danger bg-danger/10"
                    : item.status === "SENT" ? "text-cobalt-400 bg-cobalt-400/10"
                    : "text-accent bg-accent/10"
                }`}>
                  {QUEUE_STATUS_LABELS[item.status] ?? item.status}
                </span>
              </div>

              {/* Status transitions */}
              {item.status === "QUEUED" && (
                <form action={updateQueueStatus} className="mt-2 flex gap-2">
                  <input type="hidden" name="itemId" value={item.id} />
                  <button type="submit" name="status" value="SENT"
                          className="rounded-lg border border-cobalt-400/30 bg-cobalt-400/10 px-3 py-1.5 text-xs font-medium text-cobalt-400">
                    Mark sent
                  </button>
                  <button type="submit" name="status" value="COMPLETED"
                          className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                    Done
                  </button>
                  <button type="submit" name="status" value="FAILED"
                          className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger">
                    Failed
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
