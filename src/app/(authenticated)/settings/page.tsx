import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const profile = await db.builderProfile.findUnique({
    where: { ownerId: actor.userId },
    include: { rules: { orderBy: [{ priority: "desc" }, { createdAt: "asc" }] } },
  });

  async function saveProfile(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const displayName = (formData.get("displayName") as string).trim();
    const defaultAgent = (formData.get("defaultAgent") as string).trim();
    const ruleText = (formData.get("rules") as string).trim();

    const existing = await db.builderProfile.findUnique({
      where: { ownerId: actor.userId },
      select: { id: true },
    });

    const profile = existing
      ? await db.builderProfile.update({
          where: { id: existing.id },
          data: { displayName: displayName || null, defaultAgent: defaultAgent || null },
        })
      : await db.builderProfile.create({
          data: {
            ownerId: actor.userId,
            displayName: displayName || null,
            defaultAgent: defaultAgent || null,
          },
        });

    // Replace rules with the new textarea (one rule per line, "category|content")
    await db.builderRule.deleteMany({ where: { profileId: profile.id } });
    if (ruleText) {
      const lines = ruleText.split("\n").map((l) => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const [category, ...contentParts] = line.split("|");
        const content = contentParts.join("|").trim();
        await db.builderRule.create({
          data: {
            ownerId: actor.userId,
            profileId: profile.id,
            category: (category ?? "General").trim() || "General",
            content: content || line,
            enabled: true,
            priority: lines.length - i,
          },
        });
      }
    }

    redirect("/settings?saved=1");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Your global builder profile — the defaults every project starts from.
      </p>

      <form action={saveProfile} className="mt-8 space-y-6">
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Builder Profile</h2>
          <p className="mt-1 text-xs text-muted">Applied to new projects and starter prompts.</p>

          <div className="mt-5 space-y-4">
            <Field
              label="Profile name"
              name="displayName"
              type="text"
              placeholder="e.g. My default build style"
              defaultValue={profile?.displayName ?? ""}
            />
            <Field
              label="Default AI coding tool"
              name="defaultAgent"
              type="text"
              placeholder="e.g. Codex, Claude Code, Cursor"
              defaultValue={profile?.defaultAgent ?? ""}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">Coding rules</h2>
          <p className="mt-1 text-xs text-muted">
            One rule per line. Format: <code className="text-cobalt-400">Category|Rule text</code>
          </p>

          <div className="mt-5">
            <TextField
              label="Rules"
              name="rules"
              rows={10}
              placeholder={"General|Use App Router\nGeneral|No placeholder buttons\nQuality|Run lint and typecheck after implementation\nGeneral|Preserve existing patterns"}
              defaultValue={profile?.rules.map((r) => `${r.category}|${r.content}`).join("\n") ?? ""}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
