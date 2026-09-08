import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

type Props = { params: Promise<{ slug: string }> };

export default async function CommandsPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { commands: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  async function addCommand(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = ((formData.get("name") as string) || "").trim();
    const commandText = ((formData.get("commandText") as string) || "").trim();
    const description = ((formData.get("description") as string) || "").trim();
    const category = ((formData.get("category") as string) || "").trim();

    if (!name || !commandText) redirect(`/${slug}/commands?error=Name+and+command+required`);

    const maxSort = await db.command.aggregate({
      where: { ownerId: actor.userId, projectId: project!.id },
      _max: { sortOrder: true },
    });

    await db.command.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        name,
        commandText,
        description: description || null,
        category: category || null,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
    redirect(`/${slug}/commands`);
  }

  async function deleteCommand(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    await db.command.deleteMany({ where: { id, ownerId: actor.userId, projectId: project!.id } });
    redirect(`/${slug}/commands`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Command Vault</h1>
      <p className="mt-1 text-sm text-muted">
        Every command you run for this project — dev, test, deploy. Copy, paste, go.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New command
        </summary>
        <form action={addCommand} className="space-y-4 px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" name="name" type="text" placeholder="dev" required />
            <Field label="Category (optional)" name="category" type="text" placeholder="daily" />
          </div>
          <Field label="Command" name="commandText" type="text" placeholder="npm run dev" required />
          <Field label="Description (optional)" name="description" type="text" placeholder="Start the dev server" />
          <Button type="submit">Add command</Button>
        </form>
      </details>

      <div className="mt-6 space-y-3">
        {project.commands.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No commands saved yet.</p>
          </div>
        ) : (
          project.commands.map((cmd) => (
            <div key={cmd.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{cmd.name}</h3>
                    {cmd.category && (
                      <span className="rounded-full bg-cobalt-400/10 px-2 py-0.5 text-[10px] text-cobalt-400">{cmd.category}</span>
                    )}
                  </div>
                  <code className="mt-1.5 block truncate rounded-lg bg-black/30 px-3 py-2 font-mono text-sm text-accent">
                    {cmd.commandText}
                  </code>
                  {cmd.description && <p className="mt-1.5 text-xs text-muted">{cmd.description}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <CopyButton text={cmd.commandText} label="Copy" />
                  <form action={deleteCommand}>
                    <input type="hidden" name="id" value={cmd.id} />
                    <button type="submit" className="rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:text-danger" title="Delete">
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
