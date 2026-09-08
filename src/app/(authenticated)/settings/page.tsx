import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { PageHeader, PageShell } from "@/components/ui/page";
import { Panel, PanelHeader } from "@/components/ui/panel";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const actor = await requireActor();

  const profile = await db.builderProfile.findUnique({
    where: { ownerId: actor.userId },
    include: { rules: { orderBy: [{ priority: "desc" }, { id: "asc" }] } },
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
    <PageShell width="reading">
      <PageHeader
        title="Settings"
        description="Your global builder profile — the defaults every new project and generated prompt starts from, so you stop retyping them."
      />

      <form action={saveProfile} className="space-y-5">
        <Panel>
          <PanelHeader
            title="Builder profile"
            description="Applied to new projects and starter prompts."
          />
          <div className="space-y-4">
            <Field
              label="Profile name"
              name="displayName"
              type="text"
              placeholder="My default build style"
              defaultValue={profile?.displayName ?? ""}
            />
            <Field
              label="Default AI coding tool"
              name="defaultAgent"
              type="text"
              placeholder="Claude Code"
              defaultValue={profile?.defaultAgent ?? ""}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Coding rules"
            description="The standards you'd otherwise repeat in every prompt."
          />
          <TextField
            label="Rules"
            name="rules"
            rows={10}
            hint="One per line, written as Category|Rule text."
            placeholder={
              "General|Use App Router\n" +
              "General|Server Components by default\n" +
              "General|No placeholder buttons or fake functionality\n" +
              "Quality|Run lint and typecheck after implementation\n" +
              "Quality|Do not change unrelated code"
            }
            defaultValue={profile?.rules.map((r) => `${r.category}|${r.content}`).join("\n") ?? ""}
            className="font-mono text-caption"
          />
        </Panel>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Save settings
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
