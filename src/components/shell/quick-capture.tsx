"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { quickCapture } from "@/features/capture/actions";
import { Button } from "@/components/ui/button";

type QuickCaptureProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects?: { id: string; name: string }[];
};

const CAPTURE_TYPES = [
  { value: "idea", label: "Idea" },
  { value: "feature", label: "Feature" },
  { value: "bug", label: "Bug" },
  { value: "note", label: "Note" },
] as const;

export function QuickCapture({ open, onOpenChange, projects = [] }: QuickCaptureProps) {
  const [pending, setPending] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay bg-ink-950/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-dialog w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-overlay p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Zap className="h-5 w-5 text-accent" />
              Quick Capture
            </Dialog.Title>
            <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-raised hover:text-foreground">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            setPending(true);
            const result = await quickCapture(formData);
            setPending(false);
            if (result.ok) {
              toast.success("Captured to inbox");
              onOpenChange(false);
              (e.currentTarget as HTMLFormElement).reset();
            } else {
              toast.error(result.error ?? "Failed to capture");
            }
          }}>
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="capture-title" className="text-sm font-medium text-foreground">
                New thought
              </label>
              <input
                id="capture-title"
                name="title"
                type="text"
                placeholder="Add Stripe customer portal later"
                className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent/40"
                autoFocus
                required
              />
            </div>

            {/* Type selector */}
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Type</span>
              <div className="flex flex-wrap gap-2">
                {CAPTURE_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t.value}
                      defaultChecked={t.value === "idea"}
                      className="sr-only"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Project selector */}
            {projects.length > 0 && (
              <div className="space-y-1.5">
                <label htmlFor="capture-project" className="text-sm font-medium text-foreground">
                  Project <span className="text-subtle">(optional)</span>
                </label>
                <select
                  id="capture-project"
                  name="projectId"
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground"
                >
                  <option value="">Inbox (no project)</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}


            {/* Submit */}
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button type="submit" variant="primary" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
