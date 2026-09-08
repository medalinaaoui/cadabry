# Build Cadabry

You are the lead product engineer, systems architect, and product designer responsible for building a production-quality application called **Cadabry**.

Do not treat this as a prototype, demo, CRUD dashboard, or hackathon project.

Build it as a real product that I can start using every day immediately and eventually release publicly to vibe coders.

## What Cadabry is

Cadabry is a personal operating system for vibe coding.

Its purpose is to help someone who uses tools like Codex, Claude Code, Cursor, Windsurf, Lovable, Replit, Bolt, or similar AI coding agents manage multiple software projects without constantly losing context.

The problem is not simply task management.

Vibe coders repeatedly struggle with:

- forgetting what they were building
- reopening a project days later and having no idea where they left off
- rewriting the same starter prompt every time
- repeatedly explaining preferred technologies and coding standards
- forgetting the next features they wanted
- ideas scattered across Notes, Slack, screenshots, bookmarks, chats, and text files
- agents losing architectural context as projects grow
- agents introducing different patterns from previous sessions
- large "god prompts" trying to accomplish too much at once
- prompts being lost after they work well
- not remembering why an architectural decision was made
- breaking previously working features
- debugging without knowing what changed
- accepting AI-generated code without understanding the overall system
- repeatedly feeding the same project context back to agents
- spending tokens rediscovering a codebase
- not knowing what prompt should come next
- feature creep
- abandoned side projects
- losing inspiration links and screenshots
- having several projects that all feel 60% finished
- forgetting credentials, setup requirements, environment variables, deployment details, commands, libraries, and external services needed by a project

Cadabry should become the user's **external brain for building software with AI**.

The ideal experience is:

> I haven't touched this project for three weeks. I open Cadabry, understand the entire project within 30 seconds, press "Resume Building", copy the generated context prompt into my coding agent, and continue exactly where I stopped.

That is the product.

---

# Product philosophy

Cadabry should optimize for:

1. Less thinking about process
2. Less repeated typing
3. Less lost context
4. Smaller and better prompts
5. Faster resumption between coding sessions
6. Clear project direction
7. Preserving important decisions
8. Preserving working prompts
9. Preventing agents from changing established architecture unnecessarily
10. Making unfinished projects obvious and actionable
11. Giving the user the next best action immediately

Do not blindly recreate Jira, Notion, Linear, Trello, or a generic SaaS admin panel.

There can be concepts inspired by those products, but Cadabry must feel purpose-built for AI-assisted software creation.

---

# Brand

Product name:

**Cadabry**

Use this exact spelling.

Cadabry should feel magical, intelligent, calm, futuristic, creative, and premium.

The brand should communicate something like:

**Your universe of unfinished ideas becoming real software.**

Do not make the branding childish or overly "AI."

---

# Visual direction

The interface should strongly avoid the standard:

sidebar + top nav + cards + table + boring SaaS dashboard

formula.

The main project universe can feel spatial.

Imagine the user's coding projects existing as objects or worlds floating in a personal digital universe.

Possible metaphors:

- planets
- stars
- floating objects
- constellations
- orbital systems
- celestial project nodes

Do not sacrifice usability for the metaphor.

Information-heavy screens such as editing a project can become more conventional, but the home experience should feel memorable.

## Design inspiration

Combine:

### Apple Human Interface Guidelines

Use Apple-like principles:

- strong hierarchy
- restraint
- beautiful typography
- intentional whitespace
- excellent interactions
- subtle depth
- responsive motion
- clarity over decoration
- progressive disclosure
- minimal visual noise
- great keyboard accessibility
- premium micro-interactions

Do not clone Apple's UI or proprietary assets.

### Vincent van Gogh's The Starry Night

Take the color inspiration from **The Starry Night**.

Create a tasteful palette derived from:

- midnight navy
- deep ultramarine
- cobalt blue
- moonlight yellow
- muted golden yellow
- cloudy blue-gray
- subtle cyan
- near-black blue

The interface should mostly remain sophisticated and dark, with yellows and brighter blues used intentionally for active states, project energy, progress, stars, highlights, and calls to action.

Avoid turning the product into a literal painting.

Think:

**Apple designed a software workspace inside The Starry Night universe.**

Use tasteful animation.

Animations should communicate state and spatial relationships rather than exist only for decoration.

Respect `prefers-reduced-motion`.

---

# Technology stack

Use:

- Next.js
- TypeScript
- App Router
- React
- Prisma
- PostgreSQL
- Neon
- Tailwind CSS

Use the latest stable production versions compatible with each other at implementation time.

As of the initial build, Next.js 16 Active LTS and Prisma 8 are appropriate references, but verify official documentation before installing dependencies.

I will provide Neon database credentials.

Do not hardcode credentials anywhere.

Use environment variables.

Use Prisma correctly for a serverless PostgreSQL environment and follow current Prisma and Neon guidance regarding connection pooling and migrations.

Prefer Server Components where they make sense.

Only use `"use client"` where interactivity requires it.

Use Server Actions for internal mutations where appropriate.

Use Route Handlers when they are genuinely the right abstraction.

Validate all external input.

Do not expose sensitive server code to the client.

Structure the application so it can later support multiple users without requiring a complete rewrite.

---

# Authentication for V1

Do not spend a large amount of development time on authentication right now.

Initially, this app is for me.

Implement a clean minimal authentication gate.

Preferred approach:

- First-time owner setup
- create name, email, password
- hash passwords securely
- database-backed user
- secure HTTP-only session
- protected application routes
- logout
- no social login
- no email verification yet
- no password reset yet
- no organizations yet

Public signup should not need to be enabled after the initial owner has been created.

Architect the User model so proper public signup and multi-user functionality can be added later.

Do not build a fake authentication screen that doesn't actually protect data.

---

# Core information architecture

Cadabry should have these major systems.

## 1. Project Universe

This is the primary home experience.

Every active project exists visually in the Cadabry universe.

Each project should quickly communicate:

- project name
- icon or visual identity
- status
- project health
- progress
- last activity
- what I'm currently building
- number of next actions
- whether it is blocked
- whether it has been abandoned/inactive
- importance
- project type

Projects should subtly feel alive.

Recently active projects may have more visual energy.

Dormant projects can fade slightly.

Completed projects can visually transform rather than simply disappear.

Allow filtering:

- Active
- Idea
- Planning
- Building
- Blocked
- Paused
- Shipped
- Archived

Provide a conventional list/grid alternative as well for usability.

---

# 2. Project Brain

Every project must have a central source of truth called its **Project Brain**.

This is one of the most important parts of Cadabry.

Store structured information such as:

### Identity

- project name
- one-line description
- detailed description
- project icon
- project color
- project type
- repository URL
- production URL
- staging URL
- local folder path as plain metadata
- creation date
- last activity

### What are we building?

A concise product statement.

Example:

"An app for agency owners that analyzes Meta ad creatives and identifies winning hooks."

### Why are we building it?

Store:

- problem
- target user
- desired outcome
- value proposition

### Current state

Store:

- current milestone
- what currently works
- what is partially built
- what is broken
- current blocker
- current task
- next task

### Product boundaries

Store:

- goals
- non-goals
- assumptions
- constraints
- future ideas

Non-goals are important because they prevent AI agents from unnecessarily expanding scope.

---

# 3. Tech Brain

Every project needs structured technical context.

Store:

- framework
- language
- database
- ORM
- authentication
- hosting
- styling system
- state management
- email provider
- payments provider
- storage
- analytics
- background jobs
- external APIs
- AI providers
- testing tools
- package manager

Allow custom technologies.

Store important conventions:

- folder structure
- naming conventions
- preferred component patterns
- API conventions
- database conventions
- styling rules
- security rules
- testing expectations

This information should later be usable automatically when generating prompts.

---

# 4. Global Builder Profile

This solves one of my biggest personal annoyances.

I should not repeatedly type:

"Start a Next.js app using X, use Prisma, install Y, follow these conventions..."

Create a **Builder Profile** that stores my global default preferences.

Examples:

## Default stack

- Next.js
- TypeScript
- Prisma
- Neon PostgreSQL
- Tailwind
- Vercel

## Coding preferences

- use App Router
- use Server Components by default
- avoid unnecessary dependencies
- use TypeScript strictly
- validate inputs
- responsive mobile experience
- do not use placeholder buttons
- never leave fake functionality
- don't make huge files
- use reusable components
- run lint and typecheck after implementation
- do not change unrelated code
- preserve existing patterns

Let me add/edit/remove any rule.

Project rules should be able to override global rules.

---

# 5. Starter Prompt Builder

This should be one of Cadabry's flagship features.

When I start a project, Cadabry should generate a detailed starter prompt from structured information instead of making me write it again.

The UI should ask for things such as:

- what are you building?
- who is it for?
- core outcome
- project type
- chosen stack
- important features
- preferred design direction
- needed integrations
- constraints
- preferred AI coding tool
- required skills/instructions

Then produce a polished starter prompt.

Sections can include:

- role
- project
- product goal
- stack
- architecture requirements
- UX requirements
- coding rules
- required integrations
- initial database model
- required skills
- quality requirements
- implementation phases
- definition of done

Allow:

- Copy Prompt
- Edit Prompt
- Save Prompt
- Duplicate
- Version
- Add to project
- Mark as used

---

# 6. Prompt Library

Prompts should be first-class objects, not random notes.

Create a reusable Prompt Library.

Categories:

- Starter
- Feature
- Debug
- Refactor
- UI
- Database
- Security
- Performance
- Testing
- Deployment
- Architecture
- Code Review
- Research
- Custom

A prompt should support:

- title
- content
- category
- tags
- project
- associated feature
- status
- created date
- last used
- favorite
- reusable/global
- notes
- versions

Search must be excellent.

Provide quick copy functionality.

---

# 7. Prompt Recipes

Create reusable prompt recipes that automatically combine structured project context with a task.

Examples:

### Build this feature

Generate:

- relevant project context
- architecture
- current task
- acceptance criteria
- constraints
- relevant existing decisions
- definition of done

### Debug this

Include:

- expected behavior
- actual behavior
- reproduction steps
- recent relevant changes
- technical stack
- debugging instructions
- instruction not to rewrite unrelated systems

### Review implementation

Tell agent to:

- inspect implementation
- find incomplete behavior
- verify error states
- check accessibility
- check security
- typecheck
- test edge cases
- identify regressions

### Refactor safely

Tell agent:

- understand dependencies first
- preserve behavior
- don't modify unrelated files
- explain architecture impact
- run regression checks

### Continue project

This is especially important.

Generate a prompt telling an AI coding agent exactly how to resume the project.

---

# 8. Resume Building

This may become Cadabry's signature feature.

Every project gets a large action:

**Resume Building**

When clicked, Cadabry generates a ready-to-copy context packet containing only the most relevant current information.

Example structure:

# Project

What this application is.

# Current architecture

Important technical facts.

# Current state

What already works.

# Recent work

What changed recently.

# Decisions you must preserve

Important architecture/product decisions.

# Current task

Exactly what should be built now.

# Acceptance criteria

How we'll know it is complete.

# Known issues

Existing bugs or blockers.

# Next

What comes after this task.

# Instructions

Do not rewrite unrelated code.
Inspect existing patterns before implementing.
Ask only when required.
Run validation/tests when complete.

Do not dump the entire database worth of notes into this prompt.

Relevant context matters more than maximum context.

---

# 9. Next Prompt Queue

Each project needs a queue specifically for prompts I plan to send next.

Not generic tasks.

Actual AI prompts.

Statuses:

- Draft
- Ready
- Sent
- Completed
- Failed
- Needs Follow-up

Allow ordering via drag-and-drop.

Each item can attach to:

- feature
- bug
- idea
- milestone

A user should be able to plan tomorrow's AI coding session in advance.

---

# 10. Features System

Create a feature backlog optimized for vibe coding.

Feature fields:

- name
- description
- reason
- status
- priority
- difficulty
- impact
- related milestone
- dependencies
- acceptance criteria
- notes
- linked prompts
- linked decisions
- linked bugs

Statuses:

- Idea
- Planned
- Ready
- Building
- Testing
- Shipped
- Rejected

Avoid forcing everything into kanban visually.

Allow several views:

- prioritized list
- roadmap
- compact kanban
- chronological
- shipped log

---

# 11. Idea Inbox

Vibe coders constantly think of features while building something else.

Create frictionless capture.

Global shortcut:

**New Thought**

The user can quickly add:

- idea
- feature
- bug
- inspiration
- note
- prompt

Then optionally associate it with a project.

The entire interaction should take seconds.

Support an Inbox for uncategorized thoughts.

Later I can process them.

---

# 12. Inspiration Vault

Every project should have an Inspiration section.

Allow storing:

- URLs
- screenshots
- uploaded images
- text snippets
- products
- competitors
- UI references
- GitHub repositories
- tweets/posts
- videos
- articles

Each inspiration item supports:

- preview
- title
- URL
- note
- tags
- project
- what exactly inspired me

The last field matters.

Instead of only storing:

"linear.app"

I should be able to write:

"I like how their command menu surfaces actions without clutter."

---

# 13. Decision Log

AI-generated projects deteriorate when nobody remembers why something was done.

Create a first-class Decision Log.

Each decision:

- title
- decision
- reasoning
- alternatives considered
- date
- project
- affected system
- reversible?
- status

Example:

**Decision: Use Prisma instead of Drizzle**

Reason:
Existing project already depends heavily on Prisma.

Alternatives:
Drizzle.

Agent instruction:
Do not replace Prisma unless this decision is explicitly revisited.

Decisions should automatically become eligible context for generated prompts.

---

# 14. Session Journal

Create coding sessions.

A session should contain:

- project
- date/time
- objective
- prompts used
- features worked on
- notes
- discoveries
- bugs created
- decisions created
- what changed
- next task
- session status

At the end provide:

**End Session**

This opens a very fast review:

- What did we finish?
- What still doesn't work?
- What should happen next?
- Did we make any important decisions?

This creates continuity between sessions.

---

# 15. Project Timeline

Generate a human-readable history:

- project created
- feature started
- prompt used
- decision made
- bug discovered
- milestone reached
- feature shipped
- deployment
- project paused

This should answer:

"What happened in this project?"

---

# 16. Context Packs

Create reusable collections of instructions called **Context Packs**.

Examples:

### My Next.js Standards

### UI Polish

### Database Safety

### Production Checklist

### Debugging

### Security Review

### Mobile Responsiveness

### Vercel Deployment

Each pack contains reusable instructions.

Packs can be:

- global
- project-specific

When preparing a prompt I can toggle relevant packs.

This prevents one huge permanent instruction block from being injected into everything.

---

# 17. Skills Library

I frequently need specific AI-agent skills for particular jobs.

Create a Skills Library.

A Skill should store:

- name
- description
- category
- when to use
- installation instructions
- command
- repository/link
- agent-specific instructions
- notes

Examples:

- Figma skill
- browser skill
- testing skill
- database skill
- deployment skill
- screenshot skill
- accessibility review skill

Associate skills with:

- project types
- tech stack
- use cases

Then Starter Prompt Builder can recommend:

**Suggested Skills for this project**

Do not hardcode this system exclusively around one coding agent.

Agents change quickly.

---

# 18. Stack Presets

Let me save reusable technology presets.

Example:

## My SaaS Stack

Next.js
TypeScript
Prisma
Neon
Tailwind
Vercel
Stripe
Resend

## Quick Internal Tool

Next.js
TypeScript
SQLite/Postgres
Tailwind

Selecting a preset should populate the project Tech Brain.

---

# 19. Command Vault

Store useful project commands.

Examples:

- dev
- build
- lint
- typecheck
- test
- migrate
- generate
- seed
- deploy
- custom scripts

Do not store secrets.

This helps someone return to a project without remembering every CLI command.

---

# 20. Environment Checklist

Store environment variable names and statuses, never expose secrets unnecessarily.

Example:

DATABASE_URL
RESEND_API_KEY
STRIPE_SECRET_KEY

Fields:

- variable name
- description
- required?
- environment
- configured?
- where to obtain
- note

Do not make Cadabry a password manager.

Never encourage storing raw production secrets inside ordinary project notes.

---

# 21. Bugs and Debugging Memory

Create a lightweight bug system.

Fields:

- title
- symptoms
- expected behavior
- actual behavior
- reproduction steps
- suspected cause
- status
- severity
- linked feature
- linked prompts
- resolution
- root cause

When resolved, preserve the solution.

Later, when a similar issue happens, I should be able to find what fixed it previously.

---

# 22. Project Health

Calculate a lightweight project health state.

Examples:

- Moving
- Needs attention
- Blocked
- Dormant
- Almost shipped
- Shipped

Signals can include:

- time since last activity
- unresolved blocker
- active feature
- incomplete milestone
- number of unresolved bugs
- whether a next action exists

Do not pretend the score is scientifically precise.

Keep it useful.

---

# 23. Next Best Action

Every project page should answer immediately:

**What should I do next?**

Use existing structured data.

Possible answer:

"Finish onboarding persistence."

Then provide:

- current task
- reason
- prompt ready to copy

This should feel central to Cadabry.

---

# 24. Milestones

Projects need milestones without enterprise project-management complexity.

Examples:

- Prototype
- MVP
- Private beta
- Public beta
- Launch
- V1.1

Milestones can contain features and target dates if desired.

Dates should be optional.

---

# 25. Definition of Done

Allow global and project-specific completion rules.

Default software Definition of Done could include:

- feature works
- loading state
- empty state
- error state
- mobile responsiveness
- accessibility
- validation
- no obvious security issue
- lint passes
- typecheck passes
- tests where appropriate
- no unrelated regression
- no placeholder functionality
- no console errors

A feature can display its quality checklist.

---

# 26. Project Docs Export

One-click export:

**Generate Project Context**

Output well-structured Markdown.

Potential outputs:

- PROJECT_CONTEXT.md
- AGENT_HANDOFF.md
- ARCHITECTURE.md
- ROADMAP.md
- DECISIONS.md
- TODO.md

Initially these can simply download/copy Markdown.

Later repository sync can be added.

---

# 27. Agent Handoff

Create a tool for changing coding agents.

Example:

"I'm moving this project from Cursor to Codex."

Generate a clean handoff explaining:

- product
- current architecture
- important files/patterns if stored
- decisions
- current state
- active task
- known bugs
- next actions
- important instructions

The new agent should not require ten rounds of explanation.

---

# 28. Search and Command Palette

Cadabry needs extremely good navigation.

Create a global command palette using:

`Cmd + K`

Actions include:

- open project
- add project
- add thought
- add prompt
- add feature
- add bug
- resume project
- search notes
- search prompts
- search decisions
- switch project
- open settings

Search across:

- projects
- prompts
- notes
- ideas
- bugs
- decisions
- inspirations
- features

Keyboard navigation should feel excellent.

---

# 29. Quick Capture

Create a global shortcut/button that opens a minimal overlay.

I should be able to type:

"Add Stripe customer portal later"

and quickly save it to the current project as an idea.

Another example:

"Auth redirect bug on Safari"

Save as bug.

Keep quick capture extremely fast.

---

# 30. Favorites and Pins

Allow:

- favorite projects
- pin active project
- favorite prompts
- favorite context packs
- favorite skills

---

# 31. Archive instead of delete

Projects accumulate over time.

Support:

- Archive
- Restore
- Permanent delete with confirmation

Use soft deletion or an archive field where appropriate.

---

# 32. Seed Data

Do not leave me staring at an empty application.

Create polished demo content demonstrating Cadabry itself and several fake vibe coding projects.

Demo data should make the application's purpose immediately obvious.

But make it easy to remove all demo data.

---

# Data model

Design a thoughtful Prisma schema.

Likely entities include:

- User
- Session
- Project
- ProjectTechnology
- ProjectRule
- Feature
- Milestone
- Prompt
- PromptVersion
- PromptQueueItem
- Note
- Idea
- Inspiration
- Decision
- CodingSession
- Bug
- ContextPack
- ContextPackRule
- Skill
- StackPreset
- StackPresetTechnology
- Command
- EnvironmentVariable
- Tag
- Activity

Do not blindly create these exact tables if a better normalized model exists.

Think through relationships first.

Do not create generic JSON blobs for everything.

Use JSON only where flexibility provides genuine value.

Add:

- proper indexes
- cascading behavior deliberately
- createdAt
- updatedAt
- sensible enums where appropriate

Plan for future multi-user support.

---

# Activity system

Meaningful actions should create Activity records.

Examples:

- FEATURE_CREATED
- FEATURE_COMPLETED
- PROMPT_USED
- BUG_CREATED
- BUG_RESOLVED
- DECISION_CREATED
- SESSION_COMPLETED
- PROJECT_STATUS_CHANGED

This powers:

- project timelines
- recent activity
- health signals
- future analytics

---

# UX requirements

Every important mutation needs feedback.

Use:

- optimistic UI where safe
- toast feedback
- skeleton states
- empty states
- useful error states
- confirmation for destructive actions
- keyboard shortcuts
- autosave for longer text where appropriate
- unsaved state indicators

Forms should preserve user input when reasonable.

No button should exist purely decoratively.

Every visible interaction must work.

---

# Editor experience

Notes, prompts, decisions, and descriptions need a pleasant writing experience.

Support:

- Markdown
- code blocks
- lists
- headings
- inline code
- links

Do not overbuild a Notion clone.

Fast writing matters more than block-editor novelty.

---

# Mobile

Desktop is the priority because vibe coding happens mostly on computers.

Still make the product properly responsive.

On mobile, optimize around:

- quick capture
- reading project state
- adding ideas
- adding inspiration
- viewing next tasks

Do not simply shrink the desktop universe until it becomes unusable.

---

# Performance

Avoid excessive JavaScript.

Do not turn every page into a Client Component.

Lazy-load expensive spatial/animation experiences where appropriate.

Home visual effects should not make normal project management interactions sluggish.

Prioritize perceived performance.

---

# Security

Even though V1 has one user, build responsibly.

Requirements:

- secure password hashing
- HTTP-only sessions
- CSRF-aware architecture
- server-side authorization
- input validation
- safe URL handling
- no secrets exposed to clients
- environment validation
- sanitized rich/Markdown rendering
- sensible database constraints

Never trust a project ID from the browser without confirming ownership.

---

# Database operations

Use Prisma migrations.

Commit migration files.

Do not use destructive production schema workflows.

Implement a singleton or otherwise recommended Prisma connection strategy according to current official Prisma guidance.

Use Neon pooling correctly according to current Neon and Prisma documentation.

---

# Code quality

Use clear modular architecture.

Avoid:

- 1,000-line React components
- giant utility files
- duplicated form logic
- duplicated validation
- unnecessary abstraction
- random UI patterns
- unexplained magic values

Use:

- feature-level organization where reasonable
- shared UI primitives
- server-only modules for server code
- centralized validation schemas
- reusable data access patterns
- clean types

Do not introduce a dependency if a few lines of maintainable code solve the same problem.

---

# Accessibility

Use:

- semantic HTML
- keyboard navigation
- appropriate focus states
- labels
- accessible dialogs
- proper contrast
- reduced motion support

The spatial home UI must still be navigable without relying exclusively on pointer movement.

---

# Product analytics architecture

Do not integrate a third-party analytics product yet unless necessary.

But structure significant events cleanly enough that analytics can be added later.

Potential future metrics:

- projects created
- sessions per project
- prompts copied
- prompts marked successful
- features shipped
- projects resumed after dormancy
- time from idea to shipped
- most reused context packs
- most reused prompts

---

# Important product principle: selective context

Do not assume bigger prompts are better prompts.

Cadabry should help users send **the right context**, not all context.

Generated prompts should prioritize:

1. current task
2. relevant architecture
3. relevant decisions
4. relevant constraints
5. acceptance criteria
6. necessary recent history

Old unrelated notes should not automatically be injected.

This should be visible in the product concept.

---

# Useful future architecture

Do not implement these unless the foundations make them easy, but avoid architectural decisions that make them impossible:

- GitHub integration
- automatic commit ingestion
- repository scanning
- automatic architecture maps
- AI-generated session summaries
- browser extension
- Raycast integration
- desktop app
- IDE extension
- Cursor integration
- Claude Code integration
- Codex integration
- agent MCP server
- automatic prompt delivery to coding agents
- team workspaces
- shared projects
- comments
- prompt performance scoring
- automatic "what changed?" summaries from Git
- project health AI
- duplicate idea detection
- automatic documentation generation

---

# First release scope

Despite the large product vision, do not attempt every future integration immediately.

The first genuinely usable release should contain:

### Foundation

- authentication
- database
- app shell
- settings
- Builder Profile

### Projects

- Project Universe
- project creation
- Project Brain
- Tech Brain
- status
- health
- activity timeline

### Building

- features
- ideas
- next tasks
- Prompt Library
- Prompt Queue
- Starter Prompt Builder
- Resume Building
- Context Packs
- Skills Library

### Memory

- notes
- decisions
- bugs
- coding sessions
- inspirations

### Utilities

- stack presets
- commands
- environment checklist
- global search
- command palette
- quick capture
- Markdown context export

This should already be an extremely useful personal tool.

---

# Build process

Do not immediately write hundreds of files.

Follow this process.

## Phase 1: Understand and architect

First inspect the repository.

Then write a concise internal implementation plan covering:

- information architecture
- routes
- Prisma schema
- server/client boundaries
- authentication strategy
- design system
- component structure

Resolve contradictions before coding.

## Phase 2: Foundation

Implement:

- project setup
- database connection
- Prisma
- migrations
- authentication
- base design system
- navigation
- command palette
- error boundaries

## Phase 3: Project Brain

Implement the complete core project experience.

It must already feel useful before moving into advanced features.

## Phase 4: Vibe coding systems

Implement:

- Prompt Library
- Starter Prompt
- Next Prompt Queue
- Builder Profile
- Context Packs
- Skills
- Resume Building

## Phase 5: Memory systems

Implement:

- sessions
- bugs
- decisions
- inspirations
- timeline

## Phase 6: Polish

Audit:

- responsive design
- accessibility
- empty states
- keyboard UX
- loading states
- errors
- animation
- consistency

## Phase 7: Verification

Before declaring completion:

1. run lint
2. run TypeScript checks
3. run production build
4. test authentication
5. test database mutations
6. test all core CRUD flows
7. test generated prompts
8. test responsive behavior
9. inspect console errors
10. check empty states
11. check destructive actions
12. ensure migrations exist
13. remove dead code
14. remove placeholder functionality
15. verify no secret is committed

Fix problems before reporting completion.

---

# Definition of success

I should be able to:

1. Sign into Cadabry.
2. Create a software project.
3. Describe what I am building.
4. Choose my stack.
5. Apply my saved Builder Profile.
6. Add features.
7. Add ideas.
8. save inspirations.
9. record important decisions.
10. create and save prompts.
11. queue the prompts I want to send next.
12. record a coding session.
13. close Cadabry.
14. return days later.
15. immediately understand where the project stands.
16. press **Resume Building**.
17. receive a high-quality prompt containing the relevant context.
18. paste it into a coding agent.
19. continue building without explaining the project from scratch.

If Cadabry accomplishes that experience beautifully, the first version is successful.

---

# Final instruction

Treat this product as something you personally depend on to manage ten simultaneous AI-built projects.

Make strong product decisions when small details are unspecified.

Do not reduce the scope into a generic task manager.

Do not create fake functionality.

Do not leave TODO buttons.

Do not use placeholder implementation where actual implementation is reasonable.

Do not redesign away the Cadabry concept.

Prioritize the user's ability to:

**capture -> remember -> decide -> prompt -> build -> resume -> ship**

Build the foundation cleanly enough that Cadabry can evolve from my private tool into a serious product for vibe coders.
