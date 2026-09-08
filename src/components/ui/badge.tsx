import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone =
  | "neutral"
  | "gold"
  | "cobalt"
  | "cyan"
  | "success"
  | "danger"
  | "quiet";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface-raised text-ink-100",
  gold: "border-gold-600/45 bg-gold-400/12 text-gold-300",
  cobalt: "border-cobalt-500/45 bg-cobalt-500/12 text-cobalt-300",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan-300",
  success: "border-success/40 bg-success/12 text-success",
  danger: "border-danger/45 bg-danger/12 text-danger",
  quiet: "border-line-subtle bg-transparent text-subtle",
};

/** Compact status pill. Carries a dot when it represents live state. */
export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-micro font-semibold uppercase tracking-[0.06em] whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Keyboard hint. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-strong",
        "bg-well px-1.5 text-micro font-semibold text-subtle",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
