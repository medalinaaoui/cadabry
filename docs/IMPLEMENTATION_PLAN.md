# Cadabry implementation plan

Status: Phase 1 — architecture and dependency discovery. Full requirements: PRODUCT_BRIEF.md.

## Product spine
Capture → remember → decide → prompt → build → resume → ship. The first integrated acceptance path is authenticated project creation → brain/stack → feature → prompt queue → journal → return → selective Resume Building packet. All first-release systems remain in scope; future integrations do not.

## Information architecture / routes
- `/setup`, `/login`: one-time owner creation, real authentication.
- `/`: Project Universe with accessible list/grid mode and status filters.
- `/projects/new`, `/projects/[id]`: creation and 30-second project overview, current task, health, Resume Building.
- Project subroutes: brain, technology, features, prompts, queue, memory, sessions, inspiration, timeline, tools.
- `/inbox`, `/prompts`, `/context-packs`, `/skills`, `/presets`: cross-project libraries.
- `/settings`: Builder Profile, rules, definition of done, account, demo removal.
- Global Cmd+K and New Thought overlays; mobile capture-first navigation.

## Data boundaries
Normalized relational models with owner IDs and explicit relations. Project brain has typed product/current-state fields. Technology and rules are rows, not an opaque project JSON document. Prompt versions are immutable snapshots. Sessions, queue items and activities preserve history. Server-owned selective context compiler includes task, acceptance criteria, relevant stack/rules/decisions and bounded recent work; expose inclusion preview and allow user selection. No LLM dependency is required to generate useful prompts.

## Authentication
Database-backed user with secure password hashing and opaque random session tokens stored hashed. HTTP-only, SameSite cookies; Secure in production. Transaction/unique singleton lock prevents concurrent initial owner setup. Setup closes once owner exists. Authenticate and authorize in data access and every mutation, never only a route gate. Every linked entity must share ownership; validate related IDs. Origin/CSRF checks, login throttling and session expiry.

## Server/client architecture
Server Components read owner-scoped data. Server Actions validate typed input, authorize, transact mutation + Activity, and revalidate precise paths. Route Handlers only for downloads/uploads/auth abstractions requiring HTTP. Client islands handle command search, editors, copy, sortable queue, dialogs and universe transitions. No server secrets cross client boundaries.

## Organization
`src/features/<domain>/{schemas,queries,actions,components}`; shared `src/components/ui`; `src/server/{auth,db,env}` marked server-only. Pure context/health functions are independently testable. Route files compose features, not business logic.

## Design
Jinx owns the design-direction document. Midnight/cobalt/moonlight tokens, restrained depth, semantic spatial project objects, readable list fallback, keyboard operation and reduced motion. Avoid a decorative dashboard shell. Project detail is task-first with progressive disclosure of dense context.

## Delivery stages
1. Reconcile Jinx/Rick architecture, stable dependency versions and skill selection.
2. Scaffold framework, Prisma/migrations, real owner auth, tokens, navigation/error states.
3. Complete persisted project brain/tech/features/ideas and activity with return-to-project overview.
4. Implement profile/presets, prompts/versions/recipes/queue, context packs/skills and selective Resume.
5. Implement memory, sessions, bugs/decisions/inspiration, commands/env checklist, milestones/quality lists.
6. Complete exports/search/capture, demo seed/removal, archive/restore/delete confirmation, responsive and accessibility audit.
7. Lint/typecheck/build; real database/auth and ownership tests; core CRUD, generated-prompt selection, browser keyboard/mobile/error/empty/destructive tests. Never declare completion from compilation alone.

## Current external dependency
User will provide Neon credentials. Never reuse another project database. Never log secrets. Local disposable Postgres may be used for integration verification while Neon is pending, without presenting that as Neon verification.
