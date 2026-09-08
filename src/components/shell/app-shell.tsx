"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Sidebar } from "./sidebar";
import { QuickCapture } from "./quick-capture";

type AppShellProps = {
  children: React.ReactNode;
  userDisplayName: string;
};

export function AppShell({ children, userDisplayName }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-overlay bg-ink-950/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-raised flex w-60 flex-col transition-transform duration-base ease-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onQuickCapture={() => { setCaptureOpen(true); setSidebarOpen(false); }} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--header-h)] items-center justify-between border-b border-line bg-background px-[var(--gutter)] md:px-[var(--gutter-lg)]">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-raised hover:text-foreground md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>

          <span className="text-lg font-semibold tracking-tight text-accent md:hidden">
            Cadabry
          </span>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">{userDisplayName}</span>
            <a
              href="/logout"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
              aria-label="Sign out"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </a>
          </div>
        </header>

        <main id="main" className="flex-1 overflow-auto p-[var(--gutter)] md:p-[var(--gutter-lg)]">
          {children}
        </main>
      </div>

      {/* Quick Capture dialog */}
      <QuickCapture open={captureOpen} onOpenChange={setCaptureOpen} />
    </div>
  );
}
