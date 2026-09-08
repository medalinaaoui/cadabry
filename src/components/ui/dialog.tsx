"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/**
 * Modal surface. Enters with a short scale so it reads as arriving from the
 * page rather than sliding in from nowhere.
 */
export function DialogContent({
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const width =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-(--z-overlay) bg-ink-980/70 backdrop-blur-sm
          data-[state=open]:animate-[cadabry-overlay-in_var(--duration-base)_var(--ease-out)]"
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-(--z-dialog) w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
          "max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-2xl border border-line-strong",
          "bg-overlay p-6 shadow-[var(--shadow-xl)]",
          "data-[state=open]:animate-[cadabry-scale-in_var(--duration-base)_var(--ease-out)]",
          width,
          className,
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DialogPrimitive.Title className="text-title-2 text-foreground">
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-1 text-caption text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          <DialogPrimitive.Close
            aria-label="Close"
            className="press -mr-1.5 -mt-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl text-subtle transition-colors hover:bg-surface-raised hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>

        {children}

        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
