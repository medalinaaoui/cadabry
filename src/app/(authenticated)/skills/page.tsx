import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

export default async function SkillsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-[var(--page-max)]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Skills Library</h1>
        <p className="mt-1 text-sm text-muted">
          Agent skills you use — with installation notes, so you never hunt for them again.
        </p>
      </div>

      <details className="mb-8 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + Add skill
        </summary>
        <form action={addSkill} className="space-y-4 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" type="text" placeholder="e.g. Prisma CLI" required />
            <Field label="Category" name="category" type="text" placeholder="database / testing / design / ..." />
          </div>
          <Field label="Description" name="description" type="text" placeholder="What does this skill do?" />
          <Field label="When to use" name="whenToUse" type="text" placeholder="When working with the database schema" />
          <TextField label="Installation instructions" name="installation" rows={2} placeholder="How to install / enable it" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Command" name="command" type="text" placeholder="prisma db push" />
            <Field label="Repository / link" name="url" type="url" placeholder="https://github.com/..." />
          </div>
          <Button type="submit" variant="primary">Add skill</Button>
        </form>
      </details>

      {skills.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface py-16 text-center">
          <p className="text-sm text-muted">No skills saved yet. Track the ones you actually use.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{skill.name}</h3>
                  {skill.category && (
                    <span className="mt-1 rounded-full bg-cobalt-400/10 px-2 py-0.5 text-[10px] font-medium text-cobalt-400">
                      {skill.category}
                    </span>
                  )}
                </div>
              </div>
              {skill.description && <p className="mt-2 text-sm text-muted">{skill.description}</p>}
              {skill.whenToUse && <p className="mt-1 text-xs text-subtle">Use when: {skill.whenToUse}</p>}
              {skill.command && (
                <code className="mt-2 block rounded-lg bg-well px-2.5 py-1.5 text-xs text-cobalt-300">{skill.command}</code>
              )}
              {skill.url && (
                <a href={skill.url} target="_blank" rel="noopener noreferrer"
                   className="mt-2 block truncate text-xs text-cobalt-400 hover:text-cobalt-300">
                  {skill.url}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
