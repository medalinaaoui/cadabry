import { PrismaClient } from "../src/server/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "@node-rs/argon2";

const ARGON2_OPTS = { algorithm: 2, memoryCost: 19_456, timeCost: 2, parallelism: 1, outputLen: 32 } as const;
async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTS);
}

const DATABASE_URL = process.env["DATABASE_URL"];
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString: DATABASE_URL }) });

const DEMO_EMAIL = "demo@cadabry.app";
const DEMO_PASSWORD = "demo-password-2026!";

async function seed() {
  console.log("Seeding Cadabry demo data...");

  const existing = await db.user.findFirst({ where: { email: DEMO_EMAIL }, select: { id: true } });
  if (existing) {
    await db.appInstallation.deleteMany({ where: { ownerUserId: existing.id } });
    await db.user.delete({ where: { id: existing.id } });
    console.log("Cleared previous demo data");
  }

  const passwordHash = await hashPassword(DEMO_PASSWORD);

  // Does an owner already exist? (e.g. a real user set up the app first)
  const existingOwner = await db.user.findFirst({
    where: { role: "OWNER" },
    select: { id: true },
  });

  const user = await db.user.create({
    data: {
      email: DEMO_EMAIL,
      displayName: "Demo Builder",
      passwordHash,
      role: existingOwner ? "USER" : "OWNER",
    },
  });

  if (!existingOwner) {
    await db.appInstallation.upsert({
      where: { key: "primary" },
      create: { key: "primary", ownerUserId: user.id, setupCompletedAt: new Date() },
      update: { ownerUserId: user.id, setupCompletedAt: new Date() },
    });
    console.log("Demo owner created (no owner existed)");
  } else {
    console.log("Demo user created (owner already exists elsewhere)");
  }

  await db.builderProfile.create({
    data: {
      ownerId: user.id,
      displayName: "My default build style",
      defaultAgent: "Codex",
      rules: {
        create: [
          { ownerId: user.id, category: "General", content: "Use App Router", priority: 5 },
          { ownerId: user.id, category: "General", content: "Server Components by default", priority: 5 },
          { ownerId: user.id, category: "Quality", content: "Run lint and typecheck after implementation", priority: 4 },
          { ownerId: user.id, category: "Quality", content: "No placeholder buttons or fake functionality", priority: 4 },
          { ownerId: user.id, category: "Quality", content: "Use reusable components; keep files small", priority: 3 },
          { ownerId: user.id, category: "General", content: "Preserve existing patterns; do not change unrelated code", priority: 3 },
        ],
      },
    },
  });

  async function tech(name: string, category: string) {
    return db.technology.create({ data: { ownerId: user.id, name, category }, select: { id: true } });
  }
  const nextjs = await tech("Next.js", "framework");
  const ts = await tech("TypeScript", "language");
  const prisma = await tech("Prisma", "orm");
  const neon = await tech("Neon", "database");
  const tailwind = await tech("Tailwind", "styling");
  const vercel = await tech("Vercel", "hosting");
  const stripe = await tech("Stripe", "payments");
  const resend = await tech("Resend", "email");

  await db.stackPreset.create({
    data: {
      ownerId: user.id,
      name: "My SaaS Stack",
      description: "Standard production SaaS",
      technologies: { create: [
        { technologyId: nextjs.id, category: "framework", sortOrder: 0 },
        { technologyId: ts.id, category: "language", sortOrder: 1 },
        { technologyId: prisma.id, category: "orm", sortOrder: 2 },
        { technologyId: neon.id, category: "database", sortOrder: 3 },
        { technologyId: tailwind.id, category: "styling", sortOrder: 4 },
        { technologyId: vercel.id, category: "hosting", sortOrder: 5 },
        { technologyId: stripe.id, category: "payments", sortOrder: 6 },
        { technologyId: resend.id, category: "email", sortOrder: 7 },
      ] },
    },
  });

  await db.contextPack.create({
    data: {
      ownerId: user.id,
      name: "UI Polish",
      description: "Premium interaction quality",
      rules: { create: [
        { content: "Every button needs hover, active, and focus states", sortOrder: 0 },
        { content: "Use consistent spacing and the design tokens", sortOrder: 1 },
        { content: "Respect prefers-reduced-motion", sortOrder: 2 },
      ] },
    },
  });

  async function makeProject(data: any) {
    const slug = data.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return db.project.create({
      data: {
        ownerId: user.id,
        name: data.name,
        slug,
        oneLineDescription: data.desc,
        productStatement: data.statement,
        problem: data.problem,
        targetUser: data.targetUser,
        desiredOutcome: data.outcome,
        status: data.status,
        progress: data.progress,
        importance: data.importance,
        currentTask: data.task,
        nextTask: data.next,
        currentBlocker: data.blocker,
        whatWorks: data.works,
        partiallyBuilt: data.partial,
        whatIsBroken: data.broken,
        lastActivityAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 86400000),
        technologies: { create: data.tech.map((t: any, i: number) => ({
          technologyId: t.techId, category: t.category, sortOrder: i,
        })) },
        boundaries: { create: [
          { kind: "GOAL", content: "The core loop must work without manual instructions", sortOrder: 0 },
          { kind: "NON_GOAL", content: "No multi-tenant organization features", sortOrder: 1 },
          { kind: "CONSTRAINT", content: "Keep the stack fully serverless-friendly", sortOrder: 2 },
        ] },
        prompts: { create: [
          {
            title: `Starter prompt — ${data.name}`,
            category: "Starter",
            status: "READY",
            versions: { create: {
              versionNumber: 1,
              createdById: user.id,
              content: `You are the lead engineer for ${data.name}. ${data.statement}\n\nStack: Next.js, TypeScript, Prisma, Neon.\n\n## Instructions\nUse Server Components by default. Validate all input on the server. Run lint and typecheck before done.`,
            } },
          },
        ] },
        notes: { create: [
          { title: "Project notes", body: `**Why this matters**\n${data.problem}\n\nKeep the scope tight. Non-goals are intentional.`, kind: "note" },
        ] },
        decisions: { create: [
          {
            title: "Use Prisma over Drizzle",
            decision: "Prisma for all data access",
            reasoning: "Existing codebase already depends on Prisma; consistent tooling wins.",
            alternatives: "Drizzle",
            affectedSystem: "data layer",
            status: "ACCEPTED",
            decidedAt: new Date(),
          },
        ] },
      },
      select: { id: true, slug: true },
    });
  }

  await makeProject({
    name: "Cadabry",
    desc: "A personal operating system for vibe coding",
    status: "BUILDING",
    statement: "An app that helps people using AI coding agents manage multiple software projects without losing context.",
    problem: "Vibe coders constantly lose context, rewrite starter prompts, and forget why decisions were made.",
    targetUser: "Developers building multiple AI-assisted projects",
    outcome: "Open Cadabry after 3 weeks, understand everything in 30 seconds, press Resume Building, continue.",
    progress: 62, importance: 5,
    task: "Ship the remaining memory systems",
    next: "Seed data polish + final E2E verification",
    blocker: null,
    works: "Auth, project universe, project brain, resume building, prompt library, queue, features, decisions, bugs, timeline",
    partial: "Inspiration attachments (upload flow), command palette keyboard nav",
    broken: "Quick capture dialog needs a project selector on mobile",
    tech: [
      { techId: nextjs.id, category: "framework" }, { techId: ts.id, category: "language" },
      { techId: prisma.id, category: "orm" }, { techId: neon.id, category: "database" },
      { techId: tailwind.id, category: "styling" }, { techId: vercel.id, category: "hosting" },
    ],
  });

  await makeProject({
    name: "Hook Finder",
    desc: "Analyzes Meta ad creatives and identifies winning hooks",
    status: "PLANNING",
    statement: "An app for agency owners that analyzes Meta ad creatives and identifies winning hooks.",
    problem: "Agency owners spend hours manually reviewing ad creatives to find what works.",
    targetUser: "Agency owners managing five-figure ad budgets",
    outcome: "Identify winning hooks in minutes, not days",
    progress: 18, importance: 4,
    task: "Define the scoring model for hooks",
    next: "Prototype the upload flow",
    blocker: null,
    works: "Product research, competitive analysis, mock data model",
    partial: "None yet — in planning",
    broken: "None",
    tech: [
      { techId: nextjs.id, category: "framework" }, { techId: ts.id, category: "language" },
      { techId: prisma.id, category: "orm" }, { techId: neon.id, category: "database" },
      { techId: tailwind.id, category: "styling" },
    ],
  });

  await makeProject({
    name: "Recipe Robot",
    desc: "Turns leftovers into recipes",
    status: "PAUSED",
    statement: "An app that photographs your fridge and suggests recipes from what you have.",
    problem: "Food waste from not knowing what to cook with existing ingredients.",
    targetUser: "Home cooks who dislike wasting food",
    outcome: "A recipe suggestion in under 10 seconds",
    progress: 45, importance: 2,
    task: null,
    next: "Decide on computer-vision approach or skip to manual input",
    blocker: "No reliable nutrition/ingredient API found yet",
    works: "Basic recipe suggestion engine from manual ingredient list",
    partial: "Photo capture flow (mock)",
    broken: "Vision model integration never finished",
    tech: [
      { techId: nextjs.id, category: "framework" }, { techId: ts.id, category: "language" },
      { techId: prisma.id, category: "orm" }, { techId: neon.id, category: "database" },
    ],
  });

  await makeProject({
    name: "Invoice Ninja Mini",
    desc: "Simple invoice generator for freelancers",
    status: "SHIPPED",
    statement: "A dead-simple invoice generator for freelancers who hate accounting.",
    problem: "Freelancers overpay for accounting tools that do 10x what they need.",
    targetUser: "Independent freelancers",
    outcome: "Professional invoice in under a minute",
    progress: 100, importance: 3,
    task: null,
    next: "Add recurring invoicing if users ask",
    blocker: null,
    works: "Invoice generation, PDF export, client management, payment links",
    partial: "Recurring invoices (deferred)",
    broken: "None",
    tech: [
      { techId: nextjs.id, category: "framework" }, { techId: ts.id, category: "language" },
      { techId: prisma.id, category: "orm" }, { techId: neon.id, category: "database" },
      { techId: stripe.id, category: "payments" }, { techId: resend.id, category: "email" },
    ],
  });

  const mainProject = await db.project.findFirst({ where: { ownerId: user.id, name: "Cadabry" }, select: { id: true } });
  if (mainProject) {
    await db.command.createMany({ data: [
      { ownerId: user.id, projectId: mainProject.id, name: "dev", commandText: "npm run dev", sortOrder: 0 },
      { ownerId: user.id, projectId: mainProject.id, name: "build", commandText: "npm run build", sortOrder: 1 },
      { ownerId: user.id, projectId: mainProject.id, name: "lint", commandText: "npm run lint", sortOrder: 2 },
      { ownerId: user.id, projectId: mainProject.id, name: "typecheck", commandText: "npm run typecheck", sortOrder: 3 },
      { ownerId: user.id, projectId: mainProject.id, name: "test", commandText: "npm run test", sortOrder: 4 },
      { ownerId: user.id, projectId: mainProject.id, name: "migrate", commandText: "npx prisma migrate dev", sortOrder: 5 },
      { ownerId: user.id, projectId: mainProject.id, name: "deploy", commandText: "vercel --prod", sortOrder: 6 },
    ] });
    await db.environmentVariable.createMany({ data: [
      { ownerId: user.id, projectId: mainProject.id, name: "DATABASE_URL", description: "Neon pooled connection", required: true, environment: "production", configured: true, acquisitionNote: "Neon dashboard" },
      { ownerId: user.id, projectId: mainProject.id, name: "DIRECT_URL", description: "Neon direct connection for migrations", required: true, environment: "production", configured: true, acquisitionNote: "Neon dashboard (direct)" },
      { ownerId: user.id, projectId: mainProject.id, name: "RESEND_API_KEY", description: "Transactional email", required: false, environment: "production", configured: false, acquisitionNote: "Resend dashboard" },
    ] });
    const pM = await db.milestone.create({ data: { ownerId: user.id, projectId: mainProject.id, name: "Prototype", sortOrder: 0, status: "DONE" }, select: { id: true } });
    const mM = await db.milestone.create({ data: { ownerId: user.id, projectId: mainProject.id, name: "MVP", sortOrder: 1, status: "IN_PROGRESS" }, select: { id: true } });
    await db.feature.createMany({ data: [
      { ownerId: user.id, projectId: mainProject.id, title: "Project universe", status: "DONE", milestoneId: pM.id, priority: 5 },
      { ownerId: user.id, projectId: mainProject.id, title: "Resume Building packet", status: "DONE", milestoneId: pM.id, priority: 5 },
      { ownerId: user.id, projectId: mainProject.id, title: "Prompt Library", status: "DONE", milestoneId: mM.id, priority: 4 },
      { ownerId: user.id, projectId: mainProject.id, title: "Command palette", status: "PLANNED", milestoneId: mM.id, priority: 3 },
      { ownerId: user.id, projectId: mainProject.id, title: "GitHub integration", status: "PLANNED", milestoneId: mM.id, priority: 2 },
    ] });
    await db.bug.create({
      data: { ownerId: user.id, projectId: mainProject.id, title: "Long project names wrap oddly in universe view", status: "ACTIVE", severity: 2,
        symptoms: "Card layout breaks for names over ~30 chars", reproduction: "Create a project with a 40-char name" },
    });
    await db.inspiration.create({
      data: { ownerId: user.id, projectId: mainProject.id, kind: "LINK", title: "Linear command menu",
        canonicalUrl: "https://linear.app", inspiredDetail: "I like how their command menu surfaces actions without clutter." },
    });
  }

  await db.idea.create({ data: { ownerId: user.id, title: "Add a weekly recap email of all project activity", status: "INBOX", body: "Great retention idea for Cadabry" } });
  await db.idea.create({ data: { ownerId: user.id, title: "Duplicate detection for ideas", status: "INBOX", body: "Catch when the same thought is captured twice" } });

  await db.activity.create({
    data: { ownerId: user.id, actorUserId: user.id, type: "OWNER_SETUP_COMPLETED", subjectKind: "USER", summary: "Demo data seeded" },
  });

  console.log("Seed complete!");
  console.log(`Sign in: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

seed().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await db.$disconnect(); });
