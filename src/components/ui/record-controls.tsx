"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type RecordAction = (formData: FormData) => void | Promise<void>;

/** Consistent edit/delete affordances for records across project sections. */
export function RecordControls({
  id,
  name,
  editAction,
  deleteAction,
  children,
}: {
  id: string;
  name: string;
  editAction: RecordAction;
  deleteAction: RecordAction;
  children: ReactNode;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-line-subtle pt-3">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="quiet">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent title={`Edit ${name}`} description="Update this record without losing its history.">
          <form
            action={async (formData) => {
              await editAction(formData);
              setEditOpen(false);
            }}
            className="space-y-4"
          >
            <input type="hidden" name="id" value={id} />
            {children}
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="primary">Save changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="quiet" className="text-danger hover:text-danger">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent
          size="sm"
          title={`Delete ${name}?`}
          description="This permanently removes the record. This action cannot be undone."
        >
          <form
            action={async (formData) => {
              await deleteAction(formData);
              setDeleteOpen(false);
            }}
          >
            <input type="hidden" name="id" value={id} />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Keep it</Button>
              </DialogClose>
              <Button type="submit" variant="danger">Delete permanently</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
