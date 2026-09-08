"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { restoreProject } from "@/features/projects/actions";

/** Undo for archiving. Restores the project as paused, never as building. */
export function RestoreProjectButton({
  slug,
  size = "sm",
}: {
  slug: string;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      size={size}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const data = new FormData();
          data.set("slug", slug);
          const result = await restoreProject(data);
          if (result.ok) {
            toast.success(result.message);
            router.refresh();
          } else {
            toast.error(result.message);
          }
        })
      }
    >
      <ArchiveRestore className="h-4 w-4" />
      {pending ? "Restoring…" : "Restore"}
    </Button>
  );
}
