# Cadabry design system

**Apple designed a software workspace inside The Starry Night.**

Dark, quiet, spatial. Depth comes from light and surface change, never from drop
shadows. Motion describes where things are in relation to each other; it is
never decoration.

Everything below is implemented in `src/app/globals.css` and the primitives in
`src/components/ui/`. Reference boards for the influences live in
`docs/design-refs/` (Apple, Linear, Raycast, PlayStation, SpaceX, Nintendo 2001).

---

## The three rules

1. **Gold is the only "act on this" signal.** One primary action per screen,
   `--accent` (moonlight gold). Cobalt is *place and energy* — selection, links,
   live projects. If two things on a screen are gold, one of them is wrong.
2. **Depth is light, not shadow.** Elevation comes from the surface ramp
   (`--well` → `--surface` → `--surface-raised` → `--overlay`), a hairline
   border, and glow. Drop shadows are reserved for things that genuinely float:
   dialogs, popovers, the command menu.
3. **The universe is information, not ornament.** Every visual property of a
   project node encodes something real — size is importance, ring is progress,
   aura brightness is recency, hue is status.

---

## Colour

The ramp is blue-tinted throughout; there is no neutral grey in the system.

| Token | Role |
|---|---|
| `--void` / `--ink-980` | Deep space behind the star field |
| `--background` | App canvas |
| `--well` | Sunken: code blocks, generated output, inputs |
| `--surface` | Panels |
| `--surface-raised` | Hover fill, badges |
| `--overlay` | Dialogs, popovers, menus |
| `--foreground` | Primary text |
| `--muted` | Secondary text |
| `--subtle` | Captions, hints, eyebrows, placeholders |

**Accents.** `--accent` (gold) for actions and progress. `--cobalt-400/500` for
links, selection and planned work. `--cyan-400` for shipped. `--danger-500` for
blocked and destructive. `--success-500` for done.

**Contrast is a hard constraint.** `--subtle` is `#8794ae` specifically because
anything darker fails 4.5:1 against `--surface-raised`, the lightest panel. If
you darken it, `e2e/a11y.spec.ts` fails. That is the intended behaviour.

Colour never carries meaning alone: status badges pair hue with a label, and
inline links inside prose are underlined.

---

## Typography

`system-ui` first, so Apple platforms get real SF Pro; Inter (via `next/font`)
carries every other platform.

The weight ladder is **300 / 400 / 600 / 700**. Weight 500 is deliberately
absent — mid-emphasis is always 600.

| Token | Size | Use |
|---|---|---|
| `text-display` | 44px | Universe hero moments |
| `text-title-1` | 28px | Page titles |
| `text-title-2` | 21px | Section heads |
| `text-title-3` | 17px | Card and record titles |
| `text-body` | 15px | Default app body |
| `text-caption` | 13px | Secondary captions, hints |
| `text-micro` | 11px | Eyebrows, meta, keycaps |

Display sizes carry negative tracking (`--tracking-title`, `--tracking-display`)
for the tight Apple headline cadence. Nothing at or below 12px is ever
tightened — `.eyebrow` runs *positive* tracking at 11px instead.

> **Careful:** these scale names are not Tailwind defaults, so `tailwind-merge`
> would otherwise mistake `text-body` for a *colour* and strip a real colour
> class. `src/lib/cn.ts` declares them as font sizes. Add any new step there.

---

## Cascade layers

`globals.css` puts base element styles in `@layer base` and the component
classes (`.eyebrow`, `.glass`, `.node*`, `.universe`) in `@layer components`.

This matters more than it looks: **unlayered CSS beats everything inside
`@layer`**. When the base rules were unlayered, `button { color: inherit }`
silently overrode `text-on-accent` on every primary button. Keep new global CSS
inside a layer.

The one deliberate exception is the `prefers-reduced-motion` block, which stays
unlayered so it always wins.

---

## Motion

| Token | Duration | Use |
|---|---|---|
| `--duration-fast` | 120ms | Hover, press, colour change |
| `--duration-base` | 200ms | Dialogs, menus, tooltips |
| `--duration-slow` | 320ms | Page-level fades, progress fills |
| `--duration-spatial` | 520ms | Universe transitions |

`--ease-out` for anything entering, `--ease-spring` only for a node reacting to
a pointer. Every actionable element gets `.press` (a 0.97 scale on active) —
the system-wide press feedback.

Under `prefers-reduced-motion` all animation collapses, including the orbital
drift and the `.press` scale.

---

## The universe

`src/components/universe/`

- **Layout** (`features/projects/constellation.ts`) is a pure function of index,
  so a project keeps the same place in the sky on every render — which is what
  makes the map learnable. Seven projects or fewer get an evenly-spaced ring;
  beyond that, a golden-angle spiral, which never collides and never forms
  visible rows.
- **One DOM, two views.** The star map and the list are the *same* `<ul>`; only
  positioning changes. Tab order, the announced item count and the accessibility
  tree are identical in both, and small screens get the readable layout without
  a second copy of the markup.
- **Filtering dims rather than removes.** The constellation keeps its shape, so
  the sky doesn't reshuffle every time you change a filter.
- **Energy** is recency: touched today burns bright, untouched for a month is
  nearly dark. That single cue is what makes an abandoned project obvious.

---

## Navigation

There is no sidebar. A thin glass bar carries the wordmark, a Library menu,
search, capture and the account menu; **⌘K is the primary way around the app**
and must cover every destination. Bare `C` captures a thought from anywhere
(suppressed while typing).

Project screens share chrome from `app/(authenticated)/[slug]/layout.tsx`:
identity, state, the Resume Building action, and a horizontal section nav with
live counts. Individual pages render only their own content.

---

## Components

`src/components/ui/` — built on Radix primitives, styled with these tokens.

- `button` — `primary` (gold, one per screen), `secondary`, `ghost`, `quiet`,
  `danger`. `md`/`lg` clear a 44px touch target.
- `field` — label + control + hint/error with the aria plumbing wired. Selects
  are native on purpose: OS pickers beat custom listboxes for long enum lists.
- `panel` / `page` — the single container, plus `PageHeader`, `EmptyState`,
  `DataList`, `Stack`/`Row`.
- `disclosure` — the collapsed "add a record" form. Native `<details>`, so the
  server-action form inside works before hydration.
- `badge`, `progress`, `dialog`, `menu` (menu + tooltip + separator),
  `filter-bar`, `markdown`, `copy-button`.

**Empty states always name what's missing and offer the action that fixes it.**
Never a bare "No data".

---

## Verification

`e2e/a11y.spec.ts` scans every route — 8 global, 15 project sections, plus the
signed-out screens — for WCAG 2.1 A/AA violations with axe, and fails on any.
Run it with `npm run test:e2e` against a running dev server.

---

## The two skies (v2 — "The Observatory")

Cadabry now ships **two themes**, switched by the header toggle and stored in
`localStorage["cadabry:theme"]`. An inline script in the root layout replays the
stored choice before first paint, so a reload never flashes the wrong sky.

- **Night sky (default, dark).** The original concept, deepened: indigo void,
  nebula washes, gold as moonlight. Unchanged rules apply.
- **Star chart (light).** The astronomer's desk at dawn: warm chart paper
  (`#f6f2e7` family), ink-navy text, antique gold and cobalt ink. The universe
  metaphor survives translation — the sky becomes paper, stars become plotted
  points, glows become precise lines and solid inks. **Never** "invert the dark
  palette"; light-mode stops are re-chosen for contrast on paper (e.g. link
  cobalt `#2d55ad`, accent gold `#a2761a`).

### Theme plumbing rules

1. Every colour in a component resolves through a semantic token
   (`--surface`, `--muted`, `--line`, `--accent`…). Raw hex in a component is a
   bug; if a token is missing, add it to both theme blocks in `globals.css`.
2. `[data-theme="light"]` on `<html>` overrides the token values only. Layout,
   spacing, and components are theme-blind.
3. Decorative marks that cannot be tokenized by colour alone read dedicated
   vars: `--star` (star-field fill), `--veil` (dialog scrim),
   `--track` (meter tracks), `--constellation` (connector lines).
4. Theme transitions animate (`.theme-ready` on `<html>`, added after first
   paint) but respect `prefers-reduced-motion`.

### Type voices (v2)

- **Fraunces** — display voice: wordmark, page titles (`h1`), node names.
- **Instrument Sans** — UI voice: everything read and clicked all day.
- **JetBrains Mono** — chart-label voice: `.eyebrow`, keycaps, metadata.
  The eyebrow class is deliberately mono + uppercase + wide tracking; it is
  the "instrument label on a star chart" and must not regress to sans.

### Layout fixes (v2)

- Constellation node centers clamp to `18–74%` of field height so labels never
  crop at the canvas edge; the field height formula accounts for label space.
- `.node-detail` is `display: block` so `text-overflow: ellipsis` applies
  (mobile description clipping bug).
- Project brain page aside carries an "At a glance" stat grid plus a
  "Recent activity" feed — no dead rail.
