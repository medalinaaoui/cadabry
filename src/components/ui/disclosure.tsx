import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Collapsed "add a record" form.
 *
 * Native <details> on purpose: it needs no JavaScript, it is keyboard and
 * screen-reader correct for free, and the content inside is a server-action
 * form that must work before hydration.
 */
export function CreateDisclosure({
  label,
  children,
  defaultOpen = false,
  className,
}: {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group rounded-2xl border border-line bg-surface open:bg-surface-raised/40",
        className,
      )}
    >
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3.5
          text-body font-semibold text-muted transition-colors hover:text-foreground
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          [&::-webkit-details-marker]:hidden"
      >
        <Plus
          className="h-4 w-4 transition-transform duration-(--duration-base) group-open:rotate-45"
          aria-hidden="true"
        />
        {label}
      </summary>
      <div className="border-t border-line-subtle px-4 py-5">{children}</div>
    </details>
  );
}

/** Two-column form grid that collapses on narrow screens. */
export function FormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

/** Inline action buttons attached to a record row. */
export function RowActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-3 flex flex-wrap items-center gap-2", className)}>{children}</div>
  );
}

/**
 * Small status-changing button used inside record rows. Deliberately not the
 * primary Button: gold is reserved for the single main action on a screen.
 */
export function RowButton({
  children,
  tone = "neutral",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "neutral" | "success" | "danger" | "accent";
}) {
  const tones = {
    neutral: "border-line bg-surface-raised text-muted hover:text-foreground",
    success: "border-success/35 bg-success/10 text-success hover:bg-success/18",
    danger: "border-danger/35 bg-danger/10 text-danger hover:bg-danger/18",
    accent: "border-accent/35 bg-accent/10 text-accent hover:bg-accent/18",
  }[tone];

  return (
    <button
      type="submit"
      {...props}
      className={cn(
        "press inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-caption",
        "font-semibold transition-colors duration-(--duration-fast)",
        tones,
        props.className,
      )}
    >
      {children}
    </button>
  );
}
