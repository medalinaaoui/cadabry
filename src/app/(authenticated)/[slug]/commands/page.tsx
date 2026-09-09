import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Terminal } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
import { RecordControls } from "@/components/ui/record-controls";
import { deleteCommandRecord, updateCommandRecord } from "@/features/projects/record-actions";

type Props = { params: Promise<{ slug: string }> };

export default async function CommandsPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { commands: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  async function addCommand(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = ((formData.get("name") as string) || "").trim();
    const commandText = ((formData.get("commandText") as string) || "").trim();
    const description = ((formData.get("description") as string) || "").trim();
    const category = ((formData.get("category") as string) || "").trim();

    if (!name || !commandText) redirect(`/${slug}/commands?error=Name+and+command+required`);

    const maxSort = await db.command.aggregate({
      where: { ownerId: actor.userId, projectId: project!.id },
      _max: { sortOrder: true },
    });

    await db.command.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        name,
        commandText,
        description: description || null,
        category: category || null,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
    redirect(`/${slug}/commands`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Command vault</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Every command this project needs — dev, test, migrate, deploy. So you never
          go digging through shell history again.
        </p>
      </div>

      <CreateDisclosure label="New command">
        <form action={addCommand} className="space-y-4">
          <FormGrid>
            <Field label="Name" name="name" type="text" placeholder="dev" required />
            <Field label="Category" name="category" type="text" placeholder="daily" />
          </FormGrid>
          <Field
            label="Command"
            name="commandText"
            type="text"
            placeholder="npm run dev"
            required
            className="font-mono"
          />
          <Field
            label="Description"
            name="description"
            type="text"
            placeholder="Start the dev server"
          />
          <Button type="submit" variant="primary">
            Add command
          </Button>
        </form>
      </CreateDisclosure>

      {project.commands.length === 0 ? (
        <EmptyState
          icon={<Terminal className="h-5 w-5" />}
          title="No commands saved"
          description="Save the ones you retype most: dev, test, migrate, deploy."
        />
      ) : (
        <Stack className="space-y-2">
          {project.commands.map((command) => (
            <Row key={command.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-title-3 text-foreground">{command.name}</h3>
                    {command.category && <Badge tone="quiet">{command.category}</Badge>}
                  </div>

                  <code
                    className="mt-2 block overflow-x-auto rounded-lg border border-line-subtle
                      bg-well px-3 py-2 font-mono text-caption text-gold-300"
                  >
                    {command.commandText}
                  </code>

                  {command.description && (
                    <p className="mt-1.5 text-caption text-muted">{command.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <CopyButton text={command.commandText} label="Copy" size="sm" />
                </div>
              </div>
              <RecordControls id={command.id} name={command.name} editAction={updateCommandRecord} deleteAction={deleteCommandRecord}>
                <FormGrid>
                  <Field label="Name" name="name" defaultValue={command.name} required />
                  <Field label="Category" name="category" defaultValue={command.category ?? ""} />
                </FormGrid>
                <Field label="Command" name="commandText" defaultValue={command.commandText} required className="font-mono" />
                <Field label="Description" name="description" defaultValue={command.description ?? ""} />
              </RecordControls>
            </Row>
          ))}
        </Stack>
      )}
    </div>
  );
}
