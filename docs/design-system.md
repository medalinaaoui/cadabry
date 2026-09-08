# Cadabry design system

Owner: Jinx (front-end). Last updated: 2026-09-08.
Consumed by: `src/app/globals.css` (tokens are live), all `src/components/ui/*`, and every route.

> **North star.** *Apple designed a software workspace inside The Starry Night.*
> Dark, calm, premium, intentional. Moonlight gold and cobalt are **energy** — spent
> only on active state, progress, focus, stars, and calls to action. Everything else
> is quiet navy so the important thing on screen is obvious in under a second.

This is a system, not a mood board. Every value here is a token. One-off hex values,
arbitrary spacing, and ad-hoc shadows are how interfaces rot — don't introduce them.

---

## 0. How to consume the tokens

Tokens live as CSS custom properties in `:root` and are mapped into Tailwind v4 via
`@theme inline`. Three ways to use them, in order of preference:

1. **Tailwind utility** (mapped tokens): `bg-surface`, `text-muted`, `border-line`,
   `text-accent`, `bg-cobalt-500`, `text-on-accent`, `font-mono`, `text-danger`.
2. **Arbitrary value referencing a token** for the un-mapped tokens (radius, shadow,
   motion, layout): `rounded-[var(--radius-xl)]`, `shadow-[var(--shadow-lg)]`,
   `duration-[var(--duration-base)]`, `ease-[var(--ease-out)]`, `max-w-[var(--page-max)]`.
3. **Raw `var(--token)`** inside a `style` prop for dynamic per-project color/energy.

Never hardcode a hex, a px radius, or a bezier curve in a component. If a value you
need isn't a token, add the token here first.

### Migration map (existing components → tokens)

The first foundation components (`button.tsx`, `field.tsx`, `error.tsx`, `loading.tsx`)
use raw Tailwind `slate-*` / `amber-*`. They still render correctly. When touched, migrate:

| Currently | Use instead |
|---|---|
| `bg-slate-950`, `bg-slate-900` | `bg-surface`, `bg-well` |
| `border-slate-700` | `border-line` / `border-line-strong` |
| `text-slate-100` / `-200` / `-300` | `text-foreground` / `text-muted` |
| `text-slate-400` / `-500` | `text-subtle` |
| `bg-[var(--accent)]` + `text-slate-950` | `bg-accent text-on-accent` |
| `hover:bg-amber-100`, `bg-amber-200` | `hover:bg-accent-strong`, `bg-accent` |
| `bg-red-950 / border-red-800 / text-red-100` | `bg-danger/15 border-danger/50 text-danger` |
| `rounded-xl` (0.75rem) | `rounded-[var(--radius-md)]` (12px — identical) |
| `rounded-3xl` (1.5rem) | `rounded-[var(--radius-xl)]` (24px — identical) |

Radius values were chosen to match the existing `rounded-xl`/`rounded-3xl` exactly, so
migration is a find-replace with zero visual change.

---

## 1. Color

Palette derived from *The Starry Night*: midnight navy, deep ultramarine, cobalt,
moonlight yellow, muted gold, cloudy blue-gray, subtle cyan, near-black blue.
The product stays dark and sophisticated; brights are intentional.

### 1.1 Ink — blue-tinted neutral ramp

Surfaces at the dark end, text at the light end. This one ramp does ~80% of the UI.

| Token | Hex | Role |
|---|---|---|
| `--ink-950` | `#050a17` | Void behind the universe; deepest canvas |
| `--ink-900` | `#080e1f` | **App background** (`--background`) |
| `--ink-850` | `#0c1428` | Sunken wells, code blocks (`--well`) |
| `--ink-800` | `#101c35` | **Base surface / cards** (`--surface`) |
| `--ink-750` | `#16223f` | Raised surface, hover fill (`--surface-raised`) |
| `--ink-700` | `#1c2b4d` | Overlay, popover, dialog (`--overlay`) |
| `--ink-600` | `#26355a` | Strong border, dividers on raised (`--line-strong`) |
| `--ink-500` | `#35477a` | Hairline source, scrollbar hover |
| `--ink-400` | `#4a5d82` | Disabled control border |
| `--ink-300` | `#6b7d9e` | Tertiary text, placeholder (`--subtle`) |
| `--ink-200` | `#9eabc4` | Secondary/muted text (`--muted`) — cloudy blue-gray |
| `--ink-100` | `#c7d0e0` | High-emphasis secondary |
| `--ink-50`  | `#e8edf8` | **Primary foreground** (`--foreground`) |

**Elevation ladder:** background `#080e1f` → surface `#101c35` → raised `#16223f` →
overlay `#1c2b4d`. Each step is a lighter navy, reinforced by a 1px top highlight in the
shadow tokens. We build depth with lightness + glow, not heavy drop shadows.

### 1.2 Cobalt — ultramarine energy

Interactive structure: links, focus companions, selection, "Moving" project health,
progress arcs, the universe's orbital lines.

| Token | Hex | Role |
|---|---|---|
| `--cobalt-700` | `#2a4fa8` | Pressed / deep ultramarine |
| `--cobalt-600` | `#3a67c9` | Hover on fills |
| `--cobalt-500` | `#497fe3` | Base interactive blue (`--blue`) |
| `--cobalt-400` | `#6c9bef` | **Link text on dark** (passes AA) |
| `--cobalt-300` | `#93b8f6` | Highlight text, active nav label |

Use `--cobalt-400`/`-300` for text on navy; `--cobalt-500`+ for fills (with
`text-on-cobalt` `#061024`). Link text: `text-cobalt-400`, underline on hover/focus.

### 1.3 Cyan — starlight highlight

`--cyan-400 #58c8dc`, `--cyan-300 #86dcec`. Sparing: star glints, "new"/live pings,
a single data accent. Never a primary action color.

### 1.4 Gold — moonlight accent (the CTA color)

The one warm color. Primary buttons, active project energy, progress fill at
completion, pinned/favorited stars, the focus ring.

| Token | Hex | Role |
|---|---|---|
| `--gold-600` | `#d9a94e` | Pressed / muted golden |
| `--gold-500` | `#e9be63` | Secondary gold |
| `--gold-400` | `#f3cf77` | **Base moonlight** (`--accent`) |
| `--gold-300` | `#f8dd97` | Hover, bright star (`--accent-strong`) |

Text on gold fills is `--on-accent #1a1305` (near-black warm) — never white.
**Budget:** at most one gold primary action per view. A screen full of gold reads
cheap and "AI." Restraint is the brand.

### 1.5 Status

| Token | Hex | Meaning |
|---|---|---|
| `--success-500` | `#4cbf94` | Moving, shipped, configured, passing |
| `--warning-500` | `#f3cf77` | Needs attention (aligns with gold) |
| `--danger-500` | `#e5686a` | Blocked, error, destructive (`-600 #cf4d55` pressed, `-400 #f28b8c` text) |
| `--info-500` | `#497fe3` | Neutral info / cobalt |

Status is never color-only. Always pair with an icon and/or text label (accessibility
+ colorblind safety). Tints on dark: fill at ~12–18% alpha, border at ~45–55%, text at
the `-400` step, e.g. `bg-danger/15 border-danger/50 text-danger`.

### 1.6 Project health → color

Health is a transparent derived state (per brief §22), surfaced as a labeled badge and
the project object's ambient energy in the universe:

| Health | Color source | Energy in universe |
|---|---|---|
| Moving | `--cobalt-400` | Bright, gentle orbit, subtle glow |
| Almost shipped | `--gold-400` + `--cobalt-400` | Brightest, warm halo |
| Needs attention | `--warning-500` | Steady, faint pulse |
| Blocked | `--danger-500` | Dimmed with a red rim |
| Dormant | `--ink-300` | Faded, desaturated, no motion |
| Shipped | `--success-500` | Transformed: settled, ringed, calm |

Per-project accent color (user-chosen in Project Brain) is applied as
`style={{ '--project': color }}` and used for that project's icon/glow, never for
system chrome.

### 1.7 Contrast rules (WCAG)

- Body/interactive text ≥ 4.5:1; large text (≥24px or 19px bold) ≥ 3:1.
- `--foreground` and `--muted` pass on `--background` and `--surface`.
- `--subtle` (`--ink-300`) is for **non-essential** tertiary text only (timestamps,
  hints); never for anything the user must read to act.
- Focus ring and non-text UI boundaries ≥ 3:1 against adjacent color.

---

## 2. Typography

Apple-like: strong hierarchy, restraint, generous line-height, tight display tracking.

- **Sans** (`--font-sans`): system UI stack led by SF Pro / -apple-system — crisp and
  native on the Mac where vibe coding happens, zero network cost, no CLS.
- **Mono** (`--font-mono`): SF Mono / JetBrains Mono stack for prompts, code blocks,
  commands, env var names, IDs.

Antialiasing and `text-rendering: optimizeLegibility` are set globally on `body`.

### 2.1 Type scale (~1.2 modular)

| Name | Size / line-height | Use |
|---|---|---|
| Display | `3.75rem` / 1.02 | Universe hero, empty-state headline (desktop) |
| H1 | `2.25rem` / 1.1 | Page title |
| H2 | `1.5rem` / 1.25 | Section title |
| H3 | `1.25rem` / 1.3 | Card / panel title |
| Body-lg | `1.125rem` / 1.6 | Lead paragraph, project one-liner |
| Body | `1rem` / 1.5 | Default |
| Small | `0.875rem` / 1.45 | Secondary text, metadata, controls |
| Caption | `0.75rem` / 1.35 | Timestamps, hints, badge text |
| Overline | `0.75rem` / 1 · `+0.08em` · uppercase | Section eyebrows, field group labels |

Tailwind mapping: Display→`text-6xl`, H1→`text-4xl`, H2→`text-2xl`, H3→`text-xl`,
Body-lg→`text-lg`, Body→`text-base`, Small→`text-sm`, Caption→`text-xs`.

### 2.2 Weight & tracking

- Weights: 400 regular (body), 500 medium (controls, emphasis, nav), 600 semibold
  (headings, titles), 700 reserved for Display only. No black weights.
- Tracking: Display/H1 `-0.02em`; H2/H3 `-0.01em`; body `0`; overline `+0.08em`.
- Prose measure caps at `--reading-max` (46rem). Never full-width paragraphs.
- Numbers in dense/tabular contexts (health %, counts, dates): `font-variant-numeric: tabular-nums`.

---

## 3. Spacing

**Strict 4px grid** (8px preferred for layout rhythm). Use Tailwind's spacing scale —
every step is a multiple of 4px (`1`=4, `2`=8, `3`=12, `4`=16, `6`=24, `8`=32, `12`=48,
`16`=64). Do not use odd arbitrary pixel gaps.

Semantic rhythm:

- Inside controls: `8–12px` (`gap-2`/`gap-3`).
- Inside a card: `16–24px` padding (`p-4`/`p-6`).
- Between cards: `16px` (`gap-4`).
- Between sections: `32–48px` (`gap-8`/`gap-12`).
- Page gutters: `--gutter` (24px) mobile, `--gutter-lg` (48px) desktop.
- Content ceiling: `--page-max` (1280px); prose `--reading-max` (736px).

Whitespace is a feature. When unsure, add one more step of space before adding a border.

---

## 4. Radius

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 6px | Focus ring inset, tiny chips, inline code |
| `--radius-sm` | 8px | Badges, tags, small buttons |
| `--radius-md` | 12px | **Inputs, buttons, menu items** (= `rounded-xl`) |
| `--radius-lg` | 16px | Nested cards, list rows, toasts |
| `--radius-xl` | 24px | **Panels, primary cards, dialogs** (= `rounded-3xl`) |
| `--radius-2xl` | 32px | Universe hero container, large feature surfaces |
| `--radius-full` | 9999px | Pills, avatars, project nodes, icon buttons |

Nesting rule: child radius = parent radius − padding, roughly one step down. Don't nest
two identical large radii flush against each other.

---

## 5. Elevation & glow

Dark UI: depth comes from **surface lightness + a 1px top highlight + restrained
shadow**. "Energy" comes from **glow**, used only on live/active/focused objects.

| Token | Use |
|---|---|
| `--shadow-xs` | Hairline lift: badges, inline chips |
| `--shadow-sm` | Resting cards, list rows |
| `--shadow-md` | Hover on cards, dropdown menus, popovers |
| `--shadow-lg` | Dialogs, command palette, toasts |
| `--shadow-xl` | Universe hero, focused/dragged project node |
| `--glow-gold` | Active CTA, pinned project, "almost shipped" halo |
| `--glow-cobalt` | Focused input companion, "moving" project, live selection |
| `--glow-cyan` | Star glints, "new"/live ping |

Rules: never stack two shadow tokens on one element; glow replaces (does not add to) a
resting shadow when an object becomes active; glow is decorative-adjacent — it must be
disabled or reduced under `prefers-reduced-motion` when animated.

---

## 6. Motion

Motion communicates **state and spatial relationship**, never decoration for its own sake.

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Hover, press, toggle, color/opacity |
| `--duration-base` | 200ms | Enter/exit of menus, toasts, fades |
| `--duration-slow` | 320ms | Dialogs, panel expand, drawer |
| `--duration-spatial` | 520ms | Universe transitions, project open/close, view transitions |
| `--ease-out` | `cubic-bezier(0.16,1,0.3,1)` | Entrances, spatial reveals |
| `--ease-in-out` | `cubic-bezier(0.65,0,0.35,1)` | Moves, reorders, morphs |
| `--ease-standard` | `cubic-bezier(0.4,0,0.2,1)` | General UI |

Principles: animate `transform`/`opacity` (never layout props); acknowledge every input
in <100ms with a visible press state; use the View Transitions API for
project-open/close and list↔grid where supported. **`prefers-reduced-motion` is
respected globally** — animations collapse to ~0ms and the `cadabry-twinkle` keyframe
stops. Motion must never be required to understand or operate the UI.

---

## 7. Component styling rules

Shared primitives live in `src/components/ui`. Components are APIs: define the props
contract and every visual state before styling. No component ships without its full
state set (§8).

### Buttons (`button.tsx`)
- Min height 44px (touch target), `--radius-md`, `px-5`, weight 500, `--duration-fast`
  color transitions, visible pressed state (`active:` scale 0.98 or brightness drop).
- **Primary** — `bg-accent text-on-accent`, hover `bg-accent-strong`. One per view.
- **Secondary** — `bg-surface border-line text-foreground`, hover `bg-surface-raised`.
- **Ghost** — transparent, hover `bg-surface-raised/60`. For toolbars, low-emphasis.
- **Danger** — `bg-danger/15 border-danger/50 text-danger-400`, hover `bg-danger/25`.
  Destructive actions additionally require a confirm step (§8).
- Icon-only buttons need `aria-label` and `--radius-full` or `-md`; never ship a
  decorative button (brief hard rule — every button does something real).
- Loading: disabled + spinner/inline skeleton; keep the label to avoid width jump.

### Inputs & fields (`field.tsx`)
- `bg-well border-line`, `--radius-md`, `px-4 py-3`, placeholder `text-subtle`.
- Focus: `border-cobalt-500` + `--glow-cobalt`; the global gold focus ring also applies.
- Always a visible `<label>` (not placeholder-as-label); hint text `text-xs text-subtle`
  wired via `aria-describedby`.
- Error state: `border-danger/60`, message in `text-danger-400` with `aria-live="polite"`
  and `aria-invalid`. Preserve user input on failed submit (brief UX rule).
- Long-text fields autosave where appropriate with a visible "Saved / Saving…" indicator.

### Cards / panels
- `bg-surface border border-line`, `--radius-xl`, `--shadow-sm`, padding `p-6`.
- Hover (interactive): lift to `--shadow-md`, border → `--line-strong`, optional
  cobalt/gold glow if the card represents a live object. `--duration-fast`.
- Header row: H3 title + optional status badge + overflow menu (ghost icon button).

### Badges / status chips
- `--radius-sm`, `text-xs` weight 500, `px-2 py-0.5`, icon + label.
- Tint pattern: `bg-{status}/15 text-{status} border border-{status}/40`.

### Dialogs (Radix) & command palette (cmdk)
- Scrim: `bg-ink-950/70` + backdrop blur. Panel: `bg-overlay border-line`,
  `--radius-xl`, `--shadow-lg`, max-width `28rem` (dialog) / `40rem` (palette).
- Focus trapped, `Esc` closes, focus returns to trigger, `aria-modal`, labelled title.
- Command palette (`Cmd/Ctrl+K`): grouped results, arrow-key nav, visible selected row
  (`bg-surface-raised` + cobalt left rail), inline shortcut hints (mono `text-xs`).

### Markdown & prompts (`markdown.tsx`)
- Rendered via react-markdown + remark-gfm, **raw HTML disabled**, safe URL protocols
  only (security rule — no `dangerouslySetInnerHTML`).
- Code/prompt blocks: `bg-well`, `--font-mono`, `text-sm`, `--radius-lg`, with a
  persistent copy button (top-right). Copy confirms via toast + icon swap.

### Toasts (sonner)
- Dark theme, `--radius-lg`, `--shadow-lg`, top-right desktop / bottom mobile.
- Success `--success-500`, error `--danger-500`, both with icon. Auto-dismiss ~4s,
  errors persist until dismissed. Every meaningful mutation emits one.

### Icons
- lucide-react, 1.5px stroke, sized to text (`h-4 w-4` inline, `h-5 w-5` buttons).
  Functional, monochrome, inherit `currentColor`. No decorative icon soup.

---

## 8. Required states (the non-negotiable law)

Every screen and data component ships **all** of: empty · loading · error · success ·
disabled · offline (where relevant). A happy-path-only view is a prototype, not a
deliverable.

### Loading — skeletons, not spinners
- Skeletons match the final layout's shape and spacing to prevent CLS.
- `bg-surface-raised` blocks with `animate-pulse` (collapses under reduced motion),
  `--radius` matching the real element. `aria-busy="true"` on the region.
- Route-level `loading.tsx` already establishes this pattern; feature lists mirror it.
- Reserve space for async content; never let layout jump when data lands (CLS < 0.1).

### Empty — a doorway, not a dead end
- Structure: quiet illustrative mark (a faint constellation motif fits the brand),
  Display/H2 headline, one line of `text-muted` explanation, one **primary action**.
- Copy is specific and inviting, never "No data." Examples:
  - Universe: *"Your universe is dark. Create your first project to light it up."* → **New project**
  - Prompt queue: *"Plan tomorrow's session. Queue the first prompt you'll send."* → **Add prompt**
  - Inbox: *"Nothing to process. New thoughts land here."*
- Seed/demo data (brief §32) means true-empty is rare, but every list still handles it.

### Error — recoverable, honest, non-destructive
- Route boundary (`error.tsx`) reassures ("Your saved work is still there") + **Try again**.
- Inline (a failed mutation): keep the form and its input, show `text-danger-400`
  message via `aria-live`, offer retry. Never silently swallow; never fake success
  (backend contract: writes fail closed with `DEPENDENCY_UNAVAILABLE`).
- Not-found (`not-found.tsx`): calm, offers a route home / to the universe.

### Success
- Optimistic UI where safe (queue reorder, favorite, status toggle), reconciled on
  server confirm; roll back visibly with a toast on failure.
- Confirmation is proportional: toast for small mutations, inline state for saves,
  a settled animation for milestones (e.g. a project "ships" and transforms).

### Disabled
- `opacity-0.6`, `cursor: wait` for in-flight (global rule), `cursor: not-allowed` for
  genuinely unavailable, `aria-disabled`. Explain *why* nearby when non-obvious.

### Destructive
- Two-step: primary destructive action opens a confirm dialog naming the target and
  consequence. Prefer **Archive** (reversible) over delete per brief; permanent delete
  requires an explicit typed/confirmed step and a count preview.

### Offline / stale
- Detect connection loss; show a non-blocking banner. Disable mutations that require the
  server, preserve draft input locally, and re-enable on reconnect.

---

## 9. Layout specs

Shared: content max `--page-max` (1280px), gutters `--gutter`/`--gutter-lg`, a slim
top app region (`--header-h` 3.5rem) rather than a heavy SaaS sidebar+topbar shell.
Desktop-first (vibe coding lives on the computer) but genuinely responsive — mobile is
re-composed around capture/read, not a shrunk universe (brief §Mobile).

### 9.1 Auth / setup pages (`/setup`, `/login`)
- Full-viewport `--ink-950` → `--ink-900` radial-vignette canvas with a sparse,
  low-opacity starfield (static under reduced motion). This is the only place the
  "painting" shows itself boldly — it sets the tone before the workspace calms down.
- Centered card, max-width `26rem`, `bg-surface/80` + backdrop blur, `--radius-xl`,
  `--shadow-xl`. Wordmark + one-line promise above the form.
- **Setup** (first-run owner): name, email, password (with strength hint + show/hide),
  single **Create your universe** primary CTA. Copy makes clear this is one-time owner
  creation. On success → universe with a first-light welcome.
- **Login**: email, password, submit. Generic `INVALID_CREDENTIALS` error (no user
  enumeration — matches backend). Rate-limit feedback is calm, not alarming.
- Fully keyboard-operable, labels wired, `autocomplete` set correctly, Enter submits,
  errors announced. No social login, no fake providers (brief).

### 9.2 Main dashboard — the Project Universe (`/`)
- **Signature view.** Projects are celestial nodes (planets/stars) floating in the
  navy universe. Each node communicates, at a glance: name, icon/color identity,
  status, health (via ambient energy §1.6), progress, last activity, "currently
  building" line, next-action count, blocked/dormant/importance.
- Node size ≈ importance; brightness/energy ≈ health & recency; a thin cobalt progress
  arc rings the node; a gold star marks pinned/favorite; dormant nodes fade and desaturate.
- Ambient motion is slow and optional (parallax drift, faint twinkle via
  `cadabry-twinkle`); **fully disabled under reduced motion**. Heavy visual effects are
  lazy-loaded and must never make list interactions sluggish (brief §Performance).
- **Controls bar** (sticky top): status filter chips (Active/Idea/Planning/Building/
  Blocked/Paused/Shipped/Archived), search entry, **list/grid toggle**, **New project**,
  global **New Thought** (quick capture). `Cmd/Ctrl+K` opens the command palette anywhere.
- **List/grid fallback is first-class, not an afterthought** (brief §1 + a11y): a
  conventional, dense, sortable table/grid with the same data, fully keyboard-navigable.
  The universe must never be the *only* way to reach a project — spatial nav has a
  keyboard-and-list equivalent at all times.
- Mobile: universe degrades to a calm vertical list of project cards (energy shown as a
  left color rail + badge), capture and "next task" front-and-center.

### 9.3 Project list / detail

**List (grid fallback of §9.2):** project card = icon/color, name, one-liner, status +
health badges, progress bar, last-activity relative time, next-action count, pin.
Sortable by activity/health/name/progress. Rows are keyboard-focusable; Enter opens.

**Detail (`/projects/[id]`) — task-first, progressive disclosure (brief §Editor/§23):**
- **Header:** back-to-universe, project icon/name (color-themed), status control,
  health badge, pin/favorite, overflow (archive/export/handoff).
- **Above the fold — the 30-second answer + the signature action:**
  - *Next Best Action* panel: current task, why, and a ready **Resume Building** button
    that copies a selective context packet (backend context builder). This is the most
    prominent element on the page — gold primary, `--glow-gold` on hover.
  - *At-a-glance* row: what works / partially built / broken / current blocker, as
    compact labeled cells. Tabular, scannable, honest.
- **Below the fold — progressive disclosure** via tabs or anchored sections (Brain,
  Tech, Features, Prompts, Queue, Memory, Sessions, Inspiration, Timeline, Tools). Dense
  editing screens are allowed to be conventional and calm (brief permits this) — the
  universe metaphor stays at home; work screens optimize for reading and fast writing.
- Content column capped at `--reading-max` for prose/prompt bodies; metadata in a
  secondary rail on desktop, stacked on mobile.
- Editors (notes/prompts/decisions): Markdown with live-ish preview, autosave +
  "Saved/Saving…" indicator, unsaved-change guard. Fast writing over block-editor novelty.

### 9.4 Empty / loading / error at the layout level
- **Universe empty:** the void with a single bright "create first project" star as the
  primary CTA (see §8 copy). First project literally lights up the universe.
- **Universe loading:** faint static starfield + skeleton nodes/cards in place (no
  layout jump when real nodes arrive).
- **Project-detail loading:** skeleton header + Next-Best-Action + at-a-glance blocks
  matching final shape (extends route `loading.tsx`).
- **Errors:** route boundary reassures and retries; per-section errors stay local so one
  failed panel never blanks the whole project (a failed activity feed still lets you
  resume building).

---

## 10. Accessibility & performance (baked in, per SOUL + brief)

- Semantic HTML first; ARIA only to repair. Managed focus, focus-visible everywhere
  (global gold ring), keyboard operation for **every** interaction including the spatial
  universe (list/grid + palette are the keyboard path).
- Contrast per §1.7. Status never encoded by color alone. Dialogs/menus follow WAI-ARIA
  patterns (Radix gives us this — keep its semantics, restyle only).
- `prefers-reduced-motion` honored globally; skip-link present; visible labels; correct
  `autocomplete`; live regions for async feedback.
- Budgets (p75): LCP < 2.5s, INP < 200ms, CLS < 0.1. Server Components by default,
  `"use client"` only for real interactivity, lazy-load the universe's expensive
  visuals, animate only transform/opacity, skeletons reserve space. Measure before
  optimizing — never guess.

---

## 11. Do / Don't

**Do:** stay dark and quiet; spend gold like it's expensive; show every state; make the
universe memorable *and* fully keyboard/list accessible; reserve layout space; label
everything; verify with a screenshot before claiming it works.

**Don't:** ship the generic sidebar+topbar+card+table SaaS shell (brief forbids it);
use more than one gold primary per view; encode meaning in color alone; use spinners
where a skeleton fits; sacrifice usability for the metaphor; introduce an off-token hex,
radius, or bezier; leave a decorative/placeholder button.
