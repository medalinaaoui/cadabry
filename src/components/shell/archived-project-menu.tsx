"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { DeleteProjectDialog } from "./project-actions";

/** The archive row's overflow: open it, or end it. */
export function ArchivedProjectMenu({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Menu>
        <MenuTrigger asChild>
          <IconButton aria-label={`Actions for ${name}`} size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </IconButton>
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem asChild>
            <Link href={`/${slug}`}>
              <ExternalLink className="h-4 w-4 text-subtle" />
              Open project
            </Link>
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            className="text-danger data-[highlighted]:bg-danger/15 data-[highlighted]:text-danger"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete forever…
          </MenuItem>
        </MenuContent>
      </Menu>

      <DeleteProjectDialog
        slug={slug}
        name={name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.refresh()}
      />
    </>
  );
}
