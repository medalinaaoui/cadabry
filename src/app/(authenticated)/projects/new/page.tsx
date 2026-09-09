import { db } from "@/server/db";
import { PageHeader, PageShell } from "@/components/ui/page";
import { requireActor } from "@/features/projects/queries";
import { createOnboardedProject } from "./actions";
import { ProjectWizard } from "./project-wizard";

export const metadata = { title: "New project" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const actor = await requireActor();
  const { error } = await searchParams;
  const profile = await db.builderProfile.findUnique({
    where: { ownerId: actor.userId },
    include: { rules: { where: { enabled: true }, orderBy: { priority: "desc" } } },
  });

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Universe"
        eyebrowHref="/"
        title="Brief a new project"
        description="Answer what you know, skip what you don’t. Cadabry will create the project, turn your answers into an agent-ready launch brief, and place it first in the prompt queue."
      />
      <ProjectWizard
        action={createOnboardedProject}
        defaultAgent={profile?.defaultAgent ?? "your coding agent"}
        builderRules={profile?.rules.map((rule) => `${rule.category}: ${rule.content}`) ?? []}
        error={error}
      />
    </PageShell>
  );
}
