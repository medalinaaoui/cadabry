# Cadabry backend architecture — Phase 1

Status: design only; no Prisma schema or migration is implemented in this phase.  
Last verified: 2026-09-08.

## 1. Architecture decision

Build Cadabry as a **single Next.js App Router application with a modular server-side core**, PostgreSQL on Neon, and Prisma. Reads originate in Server Components and call a server-only data-access layer (DAL) directly. Internal UI mutations use Server Actions. Route Handlers are reserved for external/webhook APIs, downloads whose HTTP semantics matter, and future integrations.

This is deliberately a modular monolith. One product team owns the system, the initial load is one owner and later modest multi-user SaaS traffic, all modules share authorization and transactional data, and no module currently needs independent deployment or scaling. Module boundaries preserve a future extraction path without buying distributed-systems failure modes early.

### Architecture gate

| Concern | Phase 1 decision |
|---|---|
| Business goal | Preserve the minimum relevant context needed to resume AI-assisted software projects quickly and safely. |
| Users/ownership | Initially one owner; model and authorization are multi-user-ready. One product team owns the monolith. |
| Load shape | Read-heavy interactive workload; bursty serverless requests; small writes; append-heavy activity/session history; bounded global search. |
| Consistency | Strong transactional consistency for ownership, setup, prompt versions/queue order, and project mutations. Derived health/search can be eventually consistent later. |
| Failure tolerance | Mutations fail closed and retry safely where declared; a failed activity projection must not corrupt core state. No silent partial success. |
| Security/compliance | Personal/product engineering data, password credentials, repository metadata, and environment **names only**. Never store secret values. Server-side object ownership on every access. |
| Deployment | Vercel-style Node.js serverless runtime; Neon pooled runtime connections; direct connection only for CLI/migrations. |
| Cost | One application and one database. No queue, vector database, Redis, or search service until measured need. |
| Lifetime | Production foundation intended to evolve into public multi-user SaaS. |
| Exit strategy | Repository interfaces and module boundaries allow replacing Prisma or extracting search/context generation. PostgreSQL remains the system of record and Markdown exports provide user portability. |

## 2. Governing invariants

1. Every user-owned row is reachable through an explicit `owner_id`; project-scoped rows also carry `project_id` and are queried through both owner and project scope.
2. A browser-supplied ID is never authority. The DAL derives `user_id` from the validated database session and includes it in the query predicate.
3. Only one initial owner can ever be created, even under concurrent setup requests.
4. Only opaque, high-entropy session tokens reach the browser. The database stores a keyed hash/digest, never the raw token.
5. Passwords use Argon2id with parameters stored in the encoded hash and a server-side pepper supplied by the secret store.
6. A prompt's editable identity and its immutable content history are separate. A queue item references a specific prompt version so queued work cannot change underneath the user.
7. Prompt queue positions are unique per project among active queue items and are reordered transactionally.
8. Environment records contain variable names and configuration metadata only; the data model has no secret-value column.
9. Meaningful domain changes and their Activity row are committed in the same database transaction.
10. Context generation is deterministic for an explicit selection policy and source snapshot; it is bounded by item and character/token budgets and never means “dump everything.”
11. Delete behavior is deliberate: user/project deletion is an exceptional administrative workflow; ordinary product removal archives records. Historical links use `RESTRICT` or nullable references rather than accidental cascades.

## 3. Server-side module boundaries

Suggested source layout (names are illustrative contracts, not an instruction to scaffold in this phase):

```text
src/
  app/                         # routes, Server Components, thin actions
  modules/
    identity/                  # owner setup, login, sessions
    projects/                  # Project Brain, technologies, rules, milestones
    building/                  # features, prompts, versions, queue
    profile/                   # builder profile, packs, skills, presets
    memory/                    # ideas, notes, bugs, decisions, coding sessions, inspiration
    context/                   # selective context policy + Markdown renderer
    search/                    # bounded lexical search
    activity/                  # append/query timeline events
  server/
    auth/                      # server-only cookie/session primitives
    dal/                       # authorization-scoped repositories and DTOs
    db/                        # Prisma singleton/adapter
    validation/                # shared input schemas
    observability/             # logs, metrics, trace/correlation helpers
```

Dependency direction is `app -> application/module services -> repository ports -> Prisma adapter`. Domain/application code must not import React, Next.js, cookies, or Prisma models. `server-only` guards the database, auth, environment, and DAL modules. DTOs expose only fields a view needs.

## 4. Normalized logical data model

Use opaque UUID/ULID-style application IDs for browser-visible entities (Prisma `String @db.Uuid`, generated in the application or database). All timestamps are UTC PostgreSQL `timestamptz`; Prisma migrations must override its default timestamp mapping where necessary. Use `text`, booleans, integers, and constrained text statuses. Avoid PostgreSQL enums for product statuses that will evolve. Use JSONB only for Activity metadata and future provider-specific optional configuration; not for core relationships.

Every mutable aggregate has `created_at`, `updated_at`, and optionally `archived_at`. Long-form Markdown is stored as text and rendered through a sanitizer. Add indexes for every foreign key and the access paths listed below.

### 4.1 Identity and tenancy

| Relation | Important fields and constraints |
|---|---|
| `users` | `id`, normalized `email`, `display_name`, `password_hash`, `role`, timestamps, `disabled_at`; unique index on `lower(email)`. V1 permits role `OWNER`; schema permits future users. |
| `app_installation` | Singleton row with fixed key, `owner_user_id` unique nullable during bootstrap, `setup_completed_at`, `created_at`. The locked row is the setup serialization point. |
| `auth_sessions` | `id`, `user_id`, `token_digest` unique, `expires_at`, `last_seen_at`, `created_at`, `revoked_at`, optional `user_agent_hash` and coarse IP hash; indexes on `(token_digest)` and `(user_id, expires_at)`. |

Do not name the authentication table `Session`, because `coding_sessions` is a distinct domain concept.

### 4.2 Projects, Tech Brain, and rules

| Relation | Important fields and relationships |
|---|---|
| `projects` | `id`, `owner_id`, identity fields, product statement/problem/audience/outcome/value proposition, state summaries, status, importance, health override, URLs/metadata paths, dates, `archived_at`; unique `(owner_id, id)` supports composite tenant FKs. |
| `technologies` | Owner-scoped reusable catalog: `id`, `owner_id`, `name`, optional `category`; unique `(owner_id, lower(name))`. |
| `project_technologies` | `owner_id`, `project_id`, `technology_id`, `category`, optional `version/note`, `sort_order`; unique project/technology/category membership. Composite ownership FKs prevent cross-owner attachment. |
| `project_rules` | `id`, `owner_id`, `project_id`, `category`, `content`, `priority`, `enabled`; project-local rules and explicit overrides. |
| `project_boundaries` | `id`, `owner_id`, `project_id`, `kind` (`GOAL`, `NON_GOAL`, `ASSUMPTION`, `CONSTRAINT`, `FUTURE_IDEA`), `content`, `sort_order`. Separate rows make selection and reordering queryable. |
| `milestones` | `id`, `owner_id`, `project_id`, `name`, `description`, status, optional target date, `sort_order`. |
| `features` | `id`, `owner_id`, `project_id`, optional `milestone_id`, title/body/reason, status, priority/difficulty/impact, acceptance criteria, `sort_order`, timestamps. |
| `feature_dependencies` | `(owner_id, feature_id, depends_on_feature_id)`; no self-dependency. Cycles are rejected in the application transaction. |

“What works,” “partially built,” “broken,” blocker, current task, and next task may begin as explicit fields on `projects` because they are singular current summaries. If history/editing becomes first-class, move them to a versioned project-state relation via an expand/migrate/contract change.

### 4.3 Prompts and prompt queue

| Relation | Important fields and relationships |
|---|---|
| `prompts` | `id`, `owner_id`, optional `project_id`, optional `feature_id`, title, category, status, favorite, reusable/global flag, notes, `current_version_id`, usage timestamps, archive timestamp. |
| `prompt_versions` | `id`, `owner_id`, `prompt_id`, monotonically increasing `version_number`, immutable content, optional change note, `created_by`, `created_at`; unique `(prompt_id, version_number)`. |
| `prompt_queue_items` | `id`, `owner_id`, `project_id`, `prompt_id`, **`prompt_version_id`**, optional feature/milestone/idea/bug links, status, `position`, sent/completed timestamps, failure/follow-up note; unique active `(project_id, position)` enforced with a partial unique index in SQL migration. |

Creating a prompt and its first version is one transaction. Publishing a new version inserts a row and updates `current_version_id` in one transaction. Never update version content. Queue reorder locks the project's active queue rows (or uses a project advisory lock), validates the complete submitted ID set, assigns temporary disjoint positions, then final dense positions to avoid uniqueness collisions.

### 4.4 Builder profile, packs, skills, and presets

| Relation | Important fields and relationships |
|---|---|
| `builder_profiles` | One per owner; `owner_id` unique, display/default preferences that are truly singular. |
| `builder_rules` | `id`, `owner_id`, profile id, category, content, enabled, priority. Project rules override by explicit precedence during context construction; do not copy global rules into every project. |
| `context_packs` | `id`, `owner_id`, optional `project_id`, name, description, favorite, archived timestamp. Null project means global to that owner. |
| `context_pack_rules` | `id`, `owner_id`, pack id, content, priority, enabled, sort order. |
| `skills` | `id`, `owner_id`, name, description, category, when-to-use, installation instructions, command, URL, agent-specific instructions, notes, favorite. These are inert text records; Cadabry must never execute stored commands. |
| `skill_project_types`, `skill_technologies`, `skill_use_cases` | Junction relations rather than arrays/JSON. |
| `stack_presets` | `id`, `owner_id`, name, description, favorite. |
| `stack_preset_technologies` | `owner_id`, preset id, technology id, category, optional version/note, sort order. Applying a preset copies explicit selected values to project technologies in a transaction; future preset edits do not silently mutate projects. |

### 4.5 Memory systems

| Relation | Important fields and relationships |
|---|---|
| `ideas` | Owner-scoped, optional project, title/body, status, priority, timestamps. Null project represents inbox. |
| `notes` | Owner-scoped, optional project, title, Markdown body, kind, pinned, timestamps. |
| `bugs` | Project-scoped title, symptoms, expected/actual behavior, reproduction, suspected cause, status, severity, resolution, root cause, optional feature. |
| `decisions` | Project-scoped title, decision, reasoning, alternatives, affected system, reversible boolean, status, decided_at, optional superseded-by decision. |
| `coding_sessions` | Project-scoped objective, status, started/ended timestamps, notes/discoveries/what changed/next task. |
| `coding_session_prompts`, `coding_session_features` | Explicit many-to-many links. Bugs and decisions created during a session carry optional `coding_session_id`. |
| `inspirations` | Owner-scoped optional project; kind, title, canonical URL, text snippet, Markdown note, `inspired_detail`, external media metadata. Binary uploads belong in object storage later; DB stores only object key/metadata. |
| `tags`, `entity_tags` | Owner-scoped normalized tags. `entity_tags` needs a controlled entity kind plus entity ID; because PostgreSQL cannot FK a polymorphic target, prefer dedicated junction tables for the initially searchable entities (`prompt_tags`, `note_tags`, etc.) unless measured breadth justifies the integrity trade-off. |
| `commands` | Project-scoped `name`, `command_text`, description, category, sort order. Render as text; never execute from the server. Reject obvious secret interpolation in UI but do not claim this is a security boundary. |
| `environment_variables` | Project-scoped `name`, description, required, environment, configured flag, acquisition note, general note. Unique `(project_id, environment, name)`. **No value/ciphertext column.** |

### 4.6 Activity

`activities`: `id`, `owner_id`, optional `project_id`, `actor_user_id`, `type`, subject kind/id, safe human summary, small JSONB metadata, `occurred_at`, optional `correlation_id` and `coding_session_id`. Index `(owner_id, occurred_at desc, id desc)` and `(owner_id, project_id, occurred_at desc, id desc)`.

Activity is an append-only product timeline/audit aid, not an event-sourced authority. Metadata must be allow-listed and must never contain passwords, raw session tokens, environment values, full prompt bodies, or unsanitized request payloads. Core mutation plus Activity insert share a transaction. If future external analytics is added, publish via an outbox committed in the same transaction.

## 5. Ownership and deletion model

Prisma does not automatically enforce tenant isolation. Defense in depth:

1. DAL methods accept a trusted `Actor` derived from `verifySession()`, not a caller-provided user ID.
2. All selectors use compound ownership, for example `where: { id, ownerId: actor.userId }`.
3. Child creation first resolves the parent within the same owner scope.
4. Composite database FKs such as `(owner_id, project_id) -> projects(owner_id, id)` prevent cross-tenant relationships even if application code fails.
5. Add integration tests that attempt cross-user reads, writes, deletes, linking, search, and context generation.

RLS is not the Phase 1 authorization mechanism because a pooled Prisma connection cannot safely rely on persistent session state, and setting tenant context incorrectly can leak data. It can be added later using transaction-local context plus policies after contract tests prove it. Application authorization and composite ownership constraints remain mandatory either way.

Projects are archived by default. Permanent account/project deletion is a separately authorized, confirmed workflow with a dry-run/count preview, transactional relational deletion where feasible, asynchronous object deletion later, an audit record, and restore/backup implications documented. Cascades are limited to true owned components (for example prompt versions after a prompt's permanent deletion); cross-history links prefer `SET NULL`/`RESTRICT`.

## 6. Owner-only initial setup and race protection

Public setup is available only while `app_installation.owner_user_id IS NULL`. A preflight read controls UI only; the write path is authoritative.

Transaction (`SERIALIZABLE`, bounded retry on serialization failure):

1. Normalize and validate name/email/password server-side; enforce password length and maximum input sizes.
2. Begin transaction and lock the singleton installation row using `SELECT ... FOR UPDATE` (seed/create that row during the initial migration).
3. If `owner_user_id` or `setup_completed_at` is already set, return stable conflict code `SETUP_ALREADY_COMPLETED` without revealing the existing email.
4. Insert owner with Argon2id hash. Database uniqueness on normalized email is a second guard.
5. Update the locked installation row with the owner ID and completion timestamp.
6. Create an authentication session and setup Activity record in the same transaction.
7. Commit, then set the secure cookie and redirect outside the action's `try/catch`.

The singleton row lock is clearer than `count(users) === 0`, which races. A unique partial index on owner role is additional defense, not the primary protocol. Rate-limit setup/login at the ingress and by privacy-preserving IP/account buckets. Use constant-time credential verification and a generic `INVALID_CREDENTIALS` response.

## 7. Sessions and request authorization

- Generate at least 256 bits of randomness for the raw session token.
- Cookie contains raw token; database contains `HMAC-SHA-256(session_pepper, token)` (or equivalent keyed digest). A database leak alone must not yield usable sessions.
- Cookie: `HttpOnly`, `Secure` outside local development, `SameSite=Lax`, `Path=/`, no `Domain`, bounded `Max-Age`. Use an opaque cookie name such as `__Host-cadabry_session` in production.
- Rotate token on login and privilege-sensitive events; revoke the previous session. Provide logout-current and later logout-all.
- Check `revoked_at`, `expires_at`, and active user status in the database. Update `last_seen_at` only on a coarse interval to avoid a write per request.
- Use absolute expiration plus optional sliding renewal. Initial recommendation: 30-day absolute, renew cookie/token only within a defined window; make policy configurable and test clock boundaries.
- CSRF: Server Actions remain same-origin by default and compare Origin/Host. Keep `SameSite=Lax`; configure `serverActions.allowedOrigins` only for exact trusted proxy origins. Route-handler mutations additionally validate Origin and use POST/DELETE semantics. Never use GET for mutation.
- Proxy may perform an optimistic cookie-presence redirect, but it is not authorization. Secure checks live in the DAL close to each query/mutation.

`verifySession()` is request-memoized with React `cache()` and returns a minimal actor DTO. It must not be globally cached across requests. Logs contain session ID/correlation ID only after hashing/redaction; never raw cookies.

## 8. App Router contracts

### Reads

Server Components call query services/DAL directly. Queries return bounded DTOs, use explicit `select`, cursor pagination, stable ordering `(sort_key, id)`, and concurrent independent reads where useful. Do not call Cadabry's own Route Handlers from Server Components.

### Mutations

Dedicated `actions.ts` files are thin adapters:

1. `verifySession()`.
2. Parse and validate untrusted arguments with shared schemas, including length/list limits.
3. Call one application use case/DAL primitive that enforces ownership again.
4. Map expected failures to a serializable discriminated result: `{ ok: true, data } | { ok: false, error: { code, fieldErrors? } }`.
5. Emit safe structured telemetry.
6. Revalidate the smallest affected path/tag after commit; use current two-argument cache tag APIs where applicable.
7. Redirect outside `try/catch`, or rethrow Next.js control-flow errors.

Treat every exported Server Action as a public POST endpoint. Do not close over secrets or trust hidden form fields. Return DTOs, never Prisma records, password/session fields, or raw error objects. Use idempotency keys for retry-prone operations such as quick capture/import and enforce unique `(owner_id, operation, idempotency_key)` with stored result fingerprint if product flows can double-submit. Simple deterministic updates may be naturally idempotent.

### Route Handlers

Use only for future webhooks/integrations, file/object downloads, and an eventual public API. Authenticate, authorize, validate, rate-limit, set explicit deadlines, use uniform errors, and version public contracts. Webhooks require signature verification, replay protection, and an inbox/idempotency record.

## 9. Prisma, PostgreSQL, Neon, and migrations

### Verified production baseline

- Next.js npm stable: `16.3.4`.
- Prisma npm currently tags `8.0.0-rc.13` as latest, but official Prisma documentation still calls Prisma 8 a **Release Candidate**. The last non-RC release is `7.10.0`; use Prisma 7 for production until Prisma 8 reaches GA and passes Cadabry's migration/transaction/adapter test suite.
- Recheck exact compatible versions immediately before dependency installation and pin exact versions in the lockfile. “Latest” is not a stability guarantee when an RC occupies the npm tag.

### Connection configuration

- Node.js runtime by default; do not select Edge without a measured need and adapter compatibility proof.
- `DATABASE_URL`: Neon pooled hostname (`-pooler`) for application traffic through `@prisma/adapter-neon`.
- `DATABASE_URL_UNPOOLED`: direct Neon hostname for Prisma CLI migrations/introspection, referenced from `prisma.config.ts`.
- Prisma 7 datasource block declares only `provider = "postgresql"`; runtime connection is passed to `PrismaNeon`, CLI connection comes from `prisma.config.ts`.
- Create one module-level `PrismaClient` per warm server process and reuse it; use a `globalThis` development guard against hot-reload duplication. Do not `$disconnect()` per request. Standalone scripts disconnect in `finally`.
- Validate required environment variables at server startup without logging their values. Require TLS (`sslmode=require`). Bound connection and query acquisition timeouts; start with a small adapter pool and load-test against Neon plan limits rather than multiplying defaults by function concurrency.
- Never run migrations from a request or application startup.

### Migration workflow

1. Local/dev: create reviewed migration files against a disposable Neon development branch.
2. CI: generate client, validate/format schema, inspect migration diff, apply all migrations to a fresh ephemeral database, run constraints/auth/CRUD/rollback-compatibility tests, and scan for destructive SQL/secrets.
3. Production: backup/restore posture confirmed, run `prisma migrate deploy` once as a serialized deployment job using the direct URL, then deploy compatible application code.
4. Use expand/migrate/contract for incompatible changes. Backfills are separate, resumable, chunked, observable, throttled, and idempotent.
5. Never use `prisma db push` against production. Commit migration files. Do not edit already-applied migrations.
6. For risky DDL, review lock duration and use PostgreSQL-safe techniques (for example concurrent indexes via carefully managed SQL outside a transaction where required).

Prisma alone cannot express every required constraint (partial unique indexes, some composite ownership checks, lower-case expression indexes). Add reviewed SQL to migrations and cover it with database integration tests; do not weaken invariants to fit the ORM.

## 10. Selective context builder

The context builder is an application service, not an LLM call in V1.

### Request contract

`BuildContextInput`: trusted actor, project ID, recipe (`RESUME`, `BUILD_FEATURE`, `DEBUG`, `REVIEW`, `REFACTOR`, `HANDOFF`), optional focal entity ID, explicitly enabled pack IDs, output budget, and deterministic policy version.

### Selection pipeline

1. Authorize project ownership and focal entity ownership.
2. Load a small project identity/state snapshot.
3. Build candidate references with reason, relevance tier, recency, priority, and estimated size.
4. Always include: project statement, current task/next action, applicable acceptance criteria, relevant tech/rules, active blockers, and the recipe's instructions.
5. Include applicable decisions (active and affected-system matched), relevant feature/bug, enabled packs, and a bounded recent-session/activity window.
6. Exclude archived/rejected/superseded/unrelated records unless explicitly selected. Never include session/auth data, environment values (none exist), command output, or full unrelated notes.
7. Resolve rule precedence: project-specific explicit rule > selected project pack > builder default/selected global pack. Preserve conflicting decisions visibly; do not silently merge them.
8. Rank deterministically: required tier, direct relationship, project priority, recency, then stable ID. Fill sections within per-section caps and total estimated token/character budget.
9. Render canonical Markdown with source labels and an omission summary (`7 older notes omitted`) so selectivity is visible.
10. Return content plus a manifest of included source kind/ID/version and exclusion reasons. Save only when the user explicitly chooses Save/Version; generation itself is read-only.

Budgets are hard limits. Reject pathological inputs, cap enabled packs/items, and truncate at semantic boundaries rather than raw byte cuts. Exact tokenization can be added per target agent later; V1 uses conservative character estimates and records the estimator version.

Cache only immutable source fragments or a result keyed by `(owner_id, project_id, recipe, focal_version, policy_version, source_version_vector)`. Simpler V1 choice: no cross-request cache; measure first.

## 11. Search architecture

Start with PostgreSQL lexical search. External search infrastructure and embeddings do not yet pay rent.

- Search only the authenticated owner's supported entities: projects, prompts, notes, ideas, bugs, decisions, inspirations, and features.
- Normalize a small `search_documents` projection: `owner_id`, optional `project_id`, `entity_kind`, `entity_id`, title, plain-text body excerpt, `search_vector`, `updated_at`; unique `(entity_kind, entity_id)`. Keep canonical content in domain tables.
- Update projection in the same transaction for simple writes. If write cost becomes material, switch to a transactional outbox and idempotent worker without changing the query contract.
- GIN index on language-explicit `to_tsvector('english', ...)`; rank with weighted title/body `ts_rank_cd`. Support exact prefix/title matching before fuzzy fallback.
- Optional `pg_trgm` indexes only after measuring substring/typo demand. Do not use unbounded `%query%` scans.
- Query contract: trimmed query with 2–200 character bound, optional project/kind filters, max page size 50, opaque cursor based on rank/update/id, statement timeout, escaped `websearch_to_tsquery('english', $query)`, stable tie-breaking, safe excerpts.
- Authorization predicate (`owner_id = actor.user_id`) is part of the search query, never post-filtering. Results return minimal typed DTOs and allowed route targets.
- Search indexing strips Markdown/HTML and excludes password/session fields, environment values, and sensitive Activity metadata.

## 12. Reliability, observability, and tests

### Failure behavior

- Database unavailable: reads show a retryable error boundary; writes return `DEPENDENCY_UNAVAILABLE`, preserve form state, and do not claim success.
- Ambiguous network result: idempotent/retry-key operations can safely replay; otherwise re-read state before prompting the user.
- Neon cold start: bounded connect timeout chosen from measurement; one deliberate retry layer with exponential backoff/jitter only for transient, safe operations.
- Activity insert failure rolls back its core mutation. Search projection failure likewise rolls back initially; an outbox becomes appropriate only if measured latency/availability requires decoupling.
- Context overflow returns a bounded packet and explicit omissions, never a server crash or silent unlimited query.

### Telemetry

Structured logs and traces include correlation ID, actor ID (pseudonymous), action/query name, duration, row/result count, outcome/error code, and deployment/version. Redact inputs and URLs where they may contain secrets. Metrics: auth/setup successes/failures, DB pool acquisition latency/timeouts, Server Action latency/errors, search p50/p95 and zero-result rate, context build size/latency/omission count, and migration status. Readiness performs a bounded DB check; liveness does not depend on Neon.

Initial product SLO proposal after baseline measurement: 99.9% successful authenticated core mutations excluding validation/user errors; p95 interactive reads under 500 ms when Neon compute is warm; no cross-tenant disclosure. Cold-start latency is reported separately rather than averaged away.

### Required verification before implementation is called complete

- Unit tests for status transitions, rule precedence, context ranking/budgets, queue ordering, and error mapping.
- Database integration tests on disposable Postgres/Neon branch for constraints, cascades/restricts, composite ownership FKs, partial indexes, migration from empty, and concurrent owner setup.
- Auth tests: hash verification, token rotation/revocation/expiry, cookie flags, generic login errors, logout, disabled user, CSRF/origin behavior.
- Authorization matrix across every entity and Server Action, including malicious cross-owner IDs and relationship attachment.
- Concurrency tests for initial setup, prompt version allocation, queue reorder, and duplicate idempotency keys.
- Search tests for tenant isolation, ranking, pagination stability, statement bounds, and Markdown sanitization.
- Context golden tests showing required inclusion, irrelevant exclusion, deterministic order, safe truncation, and manifest accuracy.
- CI lint, strict typecheck, production build, dependency/secret scan, and migration rehearsal.

## 13. Deferred decisions and explicit non-goals

- Authentication library selection is deferred to Phase 2 evaluation; the contracts above hold whether using a mature library or a narrowly implemented credential/session module. Do not improvise cryptography.
- No organizations, public signup, email verification, password reset, social login, external analytics, vector search, AI summarization, repository ingestion, command execution, secret storage, service split, or background queue in Phase 1.
- File upload storage/provider is deferred; inspiration records are designed to reference object metadata later.
- Project health is a transparent derived rule set with an optional override, not a fake precision score.
- Prisma 8 is deferred until GA plus successful compatibility/migration rehearsal.

## 14. Official guidance consulted

- Prisma PostgreSQL connector: <https://www.prisma.io/docs/orm/core-concepts/supported-databases/postgresql>
- Prisma database connections: <https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections>
- Neon Prisma guide: <https://neon.com/docs/guides/prisma>
- Next.js authentication guide: <https://nextjs.org/docs/app/guides/authentication>
- Next.js `use server` security guidance: <https://nextjs.org/docs/app/api-reference/directives/use-server>
- Next.js Server Actions configuration: <https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions>

Version information was verified from the npm registry and official documentation on the date above. Re-run the check immediately before installing dependencies.
