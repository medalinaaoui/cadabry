import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** "sunken" reads as a well for code and generated output. */
  tone?: "surface" | "raised" | "sunken" | "glass";
  padded?: boolean;
};

/**
 * The one container in the system. Depth comes from the surface colour and a
 * hairline — never a drop shadow.
 */
export function Panel({
  as: Comp = "div",
  tone = "surface",
  padded = true,
  className,
  ...props
}: PanelProps) {
  return (
    <Comp
      className={cn(
        "rounded-2xl border",
        tone === "surface" && "border-line bg-surface",
        tone === "raised" && "border-line-strong bg-surface-raised",
        tone === "sunken" && "border-line-subtle bg-well",
        tone === "glass" && "glass",
        padded && "p-5",
        className,
      )}
      {...props}
    />
  );
}

/** Panel header: title, optional count, optional trailing action. */
export function PanelHeader({
  title,
  count,
  description,
  action,
  className,
}: {
  title: ReactNode;
  count?: number;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="flex items-baseline gap-2 text-title-3 text-foreground">
          {title}
          {count !== undefined && (
            <span className="tabular text-caption font-normal text-subtle">{count}</span>
          )}
        </h2>
        {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
