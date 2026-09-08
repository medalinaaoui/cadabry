"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

type HeaderProps = {
  displayName: string;
};

export function Header({ displayName }: HeaderProps) {
  return (
    <header className="flex h-[var(--header-h)] items-center justify-between border-b border-line bg-background px-[var(--gutter)] md:px-[var(--gutter-lg)]">
      <Link href="/" className="text-lg font-semibold tracking-tight text-accent">
        Cadabry
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">{displayName}</span>
        <Link
          href="/logout"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
