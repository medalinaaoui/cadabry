import { db } from "@/server/db";
import { StarterOutputClient } from "./output";
import { requireActor } from "@/features/projects/queries";
import { Field, SelectField, TextField } from "@/components/ui/field";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { PageHeader, PageShell } from "@/components/ui/page";

export const metadata = { title: "Starter prompt builder" };

export default async function StarterPromptBuilder() {
  const actor = await requireActor();

  const profile = await db.builderProfile.findUnique({
    where: { ownerId: actor.userId },
    include: { rules: { where: { enabled: true }, orderBy: { priority: "desc" } } },
  });

  const projects = await db.project.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    select: { id: true, name: true, productStatement: true, targetUser: true },
    orderBy: { name: "asc" },
  });

  return (
    <PageShell width="reading">
      <PageHeader
        eyebrow="Universe"
        eyebrowHref="/"
        title="Starter prompt builder"
        description="Answer the questions once and Cadabry writes the starter prompt — role, stack, architecture, coding rules, phases and definition of done. Never type “build me a Next.js app using…” again."
      />

      <form id="starter-form" className="space-y-5">
        <Panel>
          <PanelHeader
            title="1 · Project"
            description="Pull details from an existing project, or start from a blank slate."
          />
          <SelectField label="Project" name="projectId" defaultValue="" labelHidden>
            <option value="">Start fresh — fill in the details below</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </SelectField>
        </Panel>

        <Panel>
          <PanelHeader title="2 · What are you building?" />
          <div className="space-y-4">
            <Field label="Project name" name="name" type="text" placeholder="Hook Finder" />
            <TextField
              label="Product statement"
              name="statement"
              rows={2}
              placeholder="An app for agency owners that analyzes Meta ad creatives and identifies winning hooks"
            />
            <Field
              label="Who is it for?"
              name="audience"
              type="text"
              placeholder="Agency owners managing five-figure ad budgets"
            />
            <Field
              label="Core outcome"
              name="outcome"
              type="text"
              placeholder="Identify winning hooks in minutes, not days"
            />
            <Field
              label="Key features"
              name="features"
              type="text"
              placeholder="Hook scoring, competitor scans, export"
              hint="Comma separated."
            />
            <Field
              label="Integrations"
              name="integrations"
              type="text"
              placeholder="Meta Ads API, Stripe, Resend"
            />
            <Field
              label="Design direction"
              name="design"
              type="text"
              placeholder="Dark, premium, Apple-like, gold accents"
            />
          </div>
        </Panel>

        {profile && profile.rules.length > 0 && (
          <Panel>
            <PanelHeader
              title="3 · Your builder rules"
              count={profile.rules.length}
              description="Pulled from Settings and included automatically."
            />
            <ul className="space-y-1.5">
              {profile.rules.map((rule) => (
                <li
                  key={rule.id}
                  className="rounded-lg border border-line-subtle bg-well px-3 py-2 text-caption text-ink-100"
                >
                  <span className="eyebrow mr-2">{rule.category}</span>
                  {rule.content}
                </li>
              ))}
            </ul>
          </Panel>
        )}

        <StarterOutputClient
          defaultAgent={profile?.defaultAgent ?? "Claude Code"}
          rules={
            profile?.rules.map((r) => `${r.category.toUpperCase()}: ${r.content}`).join("\n") ?? ""
          }
        />
      </form>
    </PageShell>
  );
}
