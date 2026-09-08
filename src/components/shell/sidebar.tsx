"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderPlus, Zap, Settings, PlusCircle, FileText, Wand2, Package, Layers, BookOpen } from "lucide-react";
import { clsx } from "clsx";

type SidebarProps = {
  onQuickCapture?: () => void;
};

const navItems = [
  { href: "/", label: "Projects", icon: FolderPlus, exact: true },
  { href: "/prompts", label: "Prompts", icon: FileText, exact: false },
  { href: "/starter", label: "Starter Builder", icon: Wand2, exact: false },
  { href: "/packs", label: "Context Packs", icon: Layers, exact: false },
  { href: "/skills", label: "Skills", icon: BookOpen, exact: false },
  { href: "/inbox", label: "Inbox", icon: Package, exact: false },
];

export function Sidebar({ onQuickCapture }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-line bg-surface">
      {/* Desktop brand */}
      <div className="hidden border-b border-line px-4 py-3 md:block">
        <span className="text-lg font-semibold tracking-tight text-accent">Cadabry</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-cobalt-500/10 text-cobalt-400"
                  : "text-muted hover:bg-surface-raised hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="space-y-1.5 pt-3">
          <Link
            href="/projects/new"
            className="flex items-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong"
          >
            <PlusCircle className="h-4 w-4" />
            New Project
          </Link>

          {onQuickCapture && (
            <button
              type="button"
              onClick={onQuickCapture}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              <Zap className="h-4 w-4" />
              Quick Capture
            </button>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
