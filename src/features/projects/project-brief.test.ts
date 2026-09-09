import { describe, expect, it } from "vitest";
import {
  buildQuestionnaireMarkdown,
  buildStartingPrompt,
  EMPTY_PROJECT_BRIEF,
  listBriefItems,
  questionnaireFilename,
  technologyCategory,
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
