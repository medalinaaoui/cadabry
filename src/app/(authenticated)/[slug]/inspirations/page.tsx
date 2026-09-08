import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowUpRight, Lightbulb } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure } from "@/components/ui/disclosure";

type Props = { params: Promise<{ slug: string }> };

const KIND_LABELS: Record<string, string> = {
  LINK: "Link", IMAGE: "Image", SCREENSHOT: "Screenshot", VIDEO: "Video", TEXT: "Text", OTHER: "Other",
};

export default async function InspirationsPage({ params }: Props) {
  const actor = await requireActor();
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
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Inspiration vault</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          A bookmark says <em>what</em>. The field that matters here is <em>why</em> — the
          specific thing you want to steal.
        </p>
      </div>

      <CreateDisclosure label="Save inspiration">
        <form action={addInspiration} className="space-y-4">
          <Field
            label="Title"
            name="title"
            type="text"
            placeholder="linear.app command menu"
            required
          />
          <Field label="URL" name="url" type="url" placeholder="https://…" />
          <SelectField label="Kind" name="kind" defaultValue="LINK">
            {Object.entries(KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <TextField
            label="What exactly inspired me"
            name="inspiredDetail"
            rows={2}
            hint="Be specific. “Nice design” is worth nothing in six months."
            placeholder="How their command menu surfaces actions without any visible chrome"
          />
          <TextField label="Text snippet" name="textSnippet" rows={2} />
          <Field label="Note" name="note" type="text" placeholder="Any extra context" />
          <Button type="submit" variant="primary">
            Save
          </Button>
        </form>
      </CreateDisclosure>

      {project.inspirations.length === 0 ? (
        <EmptyState
          icon={<Lightbulb className="h-5 w-5" />}
          title="Nothing saved yet"
          description="Capture the products, screens and details you want this project to feel like."
        />
      ) : (
        <Stack className="space-y-3">
          {project.inspirations.map((item) => (
            <Row key={item.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-title-3 text-foreground">
                  {item.canonicalUrl ? (
                    <a
                      href={item.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-cobalt-400 transition-colors hover:text-cobalt-300"
                    >
                      {item.title}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <Badge tone="cobalt">{KIND_LABELS[item.kind] ?? item.kind}</Badge>
              </div>

              {item.inspiredDetail && (
                <p className="mt-2 max-w-(--reading-max) text-body text-ink-100">
                  <span className="eyebrow mr-1.5">Why</span>
                  {item.inspiredDetail}
                </p>
              )}

              {item.textSnippet && (
                <blockquote className="mt-2.5 border-l-2 border-cobalt-500/45 pl-3.5 text-caption text-muted">
                  {item.textSnippet}
                </blockquote>
              )}

              {item.note && <p className="mt-2 text-caption text-subtle">{item.note}</p>}
            </Row>
          ))}
        </Stack>
      )}
    </div>
  );
}
