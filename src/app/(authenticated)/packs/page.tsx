import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Layers } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { EmptyState, PageHeader, PageShell } from "@/components/ui/page";
import { CreateDisclosure } from "@/components/ui/disclosure";

export const metadata = { title: "Context packs" };

export default async function PacksPage() {
  const actor = await requireActor();

  const packs = await db.contextPack.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    include: {
      project: { select: { name: true, slug: true } },
      _count: { select: { rules: { where: { enabled: true } } } },
    },
    orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
  });

  async function createPack(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim();
    const rulesText = (formData.get("rules") as string).trim();

    if (!name) redirect("/packs?error=Name+required");

    const pack = await db.contextPack.create({
      data: {
        ownerId: actor.userId,
        name,
        description: description || null,
      },
      select: { id: true },
    });

    if (rulesText) {
      const lines = rulesText.split("\n").map((l) => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i += 1) {
        await db.contextPackRule.create({
          data: {
            ownerId: actor.userId,
            packId: pack.id,
            content: lines[i],
            sortOrder: i,
          },
        });
      }
    }

    redirect("/packs");
  }

  return (
    <PageShell>
      <PageHeader
        title="Context packs"
        description="Reusable instruction blocks you switch on per prompt — instead of one permanent wall of rules an agent stops reading."
      />

      <CreateDisclosure label="New context pack" className="mb-6">
        <form action={createPack} className="space-y-4">
          <Field
            label="Name"
            name="name"
            type="text"
            placeholder="My Next.js standards"
            required
          />
          <Field
            label="Description"
            name="description"
            type="text"
            placeholder="What is this pack for?"
          />
          <TextField
            label="Rules"
            name="rules"
            rows={6}
            hint="One per line."
            placeholder={"Use App Router\nServer Components by default\nValidate all external input"}
          />
          <Button type="submit" variant="primary">
            Create pack
          </Button>
        </form>
      </CreateDisclosure>

      {packs.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-5 w-5" />}
          title="No context packs yet"
          description="Group the rules you repeat, then drop them into prompts as one ingredient."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <li key={pack.id}>
              <Panel className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-title-3 text-foreground">{pack.name}</h2>
                  <Badge tone="cobalt">
                    {pack._count.rules} rule{pack._count.rules === 1 ? "" : "s"}
                  </Badge>
                </div>

                {pack.description && (
                  <p className="mt-2 text-caption text-muted">{pack.description}</p>
                )}

                {pack.project && (
                  <p className="mt-3 text-caption text-subtle">
                    <span className="eyebrow mr-1.5">Project</span>
                    <Link
                      href={`/${pack.project.slug}`}
                      className="text-cobalt-400 underline underline-offset-2 transition-colors hover:text-cobalt-300"
                    >
                      {pack.project.name}
                    </Link>
                  </p>
                )}
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
