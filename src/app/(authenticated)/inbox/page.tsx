import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Inbox as InboxIcon, Sparkles } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Badge, Kbd } from "@/components/ui/badge";
import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
import { RowButton } from "@/components/ui/disclosure";
import { timeAgo } from "@/features/projects/display";

export const metadata = { title: "Idea inbox" };

export default async function InboxPage() {
  const actor = await requireActor();

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
    <PageShell width="reading">
      <PageHeader
        title="Idea inbox"
        description="Everything you captured mid-build, waiting to be sorted. Promote what belongs to a project, archive the rest."
        actions={
          ideas.length > 0 ? (
            <Badge tone="gold">{ideas.length} to triage</Badge>
          ) : undefined
        }
      />

      {ideas.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="Inbox zero"
          description="Nothing waiting. Press C anywhere in the app the next time a thought hits."
        />
      ) : (
        <Stack className="space-y-2">
          {ideas.map((idea) => {
            const note =
              idea.body && !idea.body.startsWith("Captured as") ? idea.body : null;
            return (
              <Row key={idea.id} className="p-4">
                <h2 className="text-title-3 text-foreground">{idea.title}</h2>

                <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption text-subtle">
                  <time dateTime={idea.createdAt.toISOString()}>
                    {timeAgo(idea.createdAt)}
                  </time>
                  {idea.project && (
                    <>
                      <span aria-hidden="true">·</span>
                      <Link
                        href={`/${idea.project.slug}`}
                        className="text-cobalt-400 underline underline-offset-2 transition-colors hover:text-cobalt-300"
                      >
                        {idea.project.name}
                      </Link>
                    </>
                  )}
                  {note && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-muted">{note}</span>
                    </>
                  )}
                </p>

                <form action={triageIdea} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={idea.id} />
                  <RowButton
                    name="action"
                    value="promote"
                    tone="accent"
                    disabled={!idea.projectId}
                    title={
                      idea.projectId
                        ? "Promote to a feature on this project"
                        : "Link this idea to a project first"
                    }
                  >
                    Promote to feature
                  </RowButton>
                  <RowButton name="action" value="archive">
                    Archive
                  </RowButton>
                </form>
              </Row>
            );
          })}
        </Stack>
      )}

      <p className="mt-6 flex items-center gap-2 text-caption text-subtle">
        <InboxIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Press <Kbd>C</Kbd> anywhere to capture a new thought.
      </p>
    </PageShell>
  );
}
