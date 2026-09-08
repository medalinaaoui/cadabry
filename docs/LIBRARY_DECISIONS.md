# Library decisions — discovery

## Core
- Next.js App Router + React + TypeScript + Tailwind per brief; official installation documentation inspected via https://nextjs.org/docs/app/getting-started/installation.
- Registry observed Next 16.3.4, React 19.2.8, Tailwind 4.3.3. Pin compatible stable versions only after official cross-check.
- Prisma latest currently resolves to 8.0.0-rc.13: DO NOT install as stable. `prev` is 7.10.0; verify official release before pinning matching client/adapter/CLI.
- Neon Postgres: pooled runtime URL; separate direct migrations URL; explicit driver adapter per current Prisma guidance.

## Preferred existing libraries (verify compatibility before installing)
- Radix UI dialogs/popovers/tabs/tooltips: accessibility primitives, custom Cadabry styling.
- cmdk: keyboard command palette. PostgreSQL-backed owner-scoped search, not a client database dump.
- Zod: shared external-input validation; React Hook Form for complex client editors only.
- @dnd-kit: sortable prompt queue with keyboard sensor and move-up/down alternative.
- react-markdown + remark-gfm: safe Markdown preview, raw HTML disabled and safe URL protocols.
- CodeMirror: lazily loaded Markdown/code editing, if plain textarea proves insufficient.
- Sonner: mutation feedback; lucide-react: consistent functional icons.
- CSS/SVG for universe first; Motion only where spatial transitions justify cost. No mandatory WebGL dependency.
- Vitest: context selection/health/security invariants. Playwright + axe-core: real browser flows and accessibility.
- Native crypto/secure password library and database sessions: no unnecessary hosted auth provider or public signup.

## Skills installed locally
Official sources preferred. Vercel React best practices and web design guidelines (leaderboard ~696K/~615K installs; repo 30,948 stars); Anthropic frontend design and webapp testing (frontend ~864K installs; repo 175,074 stars). Prisma database setup/client API/CLI selected from official Prisma source (search ~265K+ installs each, but repository only 56 stars: official provenance is the reason for selection, not popularity alone). Skills remain guidance; project brief wins over conflicting recommendations.

Skills are project-local under `.agents/skills` with Claude Code compatibility links. No custom durable skill has been authored.

## Verified dependency remediation
Prisma 7.10.0 transitively pinned vulnerable deepmerge-ts 7 and mysql2 3.15.3. Overrides select deepmerge-ts 8.0.2 and mysql2 3.24.4. npm audit reports zero vulnerabilities and Prisma CLI starts correctly. Full schema/migration validation is still required before release.
