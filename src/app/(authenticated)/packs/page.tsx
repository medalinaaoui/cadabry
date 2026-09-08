import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

export default async function PacksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-[var(--page-max)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Context Packs</h1>
        <p className="mt-1 text-sm text-muted">
          Reusable instruction blocks you toggle into prompts. No more one giant permanent instruction wall.
        </p>
      </div>

      <details className="mb-8 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New context pack
        </summary>
        <form action={createPack} className="space-y-4 px-4 py-4">
          <Field label="Name" name="name" type="text" placeholder="My Next.js Standards" required />
          <Field label="Description" name="description" type="text" placeholder="What is this pack for?" />
          <TextField label="Rules (one per line)" name="rules" rows={6} placeholder={"- Use App Router\n- Server Components by default\n- Validate all input"} />
          <Button type="submit" variant="primary">Create pack</Button>
        </form>
      </details>

      {packs.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center">
          <p className="text-sm text-muted">No context packs yet. These become toggleable prompt ingredients.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <div key={pack.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{pack.name}</h3>
                  {pack.description && <p className="mt-1 text-xs text-muted">{pack.description}</p>}
                </div>
                <span className="rounded-full bg-cobalt-400/10 px-2 py-0.5 text-[10px] font-medium text-cobalt-400">
                  {pack._count.rules} rule{pack._count.rules === 1 ? "" : "s"}
                </span>
              </div>
              {pack.project && (
                <p className="mt-2 text-xs text-subtle">
                  Project: <Link href={`/${pack.project.slug}`} className="text-cobalt-400 hover:text-cobalt-300">{pack.project.name}</Link>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
