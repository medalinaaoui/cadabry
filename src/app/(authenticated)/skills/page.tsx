import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { EmptyState, PageHeader, PageShell } from "@/components/ui/page";
import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";

export const metadata = { title: "Skills" };

export default async function SkillsPage() {
  const actor = await requireActor();

  const skills = await db.skill.findMany({
    where: { ownerId: actor.userId },
    include: {
      projectTypes: true,
      technologies: { include: { technology: { select: { name: true } } } },
    },
    orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
    take: 100,
  });

  async function addSkill(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim();
    const category = (formData.get("category") as string).trim();
    const whenToUse = (formData.get("whenToUse") as string).trim();
    const installation = (formData.get("installation") as string).trim();
    const command = (formData.get("command") as string).trim();
    const url = (formData.get("url") as string).trim();

    if (!name) redirect("/skills?error=Name+required");

    await db.skill.create({
      data: {
        ownerId: actor.userId,
        name,
        description: description || null,
        category: category || null,
        whenToUse: whenToUse || null,
        installationInstructions: installation || null,
        command: command || null,
        url: url || null,
      },
    });

    redirect("/skills");
  }

  return (
    <PageShell>
      <PageHeader
        title="Skills library"
        description="The agent skills you actually use, with the install line attached — so you never go hunting for the same repo twice."
      />

      <CreateDisclosure label="Add skill" className="mb-6">
        <form action={addSkill} className="space-y-4">
          <FormGrid>
            <Field label="Name" name="name" type="text" placeholder="Prisma CLI" required />
            <Field
              label="Category"
              name="category"
              type="text"
              placeholder="database / testing / design"
            />
          </FormGrid>
          <Field
            label="Description"
            name="description"
            type="text"
            placeholder="What does this skill do?"
          />
          <Field
            label="When to use"
            name="whenToUse"
            type="text"
            placeholder="When touching the database schema"
          />
          <TextField
            label="Installation instructions"
            name="installation"
            rows={2}
            placeholder="npx skills add …"
          />
          <FormGrid>
            <Field
              label="Command"
              name="command"
              type="text"
              placeholder="prisma db push"
              className="font-mono"
            />
            <Field
              label="Repository or link"
              name="url"
              type="url"
              placeholder="https://github.com/…"
            />
          </FormGrid>
          <Button type="submit" variant="primary">
            Add skill
          </Button>
        </form>
      </CreateDisclosure>

      {skills.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="No skills saved"
          description="Track the ones you reach for, and how to install them."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <li key={skill.id}>
              <Panel className="flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-title-3 text-foreground">{skill.name}</h2>
                  {skill.category && <Badge tone="cobalt">{skill.category}</Badge>}
                </div>

                {skill.description && (
                  <p className="mt-2 text-caption text-muted">{skill.description}</p>
                )}
                {skill.whenToUse && (
                  <p className="mt-2 text-caption text-subtle">
                    <span className="eyebrow mr-1.5">Use when</span>
                    {skill.whenToUse}
                  </p>
                )}

                {skill.command && (
                  <code
                    className="mt-3 block overflow-x-auto rounded-lg border border-line-subtle
                      bg-well px-2.5 py-1.5 font-mono text-caption text-gold-300"
                  >
                    {skill.command}
                  </code>
                )}

                {skill.url && (
                  <a
                    href={skill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-caption text-cobalt-400
                      transition-colors hover:text-cobalt-300"
                  >
                    Open source
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
