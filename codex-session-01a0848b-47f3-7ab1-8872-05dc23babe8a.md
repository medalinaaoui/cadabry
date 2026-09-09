# Codex conversation

## User

add logic of editing, deleting: prompts, Features, Milestones, Bugs, Decisions, Notes, Inspiration, Commands, Env, Sessions, Timeline, Export. also fix the desing, of the app name on the space it get long and goes way out of the card check image 1 
also resume tab i don't find it usefull now it can be usefull if it has Local folder path to copy and under it has the context where it only has the recent queued prompt  
[Image #1]

## Assistant

I’ll update the item-management flows, rework the Resume tab around the local path and latest queued prompt, and fix the long project-name layout shown in the screenshot. I’m using the frontend-design and React/Next performance guidance because this touches both interaction design and component implementation; I’ll first inspect the app structure and the project’s bundled Next.js docs before editing.

## Activity

    $ /bin/zsh -lc "pwd && rg --files -g '"'!*node_modules*'"' | sed -n '1,220p' && printf '\\n--- package ---\\n' && sed -n '1,220p' package.json && printf '\\n--- frontend skill ---\\n' && cat .agents/skills/frontend-design/SKILL.md && printf '\\n--- react skill ---\\n' && cat .agents/skills/vercel-react-best-practices/SKILL.md"
    status: Completed · exit 0
      /Users/medali/Desktop/medali/cadabry
      src/lib/cn.ts
      src/components/universe/project-node.tsx
      src/components/universe/star-field.tsx
      src/components/universe/universe.tsx
      src/components/universe/constellation-lines.tsx
      src/components/shell/project-actions.tsx
      src/components/shell/theme-toggle.tsx
      src/components/shell/app-shell.tsx
      src/components/shell/brand.tsx
      src/components/shell/command-menu.tsx
      src/components/shell/project-nav.tsx
      src/components/shell/sidebar.tsx
      src/components/shell/archived-project-menu.tsx
      src/components/shell/quick-capture.tsx
      src/components/shell/auth-layout.tsx
      src/components/shell/restore-project-button.tsx
      src/components/ui/page.tsx
      src/components/ui/button.tsx
      src/components/ui/badge.tsx
      src/components/ui/filter-bar.tsx
      src/components/ui/menu.tsx
      src/components/ui/dialog.tsx
      src/components/ui/panel.tsx
      src/components/ui/field.tsx
      src/components/ui/markdown.tsx
      src/components/ui/disclosure.tsx
      src/components/ui/progress.tsx
      src/components/ui/copy-button.tsx
      src/server/db.ts
      src/server/env.ts
      src/server/auth/index.ts
      src/server/auth/session.ts
      src/server/auth/types.ts
      src/server/auth/setup.ts
      src/server/auth/errors.ts
      src/server/auth/password.ts
      src/server/auth/middleware/session.ts
      src/server/auth/middleware/setup.ts
      src/server/generated/prisma/enums.ts
      src/server/generated/prisma/commonInputTypes.ts
      src/server/generated/prisma/models.ts
      src/server/generated/prisma/client.ts
      src/server/generated/prisma/browser.ts
      src/server/generated/prisma/models/Skill.ts
      src/server/generated/prisma/models/User.ts
      src/server/generated/prisma/models/Bug.ts
      src/server/generated/prisma/models/EnvironmentVariable.ts
      src/server/generated/prisma/models/FeatureDependency.ts
      src/server/generated/prisma/models/Command.ts
      src/server/generated/prisma/models/Inspiration.ts
      src/server/generated/prisma/models/ProjectBoundary.ts
      src/server/generated/prisma/models/StackPreset.ts
      src/server/generated/prisma/models/Activity.ts
      src/server/generated/prisma/models/SkillProjectType.ts
      src/server/generated/prisma/models/Decision.ts
      src/server/generated/prisma/models/Feature.ts
      src/server/generated/prisma/models/ContextPack.ts
      src/server/generated/prisma/models/CodingSession.ts
      src/server/generated/prisma/models/SkillUseCase.ts
      src/server/generated/prisma/models/BuilderProfile.ts
      src/server/generated/prisma/models/ProjectRule.ts
      src/server/generated/prisma/models/AppInstallation.ts
      src/server/generated/prisma/models/StackPresetTechnology.ts
      src/server/generated/prisma/models/PromptQueueItem.ts
      src/server/generated/prisma/models/ContextPackRule.ts
      src/server/generated/prisma/models/PromptVersion.ts
      src/server/generated/prisma/models/ProjectTechnology.ts
      src/server/generated/prisma/models/InspirationAttachment.ts
      src/server/generated/prisma/models/CodingSessionPrompt.ts
      src/server/generated/prisma/models/CodingSessionFeature.ts
      src/server/generated/prisma/models/Prompt.ts
      src/server/generated/prisma/models/Milestone.ts
      src/server/generated/prisma/models/Idea.ts
      src/server/generated/prisma/models/SkillTechnology.ts
      src/server/generated/prisma/models/Note.ts
      src/server/generated/prisma/models/AuthSession.ts
      src/server/generated/prisma/models/BuilderRule.ts
      src/server/generated/prisma/models/Project.ts
      src/server/generated/prisma/models/Technology.ts
      src/server/generated/prisma/internal/prismaNamespaceBrowser.ts
      src/server/generated/prisma/internal/prismaNamespace.ts
      src/server/generated/prisma/internal/class.ts
      src/features/shared/validation.ts
      src/features/projects/health.test.ts
      src/features/projects/constellation.ts
      src/features/projects/health.ts
      src/features/projects/actions.ts
      src/features/projects/purge.ts
      src/features/projects/display.ts
      src/features/projects/schemas.ts
      src/features/projects/queries.ts
      src/features/projects/slug.ts
      src/features/auth/actions.ts
      src/features/context/compiler.ts
      src/features/context/compiler.test.ts
      src/features/capture/actions.ts
      src/app/not-found.tsx
      src/app/login/page.tsx
      src/app/globals.css
      src/app/loading.tsx
      src/app/error.tsx
      src/app/layout.tsx
      playwright.config.ts
      tsconfig.json
      package.json
      package-lock.json
      w.css
      next-env.d.ts
      src/app/(authenticated)/[slug]/timeline/page.tsx
      src/app/(authenticated)/[slug]/page.tsx
      src/app/(authenticated)/inbox/page.tsx
      src/app/(authenticated)/[slug]/inspirations/page.tsx
      src/app/(authenticated)/settings/page.tsx
      src/app/(authenticated)/[slug]/milestones/page.tsx
      src/app/(authenticated)/[slug]/decisions/page.tsx
      src/app/(authenticated)/[slug]/layout.tsx
      src/app/logout/route.ts
      src/app/(authenticated)/[slug]/commands/page.tsx
      src/app/(authenticated)/[slug]/export/page.tsx
      docs/LIBRARY_DECISIONS.md
      docs/IMPLEMENTATION_PLAN.md
      docs/backend-architecture.md
      src/app/setup/page.tsx
      src/middleware.ts
      next.config.ts
      CLAUDE.md
      eslint.config.mjs
      src/app/(authenticated)/[slug]/export/[doc]/route.ts
      AGENTS.md
      .env.example
      vitest.config.ts
      src/app/(authenticated)/layout.tsx
      docs/design-refs/playstation.DESIGN.md
      docs/design-refs/nintendo-2001.DESIGN.md
      docs/design-refs/raycast.DESIGN.md
      docs/design-refs/linear.app.DESIGN.md
      docs/design-refs/spacex.DESIGN.md
      docs/design-refs/apple.DESIGN.md
      docs/design-system.md
      docs/STATUS.md
      docs/PRODUCT_BRIEF.md
      prisma.config.ts
      src/app/(authenticated)/[slug]/bugs/page.tsx
      src/app/(authenticated)/[slug]/notes/page.tsx
      e2e/smoke.spec.ts
      e2e/a11y.spec.ts
      src/app/(authenticated)/[slug]/queue/page.tsx
      src/app/(authenticated)/starter/page.tsx
      src/app/(authenticated)/starter/output.tsx
      prisma/tsconfig.json
      prisma/seed.ts
      prisma/schema.prisma
      src/app/(authenticated)/[slug]/features/page.tsx
      src/app/(authenticated)/[slug]/sessions/page.tsx
      src/app/(authenticated)/skills/page.tsx
      src/app/(authenticated)/projects/new/page.tsx
      src/app/(authenticated)/page.tsx
      postcss.config.mjs
      skills-lock.json
      tsconfig.tsbuildinfo
      src/app/(authenticated)/packs/page.tsx
      src/app/(authenticated)/archive/page.tsx
      src/app/(authenticated)/[slug]/edit/page.tsx
      prisma/migrations/migration_lock.toml
      src/app/(authenticated)/prompts/page.tsx
      src/app/(authenticated)/[slug]/resume/page.tsx
      src/app/(authenticated)/[slug]/env/page.tsx
      prisma/migrations/20260908000000_initial/migration.sql
      
      --- package ---
      {
        "name": "cadabry",
        "version": "1.0.0",
        "description": "",
        "directories": {
          "doc": "docs"
        },
        "scripts": {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "lint": "eslint .",
          "typecheck": "tsc --noEmit",
          "test": "vitest run",
          "test:e2e": "playwright test",
          "db:generate": "prisma generate",
          "db:migrate": "prisma migrate dev",
          "db:deploy": "prisma migrate deploy",
          "db:seed": "tsx prisma/seed.ts"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "type": "module",
        "dependencies": {
          "@dnd-kit/core": "6.3.1",
          "@dnd-kit/sortable": "10.0.0",
          "@dnd-kit/utilities": "3.2.2",
          "@neondatabase/serverless": "1.1.0",
          "@node-rs/argon2": "2.2.0",
          "@prisma/adapter-neon": "7.10.0",
          "@prisma/client": "7.10.0",
          "@radix-ui/react-accordion": "^1.2.20",
          "@radix-ui/react-checkbox": "^1.3.11",
          "@radix-ui/react-dialog": "1.1.23",
          "@radix-ui/react-dropdown-menu": "^2.1.24",
          "@radix-ui/react-label": "^2.1.15",
          "@radix-ui/react-popover": "^1.1.23",
          "@radix-ui/react-progress": "^1.1.16",
          "@radix-ui/react-scroll-area": "^1.2.18",
          "@radix-ui/react-select": "^2.3.7",
          "@radix-ui/react-separator": "^1.1.15",
          "@radix-ui/react-slot": "^1.3.3",
          "@radix-ui/react-tabs": "^1.1.21",
          "@radix-ui/react-toggle-group": "^1.1.19",
          "@radix-ui/react-tooltip": "^1.2.16",
          "@radix-ui/react-visually-hidden": "^1.2.11",
          "clsx": "2.1.1",
          "cmdk": "1.1.1",
          "dotenv": "17.4.2",
          "lucide-react": "1.42.0",
          "next": "16.3.4",
          "react": "19.2.8",
          "react-dom": "19.2.8",
          "react-markdown": "10.1.0",
          "remark-gfm": "4.0.1",
          "server-only": "0.0.1",
          "sonner": "2.0.8",
          "tailwind-merge": "3.6.0",
          "zod": "4.5.4"
        },
        "private": true,
        "devDependencies": {
          "@axe-core/playwright": "4.13.0",
          "@playwright/test": "1.63.0",
          "@tailwindcss/postcss": "4.3.3",
          "@types/node": "26.5.0",
          "@types/react": "19.2.18",
          "@types/react-dom": "19.2.7",
          "eslint": "9.39.5",
          "eslint-config-next": "16.3.4",
          "prisma": "7.10.0",
          "tailwindcss": "4.3.3",
          "tsx": "4.23.13",
          "typescript": "6.0.3",
          "vitest": "5.0.0"
        },
        "overrides": {
          "deepmerge-ts": "8.0.2",
          "mysql2": "3.24.4"
        }
      }
      
      --- frontend skill ---
      ---
      name: frontend-design
      description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
      license: Complete terms in LICENSE.txt
      ---
      
      # Frontend Design
      
      Approach this as the design lead at a design studio known for giving every client a distinct visual identity that is not mistaken for anyone else's. This client has already rejected proposals that felt cliché or templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take aesthetic risk if justified.
      
      ## Ground your designs in the subject matter
      
      If the brief does not identify what the product or subject matter is, identify it yourself before designing, and confirm with the client. You can come up with one concrete subject, the design's audience, and the design's primary job, as a proposal. If there's any information in your memory about the client's preferences or context about what they're building, use that as a hint. The subject's industry, subject matter, materials, and vernacular are where distinctive visual choices come from — a design for a toy for girls aged 8–11 will be very aesthetically different from a dashboard for financial analysts. Build with the brief's real content and subject matter throughout.
      
      ## Design principles
      
      For web designs, the hero is the first thing viewers will see. Open with the most characteristic thing in the subject's world, in the form that is most appropriate: a headline, an image, an animation, a live demo, an interactive moment, or other treatments. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the default treatment, so only use it if that's truly the best option.
      
      Typography carries the personality of the page. You don't need a different typeface for display or headline text and body content: use one family or two, and if two, make them clearly distinct.
      
      Choose your typefaces deliberately, not the default families you would reach for on any other project, and set a clear type scale following the default guidance of The Elements of Typographic Style with intentional weights, widths, and spacing. When type is used as a headline or visual element, use the type treatment itself as an active part of the design, not a neutral delivery vehicle for the content.
      
      Default to line lengths of less than 80 characters. Serif typefaces can have slightly longer line lengths; give serif body text slightly more line-height than a sans-serif.
      
      Avoid these default typographic treatments; they are the commonest tells of a generated page:
      - Accenting just a single word or phrase in a headline, like putting one word in italic/bold or a different color.
      - Using all caps for labels.
      - Adding unnecessary typographic labels above content.
      
      Visual structure is information. Structural devices like outlines, borders, numbering, eyebrows, dividers, labels, etc., encode useful information about the content rather than decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence — like a stepped process or a timeline. Before adding numbered markers, check the content really is a sequence.
      
      Use non-user-triggered motion sparingly and deliberately, only to draw attention. A single orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects; fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed.
      
      Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy and placeholder content. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.
      
      ## Process: plan, review against the brief, build, critique
      
      For calibration, AI-generated design right now clusters around some traits:
      1. a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta or warm-clay accent (often near #D97757 — Anthropic's own Claude-interaction accent, so on a user's brief it reads as a tell);
      2. a near-black background with a single bright acid-green or vermilion accent;
      3. a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns;
      4. the SaaS-card kit: content chopped into identical rounded cards, one border-radius on everything regardless of hierarchy, the same soft grey shadow (rgba(0,0,0,.1)) under each, and gradient washes as decoration;
      5. template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C'); labels built as 'WORD — fragment' with a spaced em dash; tinted near-black (#0B0B0B, #111) standing in for black; a monospace face for small data labels; a '→' appended to link and button text.
      
      All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject. Where the brief pins down a visual direction, follow it exactly — the brief's own words always win, including when it asks for one of these looks. Where it leaves an axis free, don't spend that freedom on one of these defaults. As with a hired human designer, there's often a careful balance between doing what you're good at and taking each project as a chance to experiment and learn.
      
      Work in two passes. First, brainstorm a short design plan based on the client's design brief: create a compact token system with color, type, layout, and principles.
      - Color: describe the core base palette as 4–6 named hex values.
      - Type: the typefaces and their roles.
      - Layout: a layout concept, using one-sentence prose descriptions and ASCII wireframes to ideate and compare. Include alignment guidance; should the content be left aligned, center aligned, justified?
      - Principles: the high-level guidance for what makes this page unique.
      
      Then review that plan against the brief before building: if any part of it reads like the generic default you would produce for any similar page (work through a similar prompt to see if you arrive somewhere similar) rather than a choice made for this specific brief — revise that part, say what you changed and why. Only after you've confirmed the relative uniqueness of your design plan should you start to write the code, following the revised plan.
      
      When writing the code, be careful of structuring your CSS selector specificities. It's easy to generate CSS classes that cancel each other out (especially with a type-based selector like .section and an element-based selector like .cta). This can happen often with padding/margin between sections.
      
      ## Restraint and self-critique
      
      Spend your boldness in one place. Let one element be the memorable thing, keep everything around it quiet and disciplined, and cut any decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected, visually accessible, harmonious color palettes. Critique your own work as you build, taking screenshots to review if your environment supports it — a picture is worth 1000 tokens. Consider Chanel's advice: before leaving the house, take a look in the mirror and remove one accessory. Human creatives have memory and always try to do something new, so if you have a space to quickly jot down notes about what you've tried, it can help you in future passes.
      
      ## More on writing in design
      
      Words appear in a design for one reason: to make it easier to understand and use. They are design content, not decoration. Bring the same intentionality and minimalism to copywriting that you would bring to spacing and color. Before writing anything, ask what the design needs to say, and how it can best be said to help the person navigate the experience.
      
      Write from the end user's perspective. Name things by what users will understand in simple language, not by how the system is built. A user manages notifications, not webhook config. Describe what something is or does in plain terms rather than selling it. Being specific and legible to new users is always better than being clever.
      
      Use active voice as default. A CTA says exactly what happens when it is used: "Save changes," not "Submit." An action keeps the same name through the whole flow, so the button that says "Publish" produces a toast that says "Published." The vocabulary of an interface is the signposting for someone navigating the product. Cohesion and consistency are how people learn their way around.
      
      Treat failure and emptiness as moments for direction, not mood. Explain what went wrong and how to fix it, in the interface's voice rather than a person's. Errors don't apologize, and they are never vague about what happened. An empty screen is an invitation to act.
      
      Keep the tone conversational: plain verbs, sentence case, no filler, with tone matched to the brand and the audience. Let each written element do exactly one job.
      
      --- react skill ---
      ---
      name: vercel-react-best-practices
      description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
      license: MIT
      metadata:
        author: vercel
        version: "1.0.0"
      ---
      
      # Vercel React Best Practices
      
      Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 70 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.
      
      ## When to Apply
      
      Reference these guidelines when:
      - Writing new React components or Next.js pages
      - Implementing data fetching (client or server-side)
      - Reviewing code for performance issues
      - Refactoring existing React/Next.js code
      - Optimizing bundle size or load times
      
      ## Rule Categories by Priority
      
      | Priority | Category | Impact | Prefix |
      |----------|----------|--------|--------|
      | 1 | Eliminating Waterfalls | CRITICAL | `async-` |
      | 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
      | 3 | Server-Side Performance | HIGH | `server-` |
      | 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
      | 5 | Re-render Optimization | MEDIUM | `rerender-` |
      | 6 | Rendering Performance | MEDIUM | `rendering-` |
      | 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
      | 8 | Advanced Patterns | LOW | `advanced-` |
      
      ## Quick Reference
      
      ### 1. Eliminating Waterfalls (CRITICAL)
      
      - `async-cheap-condition-before-await` - Check cheap sync conditions before awaiting flags or remote values
      - `async-defer-await` - Move await into branches where actually used
      - `async-parallel` - Use Promise.all() for independent operations
      - `async-dependencies` - Use better-all for partial dependencies
      - `async-api-routes` - Start promises early, await late in API routes
      - `async-suspense-boundaries` - Use Suspense to stream content
      
      ### 2. Bundle Size Optimization (CRITICAL)
      
      - `bundle-barrel-imports` - Import directly, avoid barrel files
      - `bundle-analyzable-paths` - Prefer statically analyzable import and file-system paths to avoid broad bundles and traces
      - `bundle-dynamic-imports` - Use next/dynamic for heavy components
      - `bundle-defer-third-party` - Load analytics/logging after hydration
      - `bundle-conditional` - Load modules only when feature is activated
      - `bundle-preload` - Preload on hover/focus for perceived speed
      
      ### 3. Server-Side Performance (HIGH)
      
      - `server-auth-actions` - Authenticate server actions like API routes
      - `server-cache-react` - Use React.cache() for per-request deduplication
      - `server-cache-lru` - Use LRU cache for cross-request caching
      - `server-dedup-props` - Avoid duplicate serialization in RSC props
      - `server-hoist-static-io` - Hoist static I/O (fonts, logos) to module level
      - `server-no-shared-module-state` - Avoid module-level mutable request state in RSC/SSR
      - `server-serialization` - Minimize data passed to client components
      - `server-parallel-fetching` - Restructure components to parallelize fetches
      - `server-parallel-nested-fetching` - Chain nested fetches per item in Promise.all
      - `server-after-nonblocking` - Use after() for non-blocking operations
      
      ### 4. Client-Side Data Fetching (MEDIUM-HIGH)
      
      - `client-swr-dedup` - Use SWR for automatic request deduplication
      - `client-event-listeners` - Deduplicate global event listeners
      - `client-passive-event-listeners` - Use passive listeners for scroll
      - `client-localstorage-schema` - Version and minimize localStorage data
      
      ### 5. Re-render Optimization (MEDIUM)
      
      - `rerender-defer-reads` - Don't subscribe to state only used in callbacks
      - `rerender-memo` - Extract expensive work into memoized components
      - `rerender-memo-with-default-value` - Hoist default non-primitive props
      - `rerender-dependencies` - Use primitive dependencies in effects
      - `rerender-derived-state` - Subscribe to derived booleans, not raw values
      - `rerender-derived-state-no-effect` - Derive state during render, not effects
      - `rerender-functional-setstate` - Use functional setState for stable callbacks
      - `rerender-lazy-state-init` - Pass function to useState for expensive values
      - `rerender-simple-expression-in-memo` - Avoid memo for simple primitives
      - `rerender-split-combined-hooks` - Split hooks with independent dependencies
      - `rerender-move-effect-to-event` - Put interaction logic in event handlers
      - `rerender-transitions` - Use startTransition for non-urgent updates
      - `rerender-use-deferred-value` - Defer expensive renders to keep input responsive
      - `rerender-use-ref-transient-values` - Use refs for transient frequent values
      - `rerender-no-inline-components` - Don't define components inside components
      
      ### 6. Rendering Performance (MEDIUM)
      
      - `rendering-animate-svg-wrapper` - Animate div wrapper, not SVG element
      - `rendering-content-visibility` - Use content-visibility for long lists
      - `rendering-hoist-jsx` - Extract static JSX outside components
      - `rendering-svg-precision` - Reduce SVG coordinate precision
      - `rendering-hydration-no-flicker` - Use inline script for client-only data
      - `rendering-hydration-suppress-warning` - Suppress expected mismatches
      - `rendering-activity` - Use Activity component for show/hide
      - `rendering-conditional-render` - Use ternary, not && for conditionals
      - `rendering-usetransition-loading` - Prefer useTransition for loading state
      - `rendering-resource-hints` - Use React DOM resource hints for preloading
      - `rendering-script-defer-async` - Use defer or async on script tags
      
      ### 7. JavaScript Performance (LOW-MEDIUM)
      
      - `js-batch-dom-css` - Group CSS changes via classes or cssText
      - `js-index-maps` - Build Map for repeated lookups
      - `js-cache-property-access` - Cache object properties in loops
      - `js-cache-function-results` - Cache function results in module-level Map
      - `js-cache-storage` - Cache localStorage/sessionStorage reads
      - `js-combine-iterations` - Combine multiple filter/map into one loop
      - `js-length-check-first` - Check array length before expensive comparison
      - `js-early-exit` - Return early from functions
      - `js-hoist-regexp` - Hoist RegExp creation outside loops
      - `js-min-max-loop` - Use loop for min/max instead of sort
      - `js-set-map-lookups` - Use Set/Map for O(1) lookups
      - `js-tosorted-immutable` - Use toSorted() for immutability
      - `js-flatmap-filter` - Use flatMap to map and filter in one pass
      - `js-request-idle-callback` - Defer non-critical work to browser idle time
      
      ### 8. Advanced Patterns (LOW)
      
      - `advanced-effect-event-deps` - Don't put `useEffectEvent` results in effect deps
      - `advanced-event-handler-refs` - Store event handlers in refs
      - `advanced-init-once` - Initialize app once per app load
      - `advanced-use-latest` - useLatest for stable callback refs
      
      ## How to Use
      
      Read individual rule files for detailed explanations and code examples:
      
      ```
      rules/async-parallel.md
      rules/bundle-barrel-imports.md
      ```
      
      Each rule file contains:
      - Brief explanation of why it matters
      - Incorrect code example with explanation
      - Correct code example with explanation
      - Additional context and references
      
      ## Full Compiled Document
      
      For the complete guide with all rules expanded: `AGENTS.md`

## Activity

    $ /bin/zsh -lc "git status --short && printf '\\n--- next docs candidates ---\\n' && rg --files node_modules/next/dist/docs | rg '(forms|server-actions|mutating-data|redirect|cache|route)' | sed -n '1,100p' && printf '\\n--- schema ---\\n' && sed -n '1,300p' prisma/schema.prisma && printf '\\n--- actions ---\\n' && sed -n '1,360p' src/features/projects/actions.ts && printf '\\n--- queries ---\\n' && sed -n '1,360p' src/features/projects/queries.ts"
    status: Completed · exit 0
      
      --- next docs candidates ---
      node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md
      node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache-private.md
      node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache-remote.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/parallel-routes.md
      node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md
      node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md
      node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheTag.md
      node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheLife.md
      node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unstable_cache.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/runtime.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/instant.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/preferredRegion.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/prefetch.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/maxDuration.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/intercepting-routes.md
      node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration-cache-components.md
      node_modules/next/dist/docs/01-app/02-guides/redirecting.md
      node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md
      node_modules/next/dist/docs/01-app/02-guides/forms.md
      node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md
      node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
      node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md
      node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md
      node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md
      node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md
      node_modules/next/dist/docs/01-app/02-guides/server-actions.md
      node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md
      node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md
      node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheMaxMemorySize.md
      node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheHandlers.md
      node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheLife.md
      node_modules/next/dist/docs/01-app/02-guides/migrating/app-router-migration.md
      node_modules/next/dist/docs/02-pages/03-building-your-application/01-routing/02-dynamic-routes.md
      node_modules/next/dist/docs/02-pages/03-building-your-application/01-routing/07-api-routes.md
      node_modules/next/dist/docs/02-pages/02-guides/forms.md
      node_modules/next/dist/docs/02-pages/02-guides/redirecting.md
      node_modules/next/dist/docs/02-pages/02-guides/migrating/app-router-migration.md
      node_modules/next/dist/docs/02-pages/04-api-reference/04-config/01-next-config-js/redirects.md
      node_modules/next/dist/docs/02-pages/04-api-reference/03-functions/use-router.md
      
      --- schema ---
      generator client {
        provider = "prisma-client"
        output   = "../src/server/generated/prisma"
      }
      
      datasource db {
        provider = "postgresql"
      }
      
      enum UserRole {
        OWNER
        USER
      }
      
      enum ProjectStatus {
        IDEA
        PLANNING
        BUILDING
        BLOCKED
        PAUSED
        SHIPPED
        ARCHIVED
      }
      
      enum BoundaryKind {
        GOAL
        NON_GOAL
        ASSUMPTION
        CONSTRAINT
        FUTURE_IDEA
      }
      
      enum WorkStatus {
        PLANNED
        IN_PROGRESS
        BLOCKED
        DONE
        CANCELLED
      }
      
      enum PromptStatus {
        DRAFT
        READY
        ARCHIVED
      }
      
      enum QueueStatus {
        QUEUED
        SENT
        COMPLETED
        FAILED
        CANCELLED
      }
      
      enum MemoryStatus {
        INBOX
        PLANNED
        ACTIVE
        RESOLVED
        ARCHIVED
      }
      
      enum DecisionStatus {
        PROPOSED
        ACCEPTED
        SUPERSEDED
        REJECTED
      }
      
      enum SessionStatus {
        ACTIVE
        COMPLETED
        ABANDONED
      }
      
      enum InspirationKind {
        LINK
        IMAGE
        SCREENSHOT
        VIDEO
        TEXT
        OTHER
      }
      
      enum AttachmentStatus {
        PENDING
        READY
        FAILED
        DELETED
      }
      
      model User {
        id             String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        email          String
        displayName    String            @map("display_name")
        passwordHash   String            @map("password_hash")
        role           UserRole          @default(USER)
        disabledAt     DateTime?         @map("disabled_at") @db.Timestamptz
        createdAt      DateTime          @default(now()) @map("created_at") @db.Timestamptz
        updatedAt      DateTime          @updatedAt @map("updated_at") @db.Timestamptz
        installations  AppInstallation[]
        authSessions   AuthSession[]
        projects       Project[]         @relation("ProjectOwner")
        activities     Activity[]        @relation("ActivityActor")
        promptVersions PromptVersion[]   @relation("PromptVersionCreator")
      
        @@map("users")
      }
      
      model AppInstallation {
        key              String    @id @default("primary")
        ownerUserId      String?   @unique @map("owner_user_id") @db.Uuid
        setupCompletedAt DateTime? @map("setup_completed_at") @db.Timestamptz
        createdAt        DateTime  @default(now()) @map("created_at") @db.Timestamptz
        owner            User?     @relation(fields: [ownerUserId], references: [id], onDelete: Restrict)
      
        @@map("app_installation")
      }
      
      model AuthSession {
        id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        userId        String    @map("user_id") @db.Uuid
        tokenDigest   String    @unique @map("token_digest")
        expiresAt     DateTime  @map("expires_at") @db.Timestamptz
        lastSeenAt    DateTime  @default(now()) @map("last_seen_at") @db.Timestamptz
        revokedAt     DateTime? @map("revoked_at") @db.Timestamptz
        userAgentHash String?   @map("user_agent_hash")
        ipHash        String?   @map("ip_hash")
        createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
        user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
      
        @@index([userId, expiresAt])
        @@map("auth_sessions")
      }
      
      model Project {
        id                   String                @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId              String                @map("owner_id") @db.Uuid
        name                 String
        slug                 String
        oneLineDescription   String?               @map("one_line_description")
        description          String?
        icon                 String?
        color                String?
        projectType          String?               @map("project_type")
        repositoryUrl        String?               @map("repository_url")
        productionUrl        String?               @map("production_url")
        stagingUrl           String?               @map("staging_url")
        localFolderPath      String?               @map("local_folder_path")
        productStatement     String?               @map("product_statement")
        problem              String?
        targetUser           String?               @map("target_user")
        desiredOutcome       String?               @map("desired_outcome")
        valueProposition     String?               @map("value_proposition")
        whatWorks            String?               @map("what_works")
        partiallyBuilt       String?               @map("partially_built")
        whatIsBroken         String?               @map("what_is_broken")
        currentBlocker       String?               @map("current_blocker")
        currentTask          String?               @map("current_task")
        nextTask             String?               @map("next_task")
        status               ProjectStatus         @default(IDEA)
        importance           Int                   @default(0)
        progress             Int                   @default(0)
        healthOverride       String?               @map("health_override")
        lastActivityAt       DateTime?             @map("last_activity_at") @db.Timestamptz
        archivedAt           DateTime?             @map("archived_at") @db.Timestamptz
        createdAt            DateTime              @default(now()) @map("created_at") @db.Timestamptz
        updatedAt            DateTime              @updatedAt @map("updated_at") @db.Timestamptz
        owner                User                  @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Restrict)
        technologies         ProjectTechnology[]
        rules                ProjectRule[]
        boundaries           ProjectBoundary[]
        milestones           Milestone[]
        features             Feature[]
        prompts              Prompt[]
        queueItems           PromptQueueItem[]
        packs                ContextPack[]
        ideas                Idea[]
        notes                Note[]
        bugs                 Bug[]
        decisions            Decision[]            @relation("ProjectDecisions")
        codingSessions       CodingSession[]
        inspirations         Inspiration[]
        commands             Command[]
        environmentVariables EnvironmentVariable[]
        activities           Activity[]
      
        @@unique([ownerId, id])
        @@unique([ownerId, slug])
        @@index([ownerId, status, archivedAt])
        @@map("projects")
      }
      
      model Technology {
        id           String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId      String                  @map("owner_id") @db.Uuid
        name         String
        category     String?
        createdAt    DateTime                @default(now()) @map("created_at") @db.Timestamptz
        projectLinks ProjectTechnology[]
        presetLinks  StackPresetTechnology[]
        skillLinks   SkillTechnology[]
      
        @@unique([ownerId, id])
        @@index([ownerId])
        @@map("technologies")
      }
      
      model ProjectTechnology {
        ownerId      String     @map("owner_id") @db.Uuid
        projectId    String     @map("project_id") @db.Uuid
        technologyId String     @map("technology_id") @db.Uuid
        category     String
        version      String?
        note         String?
        sortOrder    Int        @default(0) @map("sort_order")
        project      Project    @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        technology   Technology @relation(fields: [ownerId, technologyId], references: [ownerId, id], onDelete: Restrict)
      
        @@id([projectId, technologyId, category])
        @@index([ownerId, technologyId])
        @@map("project_technologies")
      }
      
      model ProjectRule {
        id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId   String   @map("owner_id") @db.Uuid
        projectId String   @map("project_id") @db.Uuid
        category  String
        content   String
        priority  Int      @default(0)
        enabled   Boolean  @default(true)
        createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
        updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz
        project   Project  @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
      
        @@index([ownerId, projectId, enabled])
        @@map("project_rules")
      }
      
      model ProjectBoundary {
        id        String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId   String       @map("owner_id") @db.Uuid
        projectId String       @map("project_id") @db.Uuid
        kind      BoundaryKind
        content   String
        sortOrder Int          @default(0) @map("sort_order")
        project   Project      @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
      
        @@index([ownerId, projectId, kind, sortOrder])
        @@map("project_boundaries")
      }
      
      model Milestone {
        id          String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId     String            @map("owner_id") @db.Uuid
        projectId   String            @map("project_id") @db.Uuid
        name        String
        description String?
        status      WorkStatus        @default(PLANNED)
        targetDate  DateTime?         @map("target_date") @db.Date
        sortOrder   Int               @default(0) @map("sort_order")
        createdAt   DateTime          @default(now()) @map("created_at") @db.Timestamptz
        updatedAt   DateTime          @updatedAt @map("updated_at") @db.Timestamptz
        project     Project           @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        features    Feature[]
        queueItems  PromptQueueItem[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status])
        @@map("milestones")
      }
      
      model Feature {
        id                 String                 @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId            String                 @map("owner_id") @db.Uuid
        projectId          String                 @map("project_id") @db.Uuid
        milestoneId        String?                @map("milestone_id") @db.Uuid
        title              String
        body               String?
        reason             String?
        acceptanceCriteria String?                @map("acceptance_criteria")
        status             WorkStatus             @default(PLANNED)
        priority           Int                    @default(0)
        difficulty         Int?
        impact             Int?
        sortOrder          Int                    @default(0) @map("sort_order")
        createdAt          DateTime               @default(now()) @map("created_at") @db.Timestamptz
        updatedAt          DateTime               @updatedAt @map("updated_at") @db.Timestamptz
        project            Project                @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        milestone          Milestone?             @relation(fields: [ownerId, milestoneId], references: [ownerId, id], onDelete: Restrict)
        dependencies       FeatureDependency[]    @relation("FeatureDepends")
        dependents         FeatureDependency[]    @relation("FeatureRequiredBy")
        prompts            Prompt[]
        queueItems         PromptQueueItem[]
        bugs               Bug[]
        codingSessions     CodingSessionFeature[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status, sortOrder])
      
      --- actions ---
      "use server";
      
      import { revalidatePath } from "next/cache";
      import { redirect } from "next/navigation";
      import { db } from "@/server/db";
      import { requireActor } from "./queries";
      import { uniqueSlug } from "./slug";
      import { purgeProject } from "./purge";
      import { projectStatuses } from "./schemas";
      
      export type ProjectActionResult = { ok: boolean; message: string };
      
      /** Owner-scoped project lookup. Every action starts here. */
      async function ownedProject(slug: string) {
        const actor = await requireActor();
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          select: { id: true, name: true, slug: true, status: true, archivedAt: true },
        });
        return { actor, project };
      }
      
      async function logActivity(input: {
        ownerId: string;
        actorUserId: string;
        projectId?: string | null;
        type: string;
        subjectId?: string | null;
        summary: string;
      }) {
        await db.activity.create({
          data: {
            ownerId: input.ownerId,
            actorUserId: input.actorUserId,
            projectId: input.projectId ?? null,
            type: input.type,
            subjectKind: "PROJECT",
            subjectId: input.subjectId ?? null,
            summary: input.summary,
          },
        });
      }
      
      /* ------------------------------------------------------------------ status - */
      
      export async function setProjectStatus(formData: FormData): Promise<ProjectActionResult> {
        const slug = String(formData.get("slug") ?? "");
        const status = String(formData.get("status") ?? "");
      
        if (!projectStatuses.includes(status as (typeof projectStatuses)[number])) {
          return { ok: false, message: "Unknown status." };
        }
      
        const { actor, project } = await ownedProject(slug);
        if (!project) return { ok: false, message: "Project not found." };
        if (project.status === status) return { ok: true, message: "Already there." };
      
        await db.project.update({
          where: { id: project.id },
          data: { status: status as (typeof projectStatuses)[number], lastActivityAt: new Date() },
        });
      
        await logActivity({
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project.id,
          subjectId: project.id,
          type: "PROJECT_STATUS_CHANGED",
          summary: `Moved "${project.name}" to ${status.toLowerCase()}`,
        });
      
        revalidatePath("/", "layout");
        return { ok: true, message: `Status set to ${status.toLowerCase()}.` };
      }
      
      /* ----------------------------------------------------------------- archive - */
      
      /**
       * Archiving is the reversible half of "get this out of my way": the project
       * leaves the universe and the sidebar but keeps every record. Deleting is the
       * other half, and it is not reversible.
       */
      export async function archiveProject(formData: FormData): Promise<ProjectActionResult> {
        const slug = String(formData.get("slug") ?? "");
        const { actor, project } = await ownedProject(slug);
        if (!project) return { ok: false, message: "Project not found." };
      
        await db.project.update({
          where: { id: project.id },
          data: { archivedAt: new Date(), status: "ARCHIVED" },
        });
      
        await logActivity({
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project.id,
          subjectId: project.id,
          type: "PROJECT_ARCHIVED",
          summary: `Archived "${project.name}"`,
        });
      
        revalidatePath("/", "layout");
        return { ok: true, message: `"${project.name}" archived.` };
      }
      
      export async function restoreProject(formData: FormData): Promise<ProjectActionResult> {
        const slug = String(formData.get("slug") ?? "");
        const { actor, project } = await ownedProject(slug);
        if (!project) return { ok: false, message: "Project not found." };
      
        await db.project.update({
          where: { id: project.id },
          data: { archivedAt: null, status: "PAUSED", lastActivityAt: new Date() },
        });
      
        await logActivity({
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project.id,
          subjectId: project.id,
          type: "PROJECT_RESTORED",
          summary: `Restored "${project.name}"`,
        });
      
        revalidatePath("/", "layout");
        return { ok: true, message: `"${project.name}" is back in orbit.` };
      }
      
      /* --------------------------------------------------------------- duplicate - */
      
      /**
       * Duplicates the *brain* — identity, positioning, stack, boundaries, rules,
       * commands and env keys — but not the history. A copy is a fresh start with a
       * proven shape, so decisions, bugs, sessions and activity stay behind.
       */
      export async function duplicateProject(formData: FormData): Promise<ProjectActionResult> {
        const slug = String(formData.get("slug") ?? "");
        const actor = await requireActor();
      
        const source = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            technologies: true,
            rules: true,
            boundaries: true,
            commands: true,
            environmentVariables: true,
          },
        });
        if (!source) return { ok: false, message: "Project not found." };
      
        const name = `${source.name} copy`;
        const newSlug = await uniqueSlug(actor.userId, name);
      
        const created = await db.project.create({
          data: {
            ownerId: actor.userId,
            name,
            slug: newSlug,
            oneLineDescription: source.oneLineDescription,
            description: source.description,
            icon: source.icon,
            color: source.color,
            projectType: source.projectType,
            repositoryUrl: source.repositoryUrl,
            stagingUrl: source.stagingUrl,
            localFolderPath: source.localFolderPath,
            productStatement: source.productStatement,
            problem: source.problem,
            targetUser: source.targetUser,
            desiredOutcome: source.desiredOutcome,
            valueProposition: source.valueProposition,
            status: "IDEA",
            importance: source.importance,
            progress: 0,
            lastActivityAt: new Date(),
            technologies: {
              // ownerId is inherited from the parent project relation — passing it
              // here is a Prisma validation error.
              create: source.technologies.map((row) => ({
                technologyId: row.technologyId,
                category: row.category,
                version: row.version,
                note: row.note,
                sortOrder: row.sortOrder,
              })),
            },
            rules: {
              create: source.rules.map((row) => ({
                category: row.category,
                content: row.content,
                priority: row.priority,
                enabled: row.enabled,
              })),
            },
            boundaries: {
              create: source.boundaries.map((row) => ({
                kind: row.kind,
                content: row.content,
                sortOrder: row.sortOrder,
              })),
            },
            commands: {
              create: source.commands.map((row) => ({
                name: row.name,
                commandText: row.commandText,
                description: row.description,
                category: row.category,
                sortOrder: row.sortOrder,
              })),
            },
            environmentVariables: {
              create: source.environmentVariables.map((row) => ({
                name: row.name,
                description: row.description,
                required: row.required,
                environment: row.environment,
                acquisitionNote: row.acquisitionNote,
                note: row.note,
                configured: false,
              })),
            },
          },
          select: { id: true, slug: true },
        });
      
        await logActivity({
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: created.id,
          subjectId: created.id,
          type: "PROJECT_DUPLICATED",
          summary: `Duplicated "${source.name}" into "${name}"`,
        });
      
        revalidatePath("/", "layout");
        redirect(`/${created.slug}`);
      }
      
      /* ------------------------------------------------------------------ delete - */
      
      export async function deleteProject(formData: FormData): Promise<ProjectActionResult> {
        const slug = String(formData.get("slug") ?? "");
        const confirmation = String(formData.get("confirm") ?? "").trim();
      
        const { actor, project } = await ownedProject(slug);
        if (!project) return { ok: false, message: "Project not found." };
      
        // Typing the name is the only guard between here and permanent loss.
        if (confirmation.toLowerCase() !== project.name.trim().toLowerCase()) {
          return { ok: false, message: `Type “${project.name}” exactly to confirm.` };
        }
      
        try {
          await purgeProject(actor.userId, project.id);
        } catch {
          return {
            ok: false,
            message:
              "Something outside this project still references it — usually a prompt queued from another project. Archive it instead, or clear that reference first.",
          };
        }
      
        revalidatePath("/", "layout");
        return { ok: true, message: `"${project.name}" deleted.` };
      }
      
      --- queries ---
      import "server-only";
      
      import { cache } from "react";
      import { cookies } from "next/headers";
      import { notFound, redirect } from "next/navigation";
      import { db } from "@/server/db";
      import { SESSION_COOKIE_NAME, verifySessionToken } from "@/server/auth/session";
      
      /**
       * Resolve the signed-in owner, or bounce to /login.
       *
       * Wrapped in React's cache so the layout and the page it wraps verify the
       * session once per request instead of once per component.
       */
      export const requireActor = cache(async () => {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
        if (!token) redirect("/login");
      
        const actor = await verifySessionToken(token);
        if (!actor) redirect("/login");
      
        return actor;
      });
      
      /**
       * The project header every screen under /[slug] needs: identity, state, and
       * the counts the section nav shows as badges. Cached for the same reason.
       */
      export const getProjectSummary = cache(async (ownerId: string, slug: string) => {
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId, slug } },
          select: {
            id: true,
            name: true,
            slug: true,
            oneLineDescription: true,
            status: true,
            progress: true,
            color: true,
            icon: true,
            currentTask: true,
            currentBlocker: true,
            lastActivityAt: true,
            archivedAt: true,
            _count: {
              select: {
                features: true,
                queueItems: { where: { status: "QUEUED" } },
                bugs: { where: { status: { in: ["ACTIVE", "INBOX"] } } },
                decisions: true,
                milestones: true,
                notes: true,
                inspirations: true,
                commands: true,
                environmentVariables: true,
                codingSessions: true,
              },
            },
          },
        });
      
        return project;
      });
      
      /** Project summary or a 404 — the guard every /[slug] screen starts with. */
      export async function requireProject(slug: string) {
        const actor = await requireActor();
        const project = await getProjectSummary(actor.userId, slug);
        if (!project) notFound();
        return { actor, project };
      }
      
      export type ProjectSummary = NonNullable<Awaited<ReturnType<typeof getProjectSummary>>>;

## Activity

    $ /bin/zsh -lc "printf '%s\\n' '--- Next mutation guide ---' && cat node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md && printf '%s\\n' '--- pages ---' && for f in src/app/\\(authenticated\\)/prompts/page.tsx src/app/\\(authenticated\\)/\\[slug\\]/{features,milestones,bugs,decisions,notes,inspirations,commands,env,sessions,timeline,export,resume}/page.tsx; do printf '\\n### %s\\n' \""'$f"; sed -n '"'1,320p' \""'$f"; done'
    status: Completed · exit 0
      --- Next mutation guide ---
      ---
      title: Mutating Data
      description: Learn how to mutate data using Server Functions and Server Actions in Next.js.
      related:
        title: Next steps
        description: Learn more about Server Actions and the APIs mentioned in this page.
        links:
          - app/guides/server-actions
          - app/api-reference/functions/revalidatePath
          - app/api-reference/functions/revalidateTag
          - app/api-reference/functions/redirect
      ---
      
      You can mutate data in Next.js using [React Server Functions](https://react.dev/reference/rsc/server-functions). This page will go through how you can [create](#creating-server-functions) and [invoke](#invoking-server-functions) Server Functions. For Next.js-specific behaviors (single-roundtrip response, sequential dispatch, security, deployment), see [Server Actions and Mutations](/docs/app/guides/server-actions).
      
      ## What are Server Functions?
      
      A **Server Function** is an asynchronous function that runs on the server. You can call them from the client through a network request, which is why they must be asynchronous.
      
      In an `action` or mutation context, they are also called **Server Actions**.
      
      By convention, a Server Action is an async function used with [`startTransition`](https://react.dev/reference/react/startTransition). This happens automatically when the function is:
      
      - Passed to a `<form>` using the `action` prop.
      - Passed to a `<button>` using the `formAction` prop.
      
      When an action is invoked, Next.js can return both the updated UI and new data in a single server roundtrip.
      
      Behind the scenes, actions use the `POST` method, and only this HTTP method can invoke them.
      
      > [!WARNING]
      > Server Functions are reachable via direct POST requests, not just through your application's UI. Always verify authentication and authorization inside every Server Function. See the [Data Security guide](/docs/app/guides/data-security#authentication-and-authorization) for recommended patterns.
      
      > **Good to know:** A Server Action is a Server Function used in a specific way (for handling form submissions and mutations). Server Function is the broader term.
      
      ## Creating Server Functions
      
      A Server Function can be defined by using the [`use server`](https://react.dev/reference/rsc/use-server) directive. You can place the directive at the top of an **asynchronous** function to mark the function as a Server Function, or at the top of a separate file to mark all exports of that file.
      
      ```ts filename="app/lib/actions.ts" switcher
      import { auth } from '@/lib/auth'
      
      export async function createPost(formData: FormData) {
        'use server'
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
      
        const title = formData.get('title')
        const content = formData.get('content')
      
        // Mutate data
        // Revalidate cache
      }
      
      export async function deletePost(formData: FormData) {
        'use server'
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
      
        const id = formData.get('id')
      
        // Verify the user owns this resource before deleting
        // Mutate data
        // Revalidate cache
      }
      ```
      
      ```js filename="app/lib/actions.js" switcher
      import { auth } from '@/lib/auth'
      
      export async function createPost(formData) {
        'use server'
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
      
        const title = formData.get('title')
        const content = formData.get('content')
      
        // Mutate data
        // Revalidate cache
      }
      
      export async function deletePost(formData) {
        'use server'
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
      
        const id = formData.get('id')
      
        // Verify the user owns this resource before deleting
        // Mutate data
        // Revalidate cache
      }
      ```
      
      ### Server Components
      
      Server Functions can be inlined in Server Components by adding the `"use server"` directive to the top of the function body:
      
      ```tsx filename="app/page.tsx" switcher
      export default function Page() {
        // Server Action
        async function createPost(formData: FormData) {
          'use server'
          // ...
        }
      
        return <></>
      }
      ```
      
      ```jsx filename="app/page.js" switcher
      export default function Page() {
        // Server Action
        async function createPost(formData) {
          'use server'
          // ...
        }
      
        return <></>
      }
      ```
      
      > **Good to know:** Server Components support progressive enhancement by default, meaning forms that call Server Actions will be submitted even if JavaScript hasn't loaded yet or is disabled.
      
      ### Client Components
      
      It's not possible to define Server Functions in Client Components. However, you can invoke them in Client Components by importing them from a file that has the `"use server"` directive at the top of it:
      
      ```ts filename="app/actions.ts" switcher
      'use server'
      
      export async function createPost() {}
      ```
      
      ```js filename="app/actions.js" switcher
      'use server'
      
      export async function createPost() {}
      ```
      
      ```tsx filename="app/ui/button.tsx" switcher
      'use client'
      
      import { createPost } from '@/app/actions'
      
      export function Button() {
        return <button formAction={createPost}>Create</button>
      }
      ```
      
      ```jsx filename="app/ui/button.js" switcher
      'use client'
      
      import { createPost } from '@/app/actions'
      
      export function Button() {
        return <button formAction={createPost}>Create</button>
      }
      ```
      
      > **Good to know:** In Client Components, forms invoking Server Actions will queue submissions if JavaScript isn't loaded yet, and will be prioritized for hydration. After hydration, the browser does not refresh on form submission.
      
      ### Passing actions as props
      
      You can also pass an action to a Client Component as a prop:
      
      ```jsx
      <ClientComponent updateItemAction={updateItem} />
      ```
      
      ```tsx filename="app/client-component.tsx" switcher
      'use client'
      
      export default function ClientComponent({
        updateItemAction,
      }: {
        updateItemAction: (formData: FormData) => void
      }) {
        return <form action={updateItemAction}>{/* ... */}</form>
      }
      ```
      
      ```jsx filename="app/client-component.js" switcher
      'use client'
      
      export default function ClientComponent({ updateItemAction }) {
        return <form action={updateItemAction}>{/* ... */}</form>
      }
      ```
      
      ## Invoking Server Functions
      
      There are two main ways you can invoke a Server Function:
      
      1. [Forms](#forms) in Server and Client Components
      2. [Event Handlers](#event-handlers) and [useEffect](#useeffect) in Client Components
      
      > **Good to know:** Server Functions are designed for server-side mutations. The client currently dispatches and awaits them one at a time. This is an implementation detail and may change. If you need parallel data fetching, use [data fetching](/docs/app/getting-started/fetching-data#server-components) in Server Components, or perform parallel work inside a single Server Function or [Route Handler](/docs/app/guides/backend-for-frontend#manipulating-data).
      
      ### Forms
      
      React extends the HTML [`<form>`](https://react.dev/reference/react-dom/components/form) element to allow a Server Function to be invoked with the HTML `action` prop.
      
      When invoked in a form, the function automatically receives the [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) object. You can extract the data using the native [`FormData` methods](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods):
      
      ```tsx filename="app/ui/form.tsx" switcher
      import { createPost } from '@/app/actions'
      
      export function Form() {
        return (
          <form action={createPost}>
            <input type="text" name="title" />
            <input type="text" name="content" />
            <button type="submit">Create</button>
          </form>
        )
      }
      ```
      
      ```jsx filename="app/ui/form.js" switcher
      import { createPost } from '@/app/actions'
      
      export function Form() {
        return (
          <form action={createPost}>
            <input type="text" name="title" />
            <input type="text" name="content" />
            <button type="submit">Create</button>
          </form>
        )
      }
      ```
      
      ```ts filename="app/actions.ts" switcher
      'use server'
      
      import { auth } from '@/lib/auth'
      
      export async function createPost(formData: FormData) {
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
      
        const title = formData.get('title')
        const content = formData.get('content')
      
        // Mutate data
        // Revalidate cache
      }
      ```
      
      ```js filename="app/actions.js" switcher
      'use server'
      
      import { auth } from '@/lib/auth'
      
      export async function createPost(formData) {
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
      
        const title = formData.get('title')
        const content = formData.get('content')
      
        // Mutate data
        // Revalidate cache
      }
      ```
      
      ### Event Handlers
      
      You can invoke a Server Function in a Client Component by using event handlers such as `onClick`.
      
      ```tsx filename="app/like-button.tsx" switcher
      'use client'
      
      import { incrementLike } from './actions'
      import { useState } from 'react'
      
      export default function LikeButton({ initialLikes }: { initialLikes: number }) {
        const [likes, setLikes] = useState(initialLikes)
      
        return (
          <>
            <p>Total Likes: {likes}</p>
            <button
              onClick={async () => {
                const updatedLikes = await incrementLike()
                setLikes(updatedLikes)
              }}
            >
              Like
            </button>
          </>
        )
      }
      ```
      
      ```jsx filename="app/like-button.js" switcher
      'use client'
      
      import { incrementLike } from './actions'
      import { useState } from 'react'
      
      export default function LikeButton({ initialLikes }) {
        const [likes, setLikes] = useState(initialLikes)
      
        return (
          <>
            <p>Total Likes: {likes}</p>
            <button
              onClick={async () => {
                const updatedLikes = await incrementLike()
                setLikes(updatedLikes)
              }}
            >
              Like
            </button>
          </>
        )
      }
      ```
      
      ## Examples
      
      ### Showing a pending state
      
      While executing a Server Function, you can show a loading indicator with React's [`useActionState`](https://react.dev/reference/react/useActionState) hook. This hook returns a `pending` boolean:
      
      ```tsx filename="app/ui/button.tsx" switcher
      'use client'
      
      import { useActionState, startTransition } from 'react'
      import { createPost } from '@/app/actions'
      import { LoadingSpinner } from '@/app/ui/loading-spinner'
      
      export function Button() {
        const [state, action, pending] = useActionState(createPost, false)
      
        return (
          <button onClick={() => startTransition(action)}>
            {pending ? <LoadingSpinner /> : 'Create Post'}
          </button>
        )
      }
      ```
      
      ```jsx filename="app/ui/button.js" switcher
      'use client'
      
      import { useActionState, startTransition } from 'react'
      import { createPost } from '@/app/actions'
      import { LoadingSpinner } from '@/app/ui/loading-spinner'
      
      export function Button() {
        const [state, action, pending] = useActionState(createPost, false)
      
        return (
          <button onClick={() => startTransition(action)}>
            {pending ? <LoadingSpinner /> : 'Create Post'}
          </button>
        )
      }
      ```
      
      See the [Building interactive apps](/docs/app/guides/interactive-apps) guide for a deeper walkthrough of responsive interactions, including pending feedback, optimistic UI, transitions, and error handling.
      
      > **Good to know**: With the **experimental** [`useOffline`](/docs/app/guides/offline-support) config enabled, a Server Action interrupted by a connectivity drop stays pending and completes when the network returns.
      
      ### Refresh data
      
      After a mutation, you may want to refresh the current page to show the latest data. You can do this by calling [`refresh`](/docs/app/api-reference/functions/refresh) from `next/cache` in a Server Action:
      
      ```ts filename="app/lib/actions.ts" switcher
      'use server'
      
      import { auth } from '@/lib/auth'
      import { refresh } from 'next/cache'
      
      export async function updatePost(formData: FormData) {
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        // Mutate data
        // ...
      
        refresh()
      }
      ```
      
      ```js filename="app/lib/actions.js" switcher
      'use server'
      
      import { auth } from '@/lib/auth'
      import { refresh } from 'next/cache'
      
      export async function updatePost(formData) {
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        // Mutate data
        // ...
      
        refresh()
      }
      ```
      
      This refreshes the client router, ensuring the UI reflects the latest state. The `refresh()` function does not revalidate tagged data. To revalidate tagged data, use [`updateTag`](/docs/app/api-reference/functions/updateTag) or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) instead.
      
      ### Revalidate data
      
      After performing a mutation, you can revalidate the Next.js cache and show the updated data by calling [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) within the Server Function:
      
      ```ts filename="app/lib/actions.ts" switcher
      import { auth } from '@/lib/auth'
      import { revalidatePath } from 'next/cache'
      
      export async function createPost(formData: FormData) {
        'use server'
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        // Mutate data
        // ...
      
        revalidatePath('/posts')
      }
      ```
      
      ```js filename="app/lib/actions.js" switcher
      import { auth } from '@/lib/auth'
      import { revalidatePath } from 'next/cache'
      
      export async function createPost(formData) {
        'use server'
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        // Mutate data
        // ...
        revalidatePath('/posts')
      }
      ```
      
      ### Redirect after a mutation
      
      You may want to redirect the user to a different page after a mutation. You can do this by calling [`redirect`](/docs/app/api-reference/functions/redirect) within the Server Function.
      
      ```ts filename="app/lib/actions.ts" switcher
      'use server'
      
      import { auth } from '@/lib/auth'
      import { revalidatePath } from 'next/cache'
      import { redirect } from 'next/navigation'
      
      export async function createPost(formData: FormData) {
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        // Mutate data
        // ...
      
        revalidatePath('/posts')
        redirect('/posts')
      }
      ```
      
      ```js filename="app/lib/actions.js" switcher
      'use server'
      
      import { auth } from '@/lib/auth'
      import { revalidatePath } from 'next/cache'
      import { redirect } from 'next/navigation'
      
      export async function createPost(formData) {
        const session = await auth()
        if (!session?.user) {
          throw new Error('Unauthorized')
        }
        // Mutate data
        // ...
      
        revalidatePath('/posts')
        redirect('/posts')
      }
      ```
      
      Calling `redirect` [throws](/docs/app/api-reference/functions/redirect#behavior) a framework handled control-flow exception. Any code after it won't execute. If you need fresh data, call [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) beforehand.
      
      ### Cookies
      
      You can `get`, `set`, and `delete` cookies inside a Server Action using the [`cookies`](/docs/app/api-reference/functions/cookies) API.
      
      When you [set or delete](/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-functions) a cookie in a Server Action, Next.js re-renders the current page and its layouts on the server so the **UI reflects the new cookie value**.
      
      > **Good to know**: The server update applies to the current React tree, re-rendering, mounting, or unmounting components, as needed. Client state is preserved for re-rendered components, and effects re-run if their dependencies changed.
      
      ```ts filename="app/actions.ts" switcher
      'use server'
      
      import { cookies } from 'next/headers'
      
      export async function exampleAction() {
        const cookieStore = await cookies()
      
        // Get cookie
        cookieStore.get('name')?.value
      
        // Set cookie
        cookieStore.set('name', 'Delba')
      
        // Delete cookie
        cookieStore.delete('name')
      }
      ```
      
      ```js filename="app/actions.js" switcher
      'use server'
      
      import { cookies } from 'next/headers'
      
      export async function exampleAction() {
        // Get cookie
        const cookieStore = await cookies()
      
        // Get cookie
        cookieStore.get('name')?.value
      
        // Set cookie
        cookieStore.set('name', 'Delba')
      
        // Delete cookie
        cookieStore.delete('name')
      }
      ```
      
      ### useEffect
      
      You can use the React [`useEffect`](https://react.dev/reference/react/useEffect) hook to invoke a Server Action when the component mounts or a dependency changes. This is useful for mutations that depend on global events or need to be triggered automatically. For example, `onKeyDown` for app shortcuts, an intersection observer hook for infinite scrolling, or when the component mounts to update a view count:
      
      ```tsx filename="app/view-count.tsx" switcher
      'use client'
      
      import { incrementViews } from './actions'
      import { useState, useEffect, useTransition } from 'react'
      
      export default function ViewCount({ initialViews }: { initialViews: number }) {
        const [views, setViews] = useState(initialViews)
        const [isPending, startTransition] = useTransition()
      
        useEffect(() => {
          startTransition(async () => {
            const updatedViews = await incrementViews()
            setViews(updatedViews)
          })
        }, [])
      
        // You can use `isPending` to give users feedback
        return <p>Total Views: {views}</p>
      }
      ```
      
      ```jsx filename="app/view-count.js" switcher
      'use client'
      
      import { incrementViews } from './actions'
      import { useState, useEffect, useTransition } from 'react'
      
      export default function ViewCount({ initialViews }) {
        const [views, setViews] = useState(initialViews)
        const [isPending, startTransition] = useTransition()
      
        useEffect(() => {
          startTransition(async () => {
            const updatedViews = await incrementViews()
            setViews(updatedViews)
          })
        }, [])
      
        // You can use `isPending` to give users feedback
        return <p>Total Views: {views}</p>
      }
      ```
      --- pages ---
      
      ### src/app/(authenticated)/prompts/page.tsx
      import { redirect } from "next/navigation";
      import { cookies } from "next/headers";
      import Link from "next/link";
      import { FileText, Search } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { Button } from "@/components/ui/button";
      import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
      import { cn } from "@/lib/cn";
      
      export const metadata = { title: "Prompt library" };
      
      const PROMPT_CATEGORIES = [
        "Starter", "Feature", "Debug", "Refactor", "UI", "Database", "Security",
        "Performance", "Testing", "Deployment", "Architecture", "Code Review",
        "Research", "Custom",
      ];
      
      export default async function PromptLibrary({
        searchParams,
      }: {
        searchParams: Promise<{ category?: string; q?: string; project?: string }>;
      }) {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
        if (!token) redirect("/login");
      
        const actor = await verifySessionToken(token);
        if (!actor) redirect("/login");
      
        const { category, q, project } = await searchParams;
      
        const where = {
          ownerId: actor.userId,
          archivedAt: null as null | undefined,
          ...(category ? { category } : {}),
          ...(project ? { projectId: project } : {}),
          ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
        };
      
        const prompts = await db.prompt.findMany({
          where,
          include: {
            project: { select: { name: true } },
            currentVersion: { select: { content: true, versionNumber: true } },
            _count: { select: { queueItems: true } },
          },
          orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
          take: 100,
        });
      
        const projects = await db.project.findMany({
          where: { ownerId: actor.userId, archivedAt: null },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        });
      
        async function createPrompt(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const content = (formData.get("content") as string).trim();
          const category = (formData.get("category") as string) || "Custom";
          const projectId = (formData.get("projectId") as string) || null;
      
          if (!title || !content) redirect("/prompts?error=Title+and+content+are+required");
      
          const prompt = await db.prompt.create({
            data: {
              ownerId: actor.userId,
              title,
              category,
              projectId,
              status: "READY",
              versions: {
                // No ownerId here: it is a relation scalar of the prompt→version
                // relation, so Prisma inherits it from the parent and rejects it
                // being passed again.
                create: {
                  versionNumber: 1,
                  content,
                  createdById: actor.userId,
                },
              },
            },
            select: { id: true },
          });
      
          await db.prompt.update({
            where: { id: prompt.id },
            data: { currentVersion: { connect: { promptId_versionNumber: { promptId: prompt.id, versionNumber: 1 } } } },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId,
              type: "PROMPT_CREATED",
              subjectKind: "PROMPT",
              subjectId: prompt.id,
              summary: `Created prompt "${title}"`,
            },
          });
      
          redirect("/prompts");
        }
      
        return (
          <PageShell>
            <PageHeader
              title="Prompt library"
              description="Prompts are first-class here, not scraps in a notes app. Save the ones that worked, then queue them onto a project."
            />
      
            <CreateDisclosure label="New prompt" className="mb-6">
              <form action={createPrompt} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Add a Stripe customer portal"
                  required
                />
                <TextField
                  label="Content"
                  name="content"
                  placeholder="Paste the prompt here…"
                  rows={7}
                  required
                  className="font-mono text-caption"
                />
                <FormGrid>
                  <SelectField label="Category" name="category" defaultValue="Custom">
                    {PROMPT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField label="Project" name="projectId" defaultValue="">
                    <option value="">No project (reusable)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </SelectField>
                </FormGrid>
                <Button type="submit" variant="primary">
                  Save prompt
                </Button>
              </form>
            </CreateDisclosure>
      
            {/*
              A plain GET form: search survives a reload, is linkable, and works with
              no JavaScript. The category chips below carry the query along.
            */}
            <form method="get" role="search" className="mb-4 flex flex-wrap gap-2">
              <div className="relative min-w-56 flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                  aria-hidden="true"
                />
                <label htmlFor="prompt-search" className="sr-only">
                  Search prompts by title
                </label>
                <BareInput
                  id="prompt-search"
                  type="search"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Search prompts…"
                  className="pl-10"
                />
              </div>
              {category && <input type="hidden" name="category" value={category} />}
              <Button type="submit">Search</Button>
              {(q || category) && (
                <Button asChild variant="ghost">
                  <Link href="/prompts">Clear</Link>
                </Button>
              )}
            </form>
      
            <div className="mb-6 flex flex-wrap gap-1.5">
              {[null, ...PROMPT_CATEGORIES].map((c) => {
                const active = c === (category ?? null);
                const params = new URLSearchParams();
                if (c) params.set("category", c);
                if (q) params.set("q", q);
                const query = params.toString();
                return (
                  <Link
                    key={c ?? "all"}
                    href={query ? `/prompts?${query}` : "/prompts"}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "press inline-flex h-8 items-center rounded-full px-3 text-caption font-semibold",
                      "transition-colors duration-(--duration-fast)",
                      active
                        ? "bg-cobalt-500/18 text-cobalt-300"
                        : "border border-line text-muted hover:bg-surface-raised hover:text-foreground",
                    )}
                  >
                    {c ?? "All"}
                  </Link>
                );
              })}
            </div>
      
            {prompts.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                title={q || category ? "No prompts match" : "No prompts yet"}
                description={
                  q || category
                    ? "Try a different search, or clear the filters."
                    : "Save the prompts that actually worked. Future you will not remember them."
                }
              />
            ) : (
              <Stack className="space-y-2">
                {prompts.map((prompt) => (
                  <Row key={prompt.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-title-3 text-foreground">{prompt.title}</h2>
                          <Badge tone="cobalt">{prompt.category}</Badge>
                          {prompt.project && <Badge tone="quiet">{prompt.project.name}</Badge>}
                          {prompt._count.queueItems > 0 && (
                            <Badge tone="gold">Queued ×{prompt._count.queueItems}</Badge>
                          )}
                        </div>
      
                        <p className="mt-2 line-clamp-2 max-w-(--reading-max) text-caption text-subtle">
                          {prompt.currentVersion?.content}
                        </p>
                      </div>
      
                      <CopyButton
                        text={prompt.currentVersion?.content ?? ""}
                        label="Copy"
                        className="shrink-0"
                      />
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </PageShell>
        );
      }
      
      ### src/app/(authenticated)/[slug]/features/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Sparkles } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, SelectField, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function FeaturesPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            features: {
              orderBy: [{ status: "asc" }, { priority: "desc" }, { sortOrder: "asc" }],
            },
            milestones: { select: { id: true, name: true, status: true }, orderBy: { sortOrder: "asc" } },
          },
        });
        if (!project) notFound();
      
        async function addFeature(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const body = (formData.get("body") as string).trim();
          const reason = (formData.get("reason") as string).trim();
          const criteria = (formData.get("criteria") as string).trim();
          const milestoneId = (formData.get("milestoneId") as string) || null;
          const priority = Math.min(5, Math.max(0, parseInt(formData.get("priority") as string, 10) || 0));
      
          if (!title) redirect(`/${slug}/features?error=Title+required`);
      
          await db.feature.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              body: body || null,
              reason: reason || null,
              acceptanceCriteria: criteria || null,
              milestoneId,
              priority,
              status: "PLANNED",
            },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              type: "FEATURE_CREATED",
              subjectKind: "FEATURE",
              summary: `Feature: ${title.slice(0, 80)}`,
            },
          });
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/features`);
        }
      
        async function updateFeature(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const status = formData.get("status") as string;
      
          const feature = await db.feature.findFirst({ where: { id, ownerId: actor.userId } });
          if (!feature) redirect(`/${slug}/features`);
      
          await db.feature.update({
            where: { id: feature.id },
            data: { status: status as "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" },
          });
      
          if (status === "DONE") {
            await db.activity.create({
              data: {
                ownerId: actor.userId,
                actorUserId: actor.userId,
                projectId: project!.id,
                type: "FEATURE_COMPLETED",
                subjectKind: "FEATURE",
                summary: `Shipped: ${feature.title.slice(0, 80)}`,
              },
            });
          }
      
          redirect(`/${slug}/features`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Features</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                A backlog shaped for AI-assisted building: each feature carries the reason it
                exists and the criteria that say it&apos;s done.
              </p>
            </div>
      
            <CreateDisclosure label="New feature">
              <form action={addFeature} className="space-y-4">
                <Field
                  label="Name"
                  name="title"
                  type="text"
                  placeholder="Onboarding persistence"
                  required
                />
                <TextField
                  label="Description"
                  name="body"
                  rows={2}
                  placeholder="What should this do?"
                />
                <Field
                  label="Reason"
                  name="reason"
                  type="text"
                  placeholder="Why does this matter?"
                  hint="An agent that knows the why makes better calls than one that only knows the what."
                />
                <TextField
                  label="Acceptance criteria"
                  name="criteria"
                  rows={2}
                  placeholder="- user can save and reload"
                />
                <FormGrid>
                  <SelectField label="Milestone" name="milestoneId" defaultValue="">
                    <option value="">No milestone</option>
                    {project.milestones.map((milestone) => (
                      <option key={milestone.id} value={milestone.id}>
                        {milestone.name}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField label="Priority" name="priority" defaultValue="0">
                    {[0, 1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>
                        {p}
                        {p === 5 ? " — must ship" : p === 4 ? " — high" : p === 0 ? " — low" : ""}
                      </option>
                    ))}
                  </SelectField>
                </FormGrid>
                <Button type="submit" variant="primary">
                  Add feature
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.features.length === 0 ? (
              <EmptyState
                icon={<Sparkles className="h-5 w-5" />}
                title="No features yet"
                description="What should this project actually do? Add the first one and it becomes context for every prompt you generate."
              />
            ) : (
              <Stack>
                {project.features.map((feature) => {
                  const meta = workStatus(feature.status);
                  return (
                    <Row key={feature.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{feature.title}</h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {feature.priority >= 4 && <Badge tone="gold">P{feature.priority}</Badge>}
                      </div>
      
                      {feature.body && (
                        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                          {feature.body}
                        </p>
                      )}
                      {feature.reason && (
                        <p className="mt-1.5 text-caption text-subtle">
                          <span className="eyebrow mr-1.5">Why</span>
                          {feature.reason}
                        </p>
                      )}
                      {feature.acceptanceCriteria && (
                        <p className="mt-1 text-caption text-subtle">
                          <span className="eyebrow mr-1.5">Done when</span>
                          {feature.acceptanceCriteria}
                        </p>
                      )}
      
                      {feature.status !== "DONE" && feature.status !== "CANCELLED" && (
                        <form action={updateFeature}>
                          <input type="hidden" name="id" value={feature.id} />
                          <RowActions>
                            {feature.status !== "IN_PROGRESS" && (
                              <RowButton name="status" value="IN_PROGRESS" tone="accent">
                                Start building
                              </RowButton>
                            )}
                            {feature.status !== "BLOCKED" && (
                              <RowButton name="status" value="BLOCKED" tone="danger">
                                Block
                              </RowButton>
                            )}
                            <RowButton name="status" value="DONE" tone="success">
                              Ship
                            </RowButton>
                          </RowActions>
                        </form>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/milestones/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Flag } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function MilestonesPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            milestones: {
              include: { _count: { select: { features: true } } },
              orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
            },
          },
        });
        if (!project) notFound();
      
        async function addMilestone(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const name = (formData.get("name") as string).trim();
          const description = (formData.get("description") as string).trim();
          const targetDate = (formData.get("targetDate") as string) || null;
      
          if (!name) redirect(`/${slug}/milestones?error=Name+required`);
      
          const maxSort = await db.milestone.aggregate({
            where: { ownerId: actor.userId, projectId: project!.id },
            _max: { sortOrder: true },
          });
      
          await db.milestone.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              name,
              description: description || null,
              targetDate: targetDate ? new Date(targetDate) : null,
              sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
              status: "PLANNED",
            },
          });
          redirect(`/${slug}/milestones`);
        }
      
        async function updateStatus(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const status = formData.get("status") as string;
      
          const milestone = await db.milestone.findFirst({ where: { id, ownerId: actor.userId } });
          if (!milestone) redirect(`/${slug}/milestones`);
      
          await db.milestone.update({
            where: { id: milestone.id },
            data: { status: status as "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" },
          });
          if (status === "DONE") {
            await db.activity.create({
              data: {
                ownerId: actor.userId,
                actorUserId: actor.userId,
                projectId: project!.id,
                type: "MILESTONE_REACHED",
                subjectKind: "MILESTONE",
                summary: `Milestone reached: ${milestone.name.slice(0, 80)}`,
              },
            });
          }
          redirect(`/${slug}/milestones`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Milestones</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                The big moments on the way to shipping. Dates are optional — the sequence is
                the point.
              </p>
            </div>
      
            <CreateDisclosure label="New milestone">
              <form action={addMilestone} className="space-y-4">
                <Field label="Name" name="name" type="text" placeholder="MVP" required />
                <Field
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Core loop working end to end for early users"
                />
                <Field label="Target date" name="targetDate" type="date" hint="Optional." />
                <Button type="submit" variant="primary">
                  Add milestone
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.milestones.length === 0 ? (
              <EmptyState
                icon={<Flag className="h-5 w-5" />}
                title="No milestones yet"
                description="Prototype → MVP → Launch. Naming the stops makes an unfinished project feel finishable."
              />
            ) : (
              <Stack as="ol" className="space-y-2">
                {project.milestones.map((milestone) => {
                  const meta = workStatus(milestone.status);
                  const done = milestone.status === "DONE";
                  return (
                    <Row key={milestone.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={
                            done
                              ? "text-title-3 text-subtle line-through"
                              : "text-title-3 text-foreground"
                          }
                        >
                          {milestone.name}
                        </h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {milestone._count.features > 0 && (
                          <Badge tone="cobalt">
                            {milestone._count.features} feature
                            {milestone._count.features === 1 ? "" : "s"}
                          </Badge>
                        )}
                      </div>
      
                      {milestone.description && (
                        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                          {milestone.description}
                        </p>
                      )}
      
                      {milestone.targetDate && (
                        <p className="mt-1.5 text-caption text-subtle">
                          <span className="eyebrow mr-1.5">Target</span>
                          <time dateTime={milestone.targetDate.toISOString()}>
                            {milestone.targetDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </p>
                      )}
      
                      {!done && milestone.status !== "CANCELLED" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={milestone.id} />
                          <RowActions>
                            {milestone.status !== "IN_PROGRESS" && (
                              <RowButton name="status" value="IN_PROGRESS" tone="accent">
                                Start
                              </RowButton>
                            )}
                            <RowButton name="status" value="DONE" tone="success">
                              Complete
                            </RowButton>
                          </RowActions>
                        </form>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/bugs/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Bug as BugIcon } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function BugsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { bugs: { orderBy: [{ severity: "desc" }, { updatedAt: "desc" }] } },
        });
        if (!project) notFound();
      
        async function addBug(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const symptoms = (formData.get("symptoms") as string).trim();
          const reproduction = (formData.get("reproduction") as string).trim();
          const expected = (formData.get("expected") as string).trim();
          const actual = (formData.get("actual") as string).trim();
          const severity = Math.min(5, Math.max(0, parseInt(formData.get("severity") as string, 10) || 1));
      
          if (!title) redirect(`/${slug}/bugs?error=Title+required`);
      
          await db.bug.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              symptoms: symptoms || null,
              reproduction: reproduction || null,
              expectedBehavior: expected || null,
              actualBehavior: actual || null,
              severity,
              status: "ACTIVE",
            },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              type: "BUG_CREATED",
              subjectKind: "BUG",
              summary: `Bug: ${title.slice(0, 80)}`,
            },
          });
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/bugs`);
        }
      
        async function resolveOrReopen(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const action = formData.get("action") as string;
          const resolution = (formData.get("resolution") as string).trim();
      
          const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
          if (!bug) redirect(`/${slug}/bugs`);
          const bugNonNull = bug;
      
          if (action === "resolve") {
            await db.bug.update({
              where: { id: bugNonNull.id },
              data: { status: "RESOLVED", resolution: resolution || bugNonNull.resolution, rootCause: resolution || bugNonNull.rootCause },
            });
            await db.activity.create({
              data: {
                ownerId: actor.userId,
                actorUserId: actor.userId,
                projectId: project!.id,
                type: "BUG_RESOLVED",
                subjectKind: "BUG",
                summary: `Resolved: ${bugNonNull.title.slice(0, 80)}`,
              },
            });
          } else if (action === "reopen") {
            await db.bug.update({ where: { id: bugNonNull.id }, data: { status: "ACTIVE" } });
          }
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/bugs`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Bugs &amp; debugging memory</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Track what broke, and record how it was fixed. The resolution is the part
                that stops you debugging the same thing twice.
              </p>
            </div>
      
            <CreateDisclosure label="Report a bug">
              <form action={addBug} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Auth redirect fails on Safari"
                  required
                />
                <TextField label="Symptoms" name="symptoms" rows={2} placeholder="What goes wrong?" />
                <TextField
                  label="Reproduction steps"
                  name="reproduction"
                  rows={2}
                  placeholder="1. Open on Safari  2. Sign in  3. …"
                />
                <FormGrid>
                  <Field
                    label="Expected"
                    name="expected"
                    type="text"
                    placeholder="Redirects to the dashboard"
                  />
                  <Field
                    label="Actual"
                    name="actual"
                    type="text"
                    placeholder="Bounces back to login"
                  />
                </FormGrid>
                <SelectField label="Severity" name="severity" defaultValue="1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      {s} — {s >= 4 ? "critical" : s === 3 ? "major" : "minor"}
                    </option>
                  ))}
                </SelectField>
                <Button type="submit" variant="primary">
                  Report bug
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.bugs.length === 0 ? (
              <EmptyState
                icon={<BugIcon className="h-5 w-5" />}
                title="Nothing broken"
                description="No bugs tracked on this project. Keep it that way."
              />
            ) : (
              <Stack>
                {project.bugs.map((bug) => {
                  const meta = workStatus(bug.status);
                  const open = bug.status !== "RESOLVED" && bug.status !== "ARCHIVED";
                  return (
                    <Row key={bug.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{bug.title}</h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {bug.severity >= 4 && <Badge tone="danger">Severity {bug.severity}</Badge>}
                      </div>
      
                      {bug.symptoms && (
                        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                          {bug.symptoms}
                        </p>
                      )}
      
                      <DataList
                        className="mt-3"
                        items={[
                          { label: "Expected", value: bug.expectedBehavior },
                          { label: "Actual", value: bug.actualBehavior },
                          { label: "Reproduce", value: bug.reproduction },
                        ]}
                      />
      
                      {bug.status === "RESOLVED" && bug.resolution && (
                        <p className="mt-3 rounded-xl border border-success/25 bg-success/8 px-3.5 py-2.5 text-caption text-success">
                          <span className="font-semibold">Fixed · </span>
                          {bug.resolution}
                        </p>
                      )}
      
                      {open ? (
                        <form action={resolveOrReopen} className="mt-4 flex flex-wrap items-center gap-2">
                          <input type="hidden" name="id" value={bug.id} />
                          <label htmlFor={`resolution-${bug.id}`} className="sr-only">
                            How {bug.title} was fixed
                          </label>
                          <BareInput
                            id={`resolution-${bug.id}`}
                            name="resolution"
                            placeholder="Root cause and fix…"
                            className="h-9 min-w-0 flex-1 text-caption"
                          />
                          <RowButton name="action" value="resolve" tone="success">
                            Resolve
                          </RowButton>
                        </form>
                      ) : bug.status === "RESOLVED" ? (
                        <form action={resolveOrReopen}>
                          <input type="hidden" name="id" value={bug.id} />
                          <RowActions>
                            <RowButton name="action" value="reopen">
                              Reopen
                            </RowButton>
                          </RowActions>
                        </form>
                      ) : null}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/decisions/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { GitBranch } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function DecisionsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            decisions: { orderBy: [{ status: "asc" }, { decidedAt: "desc" }] },
          },
        });
        if (!project) notFound();
      
        async function addDecision(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const decision = (formData.get("decision") as string).trim();
          const reasoning = (formData.get("reasoning") as string).trim();
          const alternatives = (formData.get("alternatives") as string).trim();
          const affectedSystem = (formData.get("affectedSystem") as string).trim();
          const reversible = (formData.get("reversible") as string) === "on";
      
          if (!title || !decision) redirect(`/${slug}/decisions?error=Title+and+decision+required`);
      
          await db.decision.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              decision,
              reasoning: reasoning || null,
              alternatives: alternatives || null,
              affectedSystem: affectedSystem || null,
              reversible,
              status: "ACCEPTED",
              decidedAt: new Date(),
            },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              type: "DECISION_CREATED",
              subjectKind: "DECISION",
              summary: `Decision: ${title.slice(0, 80)}`,
            },
          });
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/decisions`);
        }
      
        async function updateStatus(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const status = formData.get("status") as string;
      
          const existing = await db.decision.findFirst({ where: { id, ownerId: actor.userId } });
          if (!existing) redirect(`/${slug}/decisions`);
      
          await db.decision.update({
            where: { id: existing.id },
            data: { status: status as "PROPOSED" | "ACCEPTED" | "SUPERSEDED" | "REJECTED" },
          });
          redirect(`/${slug}/decisions`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Decision log</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Why the project is the way it is. Accepted decisions become context in every
                generated prompt, so an agent won&apos;t quietly undo them.
              </p>
            </div>
      
            <CreateDisclosure label="Record a decision">
              <form action={addDecision} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Use Prisma instead of Drizzle"
                  required
                />
                <TextField
                  label="Decision"
                  name="decision"
                  rows={2}
                  placeholder="What was decided, stated as an instruction an agent can follow"
                  required
                />
                <TextField
                  label="Reasoning"
                  name="reasoning"
                  rows={2}
                  placeholder="The thinking behind it"
                />
                <Field
                  label="Alternatives considered"
                  name="alternatives"
                  type="text"
                  placeholder="Drizzle, Kysely"
                />
                <Field
                  label="Affected system"
                  name="affectedSystem"
                  type="text"
                  placeholder="Data layer"
                />
                <FieldShell label="Reversibility">
                  <label className="flex items-center gap-2.5 text-body text-muted">
                    <input
                      type="checkbox"
                      name="reversible"
                      defaultChecked
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    This decision can be revisited later
                  </label>
                </FieldShell>
                <Button type="submit" variant="primary">
                  Record decision
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.decisions.length === 0 ? (
              <EmptyState
                icon={<GitBranch className="h-5 w-5" />}
                title="No decisions logged"
                description="The first time you wonder why something was built a certain way, this is the page you'll wish you had filled in."
              />
            ) : (
              <Stack>
                {project.decisions.map((decision) => {
                  const meta = workStatus(decision.status);
                  return (
                    <Row key={decision.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{decision.title}</h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        <Badge tone={decision.reversible ? "quiet" : "danger"}>
                          {decision.reversible ? "Reversible" : "Locked"}
                        </Badge>
                      </div>
      
                      <p className="mt-2 max-w-(--reading-max) text-body text-ink-100">
                        {decision.decision}
                      </p>
      
                      <DataList
                        className="mt-3"
                        items={[
                          { label: "Reasoning", value: decision.reasoning },
                          { label: "Alternatives", value: decision.alternatives },
                          { label: "Affects", value: decision.affectedSystem },
                        ]}
                      />
      
                      {decision.status !== "ACCEPTED" && decision.status !== "REJECTED" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={decision.id} />
                          <RowActions>
                            <RowButton name="status" value="ACCEPTED" tone="success">
                              Accept
                            </RowButton>
                            <RowButton name="status" value="REJECTED" tone="danger">
                              Reject
                            </RowButton>
                          </RowActions>
                        </form>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/notes/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { FileText, Pin, PinOff } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, TextField } from "@/components/ui/field";
      import { Markdown } from "@/components/ui/markdown";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, RowButton } from "@/components/ui/disclosure";
      import { timeAgo } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function NotesPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { notes: { orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] } },
        });
        if (!project) notFound();
      
        async function addNote(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const body = (formData.get("body") as string).trim();
          if (!title || !body) redirect(`/${slug}/notes?error=Title+and+body+required`);
      
          await db.note.create({
            data: { ownerId: actor.userId, projectId: project!.id, title, body, kind: "note" },
          });
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
          redirect(`/${slug}/notes`);
        }
      
        async function togglePin(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const targetPinned = formData.get("pinned") === "true";
          const note = await db.note.findFirst({ where: { id, ownerId: actor.userId } });
          if (!note) redirect(`/${slug}/notes`);
          await db.note.update({ where: { id: note.id }, data: { pinned: targetPinned } });
          redirect(`/${slug}/notes`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Notes</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Loose memory for this project, written in Markdown. Pin the ones you keep
                coming back to.
              </p>
            </div>
      
            <CreateDisclosure label="New note">
              <form action={addNote} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Why we chose the Neon adapter"
                  required
                />
                <TextField
                  label="Body"
                  name="body"
                  rows={6}
                  hint="Markdown is supported."
                  placeholder={"**Context**\nWe picked this because…"}
                  required
                />
                <Button type="submit" variant="primary">
                  Add note
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.notes.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                title="No notes yet"
                description="The thought you'd otherwise lose in a chat window belongs here."
              />
            ) : (
              <Stack className="space-y-3">
                {project.notes.map((note) => (
                  <Row key={note.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-2 text-title-3 text-foreground">
                          {note.pinned && (
                            <Pin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                          )}
                          {note.title}
                        </h3>
                        <p className="mt-0.5 text-micro text-subtle">
                          Updated{" "}
                          <time dateTime={note.updatedAt.toISOString()}>
                            {timeAgo(note.updatedAt)}
                          </time>
                        </p>
                      </div>
      
                      <form action={togglePin} className="shrink-0">
                        <input type="hidden" name="id" value={note.id} />
                        <input type="hidden" name="pinned" value={String(!note.pinned)} />
                        <RowButton tone={note.pinned ? "accent" : "neutral"}>
                          {note.pinned ? (
                            <PinOff className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {note.pinned ? "Unpin" : "Pin"}
                        </RowButton>
                      </form>
                    </div>
      
                    <div className="mt-3.5 border-t border-line-subtle pt-3.5">
                      <Markdown>{note.body}</Markdown>
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/inspirations/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { ArrowUpRight, Lightbulb } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, SelectField, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      const KIND_LABELS: Record<string, string> = {
        LINK: "Link", IMAGE: "Image", SCREENSHOT: "Screenshot", VIDEO: "Video", TEXT: "Text", OTHER: "Other",
      };
      
      export default async function InspirationsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { inspirations: { orderBy: { createdAt: "desc" } } },
        });
        if (!project) notFound();
      
        async function addInspiration(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const url = (formData.get("url") as string).trim();
          const kind = (formData.get("kind") as string) || "LINK";
          const inspiredDetail = (formData.get("inspiredDetail") as string).trim();
          const note = (formData.get("note") as string).trim();
          const textSnippet = (formData.get("textSnippet") as string).trim();
      
          if (!title) redirect(`/${slug}/inspirations?error=Title+required`);
      
          await db.inspiration.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              canonicalUrl: url || null,
              kind: kind as "LINK" | "IMAGE" | "SCREENSHOT" | "VIDEO" | "TEXT" | "OTHER",
              inspiredDetail: inspiredDetail || null,
              note: note || null,
              textSnippet: textSnippet || null,
            },
          });
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
          redirect(`/${slug}/inspirations`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Inspiration vault</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                A bookmark says <em>what</em>. The field that matters here is <em>why</em> — the
                specific thing you want to steal.
              </p>
            </div>
      
            <CreateDisclosure label="Save inspiration">
              <form action={addInspiration} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="linear.app command menu"
                  required
                />
                <Field label="URL" name="url" type="url" placeholder="https://…" />
                <SelectField label="Kind" name="kind" defaultValue="LINK">
                  {Object.entries(KIND_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectField>
                <TextField
                  label="What exactly inspired me"
                  name="inspiredDetail"
                  rows={2}
                  hint="Be specific. “Nice design” is worth nothing in six months."
                  placeholder="How their command menu surfaces actions without any visible chrome"
                />
                <TextField label="Text snippet" name="textSnippet" rows={2} />
                <Field label="Note" name="note" type="text" placeholder="Any extra context" />
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.inspirations.length === 0 ? (
              <EmptyState
                icon={<Lightbulb className="h-5 w-5" />}
                title="Nothing saved yet"
                description="Capture the products, screens and details you want this project to feel like."
              />
            ) : (
              <Stack className="space-y-3">
                {project.inspirations.map((item) => (
                  <Row key={item.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-title-3 text-foreground">
                        {item.canonicalUrl ? (
                          <a
                            href={item.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-cobalt-400 transition-colors hover:text-cobalt-300"
                          >
                            {item.title}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      <Badge tone="cobalt">{KIND_LABELS[item.kind] ?? item.kind}</Badge>
                    </div>
      
                    {item.inspiredDetail && (
                      <p className="mt-2 max-w-(--reading-max) text-body text-ink-100">
                        <span className="eyebrow mr-1.5">Why</span>
                        {item.inspiredDetail}
                      </p>
                    )}
      
                    {item.textSnippet && (
                      <blockquote className="mt-2.5 border-l-2 border-cobalt-500/45 pl-3.5 text-caption text-muted">
                        {item.textSnippet}
                      </blockquote>
                    )}
      
                    {item.note && <p className="mt-2 text-caption text-subtle">{item.note}</p>}
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/commands/page.tsx
      import { redirect, notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Terminal, Trash2 } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field } from "@/components/ui/field";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function CommandsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { commands: { orderBy: { sortOrder: "asc" } } },
        });
        if (!project) notFound();
      
        async function addCommand(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const name = ((formData.get("name") as string) || "").trim();
          const commandText = ((formData.get("commandText") as string) || "").trim();
          const description = ((formData.get("description") as string) || "").trim();
          const category = ((formData.get("category") as string) || "").trim();
      
          if (!name || !commandText) redirect(`/${slug}/commands?error=Name+and+command+required`);
      
          const maxSort = await db.command.aggregate({
            where: { ownerId: actor.userId, projectId: project!.id },
            _max: { sortOrder: true },
          });
      
          await db.command.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              name,
              commandText,
              description: description || null,
              category: category || null,
              sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
            },
          });
          redirect(`/${slug}/commands`);
        }
      
        async function deleteCommand(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          await db.command.deleteMany({ where: { id, ownerId: actor.userId, projectId: project!.id } });
          redirect(`/${slug}/commands`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Command vault</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Every command this project needs — dev, test, migrate, deploy. So you never
                go digging through shell history again.
              </p>
            </div>
      
            <CreateDisclosure label="New command">
              <form action={addCommand} className="space-y-4">
                <FormGrid>
                  <Field label="Name" name="name" type="text" placeholder="dev" required />
                  <Field label="Category" name="category" type="text" placeholder="daily" />
                </FormGrid>
                <Field
                  label="Command"
                  name="commandText"
                  type="text"
                  placeholder="npm run dev"
                  required
                  className="font-mono"
                />
                <Field
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Start the dev server"
                />
                <Button type="submit" variant="primary">
                  Add command
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.commands.length === 0 ? (
              <EmptyState
                icon={<Terminal className="h-5 w-5" />}
                title="No commands saved"
                description="Save the ones you retype most: dev, test, migrate, deploy."
              />
            ) : (
              <Stack className="space-y-2">
                {project.commands.map((command) => (
                  <Row key={command.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-title-3 text-foreground">{command.name}</h3>
                          {command.category && <Badge tone="quiet">{command.category}</Badge>}
                        </div>
      
                        <code
                          className="mt-2 block overflow-x-auto rounded-lg border border-line-subtle
                            bg-well px-3 py-2 font-mono text-caption text-gold-300"
                        >
                          {command.commandText}
                        </code>
      
                        {command.description && (
                          <p className="mt-1.5 text-caption text-muted">{command.description}</p>
                        )}
                      </div>
      
                      <div className="flex shrink-0 items-center gap-2">
                        <CopyButton text={command.commandText} label="Copy" size="sm" />
                        <form action={deleteCommand}>
                          <input type="hidden" name="id" value={command.id} />
                          <RowButton tone="danger" aria-label={`Delete ${command.name}`}>
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </RowButton>
                        </form>
                      </div>
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/env/page.tsx
      import { redirect, notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Check, KeyRound, Trash2 } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, SelectField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { Progress } from "@/components/ui/progress";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function EnvPage({ params }: Props) {
        const actor = await requireActor();
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
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-title-2 text-foreground">Env checklist</h2>
                <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                  What a deployment needs and where to get each value. No secrets are stored
                  here — only the fact that a variable exists.
                </p>
              </div>
      
              {total > 0 && (
                <div className="w-44 shrink-0 rounded-xl border border-line bg-surface px-4 py-3">
                  <p className="eyebrow">Configured</p>
                  <p className="tabular mt-1 text-title-2 text-foreground">
                    {configured}
                    <span className="text-muted">/{total}</span>
                  </p>
                  <Progress
                    value={total === 0 ? 0 : (configured / total) * 100}
                    label="Environment variables configured"
                    showValue={false}
                    tone={configured === total ? "success" : "gold"}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
      
            {requiredMissing > 0 && (
              <p className="rounded-xl border border-danger/25 bg-danger/8 px-4 py-3 text-body text-danger">
                {requiredMissing} required variable{requiredMissing === 1 ? "" : "s"} still
                unconfigured — the app won&apos;t run without {requiredMissing === 1 ? "it" : "them"}.
              </p>
            )}
      
            <CreateDisclosure label="New variable">
              <form action={addVariable} className="space-y-4">
                <FormGrid>
                  <Field
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="DATABASE_URL"
                    required
                    className="font-mono"
                    hint="Uppercased automatically."
                  />
                  <SelectField label="Environment" name="environment" defaultValue="production">
                    <option value="local">local</option>
                    <option value="staging">staging</option>
                    <option value="production">production</option>
                  </SelectField>
                </FormGrid>
                <Field
                  label="What it is"
                  name="description"
                  type="text"
                  placeholder="Neon pooled connection string"
                />
                <Field
                  label="Where to get it"
                  name="acquisitionNote"
                  type="text"
                  placeholder="Neon dashboard → Connection string"
                />
                <FieldShell label="Requirement">
                  <label className="flex items-center gap-2.5 text-body text-muted">
                    <input type="checkbox" name="required" className="h-4 w-4 accent-[var(--accent)]" />
                    Required for the app to work
                  </label>
                </FieldShell>
                <Button type="submit" variant="primary">
                  Add variable
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.environmentVariables.length === 0 ? (
              <EmptyState
                icon={<KeyRound className="h-5 w-5" />}
                title="No variables tracked"
                description="Start with DATABASE_URL — the one you always forget on a fresh machine."
              />
            ) : (
              <Stack className="space-y-2">
                {project.environmentVariables.map((variable) => (
                  <Row key={variable.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-mono text-title-3 text-foreground">{variable.name}</h3>
                          <Badge tone="quiet">{variable.environment}</Badge>
                          {variable.required && <Badge tone="gold">Required</Badge>}
                          {variable.configured && (
                            <Badge tone="success" dot>
                              Configured
                            </Badge>
                          )}
                        </div>
      
                        {variable.description && (
                          <p className="mt-1.5 text-body text-muted">{variable.description}</p>
                        )}
                        {variable.acquisitionNote && (
                          <p className="mt-1 text-caption text-subtle">
                            <span className="eyebrow mr-1.5">Get it</span>
                            {variable.acquisitionNote}
                          </p>
                        )}
                      </div>
      
                      <div className="flex shrink-0 items-center gap-2">
                        <form action={toggleConfigured}>
                          <input type="hidden" name="id" value={variable.id} />
                          <input type="hidden" name="configured" value={String(variable.configured)} />
                          <RowButton tone={variable.configured ? "success" : "neutral"}>
                            {variable.configured && (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {variable.configured ? "Configured" : "Mark configured"}
                          </RowButton>
                        </form>
                        <form action={deleteVariable}>
                          <input type="hidden" name="id" value={variable.id} />
                          <RowButton tone="danger" aria-label={`Delete ${variable.name}`}>
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </RowButton>
                        </form>
                      </div>
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/sessions/page.tsx
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Terminal } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function SessionsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { codingSessions: { orderBy: { startedAt: "desc" }, include: { _count: { select: { prompts: true, features: true } } } } },
        });
        if (!project) notFound();
      
        async function startSession(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const objective = (formData.get("objective") as string).trim();
          if (!objective) redirect(`/${slug}/sessions?error=Objective+required`);
      
          const session = await db.codingSession.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              objective,
              status: "ACTIVE",
            },
            select: { id: true },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              codingSessionId: session.id,
              type: "SESSION_STARTED",
              subjectKind: "CODING_SESSION",
              summary: `Session started: ${objective.slice(0, 80)}`,
            },
          });
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/sessions`);
        }
      
        async function endSession(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const notes = (formData.get("notes") as string).trim();
          const discoveries = (formData.get("discoveries") as string).trim();
          const whatChanged = (formData.get("whatChanged") as string).trim();
          const nextTask = (formData.get("nextTask") as string).trim();
          const makeDecision = (formData.get("makeDecision") as string) === "on";
          const decisionTitle = (formData.get("decisionTitle") as string).trim();
          const decisionBody = (formData.get("decisionBody") as string).trim();
      
          const session = await db.codingSession.findFirst({ where: { id, ownerId: actor.userId } });
          if (!session) redirect(`/${slug}/sessions`);
          const sessionNonNull = session;
      
          await db.codingSession.update({
            where: { id: sessionNonNull.id },
            data: {
              status: "COMPLETED",
              endedAt: new Date(),
              notes: notes || null,
              discoveries: discoveries || null,
              whatChanged: whatChanged || null,
              nextTask,
            },
          });
      
          // If a decision was made, record it in the Decision Log
          if (makeDecision && decisionTitle && decisionBody) {
            await db.decision.create({
              data: {
                ownerId: actor.userId,
                projectId: project!.id,
                codingSessionId: sessionNonNull.id,
                title: decisionTitle,
                decision: decisionBody,
                status: "ACCEPTED",
                decidedAt: new Date(),
              },
            });
          }
      
          // If next task given, update project
          if (nextTask) {
            await db.project.update({
              where: { id: project!.id },
              data: { nextTask, lastActivityAt: new Date() },
            });
          }
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              codingSessionId: sessionNonNull.id,
              type: "SESSION_COMPLETED",
              subjectKind: "CODING_SESSION",
              summary: `Session completed: ${sessionNonNull.objective.slice(0, 80)}`,
            },
          });
      
          redirect(`/${slug}/sessions`);
        }
      
        return (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Coding sessions</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Close a session properly and the next one starts where this one ended. The
                review at the end is what feeds the next resume packet.
              </p>
            </div>
      
            <CreateDisclosure label="Start a session">
              <form action={startSession} className="space-y-4">
                <Field
                  label="Objective"
                  name="objective"
                  type="text"
                  placeholder="Finish onboarding persistence"
                  required
                  hint="One sentence. What does done look like for this sitting?"
                />
                <Button type="submit" variant="primary">
                  Start session
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.codingSessions.length === 0 ? (
              <EmptyState
                icon={<Terminal className="h-5 w-5" />}
                title="No sessions logged"
                description="Start one before your next build so there's a record of what changed and why."
              />
            ) : (
              <Stack className="space-y-3">
                {project.codingSessions.map((session) => {
                  const meta = workStatus(session.status);
                  return (
                    <Row key={session.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{session.objective}</h3>
                        <Badge tone={meta.tone} dot={session.status === "ACTIVE"}>
                          {meta.label}
                        </Badge>
                        {session._count.prompts > 0 && (
                          <Badge tone="cobalt">
                            {session._count.prompts} prompt
                            {session._count.prompts === 1 ? "" : "s"}
                          </Badge>
                        )}
                      </div>
      
                      <p className="mt-1 text-caption text-subtle">
                        <time dateTime={session.startedAt.toISOString()}>
                          {session.startedAt.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </time>
                        {session.endedAt && (
                          <>
                            {" → "}
                            <time dateTime={session.endedAt.toISOString()}>
                              {session.endedAt.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </time>
                          </>
                        )}
                      </p>
      
                      <DataList
                        className="mt-3"
                        items={[
                          { label: "Finished", value: session.notes },
                          { label: "Still broken", value: session.whatChanged },
                          { label: "Discoveries", value: session.discoveries },
                        ]}
                      />
      
                      {session.nextTask && (
                        <p className="mt-3 rounded-xl border border-accent/25 bg-accent/8 px-3.5 py-2.5 text-caption text-accent">
                          <span className="font-semibold">Next · </span>
                          {session.nextTask}
                        </p>
                      )}
      
                      {session.status === "ACTIVE" && (
                        <details className="mt-4 rounded-xl border border-line bg-well">
                          <summary
                            className="cursor-pointer list-none px-4 py-3 text-caption font-semibold
                              text-muted transition-colors hover:text-foreground
                              [&::-webkit-details-marker]:hidden"
                          >
                            End session — quick review
                          </summary>
                          <form
                            action={endSession}
                            className="space-y-4 border-t border-line-subtle px-4 py-4"
                          >
                            <input type="hidden" name="id" value={session.id} />
                            <TextField label="What did we finish?" name="notes" rows={2} />
                            <TextField label="What still doesn't work?" name="whatChanged" rows={2} />
                            <TextField label="Discoveries" name="discoveries" rows={2} />
                            <Field
                              label="What should happen next?"
                              name="nextTask"
                              type="text"
                              placeholder="Becomes the project's next task"
                            />
      
                            <div className="rounded-xl border border-line bg-surface p-4">
                              <FieldShell label="Decision">
                                <label className="flex items-center gap-2.5 text-body text-muted">
                                  <input
                                    type="checkbox"
                                    name="makeDecision"
                                    className="h-4 w-4 accent-[var(--accent)]"
                                  />
                                  Record a decision made this session
                                </label>
                              </FieldShell>
                              <div className="mt-4 space-y-4">
                                <Field
                                  label="Decision title"
                                  name="decisionTitle"
                                  type="text"
                                  placeholder="Use Prisma instead of Drizzle"
                                />
                                <Field
                                  label="Decision"
                                  name="decisionBody"
                                  type="text"
                                  placeholder="What was decided"
                                />
                              </div>
                            </div>
      
                            <Button type="submit" variant="primary">
                              Complete session
                            </Button>
                          </form>
                        </details>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/timeline/page.tsx
      import { notFound } from "next/navigation";
      import { History } from "lucide-react";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { EmptyState } from "@/components/ui/page";
      import { humanize } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      /** Same colour language as the rest of the app: gold acts, green completes. */
      const TYPE_HUE: Record<string, string> = {
        PROJECT_CREATED: "var(--cobalt-400)",
        FEATURE_CREATED: "var(--cobalt-400)",
        FEATURE_COMPLETED: "var(--success-500)",
        PROMPT_CREATED: "var(--gold-400)",
        PROMPT_USED: "var(--gold-400)",
        BUG_CREATED: "var(--danger-500)",
        BUG_RESOLVED: "var(--success-500)",
        DECISION_CREATED: "var(--cobalt-400)",
        SESSION_COMPLETED: "var(--gold-400)",
        MILESTONE_REACHED: "var(--success-500)",
        PROJECT_STATUS_CHANGED: "var(--gold-400)",
        THOUGHT_CAPTURED: "var(--cyan-400)",
      };
      
      export default async function TimelinePage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          select: { id: true, slug: true, name: true, createdAt: true },
        });
        if (!project) notFound();
      
        const activities = await db.activity.findMany({
          where: { ownerId: actor.userId, projectId: project.id },
          orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
          take: 200,
        });
      
        // Group by day
        const groups: { day: string; label: string; items: typeof activities }[] = [];
        for (const activity of activities) {
          const day = activity.occurredAt.toISOString().slice(0, 10);
          const last = groups[groups.length - 1];
          if (last && last.day === day) {
            last.items.push(activity);
          } else {
            groups.push({
              day,
              label: activity.occurredAt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
              items: [activity],
            });
          }
        }
      
        return (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Timeline</h2>
              <p className="mt-1.5 text-body text-muted">
                What happened on this project, most recent first.
              </p>
            </div>
      
            {groups.length === 0 ? (
              <EmptyState
                icon={<History className="h-5 w-5" />}
                title="Nothing recorded yet"
                description="Features shipped, bugs resolved and decisions made all land here automatically."
              />
            ) : (
              <div className="space-y-7">
                {groups.map((group) => (
                  <section key={group.day}>
                    <h3 className="eyebrow mb-3">{group.label}</h3>
                    <ol className="space-y-3 border-l border-line pl-5">
                      {group.items.map((item) => (
                        <li key={item.id} className="relative">
                          <span
                            className="absolute -left-[1.4rem] top-2 h-2 w-2 rounded-full ring-4 ring-background"
                            style={{ background: TYPE_HUE[item.type] ?? "var(--ink-500)" }}
                            aria-hidden="true"
                          />
                          <p className="text-body text-ink-100">{item.summary}</p>
                          <p className="mt-0.5 text-micro text-subtle">
                            <time dateTime={item.occurredAt.toISOString()}>
                              {item.occurredAt.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </time>
                            <span className="mx-1.5" aria-hidden="true">
                              ·
                            </span>
                            {humanize(item.type)}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            )}
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/export/page.tsx
      import { notFound } from "next/navigation";
      import { Download } from "lucide-react";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Row, Stack } from "@/components/ui/page";
      
      type Props = { params: Promise<{ slug: string }> };
      
      const EXPORTS = [
        { id: "project-context", file: "PROJECT_CONTEXT.md", desc: "Product, state, stack, decisions, boundaries — everything an agent needs to understand the project." },
        { id: "agent-handoff", file: "AGENT_HANDOFF.md", desc: "For switching coding agents: current state, active task, bugs, next actions." },
        { id: "roadmap", file: "ROADMAP.md", desc: "Milestones and features, past and planned." },
        { id: "decisions", file: "DECISIONS.md", desc: "Full decision log." },
        { id: "todo", file: "TODO.md", desc: "Current task, next task, queued prompts, open bugs." },
      ];
      
      export default async function ExportPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          select: { id: true, name: true, slug: true },
        });
        if (!project) notFound();
      
        return (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Export project context</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Markdown files you can drop straight into a repo, a docs folder, or an
                agent&apos;s context window.
              </p>
            </div>
      
            <Stack className="space-y-2">
              {EXPORTS.map((item) => (
                <Row key={item.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-mono text-title-3 text-foreground">{item.file}</h3>
                      <p className="mt-1 max-w-(--reading-max) text-caption text-muted">
                        {item.desc}
                      </p>
                    </div>
                    <a
                      href={`/${project.slug}/export/${item.id}.md`}
                      download
                      className="press inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border
                        border-line bg-surface-raised px-4 text-body font-semibold text-foreground
                        transition-colors hover:border-line-strong hover:bg-overlay"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download
                    </a>
                  </div>
                </Row>
              ))}
            </Stack>
          </div>
        );
      }
      
      ### src/app/(authenticated)/[slug]/resume/page.tsx
      import { notFound } from "next/navigation";
      import { db } from "@/server/db";
      import { compileContext } from "@/features/context/compiler";
      import { projectHealth } from "@/features/projects/health";
      import { requireActor } from "@/features/projects/queries";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Panel, PanelHeader } from "@/components/ui/panel";
      
      type Props = {
        params: Promise<{ slug: string }>;
      };
      
      export default async function ResumePage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            technologies: { include: { technology: true }, orderBy: { sortOrder: "asc" } },
            boundaries: { orderBy: { sortOrder: "asc" } },
            decisions: {
              where: { status: "ACCEPTED" },
              orderBy: { decidedAt: "desc" },
              take: 10,
            },
            features: {
              where: { status: { in: ["PLANNED", "IN_PROGRESS"] } },
              orderBy: [{ status: "asc" }, { priority: "desc" }],
              take: 10,
            },
            bugs: {
              where: { status: { in: ["INBOX", "ACTIVE"] } },
              orderBy: { severity: "desc" },
              take: 10,
            },
            queueItems: {
              where: { status: "QUEUED" },
              include: { prompt: { include: { currentVersion: true } } },
              orderBy: { position: "asc" },
              take: 10,
            },
            _count: { select: { bugs: { where: { status: { in: ["INBOX", "ACTIVE"] } } } } },
          },
        });
      
        if (!project) notFound();
      
        const health = projectHealth({
          status: project.status,
          lastActivity: project.lastActivityAt ?? project.updatedAt,
          blocker: project.currentBlocker,
          nextTask: project.nextTask,
          openBugs: project._count.bugs,
          totalFeatures: project.features.length,
          shippedFeatures: project.features.filter((f) => f.status === "DONE").length,
        });
      
        // Build the context packet
        const statement = project.productStatement || project.oneLineDescription || project.description || `${project.name} — see project for details.`;
        const techText = project.technologies.map((t) => `${t.category}: ${t.technology.name}${t.version ? `@${t.version}` : ""}`).join("\n");
        const currentTask = project.currentTask ? `Build: ${project.currentTask}\n${project.nextTask ? `Next: ${project.nextTask}` : ""}` : (project.nextTask ?? "No active task selected.");
      
        const sources = [
          {
            id: "task",
            title: "Current task",
            kind: "task" as const,
            relevant: true,
            content: currentTask,
          },
          {
            id: "state-works",
            title: "What already works",
            kind: "history" as const,
            relevant: true,
            content: project.whatWorks || "Nothing recorded yet.",
          },
          {
            id: "state-partial",
            title: "Partially built",
            kind: "history" as const,
            relevant: true,
            content: project.partiallyBuilt || "Nothing recorded.",
          },
          ...(project.currentBlocker ? [{ id: "blocker", title: "Known blocker", kind: "issue" as const, relevant: true, content: project.currentBlocker }] : []),
          ...project.decisions.map((d) => ({
            id: `decision-${d.id}`,
            title: `Decision: ${d.title}`,
            kind: "decision" as const,
            relevant: true,
            content: d.decision,
          })),
          ...project.boundaries.map((b) => ({
            id: `boundary-${b.id}`,
            title: `Boundary (${{ GOAL: "Goal", NON_GOAL: "Non-goal", CONSTRAINT: "Constraint", ASSUMPTION: "Assumption", FUTURE_IDEA: "Future idea" }[b.kind]})`,
            kind: "constraint" as const,
            relevant: true,
            content: b.content,
          })),
          ...project.features.map((f) => ({
            id: `feature-${f.id}`,
            title: `Feature: ${f.title}`,
            kind: "criteria" as const,
            relevant: true,
            content: f.acceptanceCriteria || f.body || f.title,
          })),
          ...project.bugs.map((b) => ({
            id: `bug-${b.id}`,
            title: `Bug: ${b.title}`,
            kind: "issue" as const,
            relevant: true,
            content: `${b.symptoms || ""}\n${b.reproduction ? `Reproduce: ${b.reproduction}` : ""}`.trim() || b.title,
          })),
          ...(techText ? [{ id: "tech", title: "Technology stack", kind: "architecture" as const, relevant: true, content: techText }] : []),
        ];
      
        const packet = compileContext({
          project: project.name,
          statement,
          sources,
          budget: 12000,
        });
      
        const toneClass: Record<typeof health.tone, string> = {
          red: "border-danger/25 bg-danger/8 text-danger",
          gold: "border-accent/25 bg-accent/8 text-accent",
          green: "border-success/25 bg-success/8 text-success",
          blue: "border-cobalt-400/25 bg-cobalt-400/8 text-cobalt-300",
          muted: "border-line bg-surface text-subtle",
        };
      
        return (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0 space-y-5">
              <div>
                <h2 className="text-title-2 text-foreground">Resume building</h2>
                <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                  Everything your agent needs to continue — and nothing it doesn&apos;t. Relevant
                  context beats maximum context.
                </p>
              </div>
      
              <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${toneClass[health.tone]}`}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
                <p className="text-body">
                  <span className="font-semibold">{health.label}.</span>{" "}
                  <span className="text-muted">{health.reason}</span>
                </p>
              </div>
      
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-caption text-subtle">
                  Paste this into your agent to pick up exactly where you stopped.
                </p>
                <CopyButton text={packet.markdown} label="Copy context packet" variant="primary" />
              </div>
      
              {/* Focusable: a scrollable region must be reachable by keyboard. */}
              <pre
                tabIndex={0}
                role="region"
                aria-label="Generated context packet"
                className="max-h-[70vh] overflow-auto rounded-2xl border border-line-subtle bg-well p-5
                  text-caption leading-relaxed text-ink-100"
              >
                {packet.markdown}
              </pre>
      
              {packet.omitted.length > 0 && (
                <details className="rounded-xl border border-line bg-surface px-4 py-3">
                  <summary className="cursor-pointer text-caption text-muted marker:text-subtle">
                    {packet.omitted.length} source{packet.omitted.length === 1 ? "" : "s"} left out
                  </summary>
                  <ul className="mt-3 space-y-1.5">
                    {packet.omitted.map((omission) => (
                      <li key={omission.id} className="flex gap-2 text-caption text-subtle">
                        <code className="text-ink-100">{omission.id}</code>
                        <span>— {omission.reason}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
      
            <aside className="space-y-5">
              <Panel>
                <PanelHeader title="Packet" description="What went in, and how big it is." />
                <dl className="space-y-3">
                  <Stat label="Sources included" value={packet.included.length} tone="text-foreground" />
                  <Stat
                    label="Characters"
                    value={`${(packet.characterCount / 1000).toFixed(1)}k`}
                    tone="text-accent"
                  />
                  <Stat label="Left out" value={packet.omitted.length} tone="text-subtle" />
                </dl>
              </Panel>
            </aside>
          </div>
        );
      }
      
      function Stat({
        label,
        value,
        tone,
      }: {
        label: string;
        value: number | string;
        tone: string;
      }) {
        return (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-caption text-muted">{label}</dt>
            <dd className={`tabular text-title-2 font-semibold ${tone}`}>{value}</dd>
          </div>
        );
      }

## Assistant

The data model already has the right entities and the pages already support creation in most sections, so this is a focused completion of the CRUD layer rather than a redesign from scratch. I’m preserving the app’s existing “project constellation” visual language, tightening action affordances into compact edit/delete controls, and treating Timeline and Export according to what they actually contain (history records and generated files, rather than pretending exports are editable records).

## Activity

    $ /bin/zsh -lc "for f in 'src/app/(authenticated)/prompts/page.tsx' 'src/app/(authenticated)/[slug]/features/page.tsx' 'src/app/(authenticated)/[slug]/milestones/page.tsx' 'src/app/(authenticated)/[slug]/bugs/page.tsx' 'src/app/(authenticated)/[slug]/decisions/page.tsx' 'src/app/(authenticated)/[slug]/notes/page.tsx' 'src/app/(authenticated)/[slug]/inspirations/page.tsx' 'src/app/(authenticated)/[slug]/commands/page.tsx' 'src/app/(authenticated)/[slug]/env/page.tsx' 'src/app/(authenticated)/[slug]/sessions/page.tsx'; do echo \"### "'$f"; rg -n "async function|db'"\\.|<Row|<form|<h3|CreateDisclosure|action=|type=\\\"submit\\\"\" \""'$f"; done && printf '"'\\n--- components ---\\n' && sed -n '1,280p' src/components/ui/dialog.tsx && sed -n '1,240p' src/components/ui/menu.tsx && sed -n '1,240p' src/components/ui/button.tsx && sed -n '1,260p' src/components/ui/field.tsx && printf '\\n--- project node ---\\n' && sed -n '1,300p' src/components/universe/project-node.tsx && printf '\\n--- CSS project node refs ---\\n' && rg -n \"project-node|universe|node-label|constellation\" src/app/globals.css src/components/universe -g '*.tsx'"
    status: Completed · exit 0
      ### src/app/(authenticated)/prompts/page.tsx
      12:import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
      23:export default async function PromptLibrary({
      45:  const prompts = await db.prompt.findMany({
      56:  const projects = await db.project.findMany({
      62:  async function createPrompt(formData: FormData) {
      78:    const prompt = await db.prompt.create({
      99:    await db.prompt.update({
      104:    await db.activity.create({
      126:      <CreateDisclosure label="New prompt" className="mb-6">
      127:        <form action={createPrompt} className="space-y-4">
      160:          <Button type="submit" variant="primary">
      164:      </CreateDisclosure>
      170:      <form method="get" role="search" className="mb-4 flex flex-wrap gap-2">
      189:        <Button type="submit">Search</Button>
      236:            <Row key={prompt.id} className="p-5">
      ### src/app/(authenticated)/[slug]/features/page.tsx
      12:import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
      17:export default async function FeaturesPage({ params }: Props) {
      21:  const project = await db.project.findUnique({
      32:  async function addFeature(formData: FormData) {
      50:    await db.feature.create({
      64:    await db.activity.create({
      75:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      80:  async function updateFeature(formData: FormData) {
      92:    const feature = await db.feature.findFirst({ where: { id, ownerId: actor.userId } });
      95:    await db.feature.update({
      101:      await db.activity.create({
      126:      <CreateDisclosure label="New feature">
      127:        <form action={addFeature} className="space-y-4">
      172:          <Button type="submit" variant="primary">
      176:      </CreateDisclosure>
      189:              <Row key={feature.id} className="p-5">
      191:                  <h3 className="text-title-3 text-foreground">{feature.title}</h3>
      215:                  <form action={updateFeature}>
      217:                    <RowActions>
      219:                        <RowButton name="status" value="IN_PROGRESS" tone="accent">
      224:                        <RowButton name="status" value="BLOCKED" tone="danger">
      228:                      <RowButton name="status" value="DONE" tone="success">
      ### src/app/(authenticated)/[slug]/milestones/page.tsx
      12:import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
      17:export default async function MilestonesPage({ params }: Props) {
      21:  const project = await db.project.findUnique({
      32:  async function addMilestone(formData: FormData) {
      47:    const maxSort = await db.milestone.aggregate({
      52:    await db.milestone.create({
      66:  async function updateStatus(formData: FormData) {
      78:    const milestone = await db.milestone.findFirst({ where: { id, ownerId: actor.userId } });
      81:    await db.milestone.update({
      86:      await db.activity.create({
      110:      <CreateDisclosure label="New milestone">
      111:        <form action={addMilestone} className="space-y-4">
      120:          <Button type="submit" variant="primary">
      124:      </CreateDisclosure>
      138:              <Row key={milestone.id} className="p-5">
      140:                  <h3
      178:                  <form action={updateStatus}>
      180:                    <RowActions>
      182:                        <RowButton name="status" value="IN_PROGRESS" tone="accent">
      186:                      <RowButton name="status" value="DONE" tone="success">
      ### src/app/(authenticated)/[slug]/bugs/page.tsx
      12:import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
      17:export default async function BugsPage({ params }: Props) {
      21:  const project = await db.project.findUnique({
      27:  async function addBug(formData: FormData) {
      45:    await db.bug.create({
      59:    await db.activity.create({
      70:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      75:  async function resolveOrReopen(formData: FormData) {
      88:    const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
      93:      await db.bug.update({
      97:      await db.activity.create({
      108:      await db.bug.update({ where: { id: bugNonNull.id }, data: { status: "ACTIVE" } });
      111:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      126:      <CreateDisclosure label="Report a bug">
      127:        <form action={addBug} className="space-y-4">
      163:          <Button type="submit" variant="primary">
      167:      </CreateDisclosure>
      181:              <Row key={bug.id} className="p-5">
      183:                  <h3 className="text-title-3 text-foreground">{bug.title}</h3>
      211:                  <form action={resolveOrReopen} className="mt-4 flex flex-wrap items-center gap-2">
      222:                    <RowButton name="action" value="resolve" tone="success">
      227:                  <form action={resolveOrReopen}>
      229:                    <RowActions>
      230:                      <RowButton name="action" value="reopen">
      ### src/app/(authenticated)/[slug]/decisions/page.tsx
      12:import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
      17:export default async function DecisionsPage({ params }: Props) {
      21:  const project = await db.project.findUnique({
      29:  async function addDecision(formData: FormData) {
      47:    await db.decision.create({
      62:    await db.activity.create({
      73:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      78:  async function updateStatus(formData: FormData) {
      90:    const existing = await db.decision.findFirst({ where: { id, ownerId: actor.userId } });
      93:    await db.decision.update({
      110:      <CreateDisclosure label="Record a decision">
      111:        <form action={addDecision} className="space-y-4">
      155:          <Button type="submit" variant="primary">
      159:      </CreateDisclosure>
      172:              <Row key={decision.id} className="p-5">
      174:                  <h3 className="text-title-3 text-foreground">{decision.title}</h3>
      195:                  <form action={updateStatus}>
      197:                    <RowActions>
      198:                      <RowButton name="status" value="ACCEPTED" tone="success">
      201:                      <RowButton name="status" value="REJECTED" tone="danger">
      ### src/app/(authenticated)/[slug]/notes/page.tsx
      12:import { CreateDisclosure, RowButton } from "@/components/ui/disclosure";
      17:export default async function NotesPage({ params }: Props) {
      21:  const project = await db.project.findUnique({
      27:  async function addNote(formData: FormData) {
      40:    await db.note.create({
      43:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      47:  async function togglePin(formData: FormData) {
      58:    const note = await db.note.findFirst({ where: { id, ownerId: actor.userId } });
      60:    await db.note.update({ where: { id: note.id }, data: { pinned: targetPinned } });
      74:      <CreateDisclosure label="New note">
      75:        <form action={addNote} className="space-y-4">
      91:          <Button type="submit" variant="primary">
      95:      </CreateDisclosure>
      106:            <Row key={note.id} className="p-5">
      109:                  <h3 className="flex items-center gap-2 text-title-3 text-foreground">
      123:                <form action={togglePin} className="shrink-0">
      126:                  <RowButton tone={note.pinned ? "accent" : "neutral"}>
      ### src/app/(authenticated)/[slug]/inspirations/page.tsx
      12:import { CreateDisclosure } from "@/components/ui/disclosure";
      20:export default async function InspirationsPage({ params }: Props) {
      24:  const project = await db.project.findUnique({
      30:  async function addInspiration(formData: FormData) {
      48:    await db.inspiration.create({
      60:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      74:      <CreateDisclosure label="Save inspiration">
      75:        <form action={addInspiration} className="space-y-4">
      100:          <Button type="submit" variant="primary">
      104:      </CreateDisclosure>
      115:            <Row key={item.id} className="p-5">
      117:                <h3 className="text-title-3 text-foreground">
      ### src/app/(authenticated)/[slug]/commands/page.tsx
      12:import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      16:export default async function CommandsPage({ params }: Props) {
      20:  const project = await db.project.findUnique({
      26:  async function addCommand(formData: FormData) {
      42:    const maxSort = await db.command.aggregate({
      47:    await db.command.create({
      61:  async function deleteCommand(formData: FormData) {
      71:    await db.command.deleteMany({ where: { id, ownerId: actor.userId, projectId: project!.id } });
      85:      <CreateDisclosure label="New command">
      86:        <form action={addCommand} className="space-y-4">
      105:          <Button type="submit" variant="primary">
      109:      </CreateDisclosure>
      120:            <Row key={command.id} className="p-4">
      124:                    <h3 className="text-title-3 text-foreground">{command.name}</h3>
      142:                  <form action={deleteCommand}>
      144:                    <RowButton tone="danger" aria-label={`Delete ${command.name}`}>
      ### src/app/(authenticated)/[slug]/env/page.tsx
      12:import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      16:export default async function EnvPage({ params }: Props) {
      20:  const project = await db.project.findUnique({
      30:  async function addVariable(formData: FormData) {
      47:    await db.environmentVariable.upsert({
      74:  async function toggleConfigured(formData: FormData) {
      85:    await db.environmentVariable.updateMany({
      92:  async function deleteVariable(formData: FormData) {
      102:    await db.environmentVariable.deleteMany({ where: { id, ownerId: actor.userId } });
      142:      <CreateDisclosure label="New variable">
      143:        <form action={addVariable} className="space-y-4">
      178:          <Button type="submit" variant="primary">
      182:      </CreateDisclosure>
      193:            <Row key={variable.id} className="p-4">
      197:                    <h3 className="font-mono text-title-3 text-foreground">{variable.name}</h3>
      219:                  <form action={toggleConfigured}>
      222:                    <RowButton tone={variable.configured ? "success" : "neutral"}>
      229:                  <form action={deleteVariable}>
      231:                    <RowButton tone="danger" aria-label={`Delete ${variable.name}`}>
      ### src/app/(authenticated)/[slug]/sessions/page.tsx
      12:import { CreateDisclosure } from "@/components/ui/disclosure";
      17:export default async function SessionsPage({ params }: Props) {
      21:  const project = await db.project.findUnique({
      27:  async function startSession(formData: FormData) {
      39:    const session = await db.codingSession.create({
      49:    await db.activity.create({
      60:    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      65:  async function endSession(formData: FormData) {
      83:    const session = await db.codingSession.findFirst({ where: { id, ownerId: actor.userId } });
      87:    await db.codingSession.update({
      101:      await db.decision.create({
      116:      await db.project.update({
      122:    await db.activity.create({
      147:      <CreateDisclosure label="Start a session">
      148:        <form action={startSession} className="space-y-4">
      157:          <Button type="submit" variant="primary">
      161:      </CreateDisclosure>
      174:              <Row key={session.id} className="p-5">
      176:                  <h3 className="text-title-3 text-foreground">{session.objective}</h3>
      235:                    <form
      236:                      action={endSession}
      277:                      <Button type="submit" variant="primary">
      
      --- components ---
      "use client";
      
      import * as DialogPrimitive from "@radix-ui/react-dialog";
      import { X } from "lucide-react";
      import type { ReactNode } from "react";
      import { cn } from "@/lib/cn";
      
      export const Dialog = DialogPrimitive.Root;
      export const DialogTrigger = DialogPrimitive.Trigger;
      export const DialogClose = DialogPrimitive.Close;
      
      /**
       * Modal surface. Enters with a short scale so it reads as arriving from the
       * page rather than sliding in from nowhere.
       */
      export function DialogContent({
        title,
        description,
        children,
        footer,
        size = "md",
        className,
      }: {
        title: string;
        description?: string;
        children: ReactNode;
        footer?: ReactNode;
        size?: "sm" | "md" | "lg";
        className?: string;
      }) {
        const width =
          size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";
      
        return (
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              className="fixed inset-0 z-(--z-overlay) bg-veil backdrop-blur-sm
                data-[state=open]:animate-[cadabry-overlay-in_var(--duration-base)_var(--ease-out)]"
            />
            <DialogPrimitive.Content
              className={cn(
                "fixed left-1/2 top-1/2 z-(--z-dialog) w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
                "max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-2xl border border-line-strong",
                "bg-overlay p-6 shadow-[var(--shadow-xl)]",
                "data-[state=open]:animate-[cadabry-scale-in_var(--duration-base)_var(--ease-out)]",
                width,
                className,
              )}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogPrimitive.Title className="text-title-2 text-foreground">
                    {title}
                  </DialogPrimitive.Title>
                  {description ? (
                    <DialogPrimitive.Description className="mt-1 text-caption text-muted">
                      {description}
                    </DialogPrimitive.Description>
                  ) : null}
                </div>
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="press -mr-1.5 -mt-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-xl text-subtle transition-colors hover:bg-surface-raised hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </DialogPrimitive.Close>
              </div>
      
              {children}
      
              {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        );
      }
      "use client";
      
      import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
      import * as TooltipPrimitive from "@radix-ui/react-tooltip";
      import * as SeparatorPrimitive from "@radix-ui/react-separator";
      import type { ComponentPropsWithoutRef, ReactNode } from "react";
      import { cn } from "@/lib/cn";
      
      /* ------------------------------------------------------------------ menu -- */
      
      export const Menu = DropdownMenu.Root;
      export const MenuTrigger = DropdownMenu.Trigger;
      
      const surface =
        "z-(--z-overlay) min-w-48 overflow-hidden rounded-xl border border-line-strong bg-overlay p-1 " +
        "shadow-[var(--shadow-lg)] data-[state=open]:animate-[cadabry-scale-in_var(--duration-fast)_var(--ease-out)]";
      
      export function MenuContent({
        children,
        align = "end",
        className,
        ...props
      }: ComponentPropsWithoutRef<typeof DropdownMenu.Content>) {
        return (
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align={align}
              sideOffset={6}
              className={cn(surface, className)}
              {...props}
            >
              {children}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        );
      }
      
      const itemStyle =
        "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-body " +
        "text-ink-100 outline-none data-[highlighted]:bg-surface-raised data-[highlighted]:text-foreground " +
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50";
      
      export function MenuItem({
        className,
        ...props
      }: ComponentPropsWithoutRef<typeof DropdownMenu.Item>) {
        return <DropdownMenu.Item className={cn(itemStyle, className)} {...props} />;
      }
      
      export function MenuLabel({ children }: { children: ReactNode }) {
        return (
          <DropdownMenu.Label className="eyebrow px-2.5 pb-1 pt-2">{children}</DropdownMenu.Label>
        );
      }
      
      export function MenuSeparator() {
        return <DropdownMenu.Separator className="my-1 h-px bg-line" />;
      }
      
      /* --------------------------------------------------------------- tooltip -- */
      
      export const TooltipProvider = TooltipPrimitive.Provider;
      
      /** Tooltips supplement a label, they never replace one. */
      export function Tooltip({
        content,
        children,
        side = "bottom",
      }: {
        content: ReactNode;
        children: ReactNode;
        side?: "top" | "right" | "bottom" | "left";
      }) {
        return (
          <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                side={side}
                sideOffset={6}
                className="z-(--z-overlay) flex items-center gap-2 rounded-lg border border-line-strong
                  bg-overlay px-2.5 py-1.5 text-caption text-ink-100 shadow-[var(--shadow-md)]
                  data-[state=delayed-open]:animate-[cadabry-scale-in_var(--duration-fast)_var(--ease-out)]"
              >
                {content}
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </TooltipPrimitive.Root>
        );
      }
      
      /* ------------------------------------------------------------- separator -- */
      
      export function Separator({
        className,
        orientation = "horizontal",
      }: {
        className?: string;
        orientation?: "horizontal" | "vertical";
      }) {
        return (
          <SeparatorPrimitive.Root
            orientation={orientation}
            className={cn(
              "shrink-0 bg-line",
              orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
              className,
            )}
          />
        );
      }
      import { Slot } from "@radix-ui/react-slot";
      import type { ButtonHTMLAttributes } from "react";
      import { cn } from "@/lib/cn";
      
      type Variant = "primary" | "secondary" | "ghost" | "danger" | "quiet";
      type Size = "sm" | "md" | "lg";
      
      const base =
        "press inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl " +
        "font-semibold transition-[background-color,border-color,color,box-shadow,transform] " +
        "duration-(--duration-fast) ease-(--ease-out) " +
        "disabled:pointer-events-none disabled:opacity-50";
      
      // Gold is the only "act on this" signal in the system; everything else recedes.
      const variants: Record<Variant, string> = {
        primary:
          "bg-accent text-on-accent hover:bg-accent-strong shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
        secondary:
          "border border-line bg-surface-raised text-foreground hover:border-line-strong hover:bg-overlay",
        ghost: "text-muted hover:bg-surface-raised hover:text-foreground",
        quiet:
          "border border-transparent text-muted hover:border-line hover:bg-surface hover:text-foreground",
        danger:
          "border border-danger-strong/60 bg-danger-strong/15 text-danger hover:bg-danger-strong/25 hover:text-foreground",
      };
      
      // Every interactive target clears 44px of height at md and lg, per Apple's
      // touch-target floor. sm is reserved for dense toolbars on pointer devices.
      const sizes: Record<Size, string> = {
        sm: "h-8 px-3 text-caption",
        md: "h-11 px-4 text-body",
        lg: "h-12 px-6 text-title-3",
      };
      
      export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: Variant;
        size?: Size;
        /** Render the child element instead of a <button> (e.g. a Next <Link>). */
        asChild?: boolean;
      };
      
      export function Button({
        className,
        variant = "secondary",
        size = "md",
        asChild = false,
        type,
        ...props
      }: ButtonProps) {
        const Comp = asChild ? Slot : "button";
        return (
          <Comp
            className={cn(base, variants[variant], sizes[size], className)}
            {...(asChild ? {} : { type: type ?? "button" })}
            {...props}
          />
        );
      }
      
      /** Square icon-only button. Requires an aria-label. */
      export function IconButton({
        className,
        variant = "ghost",
        size = "md",
        asChild = false,
        type,
        ...props
      }: ButtonProps & { "aria-label": string }) {
        const Comp = asChild ? Slot : "button";
        const square = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-11 w-11";
        return (
          <Comp
            className={cn(base, variants[variant], square, "rounded-xl p-0", className)}
            {...(asChild ? {} : { type: type ?? "button" })}
            {...props}
          />
        );
      }
      import type {
        InputHTMLAttributes,
        ReactNode,
        SelectHTMLAttributes,
        TextareaHTMLAttributes,
      } from "react";
      import { cn } from "@/lib/cn";
      
      const control =
        "w-full rounded-xl border border-line bg-well px-3.5 text-body text-foreground " +
        "placeholder:text-ink-300 transition-colors duration-(--duration-fast) " +
        "hover:border-line-strong focus:border-accent focus:outline-none " +
        "focus-visible:outline-none aria-[invalid=true]:border-danger " +
        "disabled:opacity-50";
      
      const inputHeight = "h-11";
      
      type FieldShellProps = {
        label: string;
        hint?: string;
        error?: string;
        htmlFor?: string;
        /** Hide the visual label but keep it for screen readers. */
        labelHidden?: boolean;
        children: ReactNode;
        className?: string;
      };
      
      /** Label + control + hint/error, wired together with the right aria plumbing. */
      export function FieldShell({
        label,
        hint,
        error,
        htmlFor,
        labelHidden,
        children,
        className,
      }: FieldShellProps) {
        return (
          <div className={cn("space-y-1.5", className)}>
            <label
              className={cn(
                "block text-caption font-semibold text-ink-100",
                labelHidden && "sr-only",
              )}
              htmlFor={htmlFor}
            >
              {label}
            </label>
            {children}
            {error ? (
              <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-caption text-danger">
                {error}
              </p>
            ) : hint ? (
              <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-caption text-subtle">
                {hint}
              </p>
            ) : null}
          </div>
        );
      }
      
      function describedBy(id: string | undefined, hint?: string, error?: string) {
        if (!id) return undefined;
        if (error) return `${id}-error`;
        if (hint) return `${id}-hint`;
        return undefined;
      }
      
      export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
        label: string;
        hint?: string;
        error?: string;
        labelHidden?: boolean;
        wrapperClassName?: string;
      };
      
      export function Field({
        label,
        hint,
        error,
        labelHidden,
        wrapperClassName,
        className,
        ...props
      }: FieldProps) {
        const id = props.id ?? props.name;
        return (
          <FieldShell
            label={label}
            hint={hint}
            error={error}
            htmlFor={id}
            labelHidden={labelHidden}
            className={wrapperClassName}
          >
            <input
              {...props}
              id={id}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(id, hint, error)}
              className={cn(control, inputHeight, className)}
            />
          </FieldShell>
        );
      }
      
      export type TextFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
        label: string;
        hint?: string;
        error?: string;
        labelHidden?: boolean;
        wrapperClassName?: string;
      };
      
      export function TextField({
        label,
        hint,
        error,
        labelHidden,
        wrapperClassName,
        className,
        rows = 5,
        ...props
      }: TextFieldProps) {
        const id = props.id ?? props.name;
        return (
          <FieldShell
            label={label}
            hint={hint}
            error={error}
            htmlFor={id}
            labelHidden={labelHidden}
            className={wrapperClassName}
          >
            <textarea
              {...props}
              id={id}
              rows={rows}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(id, hint, error)}
              className={cn(control, "resize-y py-2.5 leading-(--leading-body)", className)}
            />
          </FieldShell>
        );
      }
      
      export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
        label: string;
        hint?: string;
        error?: string;
        labelHidden?: boolean;
        wrapperClassName?: string;
      };
      
      /**
       * Native select. Deliberate: OS pickers beat custom listboxes for long,
       * keyboard-driven enum lists, and they cost nothing on mobile.
       */
      export function SelectField({
        label,
        hint,
        error,
        labelHidden,
        wrapperClassName,
        className,
        children,
        ...props
      }: SelectFieldProps) {
        const id = props.id ?? props.name;
        return (
          <FieldShell
            label={label}
            hint={hint}
            error={error}
            htmlFor={id}
            labelHidden={labelHidden}
            className={wrapperClassName}
          >
            <select
              {...props}
              id={id}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(id, hint, error)}
              className={cn(control, inputHeight, "appearance-none pr-9", className)}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5 6 6.5 11 1.5' stroke='%239eabc4' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.85rem center",
              }}
            >
              {children}
            </select>
          </FieldShell>
        );
      }
      
      /** Bare input for toolbars and search bars where the label lives elsewhere. */
      export function BareInput({
        className,
        ...props
      }: InputHTMLAttributes<HTMLInputElement>) {
        return <input {...props} className={cn(control, inputHeight, className)} />;
      }
      
      --- project node ---
      import Link from "next/link";
      import { AlertTriangle, Layers } from "lucide-react";
      import { placeNode } from "@/features/projects/constellation";
      import { daysSince, projectStatus, timeAgo } from "@/features/projects/display";
      
      export type UniverseProject = {
        id: string;
        name: string;
        slug: string;
        oneLineDescription: string | null;
        status: string;
        importance: number;
        progress: number;
        color: string | null;
        icon: string | null;
        currentTask: string | null;
        currentBlocker: string | null;
        lastActivityAt: Date | null;
        queuedCount: number;
        bugCount: number;
      };
      
      /**
       * Recency drives how brightly a project burns. Something touched today is at
       * full energy; a project untouched for a month is nearly dark. This is the
       * single visual cue that makes an abandoned project obvious at a glance.
       */
      function energyFor(lastActivityAt: Date | null, dormant: boolean): number {
        if (dormant) return 0.16;
        const days = daysSince(lastActivityAt);
        if (days <= 1) return 0.95;
        if (days <= 3) return 0.75;
        if (days <= 7) return 0.55;
        if (days <= 21) return 0.38;
        if (days <= 60) return 0.24;
        return 0.14;
      }
      
      function initials(name: string): string {
        const words = name.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return "?";
        if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
        return (words[0]![0]! + words[1]![0]!).toUpperCase();
      }
      
      const RADIUS = 46;
      const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
      
      export function ProjectNode({
        project,
        index,
        total,
        dimmed,
      }: {
        project: UniverseProject;
        index: number;
        total: number;
        dimmed: boolean;
      }) {
        const meta = projectStatus(project.status);
        const place = placeNode(index, total, project.id, project.importance);
        const energy = energyFor(project.lastActivityAt, Boolean(meta.dormant));
        const live = project.status === "BUILDING" && daysSince(project.lastActivityAt) <= 7;
      
        // A per-project colour overrides the status hue for the orb only — status
        // still owns the badge, so the state reading never gets ambiguous.
        const hue = project.color ?? meta.hue;
        const progress = Math.max(0, Math.min(100, project.progress));
      
        return (
          <li
            className="universe-node"
            data-dimmed={dimmed || undefined}
            style={
              {
                "--x": `${place.x}%`,
                "--y": `${place.y}%`,
                "--node-size": `${place.size + 60}px`,
                "--drift-x": `${place.driftX}px`,
                "--drift-y": `${place.driftY}px`,
                "--drift-duration": `${place.driftDuration}s`,
                "--drift-delay": `${place.driftDelay}s`,
              } as React.CSSProperties
            }
          >
            <Link
              href={`/${project.slug}`}
              className="node"
              data-live={live || undefined}
              style={
                {
                  "--hue": hue,
                  "--energy": energy,
                  "--orb": `${place.size * 0.62}px`,
                } as React.CSSProperties
              }
            >
              <span className="node-orb">
                <span className="node-aura" />
      
                {progress > 0 && (
                  <svg className="node-ring" viewBox="0 0 100 100" aria-hidden="true">
                    <circle
                      cx="50"
                      cy="50"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--track)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
                    />
                  </svg>
                )}
      
                <span className="node-core" style={{ fontSize: `${place.size * 0.22}px` }}>
                  {project.icon ? (
                    <span aria-hidden="true">{project.icon}</span>
                  ) : (
                    <span aria-hidden="true">{initials(project.name)}</span>
                  )}
                </span>
              </span>
      
              <span className="node-body">
                <span className="node-name">{project.name}</span>
      
                <span className="node-meta">
                  <span style={{ color: meta.hue }}>{meta.label}</span>
                  {progress > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular">{progress}%</span>
                    </>
                  )}
                  <span className="sr-only">
                    , last activity {timeAgo(project.lastActivityAt)}
                  </span>
                  {project.queuedCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-cobalt-400">
                      <Layers className="h-3 w-3" aria-hidden="true" />
                      {project.queuedCount}
                      <span className="sr-only"> prompts queued</span>
                    </span>
                  )}
                  {(project.currentBlocker || project.bugCount > 0) && (
                    <span className="inline-flex items-center gap-1 text-danger">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">
                        {project.currentBlocker ? "blocked" : `${project.bugCount} open bugs`}
                      </span>
                    </span>
                  )}
                </span>
      
                {(project.currentTask ?? project.oneLineDescription) && (
                  <span className="node-detail">
                    {project.currentTask
                      ? `Building: ${project.currentTask}`
                      : project.oneLineDescription}
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      }
      
      --- CSS project node refs ---
      src/components/universe/project-node.tsx:3:import { placeNode } from "@/features/projects/constellation";
      src/components/universe/project-node.tsx:72:      className="universe-node"
      src/app/globals.css:76:  /* Glass: used only on elements that float above the universe. */
      src/app/globals.css:97:  --constellation: color-mix(in oklab, var(--cobalt-400) 46%, transparent);
      src/app/globals.css:185:  --constellation: color-mix(in oklab, #6f6549 72%, transparent);
      src/app/globals.css:342:  --text-display: 3rem;     /* 48px — universe hero, empty states */
      src/app/globals.css:548:  /* Frosted panel floating above the universe. */
      src/app/globals.css:563:     The universe
      src/app/globals.css:648:   Motion preferences — the universe holds still when asked.
      src/app/globals.css:674:  .universe {
      src/app/globals.css:685:  .universe-node {
      src/app/globals.css:689:  /* Map view: nodes take the positions the constellation layout assigned them. */
      src/app/globals.css:691:    .universe[data-view="map"] {
      src/app/globals.css:696:    .universe[data-view="map"] .universe-node {
      src/app/globals.css:707:    .universe[data-view="map"] .universe-node:hover,
      src/app/globals.css:708:    .universe[data-view="map"] .universe-node:focus-within {
      src/app/globals.css:715:     constellation keeps its shape instead of reflowing on every filter change. */
      src/app/globals.css:716:  .universe-node[data-dimmed="true"] {
      src/app/globals.css:721:  .universe-node[data-dimmed="true"] .node-aura {
      src/app/globals.css:844:    .universe[data-view="map"] .node {
      src/app/globals.css:853:    .universe[data-view="map"] .node:hover,
      src/app/globals.css:854:    .universe[data-view="map"] .node:focus-visible {
      src/app/globals.css:861:    .universe[data-view="map"] .node-name {
      src/app/globals.css:865:    .universe[data-view="map"] .node-meta {
      src/app/globals.css:871:    .universe[data-view="map"] .node-detail {
      src/app/globals.css:876:    .universe[data-view="map"] .node:hover .node-detail,
      src/app/globals.css:877:    .universe[data-view="map"] .node:focus-visible .node-detail {
      src/components/universe/star-field.tsx:1:import { generateStars } from "@/features/projects/constellation";
      src/components/universe/star-field.tsx:8: * The sky behind the constellation. Purely decorative, so it is hidden from
      src/components/universe/constellation-lines.tsx:1:import { placeNode } from "@/features/projects/constellation";
      src/components/universe/constellation-lines.tsx:4: * The lines that make a set of stars a constellation.
      src/components/universe/constellation-lines.tsx:29:  // Closed, so the constellation reads as one figure rather than a loose path.
      src/components/universe/constellation-lines.tsx:43:        stroke="var(--constellation)"
      src/components/universe/universe.tsx:7:import { ProjectNode, type UniverseProject } from "./project-node";
      src/components/universe/universe.tsx:8:import { ConstellationLines } from "./constellation-lines";
      src/components/universe/universe.tsx:15:const VIEW_KEY = "cadabry:universe-view";
      src/components/universe/universe.tsx:87:  // The field grows with the constellation. A fixed 620px of sky around four
      src/components/universe/universe.tsx:98:            title="Your universe is empty"
      src/components/universe/universe.tsx:116:    <section aria-label="Project universe" className="relative">
      src/components/universe/universe.tsx:180:              className="universe"
      src/components/universe/universe.tsx:208:          No {projectStatus(filter).label.toLowerCase()} projects. The rest of your universe is

## Activity

    $ /bin/zsh -lc "sed -n '660,900p' src/app/globals.css && printf '\\n--- disclosure ---\\n' && sed -n '1,260p' src/components/ui/disclosure.tsx && printf '\\n--- schema models remainder ---\\n' && rg -n '"'^model (Prompt|PromptVersion|PromptQueueItem|Idea|Note|Bug|Decision|CodingSession|Inspiration|Command|EnvironmentVariable|Activity)'"' prisma/schema.prisma"
    status: Completed · exit 0
          transform: none;
        }
      }
      
      @layer components {
        /* ============================================================================
           Universe layout
      
           The map and the list are the SAME DOM — one <ul> of project nodes. Only the
           positioning changes, so the accessibility tree, tab order and screen-reader
           count stay identical in both views, and small screens get the readable
           layout without a second copy of the markup.
           ========================================================================== */
      
        .universe {
          --node-size: 84px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
      
        .universe-node {
          position: relative;
        }
      
        /* Map view: nodes take the positions the constellation layout assigned them. */
        @media (min-width: 768px) {
          .universe[data-view="map"] {
            display: block;
            height: var(--field-height, 520px);
          }
      
          .universe[data-view="map"] .universe-node {
            position: absolute;
            left: var(--x);
            top: var(--y);
            width: var(--node-size);
            transform: translate(-50%, -50%);
            animation: cadabry-drift var(--drift-duration, 15s) var(--ease-in-out) var(--drift-delay, 0s)
              infinite;
          }
      
          /* Lift the focused or hovered node above its neighbours' labels. */
          .universe[data-view="map"] .universe-node:hover,
          .universe[data-view="map"] .universe-node:focus-within {
            z-index: 5;
            animation-play-state: paused;
          }
        }
      
        /* A node the current filter excludes stays in the sky but recedes, so the
           constellation keeps its shape instead of reflowing on every filter change. */
        .universe-node[data-dimmed="true"] {
          opacity: 0.22;
          filter: saturate(0.4);
        }
      
        .universe-node[data-dimmed="true"] .node-aura {
          display: none;
        }
      
        /* ---------------------------------------------------------------- a node -- */
      
        /* List view is the base: a horizontal row, circle then text. Map view turns
           the same element into a stacked celestial body. */
        .node {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          border-radius: var(--radius-xl);
          border: 1px solid transparent;
          padding: 0.625rem 0.875rem;
          text-decoration: none;
          transition:
            background-color var(--duration-base) var(--ease-out),
            border-color var(--duration-base) var(--ease-out),
            transform var(--duration-base) var(--ease-out);
        }
      
        .node:hover,
        .node:focus-visible {
          background: var(--surface);
          border-color: var(--line);
        }
      
        .node-body {
          min-width: 0;
          flex: 1;
        }
      
        .node-orb {
          position: relative;
          display: grid;
          place-items: center;
          flex: none;
          width: var(--orb, 48px);
          height: var(--orb, 48px);
        }
      
        /* The aura is the project's energy: hue from status, strength from recency. */
        .node-aura {
          position: absolute;
          inset: -28%;
          border-radius: 9999px;
          background: radial-gradient(circle, var(--hue) 0%, transparent 68%);
          opacity: var(--energy, 0.4);
          filter: blur(6px);
        }
      
        .node[data-live="true"] .node-aura {
          animation: cadabry-pulse 4.5s var(--ease-in-out) infinite;
        }
      
        .node-core {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          border: 1px solid color-mix(in oklab, var(--hue) 55%, transparent);
          background:
            radial-gradient(circle at 32% 26%, color-mix(in oklab, var(--hue) 40%, transparent), transparent 62%),
            linear-gradient(160deg, var(--surface-raised), var(--well));
          color: var(--foreground);
          font-weight: var(--weight-semibold);
          letter-spacing: -0.02em;
          overflow: hidden;
        }
      
        [data-theme="light"] .node-core {
          border: 1px solid color-mix(in oklab, var(--hue) 62%, transparent);
          box-shadow: var(--shadow-sm);
        }
      
        /* Progress rides the rim of the orb as an arc — the ring IS the progress bar. */
        .node-ring {
          position: absolute;
          inset: -5px;
          transform: rotate(-90deg);
          overflow: visible;
        }
      
        .node:hover .node-orb,
        .node:focus-visible .node-orb {
          transform: scale(1.06);
          transition: transform var(--duration-base) var(--ease-spring);
        }
      
        .node-name {
          display: block;
          font-family: var(--font-display);
          font-size: var(--text-title-3);
          font-weight: 560;
          letter-spacing: var(--tracking-title);
          color: var(--foreground);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      
        .node-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: var(--text-caption);
          color: var(--muted);
          min-width: 0;
        }
      
        .node-detail {
          display: block;
          font-size: var(--text-caption);
          color: var(--subtle);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      
        @media (min-width: 768px) {
          .universe[data-view="map"] .node {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
            text-align: center;
            background: none;
            border-color: transparent;
          }
      
          .universe[data-view="map"] .node:hover,
          .universe[data-view="map"] .node:focus-visible {
            background: var(--glass);
            backdrop-filter: blur(var(--glass-blur));
            -webkit-backdrop-filter: blur(var(--glass-blur));
            border-color: var(--line);
          }
      
          .universe[data-view="map"] .node-name {
            font-size: var(--text-body);
          }
      
          .universe[data-view="map"] .node-meta {
            justify-content: center;
          }
      
          /* The current task is the payload of the map: it only appears when a node is
             hovered or focused, so the sky stays quiet until you ask it something. */
          .universe[data-view="map"] .node-detail {
            display: none;
            max-width: 15rem;
          }
      
          .universe[data-view="map"] .node:hover .node-detail,
          .universe[data-view="map"] .node:focus-visible .node-detail {
            display: block;
          }
        }
      
      }
      
      --- disclosure ---
      import type { ReactNode } from "react";
      import { Plus } from "lucide-react";
      import { cn } from "@/lib/cn";
      
      /**
       * Collapsed "add a record" form.
       *
       * Native <details> on purpose: it needs no JavaScript, it is keyboard and
       * screen-reader correct for free, and the content inside is a server-action
       * form that must work before hydration.
       */
      export function CreateDisclosure({
        label,
        children,
        defaultOpen = false,
        className,
      }: {
        label: string;
        children: ReactNode;
        defaultOpen?: boolean;
        className?: string;
      }) {
        return (
          <details
            open={defaultOpen}
            className={cn(
              "group rounded-2xl border border-line bg-surface open:bg-surface-raised/40",
              className,
            )}
          >
            <summary
              className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3.5
                text-body font-semibold text-muted transition-colors hover:text-foreground
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                [&::-webkit-details-marker]:hidden"
            >
              <Plus
                className="h-4 w-4 transition-transform duration-(--duration-base) group-open:rotate-45"
                aria-hidden="true"
              />
              {label}
            </summary>
            <div className="border-t border-line-subtle px-4 py-5">{children}</div>
          </details>
        );
      }
      
      /** Two-column form grid that collapses on narrow screens. */
      export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
        return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
      }
      
      /** Inline action buttons attached to a record row. */
      export function RowActions({ children, className }: { children: ReactNode; className?: string }) {
        return (
          <div className={cn("mt-3 flex flex-wrap items-center gap-2", className)}>{children}</div>
        );
      }
      
      /**
       * Small status-changing button used inside record rows. Deliberately not the
       * primary Button: gold is reserved for the single main action on a screen.
       */
      export function RowButton({
        children,
        tone = "neutral",
        ...props
      }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        tone?: "neutral" | "success" | "danger" | "accent";
      }) {
        const tones = {
          neutral: "border-line bg-surface-raised text-muted hover:text-foreground",
          success: "border-success/35 bg-success/10 text-success hover:bg-success/18",
          danger: "border-danger/35 bg-danger/10 text-danger hover:bg-danger/18",
          accent: "border-accent/35 bg-accent/10 text-accent hover:bg-accent/18",
        }[tone];
      
        return (
          <button
            type="submit"
            {...props}
            className={cn(
              "press inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-caption",
              "font-semibold transition-colors duration-(--duration-fast)",
              tones,
              props.className,
            )}
          >
            {children}
          </button>
        );
      }
      
      --- schema models remainder ---
      317:model Prompt {
      346:model PromptVersion {
      367:model PromptQueueItem {
      547:model Idea {
      565:model Note {
      582:model Bug {
      612:model Decision {
      640:model CodingSession {
      664:model CodingSessionPrompt {
      676:model CodingSessionFeature {
      688:model Inspiration {
      710:model InspirationAttachment {
      729:model Command {
      744:model EnvironmentVariable {
      762:model Activity {

## Activity

    $ /bin/zsh -lc "sed -n '317,790p' prisma/schema.prisma && printf '\\n--- prompt page ---\\n' && sed -n '1,330p' 'src/app/(authenticated)/prompts/page.tsx' && printf '\\n--- features ---\\n' && sed -n '1,290p' 'src/app/(authenticated)/[slug]/features/page.tsx' && printf '\\n--- milestones ---\\n' && sed -n '1,250p' 'src/app/(authenticated)/[slug]/milestones/page.tsx'"
    status: Completed · exit 0
      model Prompt {
        id               String                @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId          String                @map("owner_id") @db.Uuid
        projectId        String?               @map("project_id") @db.Uuid
        featureId        String?               @map("feature_id") @db.Uuid
        title            String
        category         String?
        status           PromptStatus          @default(DRAFT)
        favorite         Boolean               @default(false)
        reusable         Boolean               @default(false)
        notes            String?
        currentVersionId String?               @unique @map("current_version_id") @db.Uuid
        lastUsedAt       DateTime?             @map("last_used_at") @db.Timestamptz
        archivedAt       DateTime?             @map("archived_at") @db.Timestamptz
        createdAt        DateTime              @default(now()) @map("created_at") @db.Timestamptz
        updatedAt        DateTime              @updatedAt @map("updated_at") @db.Timestamptz
        project          Project?              @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        feature          Feature?              @relation(fields: [ownerId, featureId], references: [ownerId, id], onDelete: Restrict)
        versions         PromptVersion[]       @relation("PromptVersions")
        currentVersion   PromptVersion?        @relation("CurrentPromptVersion", fields: [currentVersionId], references: [id], onDelete: Restrict)
        queueItems       PromptQueueItem[]
        codingSessions   CodingSessionPrompt[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status])
        @@index([ownerId, featureId])
        @@map("prompts")
      }
      
      model PromptVersion {
        id            String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId       String            @map("owner_id") @db.Uuid
        promptId      String            @map("prompt_id") @db.Uuid
        versionNumber Int               @map("version_number")
        content       String
        changeNote    String?           @map("change_note")
        createdById   String            @map("created_by_id") @db.Uuid
        createdAt     DateTime          @default(now()) @map("created_at") @db.Timestamptz
        prompt        Prompt            @relation("PromptVersions", fields: [ownerId, promptId], references: [ownerId, id], onDelete: Cascade)
        currentFor    Prompt?           @relation("CurrentPromptVersion")
        createdBy     User              @relation("PromptVersionCreator", fields: [createdById], references: [id], onDelete: Restrict)
        queueItems    PromptQueueItem[]
      
        @@unique([ownerId, id])
        @@unique([promptId, versionNumber])
        @@index([ownerId, promptId])
        @@index([createdById])
        @@map("prompt_versions")
      }
      
      model PromptQueueItem {
        id              String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId         String        @map("owner_id") @db.Uuid
        projectId       String        @map("project_id") @db.Uuid
        promptId        String        @map("prompt_id") @db.Uuid
        promptVersionId String        @map("prompt_version_id") @db.Uuid
        featureId       String?       @map("feature_id") @db.Uuid
        milestoneId     String?       @map("milestone_id") @db.Uuid
        ideaId          String?       @map("idea_id") @db.Uuid
        bugId           String?       @map("bug_id") @db.Uuid
        status          QueueStatus   @default(QUEUED)
        position        Int
        sentAt          DateTime?     @map("sent_at") @db.Timestamptz
        completedAt     DateTime?     @map("completed_at") @db.Timestamptz
        note            String?
        createdAt       DateTime      @default(now()) @map("created_at") @db.Timestamptz
        updatedAt       DateTime      @updatedAt @map("updated_at") @db.Timestamptz
        project         Project       @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        prompt          Prompt        @relation(fields: [ownerId, promptId], references: [ownerId, id], onDelete: Restrict)
        promptVersion   PromptVersion @relation(fields: [ownerId, promptVersionId], references: [ownerId, id], onDelete: Restrict)
        feature         Feature?      @relation(fields: [ownerId, featureId], references: [ownerId, id], onDelete: Restrict)
        milestone       Milestone?    @relation(fields: [ownerId, milestoneId], references: [ownerId, id], onDelete: Restrict)
        idea            Idea?         @relation(fields: [ownerId, ideaId], references: [ownerId, id], onDelete: Restrict)
        bug             Bug?          @relation(fields: [ownerId, bugId], references: [ownerId, id], onDelete: Restrict)
      
        @@index([ownerId, projectId, status, position])
        @@index([ownerId, promptId])
        @@index([ownerId, promptVersionId])
        @@index([ownerId, featureId])
        @@index([ownerId, milestoneId])
        @@index([ownerId, ideaId])
        @@index([ownerId, bugId])
        @@map("prompt_queue_items")
      }
      
      model BuilderProfile {
        id           String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId      String        @unique @map("owner_id") @db.Uuid
        displayName  String?       @map("display_name")
        defaultAgent String?       @map("default_agent")
        createdAt    DateTime      @default(now()) @map("created_at") @db.Timestamptz
        updatedAt    DateTime      @updatedAt @map("updated_at") @db.Timestamptz
        rules        BuilderRule[]
      
        @@map("builder_profiles")
      }
      
      model BuilderRule {
        id        String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId   String         @map("owner_id") @db.Uuid
        profileId String         @map("profile_id") @db.Uuid
        category  String
        content   String
        enabled   Boolean        @default(true)
        priority  Int            @default(0)
        profile   BuilderProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
      
        @@index([ownerId, profileId, enabled])
        @@map("builder_rules")
      }
      
      model ContextPack {
        id          String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId     String            @map("owner_id") @db.Uuid
        projectId   String?           @map("project_id") @db.Uuid
        name        String
        description String?
        favorite    Boolean           @default(false)
        archivedAt  DateTime?         @map("archived_at") @db.Timestamptz
        createdAt   DateTime          @default(now()) @map("created_at") @db.Timestamptz
        updatedAt   DateTime          @updatedAt @map("updated_at") @db.Timestamptz
        project     Project?          @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        rules       ContextPackRule[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, archivedAt])
        @@map("context_packs")
      }
      
      model ContextPackRule {
        id        String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId   String      @map("owner_id") @db.Uuid
        packId    String      @map("pack_id") @db.Uuid
        content   String
        priority  Int         @default(0)
        enabled   Boolean     @default(true)
        sortOrder Int         @default(0) @map("sort_order")
        pack      ContextPack @relation(fields: [ownerId, packId], references: [ownerId, id], onDelete: Cascade)
      
        @@index([ownerId, packId, enabled, sortOrder])
        @@map("context_pack_rules")
      }
      
      model Skill {
        id                       String             @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId                  String             @map("owner_id") @db.Uuid
        name                     String
        description              String?
        category                 String?
        whenToUse                String?            @map("when_to_use")
        installationInstructions String?            @map("installation_instructions")
        command                  String?
        url                      String?
        agentInstructions        String?            @map("agent_instructions")
        notes                    String?
        favorite                 Boolean            @default(false)
        createdAt                DateTime           @default(now()) @map("created_at") @db.Timestamptz
        updatedAt                DateTime           @updatedAt @map("updated_at") @db.Timestamptz
        projectTypes             SkillProjectType[]
        technologies             SkillTechnology[]
        useCases                 SkillUseCase[]
      
        @@unique([ownerId, id])
        @@index([ownerId, name])
        @@map("skills")
      }
      
      model SkillProjectType {
        ownerId     String @map("owner_id") @db.Uuid
        skillId     String @map("skill_id") @db.Uuid
        projectType String @map("project_type")
        skill       Skill  @relation(fields: [ownerId, skillId], references: [ownerId, id], onDelete: Cascade)
      
        @@id([skillId, projectType])
        @@map("skill_project_types")
      }
      
      model SkillTechnology {
        ownerId      String     @map("owner_id") @db.Uuid
        skillId      String     @map("skill_id") @db.Uuid
        technologyId String     @map("technology_id") @db.Uuid
        skill        Skill      @relation(fields: [ownerId, skillId], references: [ownerId, id], onDelete: Cascade)
        technology   Technology @relation(fields: [ownerId, technologyId], references: [ownerId, id], onDelete: Cascade)
      
        @@id([skillId, technologyId])
        @@index([ownerId, technologyId])
        @@map("skill_technologies")
      }
      
      model SkillUseCase {
        ownerId String @map("owner_id") @db.Uuid
        skillId String @map("skill_id") @db.Uuid
        useCase String @map("use_case")
        skill   Skill  @relation(fields: [ownerId, skillId], references: [ownerId, id], onDelete: Cascade)
      
        @@id([skillId, useCase])
        @@map("skill_use_cases")
      }
      
      model StackPreset {
        id           String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId      String                  @map("owner_id") @db.Uuid
        name         String
        description  String?
        favorite     Boolean                 @default(false)
        createdAt    DateTime                @default(now()) @map("created_at") @db.Timestamptz
        updatedAt    DateTime                @updatedAt @map("updated_at") @db.Timestamptz
        technologies StackPresetTechnology[]
      
        @@unique([ownerId, id])
        @@unique([ownerId, name])
        @@map("stack_presets")
      }
      
      model StackPresetTechnology {
        ownerId      String      @map("owner_id") @db.Uuid
        presetId     String      @map("preset_id") @db.Uuid
        technologyId String      @map("technology_id") @db.Uuid
        category     String
        version      String?
        note         String?
        sortOrder    Int         @default(0) @map("sort_order")
        preset       StackPreset @relation(fields: [ownerId, presetId], references: [ownerId, id], onDelete: Cascade)
        technology   Technology  @relation(fields: [ownerId, technologyId], references: [ownerId, id], onDelete: Restrict)
      
        @@id([presetId, technologyId, category])
        @@index([ownerId, technologyId])
        @@map("stack_preset_technologies")
      }
      
      model Idea {
        id         String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId    String            @map("owner_id") @db.Uuid
        projectId  String?           @map("project_id") @db.Uuid
        title      String
        body       String?
        status     MemoryStatus      @default(INBOX)
        priority   Int               @default(0)
        createdAt  DateTime          @default(now()) @map("created_at") @db.Timestamptz
        updatedAt  DateTime          @updatedAt @map("updated_at") @db.Timestamptz
        project    Project?          @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        queueItems PromptQueueItem[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status])
        @@map("ideas")
      }
      
      model Note {
        id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId   String   @map("owner_id") @db.Uuid
        projectId String?  @map("project_id") @db.Uuid
        title     String
        body      String
        kind      String?
        pinned    Boolean  @default(false)
        createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
        updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz
        project   Project? @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, pinned])
        @@map("notes")
      }
      
      model Bug {
        id               String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId          String            @map("owner_id") @db.Uuid
        projectId        String            @map("project_id") @db.Uuid
        featureId        String?           @map("feature_id") @db.Uuid
        codingSessionId  String?           @map("coding_session_id") @db.Uuid
        title            String
        symptoms         String?
        expectedBehavior String?           @map("expected_behavior")
        actualBehavior   String?           @map("actual_behavior")
        reproduction     String?
        suspectedCause   String?           @map("suspected_cause")
        status           MemoryStatus      @default(ACTIVE)
        severity         Int               @default(0)
        resolution       String?
        rootCause        String?           @map("root_cause")
        createdAt        DateTime          @default(now()) @map("created_at") @db.Timestamptz
        updatedAt        DateTime          @updatedAt @map("updated_at") @db.Timestamptz
        project          Project           @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        feature          Feature?          @relation(fields: [ownerId, featureId], references: [ownerId, id], onDelete: Restrict)
        codingSession    CodingSession?    @relation(fields: [ownerId, codingSessionId], references: [ownerId, id], onDelete: Restrict)
        queueItems       PromptQueueItem[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status, severity])
        @@index([ownerId, featureId])
        @@index([ownerId, codingSessionId])
        @@map("bugs")
      }
      
      model Decision {
        id              String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId         String         @map("owner_id") @db.Uuid
        projectId       String         @map("project_id") @db.Uuid
        codingSessionId String?        @map("coding_session_id") @db.Uuid
        supersededById  String?        @map("superseded_by_id") @db.Uuid
        title           String
        decision        String
        reasoning       String?
        alternatives    String?
        affectedSystem  String?        @map("affected_system")
        reversible      Boolean        @default(true)
        status          DecisionStatus @default(PROPOSED)
        decidedAt       DateTime?      @map("decided_at") @db.Timestamptz
        createdAt       DateTime       @default(now()) @map("created_at") @db.Timestamptz
        updatedAt       DateTime       @updatedAt @map("updated_at") @db.Timestamptz
        project         Project        @relation("ProjectDecisions", fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        codingSession   CodingSession? @relation(fields: [ownerId, codingSessionId], references: [ownerId, id], onDelete: Restrict)
        supersededBy    Decision?      @relation("DecisionSupersession", fields: [ownerId, supersededById], references: [ownerId, id], onDelete: Restrict)
        supersedes      Decision[]     @relation("DecisionSupersession")
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status, decidedAt])
        @@index([ownerId, codingSessionId])
        @@index([ownerId, supersededById])
        @@map("decisions")
      }
      
      model CodingSession {
        id          String                 @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId     String                 @map("owner_id") @db.Uuid
        projectId   String                 @map("project_id") @db.Uuid
        objective   String
        status      SessionStatus          @default(ACTIVE)
        startedAt   DateTime               @default(now()) @map("started_at") @db.Timestamptz
        endedAt     DateTime?              @map("ended_at") @db.Timestamptz
        notes       String?
        discoveries String?
        whatChanged String?                @map("what_changed")
        nextTask    String?                @map("next_task")
        project     Project                @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        prompts     CodingSessionPrompt[]
        features    CodingSessionFeature[]
        bugs        Bug[]
        decisions   Decision[]
        activities  Activity[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, startedAt])
        @@map("coding_sessions")
      }
      
      model CodingSessionPrompt {
        ownerId         String        @map("owner_id") @db.Uuid
        codingSessionId String        @map("coding_session_id") @db.Uuid
        promptId        String        @map("prompt_id") @db.Uuid
        codingSession   CodingSession @relation(fields: [ownerId, codingSessionId], references: [ownerId, id], onDelete: Cascade)
        prompt          Prompt        @relation(fields: [ownerId, promptId], references: [ownerId, id], onDelete: Restrict)
      
        @@id([codingSessionId, promptId])
        @@index([ownerId, promptId])
        @@map("coding_session_prompts")
      }
      
      model CodingSessionFeature {
        ownerId         String        @map("owner_id") @db.Uuid
        codingSessionId String        @map("coding_session_id") @db.Uuid
        featureId       String        @map("feature_id") @db.Uuid
        codingSession   CodingSession @relation(fields: [ownerId, codingSessionId], references: [ownerId, id], onDelete: Cascade)
        feature         Feature       @relation(fields: [ownerId, featureId], references: [ownerId, id], onDelete: Restrict)
      
        @@id([codingSessionId, featureId])
        @@index([ownerId, featureId])
        @@map("coding_session_features")
      }
      
      model Inspiration {
        id                String                  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId           String                  @map("owner_id") @db.Uuid
        projectId         String?                 @map("project_id") @db.Uuid
        kind              InspirationKind
        title             String
        canonicalUrl      String?                 @map("canonical_url")
        textSnippet       String?                 @map("text_snippet")
        note              String?
        inspiredDetail    String?                 @map("inspired_detail")
        externalMediaType String?                 @map("external_media_type")
        externalMediaUrl  String?                 @map("external_media_url")
        createdAt         DateTime                @default(now()) @map("created_at") @db.Timestamptz
        updatedAt         DateTime                @updatedAt @map("updated_at") @db.Timestamptz
        project           Project?                @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        attachments       InspirationAttachment[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, createdAt])
        @@map("inspirations")
      }
      
      model InspirationAttachment {
        id               String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId          String           @map("owner_id") @db.Uuid
        inspirationId    String           @map("inspiration_id") @db.Uuid
        storageKey       String           @unique @map("storage_key")
        originalFilename String           @map("original_filename")
        mediaType        String           @map("media_type")
        byteSize         BigInt           @map("byte_size")
        checksumSha256   String?          @map("checksum_sha256")
        width            Int?
        height           Int?
        status           AttachmentStatus @default(PENDING)
        createdAt        DateTime         @default(now()) @map("created_at") @db.Timestamptz
        inspiration      Inspiration      @relation(fields: [ownerId, inspirationId], references: [ownerId, id], onDelete: Cascade)
      
        @@index([ownerId, inspirationId])
        @@map("inspiration_attachments")
      }
      
      model Command {
        id          String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId     String  @map("owner_id") @db.Uuid
        projectId   String  @map("project_id") @db.Uuid
        name        String
        commandText String  @map("command_text")
        description String?
        category    String?
        sortOrder   Int     @default(0) @map("sort_order")
        project     Project @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
      
        @@index([ownerId, projectId, sortOrder])
        @@map("commands")
      }
      
      model EnvironmentVariable {
        id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId         String  @map("owner_id") @db.Uuid
        projectId       String  @map("project_id") @db.Uuid
        name            String
        description     String?
        required        Boolean @default(false)
        environment     String
        configured      Boolean @default(false)
        acquisitionNote String? @map("acquisition_note")
        note            String?
        project         Project @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
      
        @@unique([projectId, environment, name])
        @@index([ownerId, projectId])
        @@map("environment_variables")
      }
      
      model Activity {
        id              String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId         String         @map("owner_id") @db.Uuid
        projectId       String?        @map("project_id") @db.Uuid
        actorUserId     String         @map("actor_user_id") @db.Uuid
        codingSessionId String?        @map("coding_session_id") @db.Uuid
        type            String
        subjectKind     String         @map("subject_kind")
        subjectId       String?        @map("subject_id") @db.Uuid
        summary         String
        metadata        Json           @default("{}") @db.JsonB
        correlationId   String?        @map("correlation_id")
        occurredAt      DateTime       @default(now()) @map("occurred_at") @db.Timestamptz
        project         Project?       @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Restrict)
        actor           User           @relation("ActivityActor", fields: [actorUserId], references: [id], onDelete: Restrict)
        codingSession   CodingSession? @relation(fields: [ownerId, codingSessionId], references: [ownerId, id], onDelete: Restrict)
      
        @@index([ownerId, occurredAt, id])
        @@index([ownerId, projectId, occurredAt, id])
        @@index([actorUserId])
        @@index([ownerId, codingSessionId])
        @@map("activities")
      }
      
      --- prompt page ---
      import { redirect } from "next/navigation";
      import { cookies } from "next/headers";
      import Link from "next/link";
      import { FileText, Search } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { Button } from "@/components/ui/button";
      import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
      import { cn } from "@/lib/cn";
      
      export const metadata = { title: "Prompt library" };
      
      const PROMPT_CATEGORIES = [
        "Starter", "Feature", "Debug", "Refactor", "UI", "Database", "Security",
        "Performance", "Testing", "Deployment", "Architecture", "Code Review",
        "Research", "Custom",
      ];
      
      export default async function PromptLibrary({
        searchParams,
      }: {
        searchParams: Promise<{ category?: string; q?: string; project?: string }>;
      }) {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
        if (!token) redirect("/login");
      
        const actor = await verifySessionToken(token);
        if (!actor) redirect("/login");
      
        const { category, q, project } = await searchParams;
      
        const where = {
          ownerId: actor.userId,
          archivedAt: null as null | undefined,
          ...(category ? { category } : {}),
          ...(project ? { projectId: project } : {}),
          ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
        };
      
        const prompts = await db.prompt.findMany({
          where,
          include: {
            project: { select: { name: true } },
            currentVersion: { select: { content: true, versionNumber: true } },
            _count: { select: { queueItems: true } },
          },
          orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
          take: 100,
        });
      
        const projects = await db.project.findMany({
          where: { ownerId: actor.userId, archivedAt: null },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        });
      
        async function createPrompt(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const content = (formData.get("content") as string).trim();
          const category = (formData.get("category") as string) || "Custom";
          const projectId = (formData.get("projectId") as string) || null;
      
          if (!title || !content) redirect("/prompts?error=Title+and+content+are+required");
      
          const prompt = await db.prompt.create({
            data: {
              ownerId: actor.userId,
              title,
              category,
              projectId,
              status: "READY",
              versions: {
                // No ownerId here: it is a relation scalar of the prompt→version
                // relation, so Prisma inherits it from the parent and rejects it
                // being passed again.
                create: {
                  versionNumber: 1,
                  content,
                  createdById: actor.userId,
                },
              },
            },
            select: { id: true },
          });
      
          await db.prompt.update({
            where: { id: prompt.id },
            data: { currentVersion: { connect: { promptId_versionNumber: { promptId: prompt.id, versionNumber: 1 } } } },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId,
              type: "PROMPT_CREATED",
              subjectKind: "PROMPT",
              subjectId: prompt.id,
              summary: `Created prompt "${title}"`,
            },
          });
      
          redirect("/prompts");
        }
      
        return (
          <PageShell>
            <PageHeader
              title="Prompt library"
              description="Prompts are first-class here, not scraps in a notes app. Save the ones that worked, then queue them onto a project."
            />
      
            <CreateDisclosure label="New prompt" className="mb-6">
              <form action={createPrompt} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Add a Stripe customer portal"
                  required
                />
                <TextField
                  label="Content"
                  name="content"
                  placeholder="Paste the prompt here…"
                  rows={7}
                  required
                  className="font-mono text-caption"
                />
                <FormGrid>
                  <SelectField label="Category" name="category" defaultValue="Custom">
                    {PROMPT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField label="Project" name="projectId" defaultValue="">
                    <option value="">No project (reusable)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </SelectField>
                </FormGrid>
                <Button type="submit" variant="primary">
                  Save prompt
                </Button>
              </form>
            </CreateDisclosure>
      
            {/*
              A plain GET form: search survives a reload, is linkable, and works with
              no JavaScript. The category chips below carry the query along.
            */}
            <form method="get" role="search" className="mb-4 flex flex-wrap gap-2">
              <div className="relative min-w-56 flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                  aria-hidden="true"
                />
                <label htmlFor="prompt-search" className="sr-only">
                  Search prompts by title
                </label>
                <BareInput
                  id="prompt-search"
                  type="search"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Search prompts…"
                  className="pl-10"
                />
              </div>
              {category && <input type="hidden" name="category" value={category} />}
              <Button type="submit">Search</Button>
              {(q || category) && (
                <Button asChild variant="ghost">
                  <Link href="/prompts">Clear</Link>
                </Button>
              )}
            </form>
      
            <div className="mb-6 flex flex-wrap gap-1.5">
              {[null, ...PROMPT_CATEGORIES].map((c) => {
                const active = c === (category ?? null);
                const params = new URLSearchParams();
                if (c) params.set("category", c);
                if (q) params.set("q", q);
                const query = params.toString();
                return (
                  <Link
                    key={c ?? "all"}
                    href={query ? `/prompts?${query}` : "/prompts"}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "press inline-flex h-8 items-center rounded-full px-3 text-caption font-semibold",
                      "transition-colors duration-(--duration-fast)",
                      active
                        ? "bg-cobalt-500/18 text-cobalt-300"
                        : "border border-line text-muted hover:bg-surface-raised hover:text-foreground",
                    )}
                  >
                    {c ?? "All"}
                  </Link>
                );
              })}
            </div>
      
            {prompts.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                title={q || category ? "No prompts match" : "No prompts yet"}
                description={
                  q || category
                    ? "Try a different search, or clear the filters."
                    : "Save the prompts that actually worked. Future you will not remember them."
                }
              />
            ) : (
              <Stack className="space-y-2">
                {prompts.map((prompt) => (
                  <Row key={prompt.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-title-3 text-foreground">{prompt.title}</h2>
                          <Badge tone="cobalt">{prompt.category}</Badge>
                          {prompt.project && <Badge tone="quiet">{prompt.project.name}</Badge>}
                          {prompt._count.queueItems > 0 && (
                            <Badge tone="gold">Queued ×{prompt._count.queueItems}</Badge>
                          )}
                        </div>
      
                        <p className="mt-2 line-clamp-2 max-w-(--reading-max) text-caption text-subtle">
                          {prompt.currentVersion?.content}
                        </p>
                      </div>
      
                      <CopyButton
                        text={prompt.currentVersion?.content ?? ""}
                        label="Copy"
                        className="shrink-0"
                      />
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </PageShell>
        );
      }
      
      --- features ---
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Sparkles } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, SelectField, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function FeaturesPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            features: {
              orderBy: [{ status: "asc" }, { priority: "desc" }, { sortOrder: "asc" }],
            },
            milestones: { select: { id: true, name: true, status: true }, orderBy: { sortOrder: "asc" } },
          },
        });
        if (!project) notFound();
      
        async function addFeature(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const body = (formData.get("body") as string).trim();
          const reason = (formData.get("reason") as string).trim();
          const criteria = (formData.get("criteria") as string).trim();
          const milestoneId = (formData.get("milestoneId") as string) || null;
          const priority = Math.min(5, Math.max(0, parseInt(formData.get("priority") as string, 10) || 0));
      
          if (!title) redirect(`/${slug}/features?error=Title+required`);
      
          await db.feature.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              body: body || null,
              reason: reason || null,
              acceptanceCriteria: criteria || null,
              milestoneId,
              priority,
              status: "PLANNED",
            },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              type: "FEATURE_CREATED",
              subjectKind: "FEATURE",
              summary: `Feature: ${title.slice(0, 80)}`,
            },
          });
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/features`);
        }
      
        async function updateFeature(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const status = formData.get("status") as string;
      
          const feature = await db.feature.findFirst({ where: { id, ownerId: actor.userId } });
          if (!feature) redirect(`/${slug}/features`);
      
          await db.feature.update({
            where: { id: feature.id },
            data: { status: status as "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" },
          });
      
          if (status === "DONE") {
            await db.activity.create({
              data: {
                ownerId: actor.userId,
                actorUserId: actor.userId,
                projectId: project!.id,
                type: "FEATURE_COMPLETED",
                subjectKind: "FEATURE",
                summary: `Shipped: ${feature.title.slice(0, 80)}`,
              },
            });
          }
      
          redirect(`/${slug}/features`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Features</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                A backlog shaped for AI-assisted building: each feature carries the reason it
                exists and the criteria that say it&apos;s done.
              </p>
            </div>
      
            <CreateDisclosure label="New feature">
              <form action={addFeature} className="space-y-4">
                <Field
                  label="Name"
                  name="title"
                  type="text"
                  placeholder="Onboarding persistence"
                  required
                />
                <TextField
                  label="Description"
                  name="body"
                  rows={2}
                  placeholder="What should this do?"
                />
                <Field
                  label="Reason"
                  name="reason"
                  type="text"
                  placeholder="Why does this matter?"
                  hint="An agent that knows the why makes better calls than one that only knows the what."
                />
                <TextField
                  label="Acceptance criteria"
                  name="criteria"
                  rows={2}
                  placeholder="- user can save and reload"
                />
                <FormGrid>
                  <SelectField label="Milestone" name="milestoneId" defaultValue="">
                    <option value="">No milestone</option>
                    {project.milestones.map((milestone) => (
                      <option key={milestone.id} value={milestone.id}>
                        {milestone.name}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField label="Priority" name="priority" defaultValue="0">
                    {[0, 1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>
                        {p}
                        {p === 5 ? " — must ship" : p === 4 ? " — high" : p === 0 ? " — low" : ""}
                      </option>
                    ))}
                  </SelectField>
                </FormGrid>
                <Button type="submit" variant="primary">
                  Add feature
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.features.length === 0 ? (
              <EmptyState
                icon={<Sparkles className="h-5 w-5" />}
                title="No features yet"
                description="What should this project actually do? Add the first one and it becomes context for every prompt you generate."
              />
            ) : (
              <Stack>
                {project.features.map((feature) => {
                  const meta = workStatus(feature.status);
                  return (
                    <Row key={feature.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{feature.title}</h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {feature.priority >= 4 && <Badge tone="gold">P{feature.priority}</Badge>}
                      </div>
      
                      {feature.body && (
                        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                          {feature.body}
                        </p>
                      )}
                      {feature.reason && (
                        <p className="mt-1.5 text-caption text-subtle">
                          <span className="eyebrow mr-1.5">Why</span>
                          {feature.reason}
                        </p>
                      )}
                      {feature.acceptanceCriteria && (
                        <p className="mt-1 text-caption text-subtle">
                          <span className="eyebrow mr-1.5">Done when</span>
                          {feature.acceptanceCriteria}
                        </p>
                      )}
      
                      {feature.status !== "DONE" && feature.status !== "CANCELLED" && (
                        <form action={updateFeature}>
                          <input type="hidden" name="id" value={feature.id} />
                          <RowActions>
                            {feature.status !== "IN_PROGRESS" && (
                              <RowButton name="status" value="IN_PROGRESS" tone="accent">
                                Start building
                              </RowButton>
                            )}
                            {feature.status !== "BLOCKED" && (
                              <RowButton name="status" value="BLOCKED" tone="danger">
                                Block
                              </RowButton>
                            )}
                            <RowButton name="status" value="DONE" tone="success">
                              Ship
                            </RowButton>
                          </RowActions>
                        </form>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      
      --- milestones ---
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Flag } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function MilestonesPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            milestones: {
              include: { _count: { select: { features: true } } },
              orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
            },
          },
        });
        if (!project) notFound();
      
        async function addMilestone(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const name = (formData.get("name") as string).trim();
          const description = (formData.get("description") as string).trim();
          const targetDate = (formData.get("targetDate") as string) || null;
      
          if (!name) redirect(`/${slug}/milestones?error=Name+required`);
      
          const maxSort = await db.milestone.aggregate({
            where: { ownerId: actor.userId, projectId: project!.id },
            _max: { sortOrder: true },
          });
      
          await db.milestone.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              name,
              description: description || null,
              targetDate: targetDate ? new Date(targetDate) : null,
              sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
              status: "PLANNED",
            },
          });
          redirect(`/${slug}/milestones`);
        }
      
        async function updateStatus(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const status = formData.get("status") as string;
      
          const milestone = await db.milestone.findFirst({ where: { id, ownerId: actor.userId } });
          if (!milestone) redirect(`/${slug}/milestones`);
      
          await db.milestone.update({
            where: { id: milestone.id },
            data: { status: status as "PLANNED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "CANCELLED" },
          });
          if (status === "DONE") {
            await db.activity.create({
              data: {
                ownerId: actor.userId,
                actorUserId: actor.userId,
                projectId: project!.id,
                type: "MILESTONE_REACHED",
                subjectKind: "MILESTONE",
                summary: `Milestone reached: ${milestone.name.slice(0, 80)}`,
              },
            });
          }
          redirect(`/${slug}/milestones`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Milestones</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                The big moments on the way to shipping. Dates are optional — the sequence is
                the point.
              </p>
            </div>
      
            <CreateDisclosure label="New milestone">
              <form action={addMilestone} className="space-y-4">
                <Field label="Name" name="name" type="text" placeholder="MVP" required />
                <Field
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Core loop working end to end for early users"
                />
                <Field label="Target date" name="targetDate" type="date" hint="Optional." />
                <Button type="submit" variant="primary">
                  Add milestone
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.milestones.length === 0 ? (
              <EmptyState
                icon={<Flag className="h-5 w-5" />}
                title="No milestones yet"
                description="Prototype → MVP → Launch. Naming the stops makes an unfinished project feel finishable."
              />
            ) : (
              <Stack as="ol" className="space-y-2">
                {project.milestones.map((milestone) => {
                  const meta = workStatus(milestone.status);
                  const done = milestone.status === "DONE";
                  return (
                    <Row key={milestone.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={
                            done
                              ? "text-title-3 text-subtle line-through"
                              : "text-title-3 text-foreground"
                          }
                        >
                          {milestone.name}
                        </h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {milestone._count.features > 0 && (
                          <Badge tone="cobalt">
                            {milestone._count.features} feature
                            {milestone._count.features === 1 ? "" : "s"}
                          </Badge>
                        )}
                      </div>
      
                      {milestone.description && (
                        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                          {milestone.description}
                        </p>
                      )}
      
                      {milestone.targetDate && (
                        <p className="mt-1.5 text-caption text-subtle">
                          <span className="eyebrow mr-1.5">Target</span>
                          <time dateTime={milestone.targetDate.toISOString()}>
                            {milestone.targetDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </p>
                      )}
      
                      {!done && milestone.status !== "CANCELLED" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={milestone.id} />
                          <RowActions>
                            {milestone.status !== "IN_PROGRESS" && (
                              <RowButton name="status" value="IN_PROGRESS" tone="accent">
                                Start
                              </RowButton>
                            )}
                            <RowButton name="status" value="DONE" tone="success">
                              Complete
                            </RowButton>
                          </RowActions>
                        </form>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }

## Activity

    $ /bin/zsh -lc "sed -n '744,800p' prisma/schema.prisma && sed -n '1,280p' 'src/app/(authenticated)/[slug]/bugs/page.tsx' && sed -n '1,250p' 'src/app/(authenticated)/[slug]/decisions/page.tsx' && sed -n '1,210p' 'src/app/(authenticated)/[slug]/notes/page.tsx'"
    status: Completed · exit 0
      model EnvironmentVariable {
        id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId         String  @map("owner_id") @db.Uuid
        projectId       String  @map("project_id") @db.Uuid
        name            String
        description     String?
        required        Boolean @default(false)
        environment     String
        configured      Boolean @default(false)
        acquisitionNote String? @map("acquisition_note")
        note            String?
        project         Project @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
      
        @@unique([projectId, environment, name])
        @@index([ownerId, projectId])
        @@map("environment_variables")
      }
      
      model Activity {
        id              String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId         String         @map("owner_id") @db.Uuid
        projectId       String?        @map("project_id") @db.Uuid
        actorUserId     String         @map("actor_user_id") @db.Uuid
        codingSessionId String?        @map("coding_session_id") @db.Uuid
        type            String
        subjectKind     String         @map("subject_kind")
        subjectId       String?        @map("subject_id") @db.Uuid
        summary         String
        metadata        Json           @default("{}") @db.JsonB
        correlationId   String?        @map("correlation_id")
        occurredAt      DateTime       @default(now()) @map("occurred_at") @db.Timestamptz
        project         Project?       @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Restrict)
        actor           User           @relation("ActivityActor", fields: [actorUserId], references: [id], onDelete: Restrict)
        codingSession   CodingSession? @relation(fields: [ownerId, codingSessionId], references: [ownerId, id], onDelete: Restrict)
      
        @@index([ownerId, occurredAt, id])
        @@index([ownerId, projectId, occurredAt, id])
        @@index([actorUserId])
        @@index([ownerId, codingSessionId])
        @@map("activities")
      }
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Bug as BugIcon } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function BugsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { bugs: { orderBy: [{ severity: "desc" }, { updatedAt: "desc" }] } },
        });
        if (!project) notFound();
      
        async function addBug(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const symptoms = (formData.get("symptoms") as string).trim();
          const reproduction = (formData.get("reproduction") as string).trim();
          const expected = (formData.get("expected") as string).trim();
          const actual = (formData.get("actual") as string).trim();
          const severity = Math.min(5, Math.max(0, parseInt(formData.get("severity") as string, 10) || 1));
      
          if (!title) redirect(`/${slug}/bugs?error=Title+required`);
      
          await db.bug.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              symptoms: symptoms || null,
              reproduction: reproduction || null,
              expectedBehavior: expected || null,
              actualBehavior: actual || null,
              severity,
              status: "ACTIVE",
            },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              type: "BUG_CREATED",
              subjectKind: "BUG",
              summary: `Bug: ${title.slice(0, 80)}`,
            },
          });
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/bugs`);
        }
      
        async function resolveOrReopen(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const action = formData.get("action") as string;
          const resolution = (formData.get("resolution") as string).trim();
      
          const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
          if (!bug) redirect(`/${slug}/bugs`);
          const bugNonNull = bug;
      
          if (action === "resolve") {
            await db.bug.update({
              where: { id: bugNonNull.id },
              data: { status: "RESOLVED", resolution: resolution || bugNonNull.resolution, rootCause: resolution || bugNonNull.rootCause },
            });
            await db.activity.create({
              data: {
                ownerId: actor.userId,
                actorUserId: actor.userId,
                projectId: project!.id,
                type: "BUG_RESOLVED",
                subjectKind: "BUG",
                summary: `Resolved: ${bugNonNull.title.slice(0, 80)}`,
              },
            });
          } else if (action === "reopen") {
            await db.bug.update({ where: { id: bugNonNull.id }, data: { status: "ACTIVE" } });
          }
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/bugs`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Bugs &amp; debugging memory</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Track what broke, and record how it was fixed. The resolution is the part
                that stops you debugging the same thing twice.
              </p>
            </div>
      
            <CreateDisclosure label="Report a bug">
              <form action={addBug} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Auth redirect fails on Safari"
                  required
                />
                <TextField label="Symptoms" name="symptoms" rows={2} placeholder="What goes wrong?" />
                <TextField
                  label="Reproduction steps"
                  name="reproduction"
                  rows={2}
                  placeholder="1. Open on Safari  2. Sign in  3. …"
                />
                <FormGrid>
                  <Field
                    label="Expected"
                    name="expected"
                    type="text"
                    placeholder="Redirects to the dashboard"
                  />
                  <Field
                    label="Actual"
                    name="actual"
                    type="text"
                    placeholder="Bounces back to login"
                  />
                </FormGrid>
                <SelectField label="Severity" name="severity" defaultValue="1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>
                      {s} — {s >= 4 ? "critical" : s === 3 ? "major" : "minor"}
                    </option>
                  ))}
                </SelectField>
                <Button type="submit" variant="primary">
                  Report bug
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.bugs.length === 0 ? (
              <EmptyState
                icon={<BugIcon className="h-5 w-5" />}
                title="Nothing broken"
                description="No bugs tracked on this project. Keep it that way."
              />
            ) : (
              <Stack>
                {project.bugs.map((bug) => {
                  const meta = workStatus(bug.status);
                  const open = bug.status !== "RESOLVED" && bug.status !== "ARCHIVED";
                  return (
                    <Row key={bug.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{bug.title}</h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        {bug.severity >= 4 && <Badge tone="danger">Severity {bug.severity}</Badge>}
                      </div>
      
                      {bug.symptoms && (
                        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                          {bug.symptoms}
                        </p>
                      )}
      
                      <DataList
                        className="mt-3"
                        items={[
                          { label: "Expected", value: bug.expectedBehavior },
                          { label: "Actual", value: bug.actualBehavior },
                          { label: "Reproduce", value: bug.reproduction },
                        ]}
                      />
      
                      {bug.status === "RESOLVED" && bug.resolution && (
                        <p className="mt-3 rounded-xl border border-success/25 bg-success/8 px-3.5 py-2.5 text-caption text-success">
                          <span className="font-semibold">Fixed · </span>
                          {bug.resolution}
                        </p>
                      )}
      
                      {open ? (
                        <form action={resolveOrReopen} className="mt-4 flex flex-wrap items-center gap-2">
                          <input type="hidden" name="id" value={bug.id} />
                          <label htmlFor={`resolution-${bug.id}`} className="sr-only">
                            How {bug.title} was fixed
                          </label>
                          <BareInput
                            id={`resolution-${bug.id}`}
                            name="resolution"
                            placeholder="Root cause and fix…"
                            className="h-9 min-w-0 flex-1 text-caption"
                          />
                          <RowButton name="action" value="resolve" tone="success">
                            Resolve
                          </RowButton>
                        </form>
                      ) : bug.status === "RESOLVED" ? (
                        <form action={resolveOrReopen}>
                          <input type="hidden" name="id" value={bug.id} />
                          <RowActions>
                            <RowButton name="action" value="reopen">
                              Reopen
                            </RowButton>
                          </RowActions>
                        </form>
                      ) : null}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { GitBranch } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, RowActions, RowButton } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function DecisionsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: {
            decisions: { orderBy: [{ status: "asc" }, { decidedAt: "desc" }] },
          },
        });
        if (!project) notFound();
      
        async function addDecision(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const decision = (formData.get("decision") as string).trim();
          const reasoning = (formData.get("reasoning") as string).trim();
          const alternatives = (formData.get("alternatives") as string).trim();
          const affectedSystem = (formData.get("affectedSystem") as string).trim();
          const reversible = (formData.get("reversible") as string) === "on";
      
          if (!title || !decision) redirect(`/${slug}/decisions?error=Title+and+decision+required`);
      
          await db.decision.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              decision,
              reasoning: reasoning || null,
              alternatives: alternatives || null,
              affectedSystem: affectedSystem || null,
              reversible,
              status: "ACCEPTED",
              decidedAt: new Date(),
            },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              type: "DECISION_CREATED",
              subjectKind: "DECISION",
              summary: `Decision: ${title.slice(0, 80)}`,
            },
          });
      
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/decisions`);
        }
      
        async function updateStatus(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const status = formData.get("status") as string;
      
          const existing = await db.decision.findFirst({ where: { id, ownerId: actor.userId } });
          if (!existing) redirect(`/${slug}/decisions`);
      
          await db.decision.update({
            where: { id: existing.id },
            data: { status: status as "PROPOSED" | "ACCEPTED" | "SUPERSEDED" | "REJECTED" },
          });
          redirect(`/${slug}/decisions`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Decision log</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Why the project is the way it is. Accepted decisions become context in every
                generated prompt, so an agent won&apos;t quietly undo them.
              </p>
            </div>
      
            <CreateDisclosure label="Record a decision">
              <form action={addDecision} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Use Prisma instead of Drizzle"
                  required
                />
                <TextField
                  label="Decision"
                  name="decision"
                  rows={2}
                  placeholder="What was decided, stated as an instruction an agent can follow"
                  required
                />
                <TextField
                  label="Reasoning"
                  name="reasoning"
                  rows={2}
                  placeholder="The thinking behind it"
                />
                <Field
                  label="Alternatives considered"
                  name="alternatives"
                  type="text"
                  placeholder="Drizzle, Kysely"
                />
                <Field
                  label="Affected system"
                  name="affectedSystem"
                  type="text"
                  placeholder="Data layer"
                />
                <FieldShell label="Reversibility">
                  <label className="flex items-center gap-2.5 text-body text-muted">
                    <input
                      type="checkbox"
                      name="reversible"
                      defaultChecked
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    This decision can be revisited later
                  </label>
                </FieldShell>
                <Button type="submit" variant="primary">
                  Record decision
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.decisions.length === 0 ? (
              <EmptyState
                icon={<GitBranch className="h-5 w-5" />}
                title="No decisions logged"
                description="The first time you wonder why something was built a certain way, this is the page you'll wish you had filled in."
              />
            ) : (
              <Stack>
                {project.decisions.map((decision) => {
                  const meta = workStatus(decision.status);
                  return (
                    <Row key={decision.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{decision.title}</h3>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        <Badge tone={decision.reversible ? "quiet" : "danger"}>
                          {decision.reversible ? "Reversible" : "Locked"}
                        </Badge>
                      </div>
      
                      <p className="mt-2 max-w-(--reading-max) text-body text-ink-100">
                        {decision.decision}
                      </p>
      
                      <DataList
                        className="mt-3"
                        items={[
                          { label: "Reasoning", value: decision.reasoning },
                          { label: "Alternatives", value: decision.alternatives },
                          { label: "Affects", value: decision.affectedSystem },
                        ]}
                      />
      
                      {decision.status !== "ACCEPTED" && decision.status !== "REJECTED" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={decision.id} />
                          <RowActions>
                            <RowButton name="status" value="ACCEPTED" tone="success">
                              Accept
                            </RowButton>
                            <RowButton name="status" value="REJECTED" tone="danger">
                              Reject
                            </RowButton>
                          </RowActions>
                        </form>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { FileText, Pin, PinOff } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, TextField } from "@/components/ui/field";
      import { Markdown } from "@/components/ui/markdown";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, RowButton } from "@/components/ui/disclosure";
      import { timeAgo } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function NotesPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { notes: { orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }] } },
        });
        if (!project) notFound();
      
        async function addNote(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const body = (formData.get("body") as string).trim();
          if (!title || !body) redirect(`/${slug}/notes?error=Title+and+body+required`);
      
          await db.note.create({
            data: { ownerId: actor.userId, projectId: project!.id, title, body, kind: "note" },
          });
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
          redirect(`/${slug}/notes`);
        }
      
        async function togglePin(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const targetPinned = formData.get("pinned") === "true";
          const note = await db.note.findFirst({ where: { id, ownerId: actor.userId } });
          if (!note) redirect(`/${slug}/notes`);
          await db.note.update({ where: { id: note.id }, data: { pinned: targetPinned } });
          redirect(`/${slug}/notes`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Notes</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Loose memory for this project, written in Markdown. Pin the ones you keep
                coming back to.
              </p>
            </div>
      
            <CreateDisclosure label="New note">
              <form action={addNote} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Why we chose the Neon adapter"
                  required
                />
                <TextField
                  label="Body"
                  name="body"
                  rows={6}
                  hint="Markdown is supported."
                  placeholder={"**Context**\nWe picked this because…"}
                  required
                />
                <Button type="submit" variant="primary">
                  Add note
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.notes.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-5 w-5" />}
                title="No notes yet"
                description="The thought you'd otherwise lose in a chat window belongs here."
              />
            ) : (
              <Stack className="space-y-3">
                {project.notes.map((note) => (
                  <Row key={note.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-2 text-title-3 text-foreground">
                          {note.pinned && (
                            <Pin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                          )}
                          {note.title}
                        </h3>
                        <p className="mt-0.5 text-micro text-subtle">
                          Updated{" "}
                          <time dateTime={note.updatedAt.toISOString()}>
                            {timeAgo(note.updatedAt)}
                          </time>
                        </p>
                      </div>
      
                      <form action={togglePin} className="shrink-0">
                        <input type="hidden" name="id" value={note.id} />
                        <input type="hidden" name="pinned" value={String(!note.pinned)} />
                        <RowButton tone={note.pinned ? "accent" : "neutral"}>
                          {note.pinned ? (
                            <PinOff className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {note.pinned ? "Unpin" : "Pin"}
                        </RowButton>
                      </form>
                    </div>
      
                    <div className="mt-3.5 border-t border-line-subtle pt-3.5">
                      <Markdown>{note.body}</Markdown>
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }

## Activity

    file changes: Completed · 2 changes
    Add: /Users/medali/Desktop/medali/cadabry/src/components/ui/record-controls.tsx
    "use client";
    
    import { Pencil, Trash2 } from "lucide-react";
    import type { ReactNode } from "react";
    import { Button } from "@/components/ui/button";
    import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
    
    type RecordAction = (formData: FormData) => void | Promise<void>;
    
    /** Consistent edit/delete affordances for records across project sections. */
    export function RecordControls({
      id,
      name,
      editAction,
      deleteAction,
      children,
    }: {
      id: string;
      name: string;
      editAction: RecordAction;
      deleteAction: RecordAction;
      children: ReactNode;
    }) {
      return (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line-subtle pt-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="quiet">
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent title={`Edit ${name}`} description="Update this record without losing its history.">
              <form action={editAction} className="space-y-4">
                <input type="hidden" name="id" value={id} />
                {children}
                <div className="flex justify-end gap-2 pt-2">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit" variant="primary">Save changes</Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
    
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="quiet" className="text-danger hover:text-danger">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent
              size="sm"
              title={`Delete ${name}?`}
              description="This permanently removes the record. This action cannot be undone."
            >
              <form action={deleteAction}>
                <input type="hidden" name="id" value={id} />
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Keep it</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit" variant="danger">Delete permanently</Button>
                  </DialogClose>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    Add: /Users/medali/Desktop/medali/cadabry/src/features/projects/record-actions.ts
    "use server";
    
    import { revalidatePath } from "next/cache";
    import { db } from "@/server/db";
    import { requireActor } from "./queries";
    
    const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
    const optional = (data: FormData, key: string) => text(data, key) || null;
    const boundedInt = (data: FormData, key: string, min: number, max: number) =>
      Math.min(max, Math.max(min, Number.parseInt(text(data, key), 10) || min));
    
    function refreshAll() {
      revalidatePath("/", "layout");
    }
    
    export async function updatePromptRecord(data: FormData) {
      const actor = await requireActor();
      const id = text(data, "id");
      const title = text(data, "title");
      const content = text(data, "content");
      if (!title || !content) return;
    
      const prompt = await db.prompt.findFirst({
        where: { id, ownerId: actor.userId },
        include: { currentVersion: true, versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
      });
      if (!prompt) return;
    
      await db.$transaction(async (tx) => {
        let currentVersionId = prompt.currentVersionId;
        if (content !== prompt.currentVersion?.content) {
          const version = await tx.promptVersion.create({
            data: {
              ownerId: actor.userId,
              promptId: prompt.id,
              versionNumber: (prompt.versions[0]?.versionNumber ?? 0) + 1,
              content,
              changeNote: "Edited from prompt library",
              createdById: actor.userId,
            },
          });
          currentVersionId = version.id;
        }
        await tx.prompt.update({
          where: { id: prompt.id },
          data: {
            title,
            category: optional(data, "category"),
            notes: optional(data, "notes"),
            projectId: optional(data, "projectId"),
            reusable: data.get("reusable") === "on",
            favorite: data.get("favorite") === "on",
            currentVersionId,
          },
        });
      });
      refreshAll();
    }
    
    export async function deletePromptRecord(data: FormData) {
      const actor = await requireActor();
      const prompt = await db.prompt.findFirst({ where: { id: text(data, "id"), ownerId: actor.userId } });
      if (!prompt) return;
      await db.$transaction(async (tx) => {
        await tx.codingSessionPrompt.deleteMany({ where: { ownerId: actor.userId, promptId: prompt.id } });
        await tx.promptQueueItem.deleteMany({ where: { ownerId: actor.userId, promptId: prompt.id } });
        await tx.prompt.update({ where: { id: prompt.id }, data: { currentVersionId: null } });
        await tx.prompt.delete({ where: { id: prompt.id } });
      });
      refreshAll();
    }
    
    export async function updateFeatureRecord(data: FormData) {
      const actor = await requireActor();
      const title = text(data, "title");
      if (!title) return;
      await db.feature.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: {
          title,
          body: optional(data, "body"),
          reason: optional(data, "reason"),
          acceptanceCriteria: optional(data, "criteria"),
          milestoneId: optional(data, "milestoneId"),
          priority: boundedInt(data, "priority", 0, 5),
        },
      });
      refreshAll();
    }
    
    export async function deleteFeatureRecord(data: FormData) {
      const actor = await requireActor();
      const id = text(data, "id");
      const feature = await db.feature.findFirst({ where: { id, ownerId: actor.userId } });
      if (!feature) return;
      await db.$transaction(async (tx) => {
        await tx.featureDependency.deleteMany({ where: { ownerId: actor.userId, OR: [{ featureId: id }, { dependsOnFeatureId: id }] } });
        await tx.codingSessionFeature.deleteMany({ where: { ownerId: actor.userId, featureId: id } });
        await tx.promptQueueItem.updateMany({ where: { ownerId: actor.userId, featureId: id }, data: { featureId: null } });
        await tx.bug.updateMany({ where: { ownerId: actor.userId, featureId: id }, data: { featureId: null } });
        await tx.prompt.updateMany({ where: { ownerId: actor.userId, featureId: id }, data: { featureId: null } });
        await tx.feature.delete({ where: { id } });
      });
      refreshAll();
    }
    
    export async function updateMilestoneRecord(data: FormData) {
      const actor = await requireActor();
      const name = text(data, "name");
      if (!name) return;
      const target = optional(data, "targetDate");
      await db.milestone.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: { name, description: optional(data, "description"), targetDate: target ? new Date(target) : null },
      });
      refreshAll();
    }
    
    export async function deleteMilestoneRecord(data: FormData) {
      const actor = await requireActor();
      const id = text(data, "id");
      const milestone = await db.milestone.findFirst({ where: { id, ownerId: actor.userId } });
      if (!milestone) return;
      await db.$transaction(async (tx) => {
        await tx.feature.updateMany({ where: { ownerId: actor.userId, milestoneId: id }, data: { milestoneId: null } });
        await tx.promptQueueItem.updateMany({ where: { ownerId: actor.userId, milestoneId: id }, data: { milestoneId: null } });
        await tx.milestone.delete({ where: { id } });
      });
      refreshAll();
    }
    
    export async function updateBugRecord(data: FormData) {
      const actor = await requireActor();
      const title = text(data, "title");
      if (!title) return;
      await db.bug.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: {
          title,
          symptoms: optional(data, "symptoms"),
          reproduction: optional(data, "reproduction"),
          expectedBehavior: optional(data, "expected"),
          actualBehavior: optional(data, "actual"),
          suspectedCause: optional(data, "suspectedCause"),
          severity: boundedInt(data, "severity", 1, 5),
        },
      });
      refreshAll();
    }
    
    export async function deleteBugRecord(data: FormData) {
      const actor = await requireActor();
      const id = text(data, "id");
      const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
      if (!bug) return;
      await db.$transaction(async (tx) => {
        await tx.promptQueueItem.updateMany({ where: { ownerId: actor.userId, bugId: id }, data: { bugId: null } });
        await tx.bug.delete({ where: { id } });
      });
      refreshAll();
    }
    
    export async function updateDecisionRecord(data: FormData) {
      const actor = await requireActor();
      const title = text(data, "title");
      const decision = text(data, "decision");
      if (!title || !decision) return;
      await db.decision.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: {
          title,
          decision,
          reasoning: optional(data, "reasoning"),
          alternatives: optional(data, "alternatives"),
          affectedSystem: optional(data, "affectedSystem"),
          reversible: data.get("reversible") === "on",
        },
      });
      refreshAll();
    }
    
    export async function deleteDecisionRecord(data: FormData) {
      const actor = await requireActor();
      const id = text(data, "id");
      const decision = await db.decision.findFirst({ where: { id, ownerId: actor.userId } });
      if (!decision) return;
      await db.$transaction(async (tx) => {
        await tx.decision.updateMany({ where: { ownerId: actor.userId, supersededById: id }, data: { supersededById: null } });
        await tx.decision.delete({ where: { id } });
      });
      refreshAll();
    }
    
    export async function updateNoteRecord(data: FormData) {
      const actor = await requireActor();
      const title = text(data, "title");
      const body = text(data, "body");
      if (!title || !body) return;
      await db.note.updateMany({ where: { id: text(data, "id"), ownerId: actor.userId }, data: { title, body } });
      refreshAll();
    }
    
    export async function deleteNoteRecord(data: FormData) {
      const actor = await requireActor();
      await db.note.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
      refreshAll();
    }
    
    export async function updateInspirationRecord(data: FormData) {
      const actor = await requireActor();
      const title = text(data, "title");
      if (!title) return;
      await db.inspiration.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: {
          title,
          kind: text(data, "kind") as "LINK" | "IMAGE" | "SCREENSHOT" | "VIDEO" | "TEXT" | "OTHER",
          canonicalUrl: optional(data, "url"),
          textSnippet: optional(data, "textSnippet"),
          note: optional(data, "note"),
          inspiredDetail: optional(data, "inspiredDetail"),
        },
      });
      refreshAll();
    }
    
    export async function deleteInspirationRecord(data: FormData) {
      const actor = await requireActor();
      await db.inspiration.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
      refreshAll();
    }
    
    export async function updateCommandRecord(data: FormData) {
      const actor = await requireActor();
      const name = text(data, "name");
      const commandText = text(data, "commandText");
      if (!name || !commandText) return;
      await db.command.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: { name, commandText, description: optional(data, "description"), category: optional(data, "category") },
      });
      refreshAll();
    }
    
    export async function deleteCommandRecord(data: FormData) {
      const actor = await requireActor();
      await db.command.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
      refreshAll();
    }
    
    export async function updateEnvironmentRecord(data: FormData) {
      const actor = await requireActor();
      const name = text(data, "name");
      if (!name) return;
      await db.environmentVariable.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: {
          name,
          environment: text(data, "environment") || "development",
          description: optional(data, "description"),
          acquisitionNote: optional(data, "acquisitionNote"),
          note: optional(data, "note"),
          required: data.get("required") === "on",
        },
      });
      refreshAll();
    }
    
    export async function deleteEnvironmentRecord(data: FormData) {
      const actor = await requireActor();
      await db.environmentVariable.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
      refreshAll();
    }
    
    export async function updateSessionRecord(data: FormData) {
      const actor = await requireActor();
      const objective = text(data, "objective");
      if (!objective) return;
      await db.codingSession.updateMany({
        where: { id: text(data, "id"), ownerId: actor.userId },
        data: {
          objective,
          notes: optional(data, "notes"),
          whatChanged: optional(data, "whatChanged"),
          discoveries: optional(data, "discoveries"),
          nextTask: optional(data, "nextTask"),
        },
      });
      refreshAll();
    }
    
    export async function deleteSessionRecord(data: FormData) {
      const actor = await requireActor();
      const id = text(data, "id");
      const session = await db.codingSession.findFirst({ where: { id, ownerId: actor.userId } });
      if (!session) return;
      await db.$transaction(async (tx) => {
        await tx.activity.updateMany({ where: { ownerId: actor.userId, codingSessionId: id }, data: { codingSessionId: null } });
        await tx.bug.updateMany({ where: { ownerId: actor.userId, codingSessionId: id }, data: { codingSessionId: null } });
        await tx.decision.updateMany({ where: { ownerId: actor.userId, codingSessionId: id }, data: { codingSessionId: null } });
        await tx.codingSession.delete({ where: { id } });
      });
      refreshAll();
    }
    
    export async function updateActivityRecord(data: FormData) {
      const actor = await requireActor();
      const summary = text(data, "summary");
      if (!summary) return;
      await db.activity.updateMany({ where: { id: text(data, "id"), ownerId: actor.userId }, data: { summary } });
      refreshAll();
    }
    
    export async function deleteActivityRecord(data: FormData) {
      const actor = await requireActor();
      await db.activity.deleteMany({ where: { id: text(data, "id"), ownerId: actor.userId } });
      refreshAll();
    }

## Activity

    $ /bin/zsh -lc "sed -n '280,325p' prisma/schema.prisma && sed -n '1,220p' 'src/app/(authenticated)/[slug]/inspirations/page.tsx' && sed -n '1,210p' 'src/app/(authenticated)/[slug]/commands/page.tsx' && sed -n '1,270p' 'src/app/(authenticated)/[slug]/env/page.tsx' && sed -n '1,330p' 'src/app/(authenticated)/[slug]/sessions/page.tsx'"
    status: Completed · exit 0
        body               String?
        reason             String?
        acceptanceCriteria String?                @map("acceptance_criteria")
        status             WorkStatus             @default(PLANNED)
        priority           Int                    @default(0)
        difficulty         Int?
        impact             Int?
        sortOrder          Int                    @default(0) @map("sort_order")
        createdAt          DateTime               @default(now()) @map("created_at") @db.Timestamptz
        updatedAt          DateTime               @updatedAt @map("updated_at") @db.Timestamptz
        project            Project                @relation(fields: [ownerId, projectId], references: [ownerId, id], onDelete: Cascade)
        milestone          Milestone?             @relation(fields: [ownerId, milestoneId], references: [ownerId, id], onDelete: Restrict)
        dependencies       FeatureDependency[]    @relation("FeatureDepends")
        dependents         FeatureDependency[]    @relation("FeatureRequiredBy")
        prompts            Prompt[]
        queueItems         PromptQueueItem[]
        bugs               Bug[]
        codingSessions     CodingSessionFeature[]
      
        @@unique([ownerId, id])
        @@index([ownerId, projectId, status, sortOrder])
        @@index([ownerId, milestoneId])
        @@map("features")
      }
      
      model FeatureDependency {
        ownerId            String  @map("owner_id") @db.Uuid
        featureId          String  @map("feature_id") @db.Uuid
        dependsOnFeatureId String  @map("depends_on_feature_id") @db.Uuid
        feature            Feature @relation("FeatureDepends", fields: [ownerId, featureId], references: [ownerId, id], onDelete: Cascade)
        dependsOn          Feature @relation("FeatureRequiredBy", fields: [ownerId, dependsOnFeatureId], references: [ownerId, id], onDelete: Restrict)
      
        @@id([featureId, dependsOnFeatureId])
        @@index([ownerId, dependsOnFeatureId])
        @@map("feature_dependencies")
      }
      
      model Prompt {
        id               String                @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
        ownerId          String                @map("owner_id") @db.Uuid
        projectId        String?               @map("project_id") @db.Uuid
        featureId        String?               @map("feature_id") @db.Uuid
        title            String
        category         String?
        status           PromptStatus          @default(DRAFT)
        favorite         Boolean               @default(false)
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { ArrowUpRight, Lightbulb } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, SelectField, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      const KIND_LABELS: Record<string, string> = {
        LINK: "Link", IMAGE: "Image", SCREENSHOT: "Screenshot", VIDEO: "Video", TEXT: "Text", OTHER: "Other",
      };
      
      export default async function InspirationsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { inspirations: { orderBy: { createdAt: "desc" } } },
        });
        if (!project) notFound();
      
        async function addInspiration(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const url = (formData.get("url") as string).trim();
          const kind = (formData.get("kind") as string) || "LINK";
          const inspiredDetail = (formData.get("inspiredDetail") as string).trim();
          const note = (formData.get("note") as string).trim();
          const textSnippet = (formData.get("textSnippet") as string).trim();
      
          if (!title) redirect(`/${slug}/inspirations?error=Title+required`);
      
          await db.inspiration.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              title,
              canonicalUrl: url || null,
              kind: kind as "LINK" | "IMAGE" | "SCREENSHOT" | "VIDEO" | "TEXT" | "OTHER",
              inspiredDetail: inspiredDetail || null,
              note: note || null,
              textSnippet: textSnippet || null,
            },
          });
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
          redirect(`/${slug}/inspirations`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Inspiration vault</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                A bookmark says <em>what</em>. The field that matters here is <em>why</em> — the
                specific thing you want to steal.
              </p>
            </div>
      
            <CreateDisclosure label="Save inspiration">
              <form action={addInspiration} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="linear.app command menu"
                  required
                />
                <Field label="URL" name="url" type="url" placeholder="https://…" />
                <SelectField label="Kind" name="kind" defaultValue="LINK">
                  {Object.entries(KIND_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectField>
                <TextField
                  label="What exactly inspired me"
                  name="inspiredDetail"
                  rows={2}
                  hint="Be specific. “Nice design” is worth nothing in six months."
                  placeholder="How their command menu surfaces actions without any visible chrome"
                />
                <TextField label="Text snippet" name="textSnippet" rows={2} />
                <Field label="Note" name="note" type="text" placeholder="Any extra context" />
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.inspirations.length === 0 ? (
              <EmptyState
                icon={<Lightbulb className="h-5 w-5" />}
                title="Nothing saved yet"
                description="Capture the products, screens and details you want this project to feel like."
              />
            ) : (
              <Stack className="space-y-3">
                {project.inspirations.map((item) => (
                  <Row key={item.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-title-3 text-foreground">
                        {item.canonicalUrl ? (
                          <a
                            href={item.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-cobalt-400 transition-colors hover:text-cobalt-300"
                          >
                            {item.title}
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      <Badge tone="cobalt">{KIND_LABELS[item.kind] ?? item.kind}</Badge>
                    </div>
      
                    {item.inspiredDetail && (
                      <p className="mt-2 max-w-(--reading-max) text-body text-ink-100">
                        <span className="eyebrow mr-1.5">Why</span>
                        {item.inspiredDetail}
                      </p>
                    )}
      
                    {item.textSnippet && (
                      <blockquote className="mt-2.5 border-l-2 border-cobalt-500/45 pl-3.5 text-caption text-muted">
                        {item.textSnippet}
                      </blockquote>
                    )}
      
                    {item.note && <p className="mt-2 text-caption text-subtle">{item.note}</p>}
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      import { redirect, notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Terminal, Trash2 } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field } from "@/components/ui/field";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function CommandsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { commands: { orderBy: { sortOrder: "asc" } } },
        });
        if (!project) notFound();
      
        async function addCommand(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const name = ((formData.get("name") as string) || "").trim();
          const commandText = ((formData.get("commandText") as string) || "").trim();
          const description = ((formData.get("description") as string) || "").trim();
          const category = ((formData.get("category") as string) || "").trim();
      
          if (!name || !commandText) redirect(`/${slug}/commands?error=Name+and+command+required`);
      
          const maxSort = await db.command.aggregate({
            where: { ownerId: actor.userId, projectId: project!.id },
            _max: { sortOrder: true },
          });
      
          await db.command.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              name,
              commandText,
              description: description || null,
              category: category || null,
              sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
            },
          });
          redirect(`/${slug}/commands`);
        }
      
        async function deleteCommand(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          await db.command.deleteMany({ where: { id, ownerId: actor.userId, projectId: project!.id } });
          redirect(`/${slug}/commands`);
        }
      
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Command vault</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Every command this project needs — dev, test, migrate, deploy. So you never
                go digging through shell history again.
              </p>
            </div>
      
            <CreateDisclosure label="New command">
              <form action={addCommand} className="space-y-4">
                <FormGrid>
                  <Field label="Name" name="name" type="text" placeholder="dev" required />
                  <Field label="Category" name="category" type="text" placeholder="daily" />
                </FormGrid>
                <Field
                  label="Command"
                  name="commandText"
                  type="text"
                  placeholder="npm run dev"
                  required
                  className="font-mono"
                />
                <Field
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Start the dev server"
                />
                <Button type="submit" variant="primary">
                  Add command
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.commands.length === 0 ? (
              <EmptyState
                icon={<Terminal className="h-5 w-5" />}
                title="No commands saved"
                description="Save the ones you retype most: dev, test, migrate, deploy."
              />
            ) : (
              <Stack className="space-y-2">
                {project.commands.map((command) => (
                  <Row key={command.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-title-3 text-foreground">{command.name}</h3>
                          {command.category && <Badge tone="quiet">{command.category}</Badge>}
                        </div>
      
                        <code
                          className="mt-2 block overflow-x-auto rounded-lg border border-line-subtle
                            bg-well px-3 py-2 font-mono text-caption text-gold-300"
                        >
                          {command.commandText}
                        </code>
      
                        {command.description && (
                          <p className="mt-1.5 text-caption text-muted">{command.description}</p>
                        )}
                      </div>
      
                      <div className="flex shrink-0 items-center gap-2">
                        <CopyButton text={command.commandText} label="Copy" size="sm" />
                        <form action={deleteCommand}>
                          <input type="hidden" name="id" value={command.id} />
                          <RowButton tone="danger" aria-label={`Delete ${command.name}`}>
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </RowButton>
                        </form>
                      </div>
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      import { redirect, notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Check, KeyRound, Trash2 } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, SelectField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { Progress } from "@/components/ui/progress";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function EnvPage({ params }: Props) {
        const actor = await requireActor();
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
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-title-2 text-foreground">Env checklist</h2>
                <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                  What a deployment needs and where to get each value. No secrets are stored
                  here — only the fact that a variable exists.
                </p>
              </div>
      
              {total > 0 && (
                <div className="w-44 shrink-0 rounded-xl border border-line bg-surface px-4 py-3">
                  <p className="eyebrow">Configured</p>
                  <p className="tabular mt-1 text-title-2 text-foreground">
                    {configured}
                    <span className="text-muted">/{total}</span>
                  </p>
                  <Progress
                    value={total === 0 ? 0 : (configured / total) * 100}
                    label="Environment variables configured"
                    showValue={false}
                    tone={configured === total ? "success" : "gold"}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
      
            {requiredMissing > 0 && (
              <p className="rounded-xl border border-danger/25 bg-danger/8 px-4 py-3 text-body text-danger">
                {requiredMissing} required variable{requiredMissing === 1 ? "" : "s"} still
                unconfigured — the app won&apos;t run without {requiredMissing === 1 ? "it" : "them"}.
              </p>
            )}
      
            <CreateDisclosure label="New variable">
              <form action={addVariable} className="space-y-4">
                <FormGrid>
                  <Field
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="DATABASE_URL"
                    required
                    className="font-mono"
                    hint="Uppercased automatically."
                  />
                  <SelectField label="Environment" name="environment" defaultValue="production">
                    <option value="local">local</option>
                    <option value="staging">staging</option>
                    <option value="production">production</option>
                  </SelectField>
                </FormGrid>
                <Field
                  label="What it is"
                  name="description"
                  type="text"
                  placeholder="Neon pooled connection string"
                />
                <Field
                  label="Where to get it"
                  name="acquisitionNote"
                  type="text"
                  placeholder="Neon dashboard → Connection string"
                />
                <FieldShell label="Requirement">
                  <label className="flex items-center gap-2.5 text-body text-muted">
                    <input type="checkbox" name="required" className="h-4 w-4 accent-[var(--accent)]" />
                    Required for the app to work
                  </label>
                </FieldShell>
                <Button type="submit" variant="primary">
                  Add variable
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.environmentVariables.length === 0 ? (
              <EmptyState
                icon={<KeyRound className="h-5 w-5" />}
                title="No variables tracked"
                description="Start with DATABASE_URL — the one you always forget on a fresh machine."
              />
            ) : (
              <Stack className="space-y-2">
                {project.environmentVariables.map((variable) => (
                  <Row key={variable.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-mono text-title-3 text-foreground">{variable.name}</h3>
                          <Badge tone="quiet">{variable.environment}</Badge>
                          {variable.required && <Badge tone="gold">Required</Badge>}
                          {variable.configured && (
                            <Badge tone="success" dot>
                              Configured
                            </Badge>
                          )}
                        </div>
      
                        {variable.description && (
                          <p className="mt-1.5 text-body text-muted">{variable.description}</p>
                        )}
                        {variable.acquisitionNote && (
                          <p className="mt-1 text-caption text-subtle">
                            <span className="eyebrow mr-1.5">Get it</span>
                            {variable.acquisitionNote}
                          </p>
                        )}
                      </div>
      
                      <div className="flex shrink-0 items-center gap-2">
                        <form action={toggleConfigured}>
                          <input type="hidden" name="id" value={variable.id} />
                          <input type="hidden" name="configured" value={String(variable.configured)} />
                          <RowButton tone={variable.configured ? "success" : "neutral"}>
                            {variable.configured && (
                              <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {variable.configured ? "Configured" : "Mark configured"}
                          </RowButton>
                        </form>
                        <form action={deleteVariable}>
                          <input type="hidden" name="id" value={variable.id} />
                          <RowButton tone="danger" aria-label={`Delete ${variable.name}`}>
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </RowButton>
                        </form>
                      </div>
                    </div>
                  </Row>
                ))}
              </Stack>
            )}
          </div>
        );
      }
      import { redirect } from "next/navigation";
      import { notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Terminal } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, TextField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure } from "@/components/ui/disclosure";
      import { workStatus } from "@/features/projects/display";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function SessionsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { codingSessions: { orderBy: { startedAt: "desc" }, include: { _count: { select: { prompts: true, features: true } } } } },
        });
        if (!project) notFound();
      
        async function startSession(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const objective = (formData.get("objective") as string).trim();
          if (!objective) redirect(`/${slug}/sessions?error=Objective+required`);
      
          const session = await db.codingSession.create({
            data: {
              ownerId: actor.userId,
              projectId: project!.id,
              objective,
              status: "ACTIVE",
            },
            select: { id: true },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              codingSessionId: session.id,
              type: "SESSION_STARTED",
              subjectKind: "CODING_SESSION",
              summary: `Session started: ${objective.slice(0, 80)}`,
            },
          });
          await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
      
          redirect(`/${slug}/sessions`);
        }
      
        async function endSession(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const id = formData.get("id") as string;
          const notes = (formData.get("notes") as string).trim();
          const discoveries = (formData.get("discoveries") as string).trim();
          const whatChanged = (formData.get("whatChanged") as string).trim();
          const nextTask = (formData.get("nextTask") as string).trim();
          const makeDecision = (formData.get("makeDecision") as string) === "on";
          const decisionTitle = (formData.get("decisionTitle") as string).trim();
          const decisionBody = (formData.get("decisionBody") as string).trim();
      
          const session = await db.codingSession.findFirst({ where: { id, ownerId: actor.userId } });
          if (!session) redirect(`/${slug}/sessions`);
          const sessionNonNull = session;
      
          await db.codingSession.update({
            where: { id: sessionNonNull.id },
            data: {
              status: "COMPLETED",
              endedAt: new Date(),
              notes: notes || null,
              discoveries: discoveries || null,
              whatChanged: whatChanged || null,
              nextTask,
            },
          });
      
          // If a decision was made, record it in the Decision Log
          if (makeDecision && decisionTitle && decisionBody) {
            await db.decision.create({
              data: {
                ownerId: actor.userId,
                projectId: project!.id,
                codingSessionId: sessionNonNull.id,
                title: decisionTitle,
                decision: decisionBody,
                status: "ACCEPTED",
                decidedAt: new Date(),
              },
            });
          }
      
          // If next task given, update project
          if (nextTask) {
            await db.project.update({
              where: { id: project!.id },
              data: { nextTask, lastActivityAt: new Date() },
            });
          }
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId: project!.id,
              codingSessionId: sessionNonNull.id,
              type: "SESSION_COMPLETED",
              subjectKind: "CODING_SESSION",
              summary: `Session completed: ${sessionNonNull.objective.slice(0, 80)}`,
            },
          });
      
          redirect(`/${slug}/sessions`);
        }
      
        return (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-title-2 text-foreground">Coding sessions</h2>
              <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                Close a session properly and the next one starts where this one ended. The
                review at the end is what feeds the next resume packet.
              </p>
            </div>
      
            <CreateDisclosure label="Start a session">
              <form action={startSession} className="space-y-4">
                <Field
                  label="Objective"
                  name="objective"
                  type="text"
                  placeholder="Finish onboarding persistence"
                  required
                  hint="One sentence. What does done look like for this sitting?"
                />
                <Button type="submit" variant="primary">
                  Start session
                </Button>
              </form>
            </CreateDisclosure>
      
            {project.codingSessions.length === 0 ? (
              <EmptyState
                icon={<Terminal className="h-5 w-5" />}
                title="No sessions logged"
                description="Start one before your next build so there's a record of what changed and why."
              />
            ) : (
              <Stack className="space-y-3">
                {project.codingSessions.map((session) => {
                  const meta = workStatus(session.status);
                  return (
                    <Row key={session.id} className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-title-3 text-foreground">{session.objective}</h3>
                        <Badge tone={meta.tone} dot={session.status === "ACTIVE"}>
                          {meta.label}
                        </Badge>
                        {session._count.prompts > 0 && (
                          <Badge tone="cobalt">
                            {session._count.prompts} prompt
                            {session._count.prompts === 1 ? "" : "s"}
                          </Badge>
                        )}
                      </div>
      
                      <p className="mt-1 text-caption text-subtle">
                        <time dateTime={session.startedAt.toISOString()}>
                          {session.startedAt.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </time>
                        {session.endedAt && (
                          <>
                            {" → "}
                            <time dateTime={session.endedAt.toISOString()}>
                              {session.endedAt.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </time>
                          </>
                        )}
                      </p>
      
                      <DataList
                        className="mt-3"
                        items={[
                          { label: "Finished", value: session.notes },
                          { label: "Still broken", value: session.whatChanged },
                          { label: "Discoveries", value: session.discoveries },
                        ]}
                      />
      
                      {session.nextTask && (
                        <p className="mt-3 rounded-xl border border-accent/25 bg-accent/8 px-3.5 py-2.5 text-caption text-accent">
                          <span className="font-semibold">Next · </span>
                          {session.nextTask}
                        </p>
                      )}
      
                      {session.status === "ACTIVE" && (
                        <details className="mt-4 rounded-xl border border-line bg-well">
                          <summary
                            className="cursor-pointer list-none px-4 py-3 text-caption font-semibold
                              text-muted transition-colors hover:text-foreground
                              [&::-webkit-details-marker]:hidden"
                          >
                            End session — quick review
                          </summary>
                          <form
                            action={endSession}
                            className="space-y-4 border-t border-line-subtle px-4 py-4"
                          >
                            <input type="hidden" name="id" value={session.id} />
                            <TextField label="What did we finish?" name="notes" rows={2} />
                            <TextField label="What still doesn't work?" name="whatChanged" rows={2} />
                            <TextField label="Discoveries" name="discoveries" rows={2} />
                            <Field
                              label="What should happen next?"
                              name="nextTask"
                              type="text"
                              placeholder="Becomes the project's next task"
                            />
      
                            <div className="rounded-xl border border-line bg-surface p-4">
                              <FieldShell label="Decision">
                                <label className="flex items-center gap-2.5 text-body text-muted">
                                  <input
                                    type="checkbox"
                                    name="makeDecision"
                                    className="h-4 w-4 accent-[var(--accent)]"
                                  />
                                  Record a decision made this session
                                </label>
                              </FieldShell>
                              <div className="mt-4 space-y-4">
                                <Field
                                  label="Decision title"
                                  name="decisionTitle"
                                  type="text"
                                  placeholder="Use Prisma instead of Drizzle"
                                />
                                <Field
                                  label="Decision"
                                  name="decisionBody"
                                  type="text"
                                  placeholder="What was decided"
                                />
                              </div>
                            </div>
      
                            <Button type="submit" variant="primary">
                              Complete session
                            </Button>
                          </form>
                        </details>
                      )}
                    </Row>
                  );
                })}
              </Stack>
            )}
          </div>
        );
      }

## Activity

    file changes: Completed · 5 changes
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/bugs/page.tsx
    @@ -13,2 +13,4 @@
     import { workStatus } from "@/features/projects/display";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteBugRecord, updateBugRecord } from "@/features/projects/record-actions";
     
    @@ -235,2 +237,20 @@
                     ) : null}
    +                <RecordControls
    +                  id={bug.id}
    +                  name={bug.title}
    +                  editAction={updateBugRecord}
    +                  deleteAction={deleteBugRecord}
    +                >
    +                  <Field label="Title" name="title" defaultValue={bug.title} required />
    +                  <TextField label="Symptoms" name="symptoms" rows={2} defaultValue={bug.symptoms ?? ""} />
    +                  <TextField label="Reproduction steps" name="reproduction" rows={2} defaultValue={bug.reproduction ?? ""} />
    +                  <FormGrid>
    +                    <Field label="Expected" name="expected" defaultValue={bug.expectedBehavior ?? ""} />
    +                    <Field label="Actual" name="actual" defaultValue={bug.actualBehavior ?? ""} />
    +                  </FormGrid>
    +                  <TextField label="Suspected cause" name="suspectedCause" rows={2} defaultValue={bug.suspectedCause ?? ""} />
    +                  <SelectField label="Severity" name="severity" defaultValue={String(bug.severity)}>
    +                    {[1, 2, 3, 4, 5].map((severity) => <option key={severity} value={severity}>{severity}</option>)}
    +                  </SelectField>
    +                </RecordControls>
                   </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/decisions/page.tsx
    @@ -13,2 +13,4 @@
     import { workStatus } from "@/features/projects/display";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteDecisionRecord, updateDecisionRecord } from "@/features/projects/record-actions";
     
    @@ -206,2 +208,20 @@
                     )}
    +                <RecordControls
    +                  id={decision.id}
    +                  name={decision.title}
    +                  editAction={updateDecisionRecord}
    +                  deleteAction={deleteDecisionRecord}
    +                >
    +                  <Field label="Title" name="title" defaultValue={decision.title} required />
    +                  <TextField label="Decision" name="decision" rows={2} defaultValue={decision.decision} required />
    +                  <TextField label="Reasoning" name="reasoning" rows={2} defaultValue={decision.reasoning ?? ""} />
    +                  <Field label="Alternatives considered" name="alternatives" defaultValue={decision.alternatives ?? ""} />
    +                  <Field label="Affected system" name="affectedSystem" defaultValue={decision.affectedSystem ?? ""} />
    +                  <FieldShell label="Reversibility">
    +                    <label className="flex items-center gap-2.5 text-body text-muted">
    +                      <input type="checkbox" name="reversible" defaultChecked={decision.reversible} className="h-4 w-4 accent-[var(--accent)]" />
    +                      This decision can be revisited later
    +                    </label>
    +                  </FieldShell>
    +                </RecordControls>
                   </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/features/page.tsx
    @@ -13,2 +13,4 @@
     import { workStatus } from "@/features/projects/display";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteFeatureRecord, updateFeatureRecord } from "@/features/projects/record-actions";
     
    @@ -233,2 +235,22 @@
                     )}
    +                <RecordControls
    +                  id={feature.id}
    +                  name={feature.title}
    +                  editAction={updateFeatureRecord}
    +                  deleteAction={deleteFeatureRecord}
    +                >
    +                  <Field label="Name" name="title" defaultValue={feature.title} required />
    +                  <TextField label="Description" name="body" rows={2} defaultValue={feature.body ?? ""} />
    +                  <Field label="Reason" name="reason" defaultValue={feature.reason ?? ""} />
    +                  <TextField label="Acceptance criteria" name="criteria" rows={2} defaultValue={feature.acceptanceCriteria ?? ""} />
    +                  <FormGrid>
    +                    <SelectField label="Milestone" name="milestoneId" defaultValue={feature.milestoneId ?? ""}>
    +                      <option value="">No milestone</option>
    +                      {project.milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.name}</option>)}
    +                    </SelectField>
    +                    <SelectField label="Priority" name="priority" defaultValue={String(feature.priority)}>
    +                      {[0, 1, 2, 3, 4, 5].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
    +                    </SelectField>
    +                  </FormGrid>
    +                </RecordControls>
                   </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/milestones/page.tsx
    @@ -13,2 +13,4 @@
     import { workStatus } from "@/features/projects/display";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteMilestoneRecord, updateMilestoneRecord } from "@/features/projects/record-actions";
     
    @@ -191,2 +193,17 @@
                     )}
    +                <RecordControls
    +                  id={milestone.id}
    +                  name={milestone.name}
    +                  editAction={updateMilestoneRecord}
    +                  deleteAction={deleteMilestoneRecord}
    +                >
    +                  <Field label="Name" name="name" defaultValue={milestone.name} required />
    +                  <Field label="Description" name="description" defaultValue={milestone.description ?? ""} />
    +                  <Field
    +                    label="Target date"
    +                    name="targetDate"
    +                    type="date"
    +                    defaultValue={milestone.targetDate?.toISOString().slice(0, 10) ?? ""}
    +                  />
    +                </RecordControls>
                   </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/notes/page.tsx
    @@ -13,2 +13,4 @@
     import { timeAgo } from "@/features/projects/display";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteNoteRecord, updateNoteRecord } from "@/features/projects/record-actions";
     
    @@ -139,2 +141,11 @@
                   </div>
    +              <RecordControls
    +                id={note.id}
    +                name={note.title}
    +                editAction={updateNoteRecord}
    +                deleteAction={deleteNoteRecord}
    +              >
    +                <Field label="Title" name="title" defaultValue={note.title} required />
    +                <TextField label="Body" name="body" rows={8} defaultValue={note.body} required hint="Markdown is supported." />
    +              </RecordControls>
                 </Row>

## Activity

    $ /bin/zsh -lc "sed -n '1,175p' 'src/app/(authenticated)/prompts/page.tsx' && sed -n '1,25p' 'src/app/(authenticated)/[slug]/commands/page.tsx' && sed -n '1,25p' 'src/app/(authenticated)/[slug]/env/page.tsx'"
    status: Completed · exit 0
      import { redirect } from "next/navigation";
      import { cookies } from "next/headers";
      import Link from "next/link";
      import { FileText, Search } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { Button } from "@/components/ui/button";
      import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
      import { cn } from "@/lib/cn";
      
      export const metadata = { title: "Prompt library" };
      
      const PROMPT_CATEGORIES = [
        "Starter", "Feature", "Debug", "Refactor", "UI", "Database", "Security",
        "Performance", "Testing", "Deployment", "Architecture", "Code Review",
        "Research", "Custom",
      ];
      
      export default async function PromptLibrary({
        searchParams,
      }: {
        searchParams: Promise<{ category?: string; q?: string; project?: string }>;
      }) {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
        if (!token) redirect("/login");
      
        const actor = await verifySessionToken(token);
        if (!actor) redirect("/login");
      
        const { category, q, project } = await searchParams;
      
        const where = {
          ownerId: actor.userId,
          archivedAt: null as null | undefined,
          ...(category ? { category } : {}),
          ...(project ? { projectId: project } : {}),
          ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
        };
      
        const prompts = await db.prompt.findMany({
          where,
          include: {
            project: { select: { name: true } },
            currentVersion: { select: { content: true, versionNumber: true } },
            _count: { select: { queueItems: true } },
          },
          orderBy: [{ favorite: "desc" }, { updatedAt: "desc" }],
          take: 100,
        });
      
        const projects = await db.project.findMany({
          where: { ownerId: actor.userId, archivedAt: null },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        });
      
        async function createPrompt(formData: FormData) {
          "use server";
      
          const cookieStore = await cookies();
          const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
          if (!token) redirect("/login");
          const actor = await verifySessionToken(token);
          if (!actor) redirect("/login");
      
          const title = (formData.get("title") as string).trim();
          const content = (formData.get("content") as string).trim();
          const category = (formData.get("category") as string) || "Custom";
          const projectId = (formData.get("projectId") as string) || null;
      
          if (!title || !content) redirect("/prompts?error=Title+and+content+are+required");
      
          const prompt = await db.prompt.create({
            data: {
              ownerId: actor.userId,
              title,
              category,
              projectId,
              status: "READY",
              versions: {
                // No ownerId here: it is a relation scalar of the prompt→version
                // relation, so Prisma inherits it from the parent and rejects it
                // being passed again.
                create: {
                  versionNumber: 1,
                  content,
                  createdById: actor.userId,
                },
              },
            },
            select: { id: true },
          });
      
          await db.prompt.update({
            where: { id: prompt.id },
            data: { currentVersion: { connect: { promptId_versionNumber: { promptId: prompt.id, versionNumber: 1 } } } },
          });
      
          await db.activity.create({
            data: {
              ownerId: actor.userId,
              actorUserId: actor.userId,
              projectId,
              type: "PROMPT_CREATED",
              subjectKind: "PROMPT",
              subjectId: prompt.id,
              summary: `Created prompt "${title}"`,
            },
          });
      
          redirect("/prompts");
        }
      
        return (
          <PageShell>
            <PageHeader
              title="Prompt library"
              description="Prompts are first-class here, not scraps in a notes app. Save the ones that worked, then queue them onto a project."
            />
      
            <CreateDisclosure label="New prompt" className="mb-6">
              <form action={createPrompt} className="space-y-4">
                <Field
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Add a Stripe customer portal"
                  required
                />
                <TextField
                  label="Content"
                  name="content"
                  placeholder="Paste the prompt here…"
                  rows={7}
                  required
                  className="font-mono text-caption"
                />
                <FormGrid>
                  <SelectField label="Category" name="category" defaultValue="Custom">
                    {PROMPT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField label="Project" name="projectId" defaultValue="">
                    <option value="">No project (reusable)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </SelectField>
                </FormGrid>
                <Button type="submit" variant="primary">
                  Save prompt
                </Button>
              </form>
            </CreateDisclosure>
      
            {/*
              A plain GET form: search survives a reload, is linkable, and works with
              no JavaScript. The category chips below carry the query along.
            */}
            <form method="get" role="search" className="mb-4 flex flex-wrap gap-2">
              <div className="relative min-w-56 flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
                  aria-hidden="true"
                />
      import { redirect, notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Terminal, Trash2 } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field } from "@/components/ui/field";
      import { CopyButton } from "@/components/ui/copy-button";
      import { Badge } from "@/components/ui/badge";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function CommandsPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { commands: { orderBy: { sortOrder: "asc" } } },
        });
        if (!project) notFound();
      
      import { redirect, notFound } from "next/navigation";
      import { cookies } from "next/headers";
      import { Check, KeyRound, Trash2 } from "lucide-react";
      import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
      import { db } from "@/server/db";
      import { requireActor } from "@/features/projects/queries";
      import { Button } from "@/components/ui/button";
      import { Field, FieldShell, SelectField } from "@/components/ui/field";
      import { Badge } from "@/components/ui/badge";
      import { Progress } from "@/components/ui/progress";
      import { EmptyState, Row, Stack } from "@/components/ui/page";
      import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
      
      type Props = { params: Promise<{ slug: string }> };
      
      export default async function EnvPage({ params }: Props) {
        const actor = await requireActor();
        const { slug } = await params;
      
        const project = await db.project.findUnique({
          where: { ownerId_slug: { ownerId: actor.userId, slug } },
          include: { environmentVariables: { orderBy: [{ environment: "asc" }, { name: "asc" }] } },
        });
        if (!project) notFound();
      

## Activity

    file changes: Completed · 4 changes
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/commands/page.tsx
    @@ -2,3 +2,3 @@
     import { cookies } from "next/headers";
    -import { Terminal, Trash2 } from "lucide-react";
    +import { Terminal } from "lucide-react";
     import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
    @@ -11,3 +11,5 @@
     import { EmptyState, Row, Stack } from "@/components/ui/page";
    -import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
    +import { CreateDisclosure, FormGrid } from "@/components/ui/disclosure";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteCommandRecord, updateCommandRecord } from "@/features/projects/record-actions";
     
    @@ -57,16 +59,2 @@
         });
    -    redirect(`/${slug}/commands`);
    -  }
    -
    -  async function deleteCommand(formData: FormData) {
    -    "use server";
    -
    -    const cookieStore = await cookies();
    -    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    -    if (!token) redirect("/login");
    -    const actor = await verifySessionToken(token);
    -    if (!actor) redirect("/login");
    -
    -    const id = formData.get("id") as string;
    -    await db.command.deleteMany({ where: { id, ownerId: actor.userId, projectId: project!.id } });
         redirect(`/${slug}/commands`);
    @@ -141,10 +129,12 @@
                       <CopyButton text={command.commandText} label="Copy" size="sm" />
    -                  <form action={deleteCommand}>
    -                    <input type="hidden" name="id" value={command.id} />
    -                    <RowButton tone="danger" aria-label={`Delete ${command.name}`}>
    -                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
    -                    </RowButton>
    -                  </form>
                     </div>
                   </div>
    +              <RecordControls id={command.id} name={command.name} editAction={updateCommandRecord} deleteAction={deleteCommandRecord}>
    +                <FormGrid>
    +                  <Field label="Name" name="name" defaultValue={command.name} required />
    +                  <Field label="Category" name="category" defaultValue={command.category ?? ""} />
    +                </FormGrid>
    +                <Field label="Command" name="commandText" defaultValue={command.commandText} required className="font-mono" />
    +                <Field label="Description" name="description" defaultValue={command.description ?? ""} />
    +              </RecordControls>
                 </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/env/page.tsx
    @@ -2,3 +2,3 @@
     import { cookies } from "next/headers";
    -import { Check, KeyRound, Trash2 } from "lucide-react";
    +import { Check, KeyRound } from "lucide-react";
     import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
    @@ -12,2 +12,4 @@
     import { CreateDisclosure, FormGrid, RowButton } from "@/components/ui/disclosure";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteEnvironmentRecord, updateEnvironmentRecord } from "@/features/projects/record-actions";
     
    @@ -88,16 +90,2 @@
         });
    -    redirect(`/${slug}/env`);
    -  }
    -
    -  async function deleteVariable(formData: FormData) {
    -    "use server";
    -
    -    const cookieStore = await cookies();
    -    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    -    if (!token) redirect("/login");
    -    const actor = await verifySessionToken(token);
    -    if (!actor) redirect("/login");
    -
    -    const id = formData.get("id") as string;
    -    await db.environmentVariable.deleteMany({ where: { id, ownerId: actor.userId } });
         redirect(`/${slug}/env`);
    @@ -228,10 +216,16 @@
                       </form>
    -                  <form action={deleteVariable}>
    -                    <input type="hidden" name="id" value={variable.id} />
    -                    <RowButton tone="danger" aria-label={`Delete ${variable.name}`}>
    -                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
    -                    </RowButton>
    -                  </form>
                     </div>
                   </div>
    +              <RecordControls id={variable.id} name={variable.name} editAction={updateEnvironmentRecord} deleteAction={deleteEnvironmentRecord}>
    +                <FormGrid>
    +                  <Field label="Name" name="name" defaultValue={variable.name} required className="font-mono" />
    +                  <SelectField label="Environment" name="environment" defaultValue={variable.environment}>
    +                    <option value="local">local</option><option value="staging">staging</option><option value="production">production</option>
    +                  </SelectField>
    +                </FormGrid>
    +                <Field label="What it is" name="description" defaultValue={variable.description ?? ""} />
    +                <Field label="Where to get it" name="acquisitionNote" defaultValue={variable.acquisitionNote ?? ""} />
    +                <Field label="Note" name="note" defaultValue={variable.note ?? ""} />
    +                <FieldShell label="Requirement"><label className="flex items-center gap-2.5 text-body text-muted"><input type="checkbox" name="required" defaultChecked={variable.required} /> Required for the app to work</label></FieldShell>
    +              </RecordControls>
                 </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/[slug]/inspirations/page.tsx
    @@ -12,2 +12,4 @@
     import { CreateDisclosure } from "@/components/ui/disclosure";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deleteInspirationRecord, updateInspirationRecord } from "@/features/projects/record-actions";
     
    @@ -148,2 +150,17 @@
                   {item.note && <p className="mt-2 text-caption text-subtle">{item.note}</p>}
    +              <RecordControls
    +                id={item.id}
    +                name={item.title}
    +                editAction={updateInspirationRecord}
    +                deleteAction={deleteInspirationRecord}
    +              >
    +                <Field label="Title" name="title" defaultValue={item.title} required />
    +                <Field label="URL" name="url" type="url" defaultValue={item.canonicalUrl ?? ""} />
    +                <SelectField label="Kind" name="kind" defaultValue={item.kind}>
    +                  {Object.entries(KIND_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    +                </SelectField>
    +                <TextField label="What exactly inspired me" name="inspiredDetail" rows={2} defaultValue={item.inspiredDetail ?? ""} />
    +                <TextField label="Text snippet" name="textSnippet" rows={2} defaultValue={item.textSnippet ?? ""} />
    +                <Field label="Note" name="note" defaultValue={item.note ?? ""} />
    +              </RecordControls>
                 </Row>
    Update { move_path: None }: /Users/medali/Desktop/medali/cadabry/src/app/(authenticated)/prompts/page.tsx
    @@ -7,3 +7,3 @@
     import { Button } from "@/components/ui/button";
    -import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
    +import { BareInput, Field, FieldShell, SelectField, TextField } from "@/components/ui/field";
     import { CopyButton } from "@/components/ui/copy-button";
    @@ -13,2 +13,4 @@
     import { cn } from "@/lib/cn";
    +import { RecordControls } from "@/components/ui/record-controls";
    +import { deletePromptRecord, updatePromptRecord } from "@/features/projects/record-actions";
     
    @@ -258,2 +260,27 @@
                   </div>
    +              <RecordControls
    +                id={prompt.id}
    +                name={prompt.title}
    +                editAction={updatePromptRecord}
    +                deleteAction={deletePromptRecord}
    +              >
    +                <Field label="Title" name="title" defaultValue={prompt.title} required />
    +                <TextField label="Content" name="content" rows={8} defaultValue={prompt.currentVersion?.content ?? ""} required className="font-mono text-caption" />
    +                <FormGrid>
    +                  <SelectField label="Category" name="category" defaultValue={prompt.category ?? "Custom"}>
    +                    {PROMPT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
    +                  </SelectField>
    +                  <SelectField label="Project" name="projectId" defaultValue={prompt.projectId ?? ""}>
    +                    <option value="">No project (reusable)</option>
    +                    {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
    +                  </SelectField>
    +                </FormGrid>
    +                <Field label="Notes" name="notes" defaultValue={prompt.notes ?? ""} />
    +                <FieldShell label="Library options">
    +                  <div className="flex flex-wrap gap-5 text-body text-muted">
    +                    <label className="flex items-center gap-2"><input type="checkbox" name="favorite" defaultChecked={prompt.favorite} /> Favorite</label>
    +                    <label className="flex items-center gap-2"><input type="checkbox" name="reusable" defaultChecked={prompt.reusable} /> Reusable</label>
    +                  </div>
    +                </FieldShell>
    +              </RecordControls>
                 </Row>

## User

continue
