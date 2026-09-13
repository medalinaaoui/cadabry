import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ArrowUpRight, BookOpen, Heart } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, FieldShell } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState, PageHeader, PageShell } from "@/components/ui/page";
import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
import { RecordControls } from "@/components/ui/record-controls";
import {
  deleteSkillRecord,
  updateSkillRecord,
} from "@/features/projects/record-actions";

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
    const category = (formData.get("category") as string).trim();
    const url = (formData.get("url") as string).trim();
    const favorite = formData.get("favorite") === "on";

    if (!name) redirect("/skills?error=Name+required");

    await db.skill.create({
      data: {
        ownerId: actor.userId,
        name,
        category: category || null,
        url: url || null,
        favorite,
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
            <Field
              label="Name"
              name="name"
              type="text"
              placeholder="Prisma CLI"
              required
            />
            <Field
              label="Category"
              name="category"
              type="text"
              placeholder="database / testing / design"
            />
          </FormGrid>
          <Field
            label="Repository or link"
            name="url"
            type="url"
            placeholder="https://github.com/…"
          />
          <FieldShell label="Library options">
            <label className="flex items-center gap-2 text-body text-muted">
              <input type="checkbox" name="favorite" />
              Favorite
            </label>
          </FieldShell>
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
                  <h2 className="flex items-center gap-1.5 text-title-3 text-foreground">
                    {skill.favorite && (
                      <Heart
                        className="h-4 w-4 shrink-0 fill-danger text-danger"
                        aria-label="Favorite"
                      />
                    )}
                    {skill.name}
                  </h2>
                  {skill.category && (
                    <Badge tone="cobalt">{skill.category}</Badge>
                  )}
                </div>

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

                <div className="mt-auto">
                  <RecordControls
                    id={skill.id}
                    name={skill.name}
                    editAction={updateSkillRecord}
                    deleteAction={deleteSkillRecord}
                    leading={
                      <CopyButton
                        text={`install ${skill.name}: ${skill.url ?? ""}`}
                        label="Copy prompt"
                        size="sm"
                        variant="quiet"
                      />
                    }
                  >
                    <FormGrid>
                      <Field
                        label="Name"
                        name="name"
                        defaultValue={skill.name}
                        required
                      />
                      <Field
                        label="Category"
                        name="category"
                        defaultValue={skill.category ?? ""}
                        placeholder="database / testing / design"
                      />
                    </FormGrid>
                    <Field
                      label="Repository or link"
                      name="url"
                      type="url"
                      defaultValue={skill.url ?? ""}
                      placeholder="https://github.com/…"
                    />
                    <FieldShell label="Library options">
                      <label className="flex items-center gap-2 text-body text-muted">
                        <input
                          type="checkbox"
                          name="favorite"
                          defaultChecked={skill.favorite}
                        />
                        Favorite
                      </label>
                    </FieldShell>
                  </RecordControls>
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
