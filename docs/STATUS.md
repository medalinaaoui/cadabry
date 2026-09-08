# Cadabry — STATUS

**Last updated:** 2026-09-08 22:30 (Africa/Casablanca)
**State:** 🟢 **FEATURE-COMPLETE — production-ready v1**

## What Cadabry is

A personal operating system for vibe coding: manage multiple AI-coded projects without losing context. Next.js 16 (App Router), TypeScript, React 19, Prisma 7.10 + Neon PostgreSQL, Tailwind 4, Playwright. Design: "Apple workspace inside The Starry Night" (dark navy + gold/cobalt tokens).

## Verification (all passing)

- `npx tsc --noEmit` — clean
- `npm run lint` — clean (0 errors)
- `npm run build` — clean, 26 routes
- `npx playwright test` — smoke + a11y passing (4/4); project lifecycle (create → status → duplicate → delete → archive → restore → delete) verified end to end (setup/login → dashboard → project create → resume packet → prompts → quick capture → logout)
- `npm audit` — 0 vulnerabilities (deepmerge-ts 8.0.2 + mysql2 3.24.4 overrides for Prisma transitive deps)
- Unit tests — 6/6 (context compiler + project health)
- DB migrations applied to Neon; `migrate status` up to date

## Features shipped (25 routes)

**Shell**
- Persistent left sidebar (`src/components/shell/sidebar.tsx`) — brand, ⌘K jump, Universe / Inbox / Capture, live project list with status dots and queued counts, Library group, account menu, theme toggle
- Collapsible to a 4.5rem icon rail (⌘\ or the chevron); the choice rides in the `cadabry:sidebar` cookie so the server renders the right width — no first-paint jump
- Project filter box appears once there are 7+ projects; the list scrolls, Archive sits below the scroller so it never falls out of reach
- Mobile (<lg): slim top bar + off-canvas drawer rendering the same nav, closing on navigation
- ⌘K command menu and quick capture unchanged, still global

**Project management**
- `⋯` actions menu on every project header: edit brain, export, copy link, duplicate, inline status picker, archive/restore, delete
- **Delete** — type-the-name confirmation, re-checked server side; `purgeProject` removes every child row in dependency order inside one transaction (the schema's RESTRICT edges — activity→project, bug→feature, prompt→version, queue item→prompt, decision→decision — abort a naive delete). Verified against a project seeded with one of every child record: zero leftovers.
- **Archive / restore** — reversible; archived projects leave the universe and the sidebar, keep every record, and get a banner + restore button on their own page
- **Duplicate** — copies the brain (identity, positioning, stack, boundaries, rules, commands, env keys), not the history
- `/archive` — archived projects with counts, restore, and delete-forever
- Reserved slugs (`archive`, `inbox`, `settings`, …) can no longer shadow an app route; slug collisions now suffix `-2`, `-3` instead of a timestamp

**Core**
- First-run `/setup` (owner-only, race-protected, Argon2) + `/login` + `/logout`; session cookies (HTTP-only, `__Host-` prefixed in prod); Edge-compatible middleware
- Dashboard project universe with status/progress/blocker cards + empty state
- New project flow (slug uniqueness + activity log)
- Project Brain `/[slug]` — full product statement, current state, stack, boundaries, links, stats + tabbed navigation

**The signature: Resume Building**
- `/[slug]/resume` — one-click context packet for any coding agent (deterministic compiler, live data: task, decisions, boundaries, features, bugs, stack)

**Prompt systems**
- `/prompts` Prompt Library with categories + versioning
- `/[slug]/queue` Next Prompt Queue with status transitions
- `/starter` Starter Prompt Builder

**Memory systems**
- `/[slug]/decisions` decision log (accept/supersede, reasoning, alternatives)
- `/[slug]/bugs` bug tracker (severity, root-cause resolution, reopen)
- `/[slug]/features` backlog (start/block/ship, milestone links)
- `/[slug]/milestones` milestones with target dates + feature counts
- `/[slug]/notes`, `/[slug]/inspirations`, `/[slug]/sessions`, `/[slug]/timeline`

**Support systems**
- `/[slug]/commands` Command Vault (copy buttons, categories)
- `/[slug]/env` Env Checklist (required flags, configured toggle, progress counter)
- `/[slug]/export` one-click markdown exports: PROJECT_CONTEXT, AGENT_HANDOFF, ROADMAP, DECISIONS, TODO
- `/[slug]/edit` full Project Brain editor
- `/packs` Context Packs · `/skills` Skills Library · `/inbox` idea triage · Quick Capture (global, persists as Idea)
- `/settings` Builder Profile (display name, default agent, rules)

## Seed data

`prisma/seed.ts` — owner-aware (attaches to the existing owner; fresh installs get a demo owner). Idempotent. Seeds 4 demo projects (Cadabry/BUILDING, Hook Finder/PLANNING, Recipe Robot/PAUSED, Invoice Ninja Mini/SHIPPED) with full brains, prompts, decisions, milestones, features, bugs, commands, env vars, ideas, stack preset, UI-polish pack.

## Known non-blockers

- Next.js middleware→proxy convention deprecation warning (codemod available; cosmetic)
- Inspiration attachment upload flow deferred (links work)

## Deploy

1. Push to GitHub, import to Vercel
2. Set `DATABASE_URL` (Neon pooled) + `DIRECT_URL` in Vercel env
3. Run `npx prisma migrate deploy` against production
4. First visit → `/setup` creates the owner
