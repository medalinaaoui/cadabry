"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Archive,
  ArchiveRestore,
  Copy,
  Download,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { Button, IconButton } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  archiveProject,
  deleteProject,
  duplicateProject,
  restoreProject,
  setProjectStatus,
} from "@/features/projects/actions";
import { PROJECT_STATUS_ORDER, projectStatus } from "@/features/projects/display";

/**
 * Everything you can do *to* a project, gathered in one place. Destructive
 * options sit below a divider and delete asks you to type the name — the rest
 * of the app never asks twice, so the one thing that cannot be undone should.
 */
export function ProjectActions({
  slug,
  name,
  status,
  archived,
}: {
  slug: string;
  name: string;
  status: string;
  archived: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);

  function run(action: (data: FormData) => Promise<{ ok: boolean; message: string }>, extra?: Record<string, string>) {
    const data = new FormData();
    data.set("slug", slug);
    for (const [key, value] of Object.entries(extra ?? {})) data.set(key, value);

    startTransition(async () => {
      const result = await action(data);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
      toast.success("Link copied");
    } catch {
      toast.error("Clipboard is blocked in this browser.");
    }
  }

  return (
    <>
      <Menu>
        <MenuTrigger asChild>
          <IconButton aria-label={`Actions for ${name}`} variant="secondary" disabled={pending}>
            <MoreHorizontal className="h-4 w-4" />
          </IconButton>
        </MenuTrigger>
        <MenuContent align="end" className="min-w-56">
          <MenuLabel>{name}</MenuLabel>

          <MenuItem asChild>
            <Link href={`/${slug}/edit`}>
              <Pencil className="h-4 w-4 text-subtle" />
              Edit project brain
            </Link>
          </MenuItem>

          <MenuItem asChild>
            <Link href={`/${slug}/export`}>
              <Download className="h-4 w-4 text-subtle" />
              Export documents
            </Link>
          </MenuItem>
          <MenuItem onSelect={() => void copyLink()}>
            <Link2 className="h-4 w-4 text-subtle" />
            Copy link
          </MenuItem>
          <MenuItem onSelect={() => run(duplicateProject)}>
            <Copy className="h-4 w-4 text-subtle" />
            Duplicate
          </MenuItem>

          <MenuSeparator />

          {/* Status sits inline rather than behind a submenu: it is the most
              used control here, and a flat list is one click on any device. */}
          <MenuLabel>Status</MenuLabel>
          {PROJECT_STATUS_ORDER.filter((value) => value !== "ARCHIVED").map((value) => {
            const meta = projectStatus(value);
            const current = value === status;
            return (
              <MenuItem
                key={value}
                onSelect={() => !current && run(setProjectStatus, { status: value })}
                aria-current={current ? "true" : undefined}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: meta.hue }}
                />
                {meta.label}
                {current && <Check className="ml-auto h-3.5 w-3.5 text-accent" />}
              </MenuItem>
            );
          })}

          <MenuSeparator />

          {archived ? (
            <MenuItem onSelect={() => run(restoreProject)}>
              <ArchiveRestore className="h-4 w-4 text-subtle" />
              Restore to universe
            </MenuItem>
          ) : (
            <MenuItem onSelect={() => run(archiveProject)}>
              <Archive className="h-4 w-4 text-subtle" />
              Archive
            </MenuItem>
          )}
          <MenuItem
            className="text-danger data-[highlighted]:bg-danger/15 data-[highlighted]:text-danger"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete project…
          </MenuItem>
        </MenuContent>
      </Menu>

      <DeleteProjectDialog
        slug={slug}
        name={name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          router.push("/");
          router.refresh();
        }}
      />
    </>
  );
}

/**
 * Permanent deletion. The name has to be typed exactly, and the same check
 * runs again on the server — the input is a speed bump, not the guard.
 */
export function DeleteProjectDialog({
  slug,
  name,
  open,
  onOpenChange,
  onDeleted,
}: {
  slug: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}) {
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const matches = confirm.trim().toLowerCase() === name.trim().toLowerCase();

  function close(next: boolean) {
    if (!next) setConfirm("");
    onOpenChange(next);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matches || pending) return;

    const data = new FormData();
    data.set("slug", slug);
    data.set("confirm", confirm);

    setPending(true);
    const result = await deleteProject(data);
    setPending(false);

    if (result.ok) {
      toast.success(result.message);
      close(false);
      onDeleted();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        title={`Delete “${name}”?`}
        description="This removes the brain, prompts, decisions, features, bugs, sessions and history. It cannot be undone — archiving keeps everything and hides the project instead."
        size="sm"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label={`Type “${name}” to confirm`}
            name="confirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            autoComplete="off"
            autoFocus
            placeholder={name}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={!matches || pending}>
              <Trash2 className="h-4 w-4" />
              {pending ? "Deleting…" : "Delete forever"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
