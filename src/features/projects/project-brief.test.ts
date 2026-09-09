import { describe, expect, it } from "vitest";
import {
  buildQuestionnaireMarkdown,
  buildStartingPrompt,
  EMPTY_PROJECT_BRIEF,
  listBriefItems,
  platformsForType,
  presetsForShape,
  prunePlatforms,
  pruneTechnologies,
  questionnaireFilename,
  STACK_PRESETS,
  technologyCategory,
  TECHNOLOGY_CATALOG,
  technologyGroupsForShape,
} from "./project-brief";

describe("project launch brief", () => {
  it("turns detailed answers into an actionable starting prompt", () => {
    const prompt = buildStartingPrompt(
      {
        ...EMPTY_PROJECT_BRIEF,
        name: "Hook Finder",
        productStatement: "A workspace that identifies strong advertising hooks.",
        problem: "Creative review is slow.",
        targetUser: "Agency owners",
        desiredOutcome: "Choose a hook in minutes.",
        projectType: "SaaS",
        stage: "New idea",
        platforms: ["Web"],
        features: "Upload creatives\nCompare hooks\nExport a brief",
        firstRelease: "One owner completes the core review journey.",
        nonGoals: "No automatic ad publishing",
        technologies: ["Next.js", "TypeScript", "PostgreSQL"],
        designDirection: "Editorial and fast, with dense desktop comparisons.",
        qualityPriorities: ["Accessibility", "Performance"],
        constraints: "Do not send customer content to third parties.",
      },
      "Codex",
      ["QUALITY: No placeholder functionality"],
    );

    expect(prompt).toContain("# Start Hook Finder");
    expect(prompt).toContain("- Upload creatives");
    expect(prompt).toContain("Use this stack unless the existing repository proves otherwise: Next.js, TypeScript, PostgreSQL.");
    expect(prompt).toContain("## Explicitly out of scope");
    expect(prompt).toContain("- QUALITY: No placeholder functionality");
    expect(prompt).toContain("## Definition of done");
  });

  it("accepts comma or line separated brief items", () => {
    expect(listBriefItems("Upload, compare\nExport")).toEqual(["Upload", "compare", "Export"]);
  });

  it("categorizes known stack choices for the project brain", () => {
    expect(technologyCategory("TypeScript")).toBe("Languages");
    expect(technologyCategory("PostgreSQL")).toBe("Data");
    expect(technologyCategory("Unlisted tool")).toBe("Other");
  });

  it("exports every onboarding section with current answers and choice guidance", () => {
    const markdown = buildQuestionnaireMarkdown({
      ...EMPTY_PROJECT_BRIEF,
      name: "Hook Finder",
      projectType: "SaaS",
      platforms: ["Web"],
      features: "Compare hooks",
      qualityPriorities: ["Accessibility"],
    });

    expect(markdown).toContain("# Hook Finder questionnaire");
    expect(markdown).toContain("## 1. The idea");
    expect(markdown).toContain("## 7. Launch brief");
    expect(markdown).toContain("### Project type\nOptions: Mobile app");
    expect(markdown).toContain("Compare hooks");
    expect(markdown).toContain("- Accessibility");
    expect(markdown).toContain("_Not answered yet._");
    expect(questionnaireFilename("Hook Finder ✓")).toBe("hook-finder-questions.md");
  });
});

describe("shape-aware options", () => {
  const groupItems = (
    groups: ReturnType<typeof technologyGroupsForShape>,
    label: string,
  ) => groups.find((group) => group.label === label)?.items ?? [];

  it("offers only the platforms a project type can ship on", () => {
    expect(platformsForType("Mobile app")).toEqual([
      "iOS",
      "Android",
      "iPadOS",
      "watchOS",
      "tvOS",
      "VR / AR",
    ]);
    expect(platformsForType("Browser extension")).toEqual(["Chrome", "Firefox", "Safari", "Edge"]);
    expect(platformsForType("")).toContain("Game consoles");
  });

  it("drops platforms that stop fitting after the type changes", () => {
    expect(prunePlatforms("Web app", ["iOS", "Web", "Game consoles"])).toEqual(["Web"]);
  });

  it("narrows stack presets to the chosen type and platforms", () => {
    const ids = presetsForShape("Mobile app", ["iOS"]).map((preset) => preset.id);
    expect(ids).toContain("expo-mobile");
    expect(ids).toContain("ios-native");
    expect(ids).not.toContain("android-native");
    expect(ids).not.toContain("next-fullstack");
  });

  it("keeps languages, data, and interface options inside the chosen stack", () => {
    const native = technologyGroupsForShape({
      projectType: "Mobile app",
      platforms: ["iOS"],
      stackPreset: "ios-native",
    });
    expect(groupItems(native, "Languages")).toEqual(["Swift", "SQL"]);
    expect(groupItems(native, "Data")).toContain("SwiftData");
    expect(groupItems(native, "Data")).not.toContain("Prisma");
    expect(groupItems(native, "Interface")).not.toContain("Tailwind CSS");

    const expo = technologyGroupsForShape({
      projectType: "Mobile app",
      platforms: ["iOS", "Android"],
      stackPreset: "expo-mobile",
    });
    expect(groupItems(expo, "Interface")).toContain("NativeWind");
    expect(groupItems(expo, "Frameworks")).toContain("Expo Router");
    expect(groupItems(expo, "Frameworks")).not.toContain("Next.js");
  });

  it("keeps already selected technologies visible and can show the full catalog", () => {
    const filtered = technologyGroupsForShape({
      projectType: "Mobile app",
      platforms: ["iOS"],
      stackPreset: "ios-native",
      selected: ["Docker"],
    });
    expect(groupItems(filtered, "Infrastructure")).toContain("Docker");

    const everything = technologyGroupsForShape({
      projectType: "Mobile app",
      platforms: ["iOS"],
      stackPreset: "ios-native",
      showAll: true,
    });
    expect(groupItems(everything, "Languages")).toContain("Python");
  });

  it("clears technologies that no longer fit the stack", () => {
    expect(
      pruneTechnologies({
        projectType: "Mobile app",
        platforms: ["iOS"],
        stackPreset: "ios-native",
        technologies: ["Swift", "SwiftData", "Next.js", "Prisma"],
      }),
    ).toEqual(["Swift", "SwiftData"]);
  });

  it("only names technologies that exist in the catalog", () => {
    const known = new Set(
      TECHNOLOGY_CATALOG.flatMap((group) => group.items.map((item) => item.label as string)),
    );
    for (const preset of STACK_PRESETS) {
      for (const technology of preset.technologies) {
        expect({ preset: preset.id, technology, known: known.has(technology) }).toEqual({
          preset: preset.id,
          technology,
          known: true,
        });
      }
    }
  });
});
