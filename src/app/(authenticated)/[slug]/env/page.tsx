import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type Props = { params: Promise<{ slug: string }> };

export default async function EnvPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Env Checklist</h1>
          <p className="mt-1 text-sm text-muted">
            What the deployment needs. Nothing sensitive stored — just what exists and where to get it.
          </p>
        </div>
        {total > 0 && (
          <div className="shrink-0 rounded-xl border border-line bg-surface px-4 py-2 text-center">
            <div className="text-lg font-bold text-foreground">{configured}/{total}</div>
            <div className="text-[10px] text-subtle">configured</div>
          </div>
        )}
      </div>

      {requiredMissing > 0 && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {requiredMissing} required variable{requiredMissing > 1 ? "s" : ""} not configured yet.
        </div>
      )}

      <details className="mt-6 rounded-2xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
          + New variable
        </summary>
        <form action={addVariable} className="space-y-4 px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" name="name" type="text" placeholder="DATABASE_URL" required />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Environment</label>
              <select name="environment" defaultValue="production" className="w-full rounded-xl border border-line bg-black/20 px-3 py-2 text-sm text-foreground">
                <option value="local">local</option>
                <option value="staging">staging</option>
                <option value="production">production</option>
              </select>
            </div>
          </div>
          <Field label="What it is (optional)" name="description" type="text" placeholder="Neon pooled connection string" />
          <Field label="Where to get it (optional)" name="acquisitionNote" type="text" placeholder="Neon dashboard → Connection string" />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="required" className="accent-[var(--accent)]" />
            Required for the app to work
          </label>
          <Button type="submit">Add variable</Button>
        </form>
      </details>

      <div className="mt-6 space-y-3">
        {project.environmentVariables.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface py-16 text-center">
            <p className="text-sm text-muted">No variables tracked. Add DATABASE_URL first.</p>
          </div>
        ) : (
          project.environmentVariables.map((v) => (
            <div key={v.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-mono text-sm font-semibold text-foreground">{v.name}</h3>
                    <span className="rounded-full bg-cobalt-400/10 px-2 py-0.5 text-[10px] text-cobalt-400">{v.environment}</span>
                    {v.required && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">required</span>
                    )}
                  </div>
                  {v.description && <p className="mt-1.5 text-sm text-muted">{v.description}</p>}
                  {v.acquisitionNote && <p className="mt-1 text-xs text-subtle">Get it: {v.acquisitionNote}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleConfigured}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="configured" value={String(v.configured)} />
                    <button type="submit" className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      v.configured
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-line bg-black/20 text-muted hover:text-foreground"
                    }`}>
                      {v.configured ? "✓ Configured" : "Mark configured"}
                    </button>
                  </form>
                  <form action={deleteVariable}>
                    <input type="hidden" name="id" value={v.id} />
                    <button type="submit" className="rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:text-danger" title="Delete">
                      ✕
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
