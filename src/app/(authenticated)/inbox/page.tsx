import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";

export default async function InboxPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const ideas = await db.idea.findMany({
    where: { ownerId: actor.userId, status: "INBOX" },
    include: { project: { select: { slug: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  async function triageIdea(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const action = formData.get("action") as string;

    const idea = await db.idea.findFirst({ where: { id, ownerId: actor.userId } });
    if (!idea) redirect("/inbox");
    const ideaNonNull = idea;

    if (action === "archive") {
      await db.idea.update({
        where: { id: ideaNonNull.id },
        data: { status: "ARCHIVED" },
      });
    } else if (action === "promote") {
      // Promote to a feature on the linked project
      if (ideaNonNull.projectId) {
        await db.feature.create({
          data: {
            ownerId: actor.userId,
            projectId: ideaNonNull.projectId,
            title: ideaNonNull.title,
            body: ideaNonNull.body,
            status: "PLANNED",
            priority: ideaNonNull.priority,
          },
        });
        await db.idea.update({
          where: { id: ideaNonNull.id },
          data: { status: "PLANNED" },
        });
        await db.activity.create({
          data: {
            ownerId: actor.userId,
            actorUserId: actor.userId,
            projectId: ideaNonNull.projectId,
            type: "FEATURE_CREATED",
            subjectKind: "FEATURE",
            summary: `Promoted idea to feature: ${ideaNonNull.title.slice(0, 60)}`,
          },
        });
      }
    }

    redirect("/inbox");
  }

  return (
    <div className="mx-auto max-w-[var(--page-max)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Idea Inbox</h1>
          <p className="mt-1 text-sm text-muted">
            Your raw thoughts, ideas, and captures awaiting triage.
          </p>
        </div>
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
          {ideas.length} uncategorized
        </span>
      </div>

      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface py-20">
          <h2 className="text-lg font-semibold text-foreground">Inbox zero ✨</h2>
          <p className="mt-1 max-w-sm text-center text-sm text-muted">
            Nothing pending. Use Quick Capture (sidebar) whenever a thought hits.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">{idea.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-subtle">
                    <span>{idea.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    {idea.project && (
                      <Link href={`/${idea.project.slug}`} className="text-cobalt-400 hover:text-cobalt-300">
                        → {idea.project.name}
                      </Link>
                    )}
                    {idea.body && idea.body !== "Captured as idea" && (
                      <span className="text-muted">· {idea.body}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Triage actions */}
              <div className="mt-2 flex gap-2">
                <form action={triageIdea} className="contents">
                  <input type="hidden" name="id" value={idea.id} />
                  <button type="submit" name="action" value="promote" disabled={!idea.projectId}
                          className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
                          title={idea.projectId ? "Promote to feature" : "Link a project first"}>
                    Promote to feature
                  </button>
                  <button type="submit" name="action" value="archive"
                          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground">
                    Archive
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
