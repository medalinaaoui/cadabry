"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Compass,
  Download,
  Flag,
  Layers3,
  Rocket,
  Shapes,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Field, TextField } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import {
  buildQuestionnaireMarkdown,
  buildStartingPrompt,
  EMPTY_PROJECT_BRIEF,
  platformsForType,
  presetsForShape,
  PROJECT_STAGES,
  PROJECT_TYPES,
  prunePlatforms,
  pruneTechnologies,
  QUALITY_PRIORITIES,
  questionnaireFilename,
  technologyGroupsForShape,
  type ProjectBrief,
} from "@/features/projects/project-brief";

const STEPS = [
  { label: "The idea", hint: "Name and purpose", icon: Sparkles },
  { label: "Project shape", hint: "Type and platform", icon: Shapes },
  { label: "Technical direction", hint: "Stack and systems", icon: Code2 },
  { label: "First release", hint: "Scope and boundaries", icon: Flag },
  { label: "Product experience", hint: "Feel and references", icon: Compass },
  { label: "Delivery", hint: "Quality and constraints", icon: Layers3 },
  { label: "Launch brief", hint: "Review and create", icon: Rocket },
] as const;

const SHAPE_KEYS = ["projectType", "platforms", "stackPreset"] as const;
type ShapeKey = (typeof SHAPE_KEYS)[number];

/**
 * Keeps later answers consistent with earlier ones: platforms follow the project type,
 * the stack preset follows the platforms, and technologies follow the preset.
 */
function reconcileShape(brief: ProjectBrief): ProjectBrief {
  const platforms = prunePlatforms(brief.projectType, brief.platforms);
  const stackPreset = presetsForShape(brief.projectType, platforms).some(
    (preset) => preset.id === brief.stackPreset,
  )
    ? brief.stackPreset
    : "";
  const technologies = pruneTechnologies({
    projectType: brief.projectType,
    platforms,
    stackPreset,
    technologies: brief.technologies,
  });
  return { ...brief, platforms, stackPreset, technologies };
}

type StepProps = {
  brief: ProjectBrief;
  update: <K extends keyof ProjectBrief>(key: K, value: ProjectBrief[K]) => void;
};

export function ProjectWizard({
  action,
  defaultAgent,
  builderRules,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultAgent: string;
  builderRules: string[];
  error?: string;
}) {
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [brief, setBrief] = useState<ProjectBrief>(EMPTY_PROJECT_BRIEF);

  const update = <K extends keyof ProjectBrief>(key: K, value: ProjectBrief[K]) => {
    setBrief((current) => {
      const next = { ...current, [key]: value };
      return SHAPE_KEYS.includes(key as ShapeKey) ? reconcileShape(next) : next;
    });
  };

  const prompt = buildStartingPrompt(brief, defaultAgent, builderRules);
  const isFirstStepReady = brief.name.trim().length > 0;
  const isReview = step === STEPS.length - 1;

  function goTo(next: number) {
    const bounded = Math.max(0, Math.min(STEPS.length - 1, next));
    setStep(bounded);
    setFurthestStep((current) => Math.max(current, bounded));
  }

  function toggleList(key: "platforms" | "technologies" | "qualityPriorities", value: string) {
    const values = brief[key];
    update(key, values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function choosePreset(id: string, technologies: readonly string[]) {
    update("stackPreset", id);
    update("technologies", [...technologies]);
  }

  function exportQuestions() {
    const url = URL.createObjectURL(
      new Blob([buildQuestionnaireMarkdown(brief)], { type: "text/markdown;charset=utf-8" }),
    );
    const download = document.createElement("a");
    download.href = url;
    download.download = questionnaireFilename(brief.name);
    download.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={exportQuestions}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export all questions (.md)
        </Button>
      </div>

      <form
        action={action}
        className="grid min-w-0 overflow-hidden rounded-2xl border border-line bg-surface lg:min-h-[42rem]
          lg:grid-cols-[15rem_minmax(0,1fr)]"
      >
        <input type="hidden" name="brief" value={JSON.stringify(brief)} />

        <aside className="min-w-0 overflow-hidden border-b border-line bg-well/55 p-3 lg:border-b-0 lg:border-r lg:p-4">
          <div className="mb-3 flex items-center justify-between gap-3 px-1 lg:mb-5 lg:block">
            <p className="eyebrow">Project briefing</p>
            <p className="text-caption text-subtle lg:mt-1">
              {step + 1} of {STEPS.length}
            </p>
          </div>
          <ol
            className="flex w-full max-w-full gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0"
            aria-label="Project setup steps"
          >
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              const reached = index <= furthestStep;
              const active = index === step;
              const complete = index < step || (index < furthestStep && index !== step);
              return (
                <li key={item.label} className="shrink-0 lg:w-full">
                  <button
                    type="button"
                    disabled={!reached}
                    onClick={() => goTo(index)}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "group flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-left transition-colors lg:w-full",
                      active
                        ? "bg-cobalt-500/16 text-cobalt-300"
                        : "text-subtle hover:bg-surface-raised hover:text-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-micro font-semibold",
                        active
                          ? "border-cobalt-400/40 bg-cobalt-500/12"
                          : "border-line bg-surface",
                      )}
                    >
                      {complete ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <span className="hidden min-w-0 lg:block">
                      <span className="block truncate text-caption font-semibold">
                        {item.label}
                      </span>
                      <span className="block truncate text-micro font-normal text-subtle">
                        {item.hint}
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-caption font-semibold lg:hidden">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex-1 p-5 sm:p-7 lg:p-9">
            {error ? (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-caption text-danger"
              >
                {error}
              </p>
            ) : null}

          {step === 0 ? <IdeaStep brief={brief} update={update} /> : null}
          {step === 1 ? <ShapeStep brief={brief} update={update} toggle={toggleList} /> : null}
          {step === 2 ? (
            <StackStep
              brief={brief}
              update={update}
              toggle={toggleList}
              choosePreset={choosePreset}
            />
          ) : null}
          {step === 3 ? <ScopeStep brief={brief} update={update} /> : null}
          {step === 4 ? <ExperienceStep brief={brief} update={update} /> : null}
          {step === 5 ? <DeliveryStep brief={brief} update={update} toggle={toggleList} /> : null}
          {isReview ? (
            <ReviewStep brief={brief} prompt={prompt} defaultAgent={defaultAgent} />
          ) : null}
          </div>

          <footer className="flex flex-wrap items-center gap-2 border-t border-line bg-well/35 px-5 py-4 sm:px-7 lg:px-9">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <div className="flex-1" />
          {step > 0 && !isReview ? (
            <Button type="button" variant="quiet" onClick={() => goTo(step + 1)}>
              Skip for now
            </Button>
          ) : null}
          {!isReview ? (
            <Button
              type="button"
              variant="primary"
              disabled={step === 0 && !isFirstStepReady}
              onClick={() => goTo(step + 1)}
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <SubmitButton />
          )}
          </footer>
        </div>
      </form>
    </div>
  );
}

function StepIntro({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-7 max-w-2xl">
      <h2 className="text-title-2 text-foreground">{title}</h2>
      <p className="mt-2 text-body text-muted">{description}</p>
    </header>
  );
}

function IdeaStep({ brief, update }: StepProps) {
  return (
    <fieldset>
      <legend className="sr-only">The idea</legend>
      <StepIntro title="Give the agent the reason to care" description="Start with the same facts you would give a strong teammate on their first day." />
      <div className="space-y-5">
        <Field label="Project name" name="visible-name" value={brief.name} onChange={(event) => update("name", event.target.value)} placeholder="Hook Finder" autoFocus autoComplete="off" required />
        <Field label="One-line description" name="visible-description" value={brief.oneLineDescription} onChange={(event) => update("oneLineDescription", event.target.value)} placeholder="Finds the strongest hooks in paid-social creatives" hint="A plain-language summary you could say in one breath." />
        <TextField label="What are you building?" name="visible-statement" value={brief.productStatement} onChange={(event) => update("productStatement", event.target.value)} placeholder="A workspace where agency owners upload ads, compare opening hooks, and turn the best patterns into new creative briefs." rows={3} />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="What problem does it solve?" name="visible-problem" value={brief.problem} onChange={(event) => update("problem", event.target.value)} placeholder="Creative review is slow and based on scattered opinions." rows={3} />
          <TextField label="Who is it for?" name="visible-user" value={brief.targetUser} onChange={(event) => update("targetUser", event.target.value)} placeholder="Agency owners managing five-figure ad budgets." rows={3} />
        </div>
        <TextField label="What should change for them?" name="visible-outcome" value={brief.desiredOutcome} onChange={(event) => update("desiredOutcome", event.target.value)} placeholder="They can identify a promising hook in minutes and explain why it should work." rows={2} />
      </div>
    </fieldset>
  );
}

function ShapeStep({ brief, update, toggle }: StepProps & { toggle: (key: "platforms", value: string) => void }) {
  const platforms = platformsForType(brief.projectType);
  return (
    <fieldset>
      <legend className="sr-only">Project shape</legend>
      <StepIntro title="What shape should this project take?" description="This changes the architecture, interaction patterns, testing strategy, and delivery path." />
      <Question label="Project type">
        <OptionGrid columns="three">
          {PROJECT_TYPES.map(([label, detail]) => <Choice key={label} label={label} detail={detail} selected={brief.projectType === label} onClick={() => update("projectType", label)} />)}
        </OptionGrid>
      </Question>
      <Question label="Where are you starting?">
        <div className="flex flex-wrap gap-2">
          {PROJECT_STAGES.map((stage) => <Pill key={stage} label={stage} selected={brief.stage === stage} onClick={() => update("stage", stage)} />)}
        </div>
      </Question>
      <Question
        label="Target platforms"
        hint={brief.projectType
          ? `Platforms a ${brief.projectType.toLowerCase()} can ship on. Choose every one the first release must support.`
          : "Choose a project type first to narrow this list, or pick the platforms the first release must support."}
      >
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => <Pill key={platform} label={platform} selected={brief.platforms.includes(platform)} onClick={() => toggle("platforms", platform)} />)}
        </div>
      </Question>
    </fieldset>
  );
}

function ScopeStep({ brief, update }: StepProps) {
  return (
    <fieldset>
      <legend className="sr-only">First release</legend>
      <StepIntro title="Draw the first finish line" description="A useful starting prompt needs both the core journey and a clear edge where the first release stops." />
      <div className="space-y-5">
        <TextField label="Core capabilities" name="visible-features" value={brief.features} onChange={(event) => update("features", event.target.value)} placeholder={"Upload an ad and extract its opening hook\nCompare hooks side by side\nSave a winning hook to a swipe file"} hint="One capability per line. These become the initial feature backlog." rows={5} />
        <TextField label="What must the first release prove?" name="visible-release" value={brief.firstRelease} onChange={(event) => update("firstRelease", event.target.value)} placeholder="One agency owner can upload ten ads, rank their hooks, and export a usable creative brief without help." rows={3} />
        <TextField label="What is explicitly not in the first release?" name="visible-non-goals" value={brief.nonGoals} onChange={(event) => update("nonGoals", event.target.value)} placeholder={"No automatic ad publishing\nNo team billing\nNo native mobile app"} hint="One boundary per line. This protects the agent from inventing scope." rows={4} />
      </div>
    </fieldset>
  );
}

function StackStep({ brief, update, toggle, choosePreset }: StepProps & {
  toggle: (key: "technologies", value: string) => void;
  choosePreset: (id: string, technologies: readonly string[]) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const presets = presetsForShape(brief.projectType, brief.platforms);
  const groups = technologyGroupsForShape({
    projectType: brief.projectType,
    platforms: brief.platforms,
    stackPreset: brief.stackPreset,
    selected: brief.technologies,
    showAll,
  });
  const shape = [brief.projectType, ...brief.platforms].filter(Boolean).join(" · ");

  return (
    <fieldset>
      <legend className="sr-only">Technical direction</legend>
      <StepIntro
        title="Choose a technical starting point"
        description={shape
          ? `These options are filtered to ${shape}. Pick a preset, then adjust it — the agent may still challenge a choice when the repository makes it unsafe.`
          : "Pick a sensible preset, then adjust it. The agent may challenge a choice when the repository or platform makes it unsafe."}
      />
      <Question
        label="Stack preset"
        hint={presets.length === 0 ? undefined : "Selecting a preset fills in the technologies below."}
      >
        {presets.length === 0 ? (
          <p className="rounded-xl border border-line bg-well px-4 py-3 text-caption text-subtle">
            No preset matches this combination of type and platforms. Go back and adjust the shape, or describe the stack in the notes below.
          </p>
        ) : (
          <OptionGrid columns="two">
            {presets.map((preset) => (
              <Choice
                key={preset.id}
                label={preset.label}
                detail={preset.detail}
                meta={
                  brief.platforms.length > 0 &&
                  brief.platforms.every((platform) => (preset.platforms as readonly string[]).includes(platform))
                    ? "Covers every platform"
                    : undefined
                }
                selected={brief.stackPreset === preset.id}
                onClick={() => choosePreset(preset.id, preset.technologies)}
              />
            ))}
          </OptionGrid>
        )}
      </Question>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-caption font-semibold text-ink-100">Technologies</h3>
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="text-caption font-semibold text-cobalt-300 underline-offset-4 hover:underline"
        >
          {showAll ? "Show matching only" : "Show all options"}
        </button>
      </div>
      <div className="space-y-5">
        {groups.map((group) => (
          <Question key={group.label} label={group.label} compact>
            <div className="flex flex-wrap gap-2">
              {group.items.map((technology) => <Pill key={technology} label={technology} selected={brief.technologies.includes(technology)} onClick={() => toggle("technologies", technology)} />)}
            </div>
          </Question>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <TextField label="Integrations" name="visible-integrations" value={brief.integrations} onChange={(event) => update("integrations", event.target.value)} placeholder="Stripe, Resend, Meta Ads API" rows={3} />
        <TextField label="Stack notes" name="visible-stack-notes" value={brief.stackNotes} onChange={(event) => update("stackNotes", event.target.value)} placeholder="Must deploy on our existing Vercel account. Prefer managed services." rows={3} />
      </div>
    </fieldset>
  );
}

function ExperienceStep({ brief, update }: StepProps) {
  return (
    <fieldset>
      <legend className="sr-only">Product experience</legend>
      <StepIntro title="Describe the experience, not just the style" description="Tell the agent how the product should behave and feel in the user’s hands." />
      <div className="space-y-5">
        <TextField label="Design and interaction direction" name="visible-design" value={brief.designDirection} onChange={(event) => update("designDirection", event.target.value)} placeholder="Fast and editorial rather than dashboard-like. Dense comparison views on desktop, a focused review flow on mobile, calm neutrals with one bright signal for winning hooks." rows={5} hint="Include tone, density, motion, accessibility, or device-specific behavior that matters." />
        <TextField label="References or inspiration" name="visible-references" value={brief.references} onChange={(event) => update("references", event.target.value)} placeholder="Linear for keyboard speed; Are.na for collecting references; the attached report for its comparison layout." rows={3} />
      </div>
    </fieldset>
  );
}

function DeliveryStep({ brief, update, toggle }: StepProps & { toggle: (key: "qualityPriorities", value: string) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">Delivery requirements</legend>
      <StepIntro title="Name the invisible requirements" description="These answers prevent the agent from discovering important product constraints halfway through the build." />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Authentication and permissions" name="visible-auth" value={brief.authNeeds} onChange={(event) => update("authNeeds", event.target.value)} placeholder="Email login; owner and editor roles" />
        <Field label="Business model" name="visible-business" value={brief.monetization} onChange={(event) => update("monetization", event.target.value)} placeholder="Free beta, then monthly subscription" />
        <TextField label="Data and content" name="visible-data" value={brief.dataNeeds} onChange={(event) => update("dataNeeds", event.target.value)} placeholder="Private workspaces, image uploads, analysis results, export history." rows={3} />
        <TextField label="Deployment target" name="visible-deployment" value={brief.deployment} onChange={(event) => update("deployment", event.target.value)} placeholder="Vercel with a managed PostgreSQL database; staging and production." rows={3} />
      </div>
      <Question label="Quality priorities" hint="Choose the qualities that should win when tradeoffs appear.">
        <div className="flex flex-wrap gap-2">
          {QUALITY_PRIORITIES.map((quality) => <Pill key={quality} label={quality} selected={brief.qualityPriorities.includes(quality)} onClick={() => toggle("qualityPriorities", quality)} />)}
        </div>
      </Question>
      <TextField label="Hard constraints" name="visible-constraints" value={brief.constraints} onChange={(event) => update("constraints", event.target.value)} placeholder="Must be usable with a keyboard. No user content may be sent to third parties. First demo is in three weeks." rows={4} />
    </fieldset>
  );
}

function ReviewStep({ brief, prompt, defaultAgent }: { brief: ProjectBrief; prompt: string; defaultAgent: string }) {
  const completedSignals = [brief.projectType, brief.targetUser, brief.features, brief.technologies.length ? "stack" : "", brief.designDirection, brief.constraints].filter(Boolean).length;
  return (
    <section aria-labelledby="launch-brief-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="launch-brief-title" className="text-title-2 text-foreground">Your starting point is ready</h2>
          <p className="mt-2 text-body text-muted">Creating the project saves this brief as a prompt and puts it first in the queue for {defaultAgent}.</p>
        </div>
        <div className="rounded-xl border border-line bg-well px-3 py-2 text-caption text-muted">
          <span className="tabular font-semibold text-foreground">{completedSignals}/6</span> brief signals
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {brief.projectType ? <SummaryChip>{brief.projectType}</SummaryChip> : null}
        {brief.stage ? <SummaryChip>{brief.stage}</SummaryChip> : null}
        {brief.platforms.map((platform) => <SummaryChip key={platform}>{platform}</SummaryChip>)}
        {brief.technologies.slice(0, 5).map((technology) => <SummaryChip key={technology}>{technology}</SummaryChip>)}
        {brief.technologies.length > 5 ? <SummaryChip>+{brief.technologies.length - 5} tools</SummaryChip> : null}
      </div>
      <div className="rounded-2xl border border-line-subtle bg-well">
        <div className="flex items-center justify-between gap-3 border-b border-line-subtle px-4 py-3">
          <p className="text-caption font-semibold text-ink-100">Start building {brief.name || "this project"}</p>
          <CopyButton text={prompt} label="Copy brief" size="sm" />
        </div>
        <pre className="wrap-anywhere max-h-[28rem] overflow-auto whitespace-pre-wrap p-4 text-caption leading-relaxed text-ink-100" tabIndex={0} aria-label="Generated starting prompt">{prompt}</pre>
      </div>
    </section>
  );
}

function Question({ label, hint, compact, children }: { label: string; hint?: string; compact?: boolean; children: React.ReactNode }) {
  return (
    <div className={compact ? "mb-4" : "mb-7"}>
      <h3 className="text-caption font-semibold text-ink-100">{label}</h3>
      {hint ? <p className="mt-1 text-caption text-subtle">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function OptionGrid({ columns, children }: { columns: "two" | "three"; children: React.ReactNode }) {
  return <div className={cn("grid gap-2", columns === "three" ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2")}>{children}</div>;
}

function Choice({ label, detail, meta, selected, onClick }: { label: string; detail: string; meta?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-20 rounded-xl border p-3.5 text-left transition-colors",
        selected ? "border-cobalt-400/60 bg-cobalt-500/14" : "border-line bg-well hover:border-line-strong hover:bg-surface-raised",
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className={cn("text-caption font-semibold", selected ? "text-cobalt-300" : "text-foreground")}>{label}</span>
        {meta ? <span className="rounded-full bg-accent/12 px-2 py-0.5 text-micro font-semibold text-accent">{meta}</span> : null}
      </span>
      <span className="mt-1 block text-caption text-subtle">{detail}</span>
    </button>
  );
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={cn("min-h-9 rounded-full border px-3 text-caption font-semibold transition-colors", selected ? "border-cobalt-400/50 bg-cobalt-500/16 text-cobalt-300" : "border-line bg-well text-muted hover:border-line-strong hover:text-foreground")}>{label}</button>
  );
}

function SummaryChip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line bg-well px-2.5 py-1 text-micro font-semibold text-muted">{children}</span>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      <Rocket className="h-4 w-4" aria-hidden="true" />
      {pending ? "Creating project…" : "Create project & queue prompt"}
    </Button>
  );
}
