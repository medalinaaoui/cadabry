import type { Tone } from "@/components/ui/badge";

/**
 * One vocabulary for every status the app renders. Colour carries meaning
 * consistently across the universe, the badges, and the lists: gold is live
 * work, cobalt is planned, cyan is shipped, red is stuck, grey is dormant.
 */

export type ProjectStatus =
  | "IDEA"
  | "PLANNING"
  | "BUILDING"
  | "BLOCKED"
  | "PAUSED"
  | "SHIPPED"
  | "ARCHIVED";

type StatusMeta = { label: string; tone: Tone; hue: string; dormant?: boolean };

export const PROJECT_STATUS: Record<ProjectStatus, StatusMeta> = {
  IDEA: { label: "Idea", tone: "quiet", hue: "var(--ink-300)" },
  PLANNING: { label: "Planning", tone: "cobalt", hue: "var(--cobalt-400)" },
  BUILDING: { label: "Building", tone: "gold", hue: "var(--gold-400)" },
  BLOCKED: { label: "Blocked", tone: "danger", hue: "var(--danger-500)" },
  PAUSED: { label: "Paused", tone: "neutral", hue: "var(--ink-300)", dormant: true },
  SHIPPED: { label: "Shipped", tone: "cyan", hue: "var(--cyan-400)" },
  ARCHIVED: { label: "Archived", tone: "quiet", hue: "var(--ink-400)", dormant: true },
};

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  "IDEA",
  "PLANNING",
  "BUILDING",
  "BLOCKED",
  "PAUSED",
  "SHIPPED",
  "ARCHIVED",
];

export function projectStatus(status: string): StatusMeta {
  return PROJECT_STATUS[status as ProjectStatus] ?? PROJECT_STATUS.IDEA;
}

const WORK_STATUS: Record<string, StatusMeta> = {
  PLANNED: { label: "Planned", tone: "cobalt", hue: "var(--cobalt-400)" },
  IN_PROGRESS: { label: "In progress", tone: "gold", hue: "var(--gold-400)" },
  BLOCKED: { label: "Blocked", tone: "danger", hue: "var(--danger-500)" },
  DONE: { label: "Done", tone: "success", hue: "var(--success-500)" },
  CANCELLED: { label: "Cancelled", tone: "quiet", hue: "var(--ink-400)" },

  QUEUED: { label: "Queued", tone: "cobalt", hue: "var(--cobalt-400)" },
  SENT: { label: "Sent", tone: "gold", hue: "var(--gold-400)" },
  COMPLETED: { label: "Completed", tone: "success", hue: "var(--success-500)" },
  FAILED: { label: "Failed", tone: "danger", hue: "var(--danger-500)" },

  INBOX: { label: "Inbox", tone: "quiet", hue: "var(--ink-300)" },
  ACTIVE: { label: "Active", tone: "danger", hue: "var(--danger-500)" },
  RESOLVED: { label: "Resolved", tone: "success", hue: "var(--success-500)" },
  ARCHIVED: { label: "Archived", tone: "quiet", hue: "var(--ink-400)" },

  DRAFT: { label: "Draft", tone: "quiet", hue: "var(--ink-300)" },
  READY: { label: "Ready", tone: "success", hue: "var(--success-500)" },

  PROPOSED: { label: "Proposed", tone: "cobalt", hue: "var(--cobalt-400)" },
  ACCEPTED: { label: "Accepted", tone: "success", hue: "var(--success-500)" },
  SUPERSEDED: { label: "Superseded", tone: "quiet", hue: "var(--ink-400)" },
  REJECTED: { label: "Rejected", tone: "danger", hue: "var(--danger-500)" },

  ABANDONED: { label: "Abandoned", tone: "quiet", hue: "var(--ink-400)" },
};

/** Status meta for every non-project enum in the schema. */
export function workStatus(status: string): StatusMeta {
  return (
    WORK_STATUS[status] ?? {
      label: humanize(status),
      tone: "neutral" as Tone,
      hue: "var(--ink-300)",
    }
  );
}

/** SCREAMING_SNAKE → "Screaming snake". */
export function humanize(value: string): string {
  const lower = value.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/** Compact relative time. Rendered inside a <time> with a full title. */
export function timeAgo(date: Date | string | null | undefined): string {
  if (!date) return "never";
  const then = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);
  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  const days = Math.floor(seconds / DAY);
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/** Days since a date, used to fade dormant projects in the universe. */
export function daysSince(date: Date | string | null | undefined): number {
  if (!date) return Infinity;
  const then = typeof date === "string" ? new Date(date) : date;
  return Math.floor((Date.now() - then.getTime()) / (DAY * 1000));
}
