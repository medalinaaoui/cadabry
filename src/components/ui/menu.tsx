"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ menu -- */

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

const surface =
  "z-(--z-overlay) min-w-48 overflow-hidden rounded-xl border border-line-strong bg-overlay p-1 " +
  "shadow-[var(--shadow-lg)] data-[state=open]:animate-[cadabry-scale-in_var(--duration-fast)_var(--ease-out)]";

export function MenuContent({
  children,
  align = "end",
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={6}
        className={cn(surface, className)}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

const itemStyle =
  "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-body " +
  "text-ink-100 outline-none data-[highlighted]:bg-surface-raised data-[highlighted]:text-foreground " +
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

export function MenuItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenu.Item>) {
  return <DropdownMenu.Item className={cn(itemStyle, className)} {...props} />;
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu.Label className="eyebrow px-2.5 pb-1 pt-2">{children}</DropdownMenu.Label>
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-line" />;
}

/* --------------------------------------------------------------- tooltip -- */

export const TooltipProvider = TooltipPrimitive.Provider;

/** Tooltips supplement a label, they never replace one. */
export function Tooltip({
  content,
  children,
  side = "bottom",
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="z-(--z-overlay) flex items-center gap-2 rounded-lg border border-line-strong
            bg-overlay px-2.5 py-1.5 text-caption text-ink-100 shadow-[var(--shadow-md)]
            data-[state=delayed-open]:animate-[cadabry-scale-in_var(--duration-fast)_var(--ease-out)]"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/* ------------------------------------------------------------- separator -- */

export function Separator({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={cn(
        "shrink-0 bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
