import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 100) || "untitled";
}

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  async function createProject(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim();
    const productStatement = (formData.get("productStatement") as string).trim();
    const problem = (formData.get("problem") as string).trim();
    const targetUser = (formData.get("targetUser") as string).trim();
    const desiredOutcome = (formData.get("desiredOutcome") as string).trim();

    if (!name) redirect("/projects/new?error=Name+is+required");

    let slug = slugify(name);
    // Ensure unique slug
    const existing = await db.project.findFirst({
      where: { ownerId: actor.userId, slug },
      select: { id: true },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const project = await db.project.create({
      data: {
        ownerId: actor.userId,
        name,
        slug,
        oneLineDescription: description || null,
        productStatement: productStatement || null,
        problem: problem || null,
        targetUser: targetUser || null,
        desiredOutcome: desiredOutcome || null,
        status: "IDEA",
        importance: 0,
        progress: 0,
        lastActivityAt: new Date(),
      },
      select: { slug: true },
    });

    // Log activity
    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        type: "PROJECT_CREATED",
        subjectKind: "PROJECT",
        subjectId: project.slug,
        summary: `Created project "${name}"`,
      },
    });

    redirect(`/${project.slug}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
          ← Projects
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">New Project</h1>
      <p className="mt-1 text-sm text-muted">
        Describe what you&apos;re building. The rest fills in as you go.
      </p>

      <form action={createProject} className="mt-8 space-y-6">
        <Field label="Project name" name="name" type="text" placeholder="My awesome project" required autoComplete="off" />
        <TextField label="One-line description" name="description" placeholder="What is this? Keep it short." rows={2} />
        <TextField label="Product statement" name="productStatement" placeholder="What are you building?" rows={3} />
        <TextField label="Problem" name="problem" placeholder="What problem does this solve?" rows={3} />
        <Field label="Target user" name="targetUser" type="text" placeholder="Who is this for?" />
        <TextField label="Desired outcome" name="desiredOutcome" placeholder="What does success look like?" rows={2} />

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary">Create Project</Button>
        </div>
      </form>
    </div>
  );
}
