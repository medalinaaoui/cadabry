type FeatureLike = {
  title: string;
  body: string | null;
  reason: string | null;
  acceptanceCriteria: string | null;
  priority: number;
};

const labeled = (label: string, value: string | null) =>
  value ? `## ${label}\n${value}` : null;

/** Turns a feature record into a ready-to-paste prompt for a coding agent. */
export function featureToPrompt(feature: FeatureLike) {
  const lines = [
    `# Build: ${feature.title}`,
    "",

    ...[
      labeled("Description", feature.body),
      labeled("Why this matters", feature.reason),
      labeled("Acceptance criteria", feature.acceptanceCriteria),
    ].filter((line): line is string => Boolean(line)),
    feature.priority >= 4
      ? "This is high priority — treat it as urgent."
      : null,
    "",
    "Implement this feature end to end: real data flow, no placeholders, and cover the",
    "failure and empty states. Run lint, typecheck, and relevant tests before reporting done.",
  ].filter((line): line is string => line !== null);

  return lines
    .filter((line, index) => line !== "" || lines[index - 1] !== "")
    .join("\n")
    .trim();
}
