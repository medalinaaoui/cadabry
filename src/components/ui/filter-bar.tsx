"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/cn";

export type FilterOption = { value: string; label: string; count?: number };

/**
 * Single-select segmented filter. Radix ToggleGroup gives roving-tabindex
 * arrow-key navigation, so a long status row stays one tab stop.
 */
export function FilterBar({
  options,
  value,
  onValueChange,
  label,
  className,
}: {
  options: FilterOption[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
      aria-label={label}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-full border border-line bg-surface/70 p-1",
        className,
      )}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="press inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-caption
            font-semibold text-muted transition-colors duration-(--duration-fast)
            hover:text-foreground data-[state=on]:bg-cobalt-500/18 data-[state=on]:text-cobalt-300"
        >
          {option.label}
          {option.count !== undefined && (
            <span className="tabular text-micro text-subtle">{option.count}</span>
          )}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
