import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { FileText, Pin, PinOff } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { Markdown } from "@/components/ui/markdown";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, RowButton } from "@/components/ui/disclosure";
import { timeAgo } from "@/features/projects/display";

type Props = { params: Promise<{ slug: string }> };

export default async function NotesPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { notes: { orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] } },
  });
  if (!project) notFound();

  async function addNote(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const body = (formData.get("body") as string).trim();
    if (!title || !body) redirect(`/${slug}/notes?error=Title+and+body+required`);

    await db.note.create({
      data: { ownerId: actor.userId, projectId: project!.id, title, body, kind: "note" },
    });
    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
    redirect(`/${slug}/notes`);
  }

  async function togglePin(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const targetPinned = formData.get("pinned") === "true";
    const note = await db.note.findFirst({ where: { id, ownerId: actor.userId } });
    if (!note) redirect(`/${slug}/notes`);
    await db.note.update({ where: { id: note.id }, data: { pinned: targetPinned } });
    redirect(`/${slug}/notes`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Notes</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Loose memory for this project, written in Markdown. Pin the ones you keep
          coming back to.
        </p>
      </div>

      <CreateDisclosure label="New note">
        <form action={addNote} className="space-y-4">
          <Field
            label="Title"
            name="title"
            type="text"
            placeholder="Why we chose the Neon adapter"
            required
          />
          <TextField
            label="Body"
            name="body"
            rows={6}
            hint="Markdown is supported."
            placeholder={"**Context**\nWe picked this because…"}
            required
          />
          <Button type="submit" variant="primary">
            Add note
          </Button>
        </form>
      </CreateDisclosure>

      {project.notes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No notes yet"
          description="The thought you'd otherwise lose in a chat window belongs here."
        />
      ) : (
        <Stack className="space-y-3">
          {project.notes.map((note) => (
            <Row key={note.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-title-3 text-foreground">
                    {note.pinned && (
                      <Pin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                    )}
                    {note.title}
                  </h3>
                  <p className="mt-0.5 text-micro text-subtle">
                    Updated{" "}
                    <time dateTime={note.updatedAt.toISOString()}>
                      {timeAgo(note.updatedAt)}
                    </time>
                  </p>
                </div>

                <form action={togglePin} className="shrink-0">
                  <input type="hidden" name="id" value={note.id} />
                  <input type="hidden" name="pinned" value={String(!note.pinned)} />
                  <RowButton tone={note.pinned ? "accent" : "neutral"}>
                    {note.pinned ? (
                      <PinOff className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {note.pinned ? "Unpin" : "Pin"}
                  </RowButton>
                </form>
              </div>

              <div className="mt-3.5 border-t border-line-subtle pt-3.5">
                <Markdown>{note.body}</Markdown>
              </div>
            </Row>
          ))}
        </Stack>
      )}
    </div>
  );
}
