import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { Markdown } from "@/components/ui/markdown";

type Props = { params: Promise<{ slug: string }> };

export default async function NotesPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Notes</h1>
      <p className="mt-1 text-sm text-muted">Random memory for this project, in Markdown.</p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New note
        </summary>
        <form action={addNote} className="space-y-4 px-4 py-4">
          <Field label="Title" name="title" type="text" placeholder="Why we chose X" required />
          <TextField label="Body (Markdown)" name="body" rows={5} placeholder={"**Decision context**\nWe picked this because..."} required />
          <Button type="submit" variant="primary">Add note</Button>
        </form>
      </details>

      <div className="mt-6 space-y-4">
        {project.notes.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No notes yet.</p>
          </div>
        ) : (
          project.notes.map((note) => (
            <div key={note.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  {note.pinned && <span className="mr-2 text-accent">📌</span>}
                  {note.title}
                </h3>
                <form action={togglePin} className="contents">
                  <input type="hidden" name="id" value={note.id} />
                  <input type="hidden" name="pinned" value={String(!note.pinned)} />
                  <button type="submit" className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted hover:text-foreground">
                    {note.pinned ? "Unpin" : "Pin"}
                  </button>
                </form>
              </div>
              <div className="mt-2 text-sm text-foreground markdown-body">
                <Markdown>{note.body}</Markdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
