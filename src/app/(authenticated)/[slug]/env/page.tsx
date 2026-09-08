import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Check, KeyRound, Trash2 } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field, FieldShell, SelectField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";

type Props = { params: Promise<{ slug: string }> };

export default async function EnvPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { environmentVariables: { orderBy: [{ environment: "asc" }, { name: "asc" }] } },
  });
  if (!project) notFound();

  const total = project.environmentVariables.length;
  const configured = project.environmentVariables.filter((v) => v.configured).length;
  const requiredMissing = project.environmentVariables.filter((v) => v.required && !v.configured).length;

  async function addVariable(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const name = ((formData.get("name") as string) || "").trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
    const environment = ((formData.get("environment") as string) || "production").trim();
    const description = ((formData.get("description") as string) || "").trim();
    const required = formData.get("required") === "on";
    const acquisitionNote = ((formData.get("acquisitionNote") as string) || "").trim();

    if (!name) redirect(`/${slug}/env?error=Name+required`);

    await db.environmentVariable.upsert({
      where: {
        projectId_environment_name: {
          projectId: project!.id,
          environment,
          name,
        },
      },
      create: {
        ownerId: actor.userId,
        projectId: project!.id,
        name,
        environment,
        description: description || null,
        required,
        configured: false,
        acquisitionNote: acquisitionNote || null,
      },
      update: {
        description: description || null,
        required,
        acquisitionNote: acquisitionNote || null,
      },
    });
    redirect(`/${slug}/env`);
  }

  async function toggleConfigured(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const current = formData.get("configured") === "true";
    await db.environmentVariable.updateMany({
      where: { id, ownerId: actor.userId },
      data: { configured: !current },
    });
    redirect(`/${slug}/env`);
  }

  async function deleteVariable(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    await db.environmentVariable.deleteMany({ where: { id, ownerId: actor.userId } });
    redirect(`/${slug}/env`);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-title-2 text-foreground">Env checklist</h2>
          <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
            What a deployment needs and where to get each value. No secrets are stored
            here — only the fact that a variable exists.
          </p>
        </div>

        {total > 0 && (
          <div className="w-44 shrink-0 rounded-xl border border-line bg-surface px-4 py-3">
            <p className="eyebrow">Configured</p>
            <p className="tabular mt-1 text-title-2 text-foreground">
              {configured}
              <span className="text-muted">/{total}</span>
            </p>
            <Progress
              value={total === 0 ? 0 : (configured / total) * 100}
              label="Environment variables configured"
              showValue={false}
              tone={configured === total ? "success" : "gold"}
              className="mt-2"
            />
          </div>
        )}
      </div>

      {requiredMissing > 0 && (
        <p className="rounded-xl border border-danger/25 bg-danger/8 px-4 py-3 text-body text-danger">
          {requiredMissing} required variable{requiredMissing === 1 ? "" : "s"} still
          unconfigured — the app won&apos;t run without {requiredMissing === 1 ? "it" : "them"}.
        </p>
      )}

      <CreateDisclosure label="New variable">
        <form action={addVariable} className="space-y-4">
          <FormGrid>
            <Field
              label="Name"
              name="name"
              type="text"
              placeholder="DATABASE_URL"
              required
              className="font-mono"
              hint="Uppercased automatically."
            />
            <SelectField label="Environment" name="environment" defaultValue="production">
              <option value="local">local</option>
              <option value="staging">staging</option>
              <option value="production">production</option>
            </SelectField>
          </FormGrid>
          <Field
            label="What it is"
            name="description"
            type="text"
            placeholder="Neon pooled connection string"
          />
          <Field
            label="Where to get it"
            name="acquisitionNote"
            type="text"
            placeholder="Neon dashboard → Connection string"
          />
          <FieldShell label="Requirement">
            <label className="flex items-center gap-2.5 text-body text-muted">
              <input type="checkbox" name="required" className="h-4 w-4 accent-[var(--accent)]" />
              Required for the app to work
            </label>
          </FieldShell>
          <Button type="submit" variant="primary">
            Add variable
          </Button>
        </form>
      </CreateDisclosure>

      {project.environmentVariables.length === 0 ? (
        <EmptyState
          icon={<KeyRound className="h-5 w-5" />}
          title="No variables tracked"
          description="Start with DATABASE_URL — the one you always forget on a fresh machine."
        />
      ) : (
        <Stack className="space-y-2">
          {project.environmentVariables.map((variable) => (
            <Row key={variable.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-mono text-title-3 text-foreground">{variable.name}</h3>
                    <Badge tone="quiet">{variable.environment}</Badge>
                    {variable.required && <Badge tone="gold">Required</Badge>}
                    {variable.configured && (
                      <Badge tone="success" dot>
                        Configured
                      </Badge>
                    )}
                  </div>

                  {variable.description && (
                    <p className="mt-1.5 text-body text-muted">{variable.description}</p>
                  )}
                  {variable.acquisitionNote && (
                    <p className="mt-1 text-caption text-subtle">
                      <span className="eyebrow mr-1.5">Get it</span>
                      {variable.acquisitionNote}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleConfigured}>
                    <input type="hidden" name="id" value={variable.id} />
                    <input type="hidden" name="configured" value={String(variable.configured)} />
                    <RowButton tone={variable.configured ? "success" : "neutral"}>
                      {variable.configured && (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {variable.configured ? "Configured" : "Mark configured"}
                    </RowButton>
                  </form>
                  <form action={deleteVariable}>
                    <input type="hidden" name="id" value={variable.id} />
                    <RowButton tone="danger" aria-label={`Delete ${variable.name}`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </RowButton>
                  </form>
                </div>
              </div>
            </Row>
          ))}
        </Stack>
      )}
    </div>
  );
}
