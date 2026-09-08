"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Inbox,
  Layers,
  LogOut,
  Plus,
  Search,
  Settings,
  Wand2,
  Zap,
} from "lucide-react";
import { Wordmark } from "./brand";
import { CommandMenu, type CommandProject } from "./command-menu";
import { QuickCapture } from "./quick-capture";
import { Button, IconButton } from "@/components/ui/button";
import { Kbd } from "@/components/ui/badge";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  TooltipProvider,
} from "@/components/ui/menu";
import { logout } from "@/features/auth/actions";

const LIBRARY = [
  { href: "/prompts", label: "Prompt Library", icon: FileText },
  { href: "/starter", label: "Starter Builder", icon: Wand2 },
  { href: "/packs", label: "Context Packs", icon: Layers },
  { href: "/skills", label: "Skills", icon: BookOpen },
  { href: "/inbox", label: "Idea Inbox", icon: Inbox },
];

/**
 * The shell is deliberately thin: one floating bar, and ⌘K for everything
 * else. A permanent sidebar would eat a fifth of the screen to show links
 * that the command menu already surfaces faster.
 */
export function AppShell({
  children,
  userDisplayName,
  projects = [],
}: {
  children: React.ReactNode;
  userDisplayName: string;
  projects?: CommandProject[];
}) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const pathname = usePathname();
  const onUniverse = pathname === "/";

  const openCapture = useCallback(() => setCaptureOpen(true), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
        return;
      }

      // Bare "c" captures a thought — but never while someone is typing.
      if (event.key === "c" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setCaptureOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative flex min-h-dvh flex-col bg-background">
        <header
          className="sticky top-0 z-(--z-header) border-b border-line-subtle
            bg-background/80 backdrop-blur-xl backdrop-saturate-150"
        >
          <div
            className="mx-auto flex h-(--header-h) max-w-(--page-max) items-center gap-2
              px-(--gutter) md:px-(--gutter-lg)"
          >
            <Link
              href="/"
              className="mr-1 shrink-0 rounded-lg transition-opacity hover:opacity-80"
              aria-label="Cadabry — project universe"
              aria-current={onUniverse ? "page" : undefined}
            >
              <Wordmark />
            </Link>

            <Menu>
              <MenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden gap-1 sm:inline-flex">
                  Library
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </MenuTrigger>
              <MenuContent align="start">
                <MenuLabel>Library</MenuLabel>
                {LIBRARY.map((item) => (
                  <MenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 text-subtle" />
                      {item.label}
                    </Link>
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>

            <div className="flex-1" />

            {/* Search doubles as the discoverable entry point for ⌘K. */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="press hidden h-9 items-center gap-2 rounded-full border border-line
                bg-surface/70 pl-3 pr-2 text-caption text-subtle transition-colors
                hover:border-line-strong hover:text-muted sm:inline-flex"
            >
              <Search className="h-3.5 w-3.5" />
              Jump to…
              <Kbd>⌘K</Kbd>
            </button>

            <IconButton
              aria-label="Search and jump to"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="sm:hidden"
            >
              <Search className="h-4 w-4" />
            </IconButton>

            <IconButton aria-label="Capture a thought" size="sm" onClick={openCapture}>
              <Zap className="h-4 w-4" />
            </IconButton>

            <Menu>
              <MenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Account: ${userDisplayName}`}
                  className="press ml-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full
                    border border-line bg-surface-raised text-micro font-semibold text-ink-100
                    transition-colors hover:border-line-strong"
                >
                  {userDisplayName.slice(0, 1).toUpperCase()}
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuLabel>{userDisplayName}</MenuLabel>
                <MenuItem asChild>
                  <Link href="/projects/new">
                    <Plus className="h-4 w-4 text-subtle" />
                    New project
                  </Link>
                </MenuItem>
                <MenuItem asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 text-subtle" />
                    Settings
                  </Link>
                </MenuItem>
                <MenuSeparator />
                <MenuItem asChild>
                  {/* A form POST, not a link: signing out should never be
                      reachable by a prefetch or a crawler. */}
                  <form action={logout}>
                    <button type="submit" className="flex w-full items-center gap-2.5">
                      <LogOut className="h-4 w-4 text-subtle" />
                      Sign out
                    </button>
                  </form>
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </header>

        <main
          id="main"
          className="flex-1 px-(--gutter) py-7 md:px-(--gutter-lg) md:py-10"
        >
          {children}
        </main>

        <CommandMenu
          open={commandOpen}
          onOpenChange={setCommandOpen}
          projects={projects}
          onQuickCapture={openCapture}
        />
        <QuickCapture
          open={captureOpen}
          onOpenChange={setCaptureOpen}
          projects={projects}
        />
      </div>
    </TooltipProvider>
  );
}
