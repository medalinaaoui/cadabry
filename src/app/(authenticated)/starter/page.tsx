import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

export default async function StarterPromptBuilder() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
          ← Projects
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Starter Prompt Builder</h1>
      <p className="mt-1 text-sm text-muted">
        Generate a polished starter prompt from structured answers — never write one from scratch again.
      </p>

      <form id="starter-form" className="mt-8 space-y-6">
        {/* Project picker */}
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">1. Project</h2>
          <div className="mt-4">
            <div className="space-y-1.5">
              <label htmlFor="projectId" className="text-sm text-muted">Existing project or new?</label>
              <select id="projectId" name="projectId" className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground">
                <option value="">— Start fresh (fill details below) —</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Project details */}
        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">2. What are you building?</h2>
          <div className="mt-4 space-y-4">
            <Field label="Project name" name="name" type="text" placeholder="My project" />
            <TextField label="Product statement" name="statement" rows={2} placeholder="An app for agency owners that analyzes Meta ad creatives..." />
            <Field label="Who is it for?" name="audience" type="text" placeholder="Agency owners managing five-figure ad budgets" />
            <Field label="Core outcome" name="outcome" type="text" placeholder="Identify winning hooks in minutes, not days" />
            <Field label="Key features" name="features" type="text" placeholder="Comma separated: hook scoring, competitor scans, export" />
            <Field label="Integrations" name="integrations" type="text" placeholder="Meta Ads API, Stripe, Resend" />
            <Field label="Design direction" name="design" type="text" placeholder="Dark, premium, Apple-like; gold accents" />
          </div>
        </section>

        {/* Builder profile rules injected */}
        {profile && profile.rules.length > 0 && (
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground">3. Builder Profile rules (auto-included)</h2>
            <ul className="mt-3 space-y-1.5 text-xs text-muted">
              {profile.rules.map((r) => (
                <li key={r.id} className="rounded-lg bg-surface-raised px-2.5 py-1.5">
                  <span className="text-subtle">[{r.category}]</span> {r.content}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* This is a client-side form — the generate action lives in the client component below */}
        <StarterOutput
          defaultAgent={profile?.defaultAgent ?? "Codex"}
          rules={profile?.rules.map((r) => `${r.category.toUpperCase()}: ${r.content}`).join("\n") ?? ""}
        />
      </form>
    </div>
  );
}

function StarterOutput({ defaultAgent, rules }: { defaultAgent: string; rules: string }) {
  return (
    <StarterOutputClient defaultAgent={defaultAgent} rules={rules} />
  );
}

/** @internal — imports the client widget to keep this page a Server Component */
import { StarterOutputClient } from "./output";
