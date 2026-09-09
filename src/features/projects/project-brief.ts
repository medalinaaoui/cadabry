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

export const PROJECT_PLATFORMS = [
  "Web",
  "iOS",
  "Android",
  "macOS",
  "Windows",
  "Linux",
  "Game consoles",
  "VR / AR",
] as const;

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

export const STACK_PRESETS = [
  {
    id: "next-fullstack",
    label: "Next.js full-stack",
    detail: "Web product with an integrated backend",
    types: ["Web app", "Website", "SaaS"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
  },
  {
    id: "expo-mobile",
    label: "Expo mobile",
    detail: "One React Native codebase for iOS and Android",
    types: ["Mobile app"],
    technologies: ["Expo", "React Native", "TypeScript", "NativeWind"],
  },
  {
    id: "flutter-mobile",
    label: "Flutter",
    detail: "Cross-platform mobile and desktop",
    types: ["Mobile app", "Desktop app"],
    technologies: ["Flutter", "Dart", "Firebase"],
  },
  {
    id: "ios-native",
    label: "Native iOS",
    detail: "Apple-first product with native UI",
    types: ["Mobile app"],
    technologies: ["Swift", "SwiftUI", "SwiftData"],
  },
  {
    id: "react-web",
    label: "React frontend",
    detail: "Client-side product with a separate API",
    types: ["Web app", "Website", "Browser extension"],
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  },
  {
    id: "fastapi",
    label: "Python API",
    detail: "Typed service or AI-heavy backend",
    types: ["API / backend", "AI tool"],
    technologies: ["Python", "FastAPI", "PostgreSQL", "Redis"],
  },
  {
    id: "godot-game",
    label: "Godot game",
    detail: "Lightweight 2D or 3D game production",
    types: ["Game"],
    technologies: ["Godot", "GDScript"],
  },
  {
    id: "unity-game",
    label: "Unity game",
    detail: "Cross-platform 2D or 3D game production",
    types: ["Game"],
    technologies: ["Unity", "C#"],
  },
] as const;

export const TECHNOLOGY_GROUPS = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "Swift", "Kotlin", "Dart", "C#", "GDScript"] },
  { label: "Frameworks", items: ["Next.js", "React", "React Native", "Expo", "Flutter", "SwiftUI", "Jetpack Compose", "FastAPI", "Unity", "Godot"] },
  { label: "Data", items: ["PostgreSQL", "Prisma", "Supabase", "Firebase", "SQLite", "Redis", "SwiftData"] },
  { label: "Interface", items: ["Tailwind CSS", "NativeWind", "shadcn/ui", "Material UI"] },
] as const;

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
    optionLine(PROJECT_PLATFORMS),
    "",
    selectedAnswers(brief.platforms),
    "",
    "## 3. First release",
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
    "## 4. Technical direction",
    "",
    "### Stack preset",
    optionLine(STACK_PRESETS.map((preset) => preset.label)),
    "",
    unanswered(STACK_PRESETS.find((preset) => preset.id === brief.stackPreset)?.label ?? ""),
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
