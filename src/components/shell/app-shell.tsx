"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu as MenuIcon, Search, X, Zap } from "lucide-react";
import { Wordmark } from "./brand";
import { CommandMenu, type CommandProject } from "./command-menu";
import { QuickCapture } from "./quick-capture";
import { Sidebar, type SidebarProject } from "./sidebar";
import { IconButton } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/menu";
import { cn } from "@/lib/cn";

const SIDEBAR_COOKIE = "cadabry:sidebar";

/**
 * The shell: a persistent left rail, a mobile drawer that shares the exact
 * same nav, and ⌘K over the top of both. The rail is the app's spine — every
 * project is one click away — while ⌘K stays the fast path for people who
 * already know where they are going.
 */
export function AppShell({
  children,
  userDisplayName,
  projects = [],
  archivedCount = 0,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  userDisplayName: string;
  projects?: SidebarProject[];
  archivedCount?: number;
  defaultCollapsed?: boolean;
}) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const openCapture = useCallback(() => setCaptureOpen(true), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // The width preference is a cookie, not localStorage, so the server renders
  // the correct rail width and the layout never jumps on first paint.
  const toggleCollapsed = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      document.cookie = `${SIDEBAR_COOKIE}=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }, []);

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

      if (event.key === "\\" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleCollapsed();
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
  }, [toggleCollapsed]);

  const sidebarProps = {
    userDisplayName,
    projects,
    archivedCount,
    collapsed,
    onToggleCollapsed: toggleCollapsed,
    onOpenCommand: openCommand,
    onOpenCapture: openCapture,
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-dvh bg-background">
        {/* ------------------------------------------------------- rail --- */}
        <aside
          aria-label="Sidebar"
          data-collapsed={collapsed ? "true" : "false"}
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 border-r border-line-subtle",
            "bg-surface/50 backdrop-blur-xl lg:block",
            "transition-[width] duration-(--duration-base) ease-(--ease-out)",
            collapsed ? "w-[4.5rem]" : "w-[17rem]",
          )}
        >
          <Sidebar {...sidebarProps} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* ------------------------------------------ mobile top bar --- */}
          <header
            className="sticky top-0 z-(--z-header) flex h-(--header-h) items-center gap-2
              border-b border-line-subtle bg-background/80 px-(--gutter) backdrop-blur-xl
              backdrop-saturate-150 lg:hidden"
          >
            <IconButton
              aria-label="Open navigation"
              size="sm"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon className="h-4 w-4" />
            </IconButton>

            <Link
              href="/"
              className="min-w-0 shrink rounded-lg transition-opacity hover:opacity-80"
              aria-label="Cadabry — project universe"
            >
              <Wordmark />
            </Link>

            <div className="flex-1" />

            <IconButton aria-label="Search and jump to" size="sm" onClick={openCommand}>
              <Search className="h-4 w-4" />
            </IconButton>
            <IconButton aria-label="Capture a thought" size="sm" onClick={openCapture}>
              <Zap className="h-4 w-4" />
            </IconButton>
          </header>

          <main
            id="main"
            className="flex-1 px-(--gutter) py-7 md:px-(--gutter-lg) md:py-10"
          >
            {children}
          </main>
        </div>

        {/* ---------------------------------------------- mobile drawer --- */}
        <DialogPrimitive.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              className="fixed inset-0 z-(--z-overlay) bg-veil backdrop-blur-sm lg:hidden
                data-[state=open]:animate-[cadabry-overlay-in_var(--duration-base)_var(--ease-out)]"
            />
            <DialogPrimitive.Content
              className="fixed inset-y-0 left-0 z-(--z-dialog) flex w-[18rem] max-w-[86vw] flex-col
                border-r border-line-strong bg-overlay shadow-[var(--shadow-xl)] lg:hidden
                data-[state=open]:animate-[cadabry-drawer-in_var(--duration-base)_var(--ease-out)]"
            >
              <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Projects, library, and account.
              </DialogPrimitive.Description>
              <DialogPrimitive.Close
                aria-label="Close navigation"
                className="press absolute right-2 top-2.5 z-10 grid h-8 w-8 place-items-center
                  rounded-lg text-subtle transition-colors hover:bg-surface-raised
                  hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
              <Sidebar {...sidebarProps} collapsed={false} variant="drawer" onNavigate={closeDrawer} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

        <CommandMenu
          open={commandOpen}
          onOpenChange={setCommandOpen}
          projects={projects as CommandProject[]}
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
