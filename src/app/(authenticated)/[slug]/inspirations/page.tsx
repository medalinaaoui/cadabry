import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

type Props = { params: Promise<{ slug: string }> };

const KIND_LABELS: Record<string, string> = {
  LINK: "Link", IMAGE: "Image", SCREENSHOT: "Screenshot", VIDEO: "Video", TEXT: "Text", OTHER: "Other",
};

export default async function InspirationsPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { inspirations: { orderBy: { createdAt: "desc" } } },
  });
  if (!project) notFound();

  async function addInspiration(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const url = (formData.get("url") as string).trim();
    const kind = (formData.get("kind") as string) || "LINK";
    const inspiredDetail = (formData.get("inspiredDetail") as string).trim();
    const note = (formData.get("note") as string).trim();
    const textSnippet = (formData.get("textSnippet") as string).trim();

    if (!title) redirect(`/${slug}/inspirations?error=Title+required`);

    await db.inspiration.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        title,
        canonicalUrl: url || null,
        kind: kind as "LINK" | "IMAGE" | "SCREENSHOT" | "VIDEO" | "TEXT" | "OTHER",
        inspiredDetail: inspiredDetail || null,
        note: note || null,
        textSnippet: textSnippet || null,
      },
    });
    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
    redirect(`/${slug}/inspirations`);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Inspiration Vault</h1>
      <p className="mt-1 text-sm text-muted">
        Save what inspires you — and why it matters.
      </p>

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + Save inspiration
        </summary>
        <form action={addInspiration} className="space-y-4 px-4 py-4">
          <Field label="Title" name="title" type="text" placeholder="linear.app command menu" required />
          <Field label="URL" name="url" type="url" placeholder="https://..." />
          <div className="space-y-1.5">
            <label htmlFor="kind" className="text-sm text-muted">Kind</label>
            <select id="kind" name="kind" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
              {Object.entries(KIND_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <TextField label="What exactly inspired me" name="inspiredDetail" rows={2} placeholder="I like how their command menu surfaces actions without clutter" />
          <TextField label="Text snippet" name="textSnippet" rows={2} />
          <Field label="Note" name="note" type="text" placeholder="Any extra context" />
          <Button type="submit" variant="primary">Save</Button>
        </form>
      </details>

      <div className="mt-6 space-y-4">
        {project.inspirations.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No inspirations yet. Capture what makes products feel good.</p>
          </div>
        ) : (
          project.inspirations.map((item) => (
            <div key={item.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {item.canonicalUrl ? (
                        <a href={item.canonicalUrl} target="_blank" rel="noopener noreferrer" className="text-cobalt-400 hover:text-cobalt-300">{item.title}</a>
                      ) : item.title}
                    </h3>
                    <span className="rounded-full bg-cobalt-400/10 px-2 py-0.5 text-[10px] font-medium text-cobalt-400">
                      {KIND_LABELS[item.kind] ?? item.kind}
                    </span>
                  </div>
                  {item.inspiredDetail && (
                    <p className="mt-1 text-sm text-muted">💡 {item.inspiredDetail}</p>
                  )}
                  {item.textSnippet && (
                    <blockquote className="mt-1 border-l-2 border-line pl-3 text-xs text-subtle">{item.textSnippet}</blockquote>
                  )}
                  {item.note && <p className="mt-1 text-xs text-subtle">{item.note}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
