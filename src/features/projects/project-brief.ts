export type ProjectBrief = {
  name: string;
  oneLineDescription: string;
  productStatement: string;
  problem: string;
  targetUser: string;
  desiredOutcome: string;
  projectType: string;
  stage: string;
  platforms: string[];
  features: string;
  firstRelease: string;
  nonGoals: string;
  stackPreset: string;
  technologies: string[];
  stackNotes: string;
  integrations: string;
  dataNeeds: string;
  authNeeds: string;
  monetization: string;
  designDirection: string;
  references: string;
  qualityPriorities: string[];
  deployment: string;
  constraints: string;
};

export const EMPTY_PROJECT_BRIEF: ProjectBrief = {
  name: "",
  oneLineDescription: "",
  productStatement: "",
  problem: "",
  targetUser: "",
  desiredOutcome: "",
  projectType: "",
  stage: "",
  platforms: [],
  features: "",
  firstRelease: "",
  nonGoals: "",
  stackPreset: "",
  technologies: [],
  stackNotes: "",
  integrations: "",
  dataNeeds: "",
  authNeeds: "",
  monetization: "",
  designDirection: "",
  references: "",
  qualityPriorities: [],
  deployment: "",
  constraints: "",
};

export const PROJECT_TYPES = [
  ["Mobile app", "iOS, Android, or both"],
  ["Web app", "Interactive browser product"],
  ["Website", "Content, marketing, or commerce"],
  ["SaaS", "Hosted product with accounts"],
  ["Game", "2D, 3D, desktop, or mobile"],
  ["Desktop app", "Installed computer application"],
  ["Browser extension", "Runs inside the browser"],
  ["API / backend", "Service without a primary UI"],
  ["AI tool", "AI is central to the workflow"],
] as const;

export const PROJECT_STAGES = [
  "New idea",
  "Validated concept",
  "Prototype exists",
  "Already in development",
  "Rebuild or migration",
] as const;

/** Ecosystems keep languages, frameworks, data, and interface choices coherent with the chosen stack. */
type Ecosystem =
  | "js"
  | "python"
  | "swift"
  | "kotlin"
  | "dart"
  | "go"
  | "rust"
  | "ruby"
  | "csharp"
  | "cpp"
  | "gdscript";

type ProjectType = (typeof PROJECT_TYPES)[number][0];

type PlatformOption = {
  label: string;
  /** Project types this platform is a real target for. */
  types: readonly ProjectType[];
};

export const PROJECT_PLATFORMS = [
  { label: "Web", types: ["Web app", "Website", "SaaS", "Game", "AI tool"] },
  { label: "iOS", types: ["Mobile app", "Game", "AI tool"] },
  { label: "Android", types: ["Mobile app", "Game", "AI tool"] },
  { label: "iPadOS", types: ["Mobile app", "Game"] },
  { label: "watchOS", types: ["Mobile app"] },
  { label: "tvOS", types: ["Mobile app", "Game"] },
  { label: "macOS", types: ["Desktop app", "Game", "AI tool"] },
  { label: "Windows", types: ["Desktop app", "Game", "AI tool"] },
  { label: "Linux", types: ["Desktop app", "Game", "API / backend", "AI tool"] },
  { label: "Game consoles", types: ["Game"] },
  { label: "VR / AR", types: ["Game", "Mobile app"] },
  { label: "Chrome", types: ["Browser extension"] },
  { label: "Firefox", types: ["Browser extension"] },
  { label: "Safari", types: ["Browser extension"] },
  { label: "Edge", types: ["Browser extension"] },
  { label: "Cloud / managed hosting", types: ["API / backend", "SaaS", "AI tool", "Web app"] },
  { label: "Self-hosted / Docker", types: ["API / backend", "SaaS", "AI tool"] },
  { label: "Edge runtime", types: ["API / backend", "Web app", "AI tool"] },
  { label: "CLI / terminal", types: ["API / backend", "AI tool"] },
] as const satisfies readonly PlatformOption[];

export const QUALITY_PRIORITIES = [
  "Speed to first release",
  "Visual polish",
  "Accessibility",
  "Performance",
  "Privacy",
  "Offline support",
  "Scalability",
  "Test coverage",
] as const;

type StackPreset = {
  id: string;
  label: string;
  detail: string;
  ecosystems: readonly Ecosystem[];
  types: readonly ProjectType[];
  platforms: readonly string[];
  technologies: readonly string[];
};

export const STACK_PRESETS = [
  {
    id: "next-fullstack",
    label: "Next.js full-stack",
    detail: "Web product with an integrated backend",
    ecosystems: ["js"],
    types: ["Web app", "Website", "SaaS", "AI tool"],
    platforms: ["Web", "Cloud / managed hosting", "Edge runtime"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
  },
  {
    id: "supabase-saas",
    label: "Next.js + Supabase",
    detail: "Managed auth, database, and storage from day one",
    ecosystems: ["js"],
    types: ["Web app", "SaaS", "AI tool"],
    platforms: ["Web", "Cloud / managed hosting", "Edge runtime"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
  },
  {
    id: "react-web",
    label: "React frontend",
    detail: "Client-side product with a separate API",
    ecosystems: ["js"],
    types: ["Web app", "Website"],
    platforms: ["Web"],
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  },
  {
    id: "astro-content",
    label: "Astro content site",
    detail: "Fast marketing, docs, or editorial site",
    ecosystems: ["js"],
    types: ["Website"],
    platforms: ["Web", "Edge runtime", "Cloud / managed hosting"],
    technologies: ["Astro", "TypeScript", "Tailwind CSS", "MDX"],
  },
  {
    id: "sveltekit",
    label: "SvelteKit",
    detail: "Lean full-stack alternative to React",
    ecosystems: ["js"],
    types: ["Web app", "Website", "SaaS"],
    platforms: ["Web", "Edge runtime", "Cloud / managed hosting"],
    technologies: ["SvelteKit", "Svelte", "TypeScript", "Tailwind CSS", "PostgreSQL", "Drizzle"],
  },
  {
    id: "rails-saas",
    label: "Ruby on Rails",
    detail: "Batteries-included server-rendered SaaS",
    ecosystems: ["ruby"],
    types: ["SaaS", "Web app", "Website"],
    platforms: ["Web", "Cloud / managed hosting", "Self-hosted / Docker"],
    technologies: ["Ruby", "Ruby on Rails", "Hotwire", "PostgreSQL", "Redis"],
  },
  {
    id: "expo-mobile",
    label: "Expo mobile",
    detail: "One React Native codebase for iOS and Android",
    ecosystems: ["js"],
    types: ["Mobile app", "AI tool"],
    platforms: ["iOS", "Android", "iPadOS", "Web"],
    technologies: ["Expo", "React Native", "TypeScript", "NativeWind", "Expo Router"],
  },
  {
    id: "ios-native",
    label: "Native iOS",
    detail: "Apple-first product with native UI",
    ecosystems: ["swift"],
    types: ["Mobile app", "AI tool"],
    platforms: ["iOS", "iPadOS", "watchOS", "tvOS", "macOS", "VR / AR"],
    technologies: ["Swift", "SwiftUI", "SwiftData"],
  },
  {
    id: "android-native",
    label: "Native Android",
    detail: "Kotlin and Compose on Google's stack",
    ecosystems: ["kotlin"],
    types: ["Mobile app", "AI tool"],
    platforms: ["Android", "tvOS"],
    technologies: ["Kotlin", "Jetpack Compose", "Room"],
  },
  {
    id: "flutter-mobile",
    label: "Flutter",
    detail: "Cross-platform mobile and desktop",
    ecosystems: ["dart"],
    types: ["Mobile app", "Desktop app"],
    platforms: ["iOS", "Android", "iPadOS", "macOS", "Windows", "Linux", "Web"],
    technologies: ["Flutter", "Dart", "Firebase", "Material 3"],
  },
  {
    id: "kotlin-multiplatform",
    label: "Kotlin Multiplatform",
    detail: "Shared logic across mobile and desktop",
    ecosystems: ["kotlin"],
    types: ["Mobile app", "Desktop app"],
    platforms: ["iOS", "Android", "macOS", "Windows", "Linux"],
    technologies: ["Kotlin", "Compose Multiplatform", "SQLDelight"],
  },
  {
    id: "tauri-desktop",
    label: "Tauri desktop",
    detail: "Small native binaries with a web UI",
    ecosystems: ["rust", "js"],
    types: ["Desktop app"],
    platforms: ["macOS", "Windows", "Linux"],
    technologies: ["Tauri", "Rust", "TypeScript", "React", "SQLite"],
  },
  {
    id: "electron-desktop",
    label: "Electron desktop",
    detail: "Web stack with deep desktop integration",
    ecosystems: ["js"],
    types: ["Desktop app"],
    platforms: ["macOS", "Windows", "Linux"],
    technologies: ["Electron", "TypeScript", "React", "SQLite"],
  },
  {
    id: "macos-native",
    label: "Native macOS",
    detail: "AppKit-quality Mac application",
    ecosystems: ["swift"],
    types: ["Desktop app"],
    platforms: ["macOS"],
    technologies: ["Swift", "SwiftUI", "SwiftData"],
  },
  {
    id: "browser-extension",
    label: "Browser extension",
    detail: "Manifest V3 across Chromium and Firefox",
    ecosystems: ["js"],
    types: ["Browser extension"],
    platforms: ["Chrome", "Firefox", "Edge", "Safari"],
    technologies: ["WXT", "TypeScript", "React", "Vite", "Tailwind CSS"],
  },
  {
    id: "node-api",
    label: "TypeScript API",
    detail: "Typed Node service with a relational database",
    ecosystems: ["js"],
    types: ["API / backend", "SaaS", "AI tool"],
    platforms: ["Cloud / managed hosting", "Self-hosted / Docker", "Edge runtime", "Linux", "CLI / terminal"],
    technologies: ["TypeScript", "Node.js", "Hono", "Prisma", "PostgreSQL", "Docker"],
  },
  {
    id: "fastapi",
    label: "Python API",
    detail: "Typed service or data-heavy backend",
    ecosystems: ["python"],
    types: ["API / backend", "AI tool"],
    platforms: ["Cloud / managed hosting", "Self-hosted / Docker", "Linux", "CLI / terminal"],
    technologies: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "go-api",
    label: "Go service",
    detail: "Small, fast, dependency-light backend",
    ecosystems: ["go"],
    types: ["API / backend"],
    platforms: ["Cloud / managed hosting", "Self-hosted / Docker", "Linux", "CLI / terminal"],
    technologies: ["Go", "PostgreSQL", "Docker"],
  },
  {
    id: "ai-python",
    label: "Python AI service",
    detail: "Model calls, retrieval, and evaluation loops",
    ecosystems: ["python"],
    types: ["AI tool", "API / backend"],
    platforms: ["Cloud / managed hosting", "Self-hosted / Docker", "Linux", "CLI / terminal"],
    technologies: ["Python", "FastAPI", "Claude API", "pgvector", "PostgreSQL"],
  },
  {
    id: "ai-typescript",
    label: "TypeScript AI app",
    detail: "Streaming AI product on a web stack",
    ecosystems: ["js"],
    types: ["AI tool", "Web app", "SaaS"],
    platforms: ["Web", "Cloud / managed hosting", "Edge runtime"],
    technologies: ["Next.js", "TypeScript", "Claude API", "Vercel AI SDK", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "godot-game",
    label: "Godot game",
    detail: "Lightweight 2D or 3D game production",
    ecosystems: ["gdscript"],
    types: ["Game"],
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web", "Game consoles"],
    technologies: ["Godot", "GDScript"],
  },
  {
    id: "unity-game",
    label: "Unity game",
    detail: "Cross-platform 2D, 3D, and XR production",
    ecosystems: ["csharp"],
    types: ["Game"],
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android", "Web", "Game consoles", "VR / AR"],
    technologies: ["Unity", "C#"],
  },
  {
    id: "unreal-game",
    label: "Unreal Engine",
    detail: "High-fidelity 3D and console production",
    ecosystems: ["cpp"],
    types: ["Game"],
    platforms: ["Windows", "macOS", "Game consoles", "VR / AR"],
    technologies: ["Unreal Engine", "C++"],
  },
  {
    id: "phaser-web",
    label: "Phaser web game",
    detail: "2D game that runs in the browser",
    ecosystems: ["js"],
    types: ["Game"],
    platforms: ["Web"],
    technologies: ["Phaser", "TypeScript", "Vite"],
  },
] as const satisfies readonly StackPreset[];

type TechnologyOption = {
  label: string;
  /** Undefined means the choice fits any ecosystem. */
  ecosystems?: readonly Ecosystem[];
  types?: readonly ProjectType[];
  platforms?: readonly string[];
};

type TechnologyGroup = {
  label: string;
  items: readonly TechnologyOption[];
};

export const TECHNOLOGY_CATALOG = [
  {
    label: "Languages",
    items: [
      { label: "TypeScript", ecosystems: ["js", "rust"] },
      { label: "JavaScript", ecosystems: ["js"] },
      { label: "Python", ecosystems: ["python"] },
      { label: "Swift", ecosystems: ["swift"] },
      { label: "Kotlin", ecosystems: ["kotlin"] },
      { label: "Dart", ecosystems: ["dart"] },
      { label: "Go", ecosystems: ["go"] },
      { label: "Rust", ecosystems: ["rust"] },
      { label: "Ruby", ecosystems: ["ruby"] },
      { label: "C#", ecosystems: ["csharp"] },
      { label: "C++", ecosystems: ["cpp"] },
      { label: "GDScript", ecosystems: ["gdscript"] },
      { label: "SQL" },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { label: "Next.js", ecosystems: ["js"], platforms: ["Web", "Cloud / managed hosting", "Edge runtime"] },
      { label: "React", ecosystems: ["js", "rust"] },
      { label: "Vite", ecosystems: ["js", "rust"] },
      { label: "Astro", ecosystems: ["js"], types: ["Website", "Web app"] },
      { label: "SvelteKit", ecosystems: ["js"], platforms: ["Web", "Cloud / managed hosting", "Edge runtime"] },
      { label: "Svelte", ecosystems: ["js"], platforms: ["Web", "Cloud / managed hosting", "Edge runtime"] },
      { label: "React Native", ecosystems: ["js"], platforms: ["iOS", "Android", "iPadOS", "tvOS"] },
      { label: "Expo", ecosystems: ["js"], platforms: ["iOS", "Android", "iPadOS", "Web"] },
      { label: "Expo Router", ecosystems: ["js"], platforms: ["iOS", "Android", "iPadOS", "Web"] },
      { label: "Flutter", ecosystems: ["dart"] },
      { label: "SwiftUI", ecosystems: ["swift"] },
      { label: "Jetpack Compose", ecosystems: ["kotlin"], platforms: ["Android", "tvOS"] },
      { label: "Compose Multiplatform", ecosystems: ["kotlin"] },
      { label: "Node.js", ecosystems: ["js"] },
      { label: "Hono", ecosystems: ["js"], types: ["API / backend", "SaaS", "AI tool", "Web app"] },
      { label: "Express", ecosystems: ["js"], types: ["API / backend", "SaaS", "AI tool", "Web app"] },
      { label: "FastAPI", ecosystems: ["python"], types: ["API / backend", "AI tool", "SaaS"] },
      { label: "Django", ecosystems: ["python"], types: ["API / backend", "SaaS", "Web app", "Website"] },
      { label: "Ruby on Rails", ecosystems: ["ruby"] },
      { label: "Hotwire", ecosystems: ["ruby"] },
      { label: "Tauri", ecosystems: ["rust", "js"], types: ["Desktop app"] },
      { label: "Electron", ecosystems: ["js"], types: ["Desktop app"] },
      { label: "WXT", ecosystems: ["js"], types: ["Browser extension"] },
      { label: "Unity", ecosystems: ["csharp"], types: ["Game"] },
      { label: "Unreal Engine", ecosystems: ["cpp"], types: ["Game"] },
      { label: "Godot", ecosystems: ["gdscript"], types: ["Game"] },
      { label: "Phaser", ecosystems: ["js"], types: ["Game"], platforms: ["Web"] },
    ],
  },
  {
    label: "Data",
    items: [
      { label: "PostgreSQL" },
      { label: "MySQL" },
      { label: "SQLite" },
      { label: "MongoDB" },
      { label: "Redis" },
      { label: "Prisma", ecosystems: ["js"] },
      { label: "Drizzle", ecosystems: ["js"] },
      { label: "SQLAlchemy", ecosystems: ["python"] },
      { label: "Supabase", ecosystems: ["js", "dart", "swift", "kotlin"] },
      { label: "Firebase", ecosystems: ["js", "dart", "swift", "kotlin"] },
      { label: "SwiftData", ecosystems: ["swift"] },
      { label: "Room", ecosystems: ["kotlin"], platforms: ["Android", "tvOS"] },
      { label: "SQLDelight", ecosystems: ["kotlin"] },
      { label: "pgvector", types: ["AI tool", "API / backend", "SaaS", "Web app"] },
      { label: "S3-compatible storage" },
    ],
  },
  {
    label: "Interface",
    items: [
      { label: "Tailwind CSS", ecosystems: ["js", "rust"], platforms: ["Web", "Chrome", "Firefox", "Edge", "Safari", "macOS", "Windows", "Linux", "Cloud / managed hosting", "Edge runtime"] },
      { label: "shadcn/ui", ecosystems: ["js", "rust"], platforms: ["Web", "Chrome", "Firefox", "Edge", "Safari", "macOS", "Windows", "Linux", "Cloud / managed hosting", "Edge runtime"] },
      { label: "NativeWind", ecosystems: ["js"], platforms: ["iOS", "Android", "iPadOS"] },
      { label: "Material UI", ecosystems: ["js"], platforms: ["Web", "Cloud / managed hosting", "Edge runtime"] },
      { label: "Material 3", ecosystems: ["dart", "kotlin"] },
      { label: "MDX", ecosystems: ["js"], types: ["Website", "Web app"] },
      { label: "Framer Motion", ecosystems: ["js", "rust"], platforms: ["Web", "Chrome", "Firefox", "Edge", "Safari", "macOS", "Windows", "Linux", "Cloud / managed hosting", "Edge runtime"] },
      { label: "Reanimated", ecosystems: ["js"], platforms: ["iOS", "Android", "iPadOS"] },
    ],
  },
  {
    label: "AI",
    items: [
      { label: "Claude API", types: ["AI tool", "API / backend", "SaaS", "Web app", "Mobile app", "Desktop app"] },
      { label: "Vercel AI SDK", ecosystems: ["js"], types: ["AI tool", "Web app", "SaaS"] },
      { label: "Embeddings + RAG", types: ["AI tool", "API / backend", "SaaS", "Web app"] },
      { label: "Background jobs / queue", types: ["AI tool", "API / backend", "SaaS", "Web app"] },
      { label: "Evals harness", types: ["AI tool", "API / backend", "SaaS"] },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Docker" },
      { label: "Vercel", ecosystems: ["js"], platforms: ["Web", "Cloud / managed hosting", "Edge runtime"] },
      { label: "Cloudflare", platforms: ["Web", "Cloud / managed hosting", "Edge runtime"] },
      { label: "AWS" },
      { label: "Fly.io", types: ["API / backend", "SaaS", "AI tool", "Web app"] },
      { label: "GitHub Actions" },
      { label: "Expo EAS", ecosystems: ["js"], platforms: ["iOS", "Android", "iPadOS"] },
      { label: "Fastlane", platforms: ["iOS", "Android", "iPadOS", "macOS"] },
      { label: "Sentry" },
      { label: "PostHog" },
      { label: "Stripe", types: ["SaaS", "Web app", "Website", "Mobile app", "Desktop app", "AI tool"] },
    ],
  },
] as const satisfies readonly TechnologyGroup[];

/** Flat option list kept for the exported questionnaire and the project brain. */
export const TECHNOLOGY_GROUPS = TECHNOLOGY_CATALOG.map((group) => ({
  label: group.label,
  items: group.items.map((item) => item.label),
}));

const intersects = (a: readonly string[], b: readonly string[]) => a.some((value) => b.includes(value));

/** Platforms a given project type can actually ship on. */
export function platformsForType(projectType: string): string[] {
  const labels = PROJECT_PLATFORMS.filter(
    (platform) => !projectType || (platform.types as readonly string[]).includes(projectType),
  ).map((platform) => platform.label);
  return labels.length > 0 ? labels : PROJECT_PLATFORMS.map((platform) => platform.label);
}

/** Drops platform selections that stop making sense after the project type changes. */
export function prunePlatforms(projectType: string, platforms: readonly string[]) {
  const allowed = platformsForType(projectType);
  return platforms.filter((platform) => allowed.includes(platform));
}

/** Stack presets that fit the chosen project type and platforms. */
export function presetsForShape(projectType: string, platforms: readonly string[]) {
  return STACK_PRESETS.filter((preset) => {
    if (projectType && !(preset.types as readonly string[]).includes(projectType)) return false;
    if (platforms.length > 0 && !intersects(platforms, preset.platforms)) return false;
    return true;
  });
}

export function findPreset(id: string) {
  return STACK_PRESETS.find((preset) => preset.id === id);
}

function technologyFits(
  item: TechnologyOption,
  projectType: string,
  platforms: readonly string[],
  preset: StackPreset | undefined,
) {
  if (preset) {
    if (preset.technologies.includes(item.label)) return true;
    if (item.ecosystems && !intersects(item.ecosystems, preset.ecosystems)) return false;
  }
  if (item.types && projectType && !(item.types as readonly string[]).includes(projectType)) return false;
  if (item.platforms && platforms.length > 0 && !intersects(platforms, item.platforms)) return false;
  return true;
}

/**
 * Technology groups narrowed to the current project type, platforms, and stack preset.
 * Selected values always survive so an earlier answer is never silently hidden.
 */
export function technologyGroupsForShape({
  projectType,
  platforms,
  stackPreset,
  selected = [],
  showAll = false,
}: {
  projectType: string;
  platforms: readonly string[];
  stackPreset: string;
  selected?: readonly string[];
  showAll?: boolean;
}) {
  const preset = findPreset(stackPreset);
  return TECHNOLOGY_CATALOG.map((group) => ({
    label: group.label,
    items: group.items
      .filter(
        (item) =>
          showAll ||
          selected.includes(item.label) ||
          technologyFits(item, projectType, platforms, preset),
      )
      .map((item) => item.label),
  })).filter((group) => group.items.length > 0);
}

/** Technologies that no longer fit the shape, so the wizard can clear them. */
export function pruneTechnologies({
  projectType,
  platforms,
  stackPreset,
  technologies,
}: {
  projectType: string;
  platforms: readonly string[];
  stackPreset: string;
  technologies: readonly string[];
}) {
  const preset = findPreset(stackPreset);
  const allowed = new Set<string>(
    TECHNOLOGY_CATALOG.flatMap((group) =>
      group.items
        .filter((item) => technologyFits(item, projectType, platforms, preset))
        .map((item) => item.label),
    ),
  );
  return technologies.filter((technology) => allowed.has(technology));
}

const unanswered = (value: string) => value.trim() || "_Not answered yet._";
const selectedAnswers = (values: string[]) =>
  values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "_None selected yet._";
const optionLine = (values: readonly string[]) => `Options: ${values.join(" · ")}`;

/** A portable copy of the complete onboarding questionnaire and its current answers. */
export function buildQuestionnaireMarkdown(brief: ProjectBrief) {
  return [
    `# ${brief.name.trim() || "New project"} questionnaire`,
    "",
    "> Fill this in anywhere, then use the answers to brief a project in Cadabry.",
    "",
    "## 1. The idea",
    "",
    "### Project name",
    unanswered(brief.name),
    "",
    "### One-line description",
    unanswered(brief.oneLineDescription),
    "",
    "### What are you building?",
    unanswered(brief.productStatement),
    "",
    "### What problem does it solve?",
    unanswered(brief.problem),
    "",
    "### Who is it for?",
    unanswered(brief.targetUser),
    "",
    "### What should change for them?",
    unanswered(brief.desiredOutcome),
    "",
    "## 2. Project shape",
    "",
    "### Project type",
    optionLine(PROJECT_TYPES.map(([label]) => label)),
    "",
    unanswered(brief.projectType),
    "",
    "### Where are you starting?",
    optionLine(PROJECT_STAGES),
    "",
    unanswered(brief.stage),
    "",
    "### Target platforms",
    optionLine(platformsForType(brief.projectType)),
    "",
    selectedAnswers(brief.platforms),
    "",
    "## 3. Technical direction",
    "",
    "### Stack preset",
    optionLine(presetsForShape(brief.projectType, brief.platforms).map((preset) => preset.label)),
    "",
    unanswered(findPreset(brief.stackPreset)?.label ?? ""),
    "",
    "### Technologies",
    selectedAnswers(brief.technologies),
    "",
    "### Integrations",
    unanswered(brief.integrations),
    "",
    "### Stack notes",
    unanswered(brief.stackNotes),
    "",
    "## 4. First release",
    "",
    "### Core capabilities",
    "List one capability per line.",
    "",
    unanswered(brief.features),
    "",
    "### What must the first release prove?",
    unanswered(brief.firstRelease),
    "",
    "### What is explicitly not in the first release?",
    unanswered(brief.nonGoals),
    "",
    "## 5. Product experience",
    "",
    "### Design and interaction direction",
    unanswered(brief.designDirection),
    "",
    "### References or inspiration",
    unanswered(brief.references),
    "",
    "## 6. Delivery",
    "",
    "### Authentication and permissions",
    unanswered(brief.authNeeds),
    "",
    "### Business model",
    unanswered(brief.monetization),
    "",
    "### Data and content",
    unanswered(brief.dataNeeds),
    "",
    "### Deployment target",
    unanswered(brief.deployment),
    "",
    "### Quality priorities",
    optionLine(QUALITY_PRIORITIES),
    "",
    selectedAnswers(brief.qualityPriorities),
    "",
    "### Hard constraints",
    unanswered(brief.constraints),
    "",
    "## 7. Launch brief",
    "",
    "Cadabry turns the completed answers into the starting prompt for your configured coding agent.",
  ].join("\n");
}

export function questionnaireFilename(projectName: string) {
  const slug = projectName
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return `${slug || "new-project"}-questions.md`;
}

const splitLines = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const bulletLines = (value: string) => splitLines(value).map((item) => `- ${item}`);

const labeled = (label: string, value: string) => (value ? `- ${label}: ${value}` : null);

export function buildStartingPrompt(
  brief: ProjectBrief,
  agentName: string,
  builderRules: string[] = [],
) {
  const product = brief.productStatement || brief.oneLineDescription || "A new software product.";
  const features = bulletLines(brief.features);
  const nonGoals = bulletLines(brief.nonGoals);
  const quality = brief.qualityPriorities.length > 0
    ? brief.qualityPriorities.map((item) => `- Prioritize ${item.toLowerCase()}.`)
    : ["- Favor a small, reliable first release over broad unfinished scope."];

  const lines = [
    `# Start ${brief.name || "this project"}`,
    "",
    `You are the lead product engineer for ${brief.name || "this project"}, working through ${agentName || "the configured coding agent"}. Turn this brief into a strong, working starting point. Make reasonable, reversible decisions when details are missing and state important assumptions before implementing.`,
    "",
    "## Product intent",
    product,
    "",
    ...[
      labeled("Problem", brief.problem),
      labeled("Primary user", brief.targetUser),
      labeled("Desired outcome", brief.desiredOutcome),
      labeled("Product type", brief.projectType),
      labeled("Starting state", brief.stage),
      labeled("Platforms", brief.platforms.join(", ")),
    ].filter((line): line is string => Boolean(line)),
    "",
    ...(features.length > 0 ? ["## Core capabilities", ...features, ""] : []),
    ...(brief.firstRelease ? ["## First-release target", brief.firstRelease, ""] : []),
    ...(nonGoals.length > 0 ? ["## Explicitly out of scope", ...nonGoals, ""] : []),
    "## Technical direction",
    brief.technologies.length > 0
      ? `Use this stack unless the existing repository proves otherwise: ${brief.technologies.join(", ")}.`
      : "Inspect the repository and propose the smallest suitable stack before scaffolding.",
    ...(brief.stackNotes ? [brief.stackNotes] : []),
    "",
    ...[
      labeled("Authentication and permissions", brief.authNeeds),
      labeled("Data and content", brief.dataNeeds),
      labeled("Integrations", brief.integrations),
      labeled("Business model", brief.monetization),
      labeled("Deployment target", brief.deployment),
    ].filter((line): line is string => Boolean(line)),
    "",
    ...(brief.designDirection || brief.references
      ? [
          "## Product experience",
          ...(brief.designDirection ? [brief.designDirection] : []),
          ...(brief.references ? [`References or inspiration: ${brief.references}`] : []),
          "Build responsive layouts, clear loading/empty/error states, visible focus, and keyboard-accessible interactions.",
          "",
        ]
      : []),
    ...(brief.constraints ? ["## Constraints", brief.constraints, ""] : []),
    ...(builderRules.length > 0
      ? ["## Builder rules", ...builderRules.map((rule) => `- ${rule}`), ""]
      : []),
    "## How to begin",
    "1. Inspect the existing workspace, its instructions, dependencies, and established patterns before changing code.",
    "2. Translate this brief into a concise implementation plan. Identify assumptions, the minimum coherent architecture, and the first vertical slice.",
    "3. Implement that vertical slice end to end with real behavior and data flow; do not leave dead controls or placeholder functionality.",
    "4. Keep scope aligned to the first-release target and record any deliberate tradeoffs.",
    "5. Run the relevant lint, typecheck, tests, and a focused interaction check before reporting completion.",
    "",
    "## Definition of done",
    ...quality,
    "- The primary user can complete the core journey without manual workarounds.",
    "- Inputs and mutations are validated at the correct trust boundary.",
    "- The experience works on the selected platforms and handles failure states.",
    "- No unrelated systems are rewritten and no secrets are exposed.",
    "- Report what changed, what was verified, and the most valuable next step.",
  ];

  return lines.filter((line, index) => line !== "" || lines[index - 1] !== "").join("\n").trim();
}

export function listBriefItems(value: string) {
  return splitLines(value);
}

export function technologyCategory(name: string) {
  for (const group of TECHNOLOGY_GROUPS) {
    if ((group.items as readonly string[]).includes(name)) return group.label;
  }
  return "Other";
}
