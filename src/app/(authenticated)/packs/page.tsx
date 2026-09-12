import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Check, Layers, Star, X } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { BareInput, Field, FieldShell, SelectField, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState, PageHeader, PageShell } from "@/components/ui/page";
import { CreateDisclosure } from "@/components/ui/disclosure";
import { RecordControls } from "@/components/ui/record-controls";
import {
  addPackRule,
  deletePackRecord,
  deletePackRule,
  togglePackRule,
  updatePackRecord,
} from "@/features/projects/record-actions";
import { cn } from "@/lib/cn";

export const metadata = { title: "Context packs" };

export default async function PacksPage() {
  const actor = await requireActor();

  const packs = await db.contextPack.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    include: {
      project: { select: { name: true, slug: true } },
      rules: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
  });

  const projects = await db.project.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
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
    const projectId = (formData.get("projectId") as string) || null;
    const rulesText = (formData.get("rules") as string).trim();

    if (!name) redirect("/packs?error=Name+required");

    const pack = await db.contextPack.create({
      data: {
        ownerId: actor.userId,
        name,
        description: description || null,
        projectId,
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
        description="Reusable instruction blocks you switch on per prompt — toggle the rules you need, then copy the compiled block into whatever you're pasting into."
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
          <SelectField label="Project" name="projectId" defaultValue="">
            <option value="">No project (reusable everywhere)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Rules"
            name="rules"
            rows={6}
            hint="One per line. You can toggle, add, or remove individual rules afterward."
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
          {packs.map((pack) => {
            const enabledRules = pack.rules.filter((r) => r.enabled);
            const compiled = enabledRules.map((r) => r.content).join("\n");

            return (
              <li key={pack.id}>
                <Panel className="flex h-full flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="flex items-center gap-1.5 text-title-3 text-foreground">
                      {pack.favorite && (
                        <Star className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
                      )}
                      {pack.name}
                    </h2>
                    <Badge tone="cobalt">
                      {enabledRules.length}/{pack.rules.length} on
                    </Badge>
                  </div>

                  {pack.description && (
                    <p className="mt-2 text-caption text-muted">{pack.description}</p>
                  )}

                  {pack.project && (
                    <p className="mt-2 text-caption text-subtle">
                      <span className="eyebrow mr-1.5">Project</span>
                      <Link
                        href={`/${pack.project.slug}`}
                        className="text-cobalt-400 underline underline-offset-2 transition-colors hover:text-cobalt-300"
                      >
                        {pack.project.name}
                      </Link>
                    </p>
                  )}

                  <ul className="mt-3 space-y-1.5">
                    {pack.rules.map((rule) => (
                      <li
                        key={rule.id}
                        className="flex items-start gap-2 rounded-lg border border-line-subtle
                          bg-well px-2.5 py-1.5"
                      >
                        <form action={togglePackRule} className="contents">
                          <input type="hidden" name="id" value={rule.id} />
                          <button
                            type="submit"
                            aria-pressed={rule.enabled}
                            title={rule.enabled ? "On — click to turn off" : "Off — click to turn on"}
                            className={cn(
                              "mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center",
                              "rounded-[5px] border transition-colors",
                              rule.enabled
                                ? "border-cobalt-400 bg-cobalt-500/20 text-cobalt-300"
                                : "border-line text-transparent hover:border-line-strong",
                            )}
                          >
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </form>
                        <p
                          className={cn(
                            "min-w-0 flex-1 text-caption",
                            rule.enabled ? "text-foreground" : "text-subtle line-through",
                          )}
                        >
                          {rule.content}
                        </p>
                        <form action={deletePackRule} className="contents">
                          <input type="hidden" name="id" value={rule.id} />
                          <button
                            type="submit"
                            aria-label={`Remove rule "${rule.content}"`}
                            className="mt-0.5 shrink-0 text-subtle transition-colors hover:text-danger"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </form>
                      </li>
                    ))}
                    {pack.rules.length === 0 && (
                      <li className="text-caption text-subtle">No rules yet — add one below.</li>
                    )}
                  </ul>

                  <form action={addPackRule} className="mt-2 flex gap-2">
                    <input type="hidden" name="packId" value={pack.id} />
                    <BareInput
                      name="content"
                      placeholder="Add a rule…"
                      className="h-9 flex-1 text-caption"
                      required
                    />
                    <Button type="submit" size="sm" variant="secondary" className="shrink-0">
                      Add
                    </Button>
                  </form>

                  <CopyButton
                    text={compiled}
                    label={
                      enabledRules.length === 0
                        ? "No rules on"
                        : `Copy ${enabledRules.length} rule${enabledRules.length === 1 ? "" : "s"}`
                    }
                    size="sm"
                    variant="secondary"
                    className="mt-3 w-full justify-center"
                  />

                  <div className="mt-auto pt-3">
                    <RecordControls
                      id={pack.id}
                      name={pack.name}
                      editAction={updatePackRecord}
                      deleteAction={deletePackRecord}
                    >
                      <Field label="Name" name="name" defaultValue={pack.name} required />
                      <Field
                        label="Description"
                        name="description"
                        defaultValue={pack.description ?? ""}
                        placeholder="What is this pack for?"
                      />
                      <SelectField label="Project" name="projectId" defaultValue={pack.projectId ?? ""}>
                        <option value="">No project (reusable everywhere)</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </SelectField>
                      <FieldShell label="Library options">
                        <label className="flex items-center gap-2 text-body text-muted">
                          <input type="checkbox" name="favorite" defaultChecked={pack.favorite} />
                          Favorite
                        </label>
                      </FieldShell>
                    </RecordControls>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
