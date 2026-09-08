"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";

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
      ...(features
        ? [
            "# Core features",
            ...features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
              .map((f) => `- ${f}`),
            "",
          ]
        : []),
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
      <Panel>
        <PanelHeader
          title="4 · Generate"
          description="Assembled from your answers plus your builder profile. Edit it freely once it's out."
        />
        <Button type="button" variant="primary" onClick={generatePrompt}>
          Generate starter prompt
        </Button>
      </Panel>

      {generated && (
        <Panel>
          <PanelHeader
            title="Your starter prompt"
            action={<CopyButton text={generated} label="Copy prompt" variant="primary" />}
          />
          <pre
            tabIndex={0}
            role="region"
            aria-label="Generated starter prompt"
            className="max-h-[60vh] overflow-auto rounded-xl border border-line-subtle bg-well p-4
              text-caption leading-relaxed text-ink-100"
          >
            {generated}
          </pre>
        </Panel>
      )}
    </>
  );
}
