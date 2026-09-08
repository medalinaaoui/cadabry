import { cn } from "@/lib/cn";

/**
 * Progress meter. Reads as an accessible progressbar, and the value is always
 * shown as text too — a bar alone never communicates a number.
 */
export function Progress({
  value,
  label = "Progress",
  showValue = true,
  tone = "gold",
  className,
}: {
  value: number;
  label?: string;
  showValue?: boolean;
  tone?: "gold" | "cobalt" | "success";
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const fill =
    tone === "cobalt" ? "bg-cobalt-500" : tone === "success" ? "bg-success" : "bg-accent";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 flex-1 overflow-hidden rounded-full bg-ink-700"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-(--duration-slow) ease-(--ease-out)", fill)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showValue && (
        <span className="tabular w-8 shrink-0 text-right text-micro text-subtle">{clamped}%</span>
      )}
    </div>
  );
}
