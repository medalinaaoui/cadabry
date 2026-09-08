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
                stroke="var(--ink-700)"
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
