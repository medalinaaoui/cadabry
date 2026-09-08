import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { PageHeader, PageShell } from "@/components/ui/page";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { uniqueSlug } from "@/features/projects/slug";

export const metadata = { title: "New project" };

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

    const slug = await uniqueSlug(actor.userId, name);

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
      select: { id: true, slug: true },
    });

    // Log activity
    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        type: "PROJECT_CREATED",
        subjectKind: "PROJECT",
        subjectId: project.id,
        summary: `Created project "${name}"`,
      },
    });

    // The shell renders the project list from the shared layout, so the layout
    // has to be revalidated or the new project is missing from the sidebar
    // until a full reload.
    revalidatePath("/", "layout");

    redirect(`/${project.slug}`);
  }

  return (
    <PageShell width="reading">
      <PageHeader
        eyebrow="Universe"
        eyebrowHref="/"
        title="New project"
        description="Only the name is required. Everything else can be filled in as the project takes shape — but the more you answer now, the better your first generated prompt will be."
      />

      <form action={createProject} className="space-y-5">
        <Panel>
          <PanelHeader title="Identity" />
          <div className="space-y-4">
            <Field
              label="Project name"
              name="name"
              type="text"
              placeholder="Hook Finder"
              required
              autoComplete="off"
              autoFocus
            />
            <TextField
              label="One-line description"
              name="description"
              placeholder="Analyzes Meta ad creatives and identifies winning hooks"
              rows={2}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="What and why"
            description="Optional now, valuable later — this is what an agent reads first."
          />
          <div className="space-y-4">
            <TextField
              label="Product statement"
              name="productStatement"
              placeholder="What exactly are you building?"
              rows={3}
            />
            <TextField
              label="Problem"
              name="problem"
              placeholder="What problem does this solve?"
              rows={3}
            />
            <Field
              label="Target user"
              name="targetUser"
              type="text"
              placeholder="Who is it for?"
            />
            <TextField
              label="Desired outcome"
              name="desiredOutcome"
              placeholder="What does success look like?"
              rows={2}
            />
          </div>
        </Panel>

        <div className="flex justify-end gap-2">
          <Button asChild variant="ghost">
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" variant="primary">
            Create project
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
