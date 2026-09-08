"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

// Fixed reference — no "AI" novium
const DEFAULT_RULES = `GENERAL: Use App Router, Server Components by default
QUALITY: Run lint and typecheck after implementation
QUALITY: No placeholder buttons or fake functionality
QUALITY: Use reusable components; keep files small
GENERAL: Preserve existing patterns; do not change unrelated code`;

export function StarterOutputClient({ defaultAgent, rules }: { defaultAgent: string; rules: string }) {
  const [generated, setGenerated] = useState<string | null>(null);
  const activeRules = rules.trim() || DEFAULT_RULES;

  function generatePrompt() {
    const form = document.getElementById("starter-form") as HTMLFormElement;
    if (!form) return;
    const formData = new FormData(form);
    const get = (k: string) => (formData.get(k) as string ?? "").trim();

    const name = get("name") || "My project";
    const statement = get("statement");
    const audience = get("audience");
    const outcome = get("outcome");
    const features = get("features");
    const integrations = get("integrations");
    const design = get("design");

    const lines = [
      "# Role",
      `You are the lead product engineer for "${name}". You keep the project coherent, production-ready, and moving forward without being asked twice.`,
      "",
      "# Project",
      statement || "A software product built with AI assistance.",
      "",
      "# Product goal",
      `Help ${audience || "the user"}.${outcome ? `\nCore outcome: ${outcome}.` : ""}`,
      "",
      "# Stack",
      "Next.js · TypeScript · App Router · React · Prisma · PostgreSQL (Neon) · Tailwind CSS",
      "",
      "# Architecture requirements",
      "- Server Components by default; add client components only where interactivity requires it",
      "- Server Actions for internal mutations",
      "- Centralized validation with zod; validate all external input",
      "- Never expose server-only code or secrets to the client",
      "- Structure the app so multi-user can be added later without a rewrite",
      "",
      "# UX requirements",
      `- ${design || "Premium, calm, dark interface with gold accents"}`,
      "- Responsive: mobile and desktop",
      "- Every mutation needs feedback; no dead buttons or placeholders",
      "- Keyboard-accessible, semantic HTML",
      "",
      "# Coding rules",
      ...activeRules.split("\n").map((r) => `- ${r.trim()}`),
      "",
      "# Required integrations",
      integrations || "None for now.",
      "",
      "# Initial database model",
      "Design a thoughtful Prisma schema for the domain. Use enums where sensible, proper indexes, createdAt/updatedAt, and deliberate cascade behavior.",
      "",
      "# Required skills",
      `Primary agent: ${defaultAgent}. Use available skills for Prisma, design, and testing.`,
      "",
      "# Quality requirements",
      "- No placeholder features",
      "- Preserve reviewer-approved patterns",
      "- Validate inputs on the server",
      "- Typecheck, lint and test before declaring done",
      "",
      "# Implementation phases",
      "Phase 1 — Foundation: scaffold, data model, auth. Phase 2 — Core experience. Phase 3 — Advanced systems. Phase 4 — Polish and verification.",
      "",
      "# Definition of done",
      "- Feature works, with loading/empty/error states",
      "- Mobile responsive",
      "- Lint, typecheck pass; tests where appropriate",
      "- No console errors",
      "- No placeholder functionality",
      "",
    ];

    setGenerated(lines.join("\n"));
  }

  return (
    <>
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">4. Generate</h2>
        <p className="mt-1 text-xs text-muted">
          Assembled from your answers + Builder Profile. Edit freely, then copy.
        </p>
        <div className="mt-4">
          <Button type="button" variant="primary" onClick={generatePrompt}>Generate starter prompt</Button>
        </div>
      </section>

      {generated && (
        <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Your starter prompt</h2>
            <CopyButton text={generated} label="Copy prompt" />
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-well p-4 text-xs text-foreground leading-relaxed">
            {generated}
          </pre>
        </section>
      )}
    </>
  );
}
