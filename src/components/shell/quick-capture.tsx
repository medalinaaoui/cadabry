"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bug, FileText, Lightbulb, Sparkles } from "lucide-react";
import { quickCapture } from "@/features/capture/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Field, FieldShell, SelectField } from "@/components/ui/field";

const CAPTURE_TYPES = [
  { value: "idea", label: "Idea", icon: Lightbulb },
  { value: "feature", label: "Feature", icon: Sparkles },
  { value: "bug", label: "Bug", icon: Bug },
  { value: "note", label: "Note", icon: FileText },
] as const;

/**
 * Frictionless capture. One required field, everything else optional, and the
 * dialog closes the moment it saves — the whole interaction is meant to cost
 * a couple of seconds mid-build.
 */
export function QuickCapture({
  open,
  onOpenChange,
  projects = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects?: { id: string; name: string }[];
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    const result = await quickCapture(formData);
    setPending(false);

    if (result.ok) {
      toast.success("Captured to inbox");
      form.reset();
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error ?? "Could not capture that. Try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Capture a thought"
        description="It lands in your inbox. Sort it later."
        size="sm"
      >
        <form className="space-y-5" onSubmit={onSubmit}>
          <Field
            label="New thought"
            id="capture-title"
            name="title"
            placeholder="Add a Stripe customer portal later"
            autoFocus
            required
            autoComplete="off"
          />

          <FieldShell label="Type">
            <div className="flex flex-wrap gap-2">
              {CAPTURE_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="press flex cursor-pointer items-center gap-1.5 rounded-xl border
                    border-line bg-surface px-3 py-2 text-caption text-muted transition-colors
                    hover:border-line-strong has-[:checked]:border-accent
                    has-[:checked]:bg-accent/10 has-[:checked]:text-accent
                    has-[:focus-visible]:outline has-[:focus-visible]:outline-2
                    has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    defaultChecked={type.value === "idea"}
                    className="sr-only"
                  />
                  <type.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {type.label}
                </label>
              ))}
            </div>
          </FieldShell>

          {projects.length > 0 && (
            <SelectField
              label="Project"
              id="capture-project"
              name="projectId"
              hint="Leave as Inbox if it isn't tied to anything yet."
              defaultValue=""
            >
              <option value="">Inbox (no project)</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </SelectField>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Saving…" : "Capture"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
