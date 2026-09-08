import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

/** Standard content column for every non-universe screen. */
export function PageShell({
  children,
  width = "wide",
  className,
}: {
  children: ReactNode;
  width?: "wide" | "reading";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full animate-fade-up",
        width === "reading" ? "max-w-(--reading-max)" : "max-w-(--page-max)",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Page title block. The eyebrow carries the "where am I" signal so the title
 * itself stays short — the same job a breadcrumb does, with less chrome.
 */
export function PageHeader({
  eyebrow,
  eyebrowHref,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  eyebrowHref?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-7 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow &&
          (eyebrowHref ? (
            <Link
              href={eyebrowHref}
              className="eyebrow -ml-1 inline-flex items-center gap-1 rounded-md py-0.5 pl-1 pr-2
                transition-colors hover:text-accent"
            >
              <ChevronLeft className="h-3 w-3" />
              {eyebrow}
            </Link>
          ) : (
            <p className="eyebrow">{eyebrow}</p>
          ))}
        <h1 className="mt-1.5 text-title-1 text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 max-w-(--reading-max) text-body text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/**
 * Empty state. Always names the thing that is missing and offers the one
 * action that fixes it — never a bare "No data".
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-line",
        "bg-surface/40 px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-well text-cobalt-400">
          {icon}
        </div>
      )}
      <h2 className="text-title-3 text-foreground">{title}</h2>
      {description && <p className="mt-1.5 max-w-sm text-caption text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/**
 * Label/value pair list for structured records. Renders as a real <dl> so the
 * relationship survives in the accessibility tree.
 */
export function DataList({
  items,
  columns = 2,
  className,
}: {
  items: { label: string; value: ReactNode }[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const visible = items.filter((i) => i.value !== null && i.value !== undefined && i.value !== "");
  if (visible.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {visible.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="eyebrow">{item.label}</dt>
          <dd className="mt-1 text-body text-ink-100 wrap-anywhere">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Rows of records. Uses a list so counts are announced. */
export function Stack({
  children,
  className,
  as: Comp = "ul",
}: {
  children: ReactNode;
  className?: string;
  as?: "ul" | "ol" | "div";
}) {
  return <Comp className={cn("space-y-2", className)}>{children}</Comp>;
}

/** One record row inside a Stack. */
export function Row({
  children,
  className,
  interactive = false,
  as: Comp = "li",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "li" | "div";
}) {
  return (
    <Comp
      className={cn(
        "rounded-xl border border-line bg-surface p-4 transition-colors duration-(--duration-fast)",
        interactive && "hover:border-line-strong hover:bg-surface-raised",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
