"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BookOpen,
  ChevronsRight,
  FileText,
  Inbox,
  Layers,
  LogOut,
  Orbit,
  Plus,
  Search,
  Settings,
  Wand2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CadabryMark } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { Kbd } from "@/components/ui/badge";
import { Tooltip, Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { projectStatus } from "@/features/projects/display";
import { logout } from "@/features/auth/actions";

export type SidebarProject = {
  id: string;
  name: string;
  slug: string;
  status: string;
  icon?: string | null;
  queuedCount?: number;
};

const LIBRARY = [
  { href: "/prompts", label: "Prompt Library", icon: FileText },
  { href: "/starter", label: "Starter Builder", icon: Wand2 },
  { href: "/packs", label: "Context Packs", icon: Layers },
  { href: "/skills", label: "Skills", icon: BookOpen },
];

/** Projects beyond this and the list gets a filter box of its own. */
const FILTER_THRESHOLD = 7;

/**
 * The permanent left rail. It replaces the old floating top bar because the
 * app is project-shaped: you spend the day moving between projects, and a
 * sidebar keeps every one of them one click away instead of one ⌘K away.
 *
 * Collapsed it becomes a 4.5rem icon rail — the same destinations, none of the
 * width. The choice rides in a cookie so the server renders the right width on
 * the first paint and the rail never snaps.
 */
export function Sidebar({
  userDisplayName,
  projects,
  archivedCount,
  collapsed,
  onToggleCollapsed,
  onOpenCommand,
  onOpenCapture,
  onNavigate,
  variant = "rail",
}: {
  userDisplayName: string;
  projects: SidebarProject[];
  archivedCount: number;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenCommand: () => void;
  onOpenCapture: () => void;
  /** Mobile drawer closes itself when a link is followed. */
  onNavigate?: () => void;
  variant?: "rail" | "drawer";
}) {
  const pathname = usePathname();
  const [filter, setFilter] = useState("");
  const isDrawer = variant === "drawer";
  const shrunk = collapsed && !isDrawer;

  const visibleProjects = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.slug.toLowerCase().includes(query),
    );
  }, [projects, filter]);

  const activeSlug = useMemo(() => {
    const first = pathname.split("/")[1] ?? "";
    return projects.some((project) => project.slug === first) ? first : null;
  }, [pathname, projects]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-1 p-2.5">
      {/* ---------------------------------------------------------- brand -- */}
      {/* The collapse control lives here, never in the footer: on a short
          viewport the footer can be pushed out of reach, and the one thing you
          must always be able to do is get the labels back. */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2",
          shrunk ? "flex-col justify-center" : "px-1",
        )}
      >
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="Cadabry — project universe"
          className="press flex min-w-0 items-center gap-2 rounded-lg py-1 transition-opacity hover:opacity-80"
        >
          <CadabryMark className="h-5 w-5 shrink-0 text-accent" />
          {!shrunk && (
            <span className="truncate font-(family-name:--font-display) text-title-3 font-semibold tracking-[-0.02em] text-foreground">
              Cadabry
            </span>
          )}
        </Link>
        {!shrunk && <div className="flex-1" />}
        {!isDrawer && <CollapseButton collapsed={collapsed} onToggle={onToggleCollapsed} />}
      </div>

      {/* --------------------------------------------------------- search -- */}
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onOpenCommand();
        }}
        className={cn(
          "press mt-1 flex h-9 shrink-0 items-center gap-2 rounded-xl border border-line bg-well",
          "text-caption text-subtle transition-colors hover:border-line-strong hover:text-muted",
          shrunk ? "w-11 justify-center self-center px-0" : "px-2.5",
        )}
        aria-label="Search and jump to"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        {!shrunk && (
          <>
            <span className="flex-1 text-left">Jump to…</span>
            <Kbd>⌘K</Kbd>
          </>
        )}
      </button>

      {/* ------------------------------------------------------- primary --- */}
      <nav aria-label="Primary" className="mt-2 shrink-0 space-y-0.5">
        <Item
          href="/"
          icon={Orbit}
          label="Universe"
          active={pathname === "/"}
          shrunk={shrunk}
          onNavigate={onNavigate}
        />
        <Item
          href="/inbox"
          icon={Inbox}
          label="Idea Inbox"
          active={pathname.startsWith("/inbox")}
          shrunk={shrunk}
          onNavigate={onNavigate}
        />
        <ActionItem
          icon={Zap}
          label="Capture a thought"
          hint="C"
          shrunk={shrunk}
          onClick={() => {
            onNavigate?.();
            onOpenCapture();
          }}
        />
      </nav>

      {/* -------------------------------------------------------- projects -- */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {shrunk ? (
          <div className="mx-auto mb-2 h-px w-6 bg-line" aria-hidden="true" />
        ) : (
          <div className="mb-1 flex items-center justify-between gap-2 px-2.5">
            <span className="eyebrow">Projects</span>
            <Tooltip content="New project" side="right">
              <Link
                href="/projects/new"
                onClick={onNavigate}
                aria-label="New project"
                className="press grid h-6 w-6 place-items-center rounded-md text-subtle
                  transition-colors hover:bg-surface-raised hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" />
              </Link>
            </Tooltip>
          </div>
        )}

        {!shrunk && projects.length >= FILTER_THRESHOLD && (
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter projects"
            aria-label="Filter projects"
            className="mb-1.5 h-8 w-full rounded-lg border border-line-subtle bg-well px-2.5
              text-caption text-foreground placeholder:text-ink-300 transition-colors
              hover:border-line focus:border-accent focus:outline-none"
          />
        )}

        <nav
          aria-label="Projects"
          className="-mr-1 min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain pr-1"
        >
          {visibleProjects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              active={activeSlug === project.slug}
              shrunk={shrunk}
              onNavigate={onNavigate}
            />
          ))}

          {visibleProjects.length === 0 && !shrunk && (
            <p className="px-2.5 py-2 text-caption text-subtle">
              {projects.length === 0 ? "No projects yet." : "Nothing matches that."}
            </p>
          )}

          {shrunk && (
            <Item
              href="/projects/new"
              icon={Plus}
              label="New project"
              active={pathname === "/projects/new"}
              shrunk
              onNavigate={onNavigate}
            />
          )}

        </nav>

        {/* Archive sits below the scroller, not inside it: with a dozen
            projects it would otherwise be permanently scrolled out of sight. */}
        {archivedCount > 0 && (
          <div className="mt-0.5 shrink-0">
            <Item
              href="/archive"
              icon={Archive}
              label="Archive"
              count={archivedCount}
              active={pathname.startsWith("/archive")}
              shrunk={shrunk}
              onNavigate={onNavigate}
              muted
            />
          </div>
        )}
      </div>

      {/* --------------------------------------------------------- library -- */}
      <div className="mt-3 shrink-0 border-t border-line-subtle pt-2">
        {!shrunk && <p className="eyebrow mb-1 px-2.5">Library</p>}
        <nav aria-label="Library" className="space-y-0.5">
          {LIBRARY.map((entry) => (
            <Item
              key={entry.href}
              href={entry.href}
              icon={entry.icon}
              label={entry.label}
              active={pathname.startsWith(entry.href)}
              shrunk={shrunk}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>

      {/* ---------------------------------------------------------- footer -- */}
      <div
        className={cn(
          "mt-2 flex shrink-0 items-center gap-1 border-t border-line-subtle pt-2",
          shrunk && "flex-col",
        )}
      >
        <Menu>
          <MenuTrigger asChild>
            <button
              type="button"
              aria-label={`Account: ${userDisplayName}`}
              className={cn(
                "press flex min-w-0 flex-1 items-center gap-2 rounded-xl px-1.5 py-1.5",
                "text-left transition-colors hover:bg-surface-raised",
                shrunk && "flex-none justify-center px-0",
              )}
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line
                  bg-surface-raised text-micro font-semibold text-ink-100"
              >
                {userDisplayName.slice(0, 1).toUpperCase()}
              </span>
              {!shrunk && (
                <span className="min-w-0 flex-1 truncate text-caption font-semibold text-ink-100">
                  {userDisplayName}
                </span>
              )}
            </button>
          </MenuTrigger>
          <MenuContent align="start" side="top">
            <MenuLabel>{userDisplayName}</MenuLabel>
            <MenuItem asChild>
              <Link href="/projects/new" onClick={onNavigate}>
                <Plus className="h-4 w-4 text-subtle" />
                New project
              </Link>
            </MenuItem>
            <MenuItem asChild>
              <Link href="/settings" onClick={onNavigate}>
                <Settings className="h-4 w-4 text-subtle" />
                Settings
              </Link>
            </MenuItem>
            {archivedCount > 0 && (
              <MenuItem asChild>
                <Link href="/archive" onClick={onNavigate}>
                  <Archive className="h-4 w-4 text-subtle" />
                  Archive
                  <span className="ml-auto tabular text-micro text-subtle">{archivedCount}</span>
                </Link>
              </MenuItem>
            )}
            <MenuSeparator />
            <MenuItem asChild>
              {/* A form POST, not a link: signing out should never be reachable
                  by a prefetch or a crawler. */}
              <form action={logout}>
                <button type="submit" className="flex w-full items-center gap-2.5">
                  <LogOut className="h-4 w-4 text-subtle" />
                  Sign out
                </button>
              </form>
            </MenuItem>
          </MenuContent>
        </Menu>

        <ThemeToggle className="h-8 w-8 shrink-0" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ parts -- */

const rowStyle =
  "press group relative flex h-9 items-center gap-2.5 rounded-xl text-caption font-medium " +
  "transition-colors duration-(--duration-fast)";

function rowTone(active: boolean, muted?: boolean) {
  if (active) return "bg-cobalt-500/16 text-cobalt-300";
  return muted
    ? "text-subtle hover:bg-surface-raised hover:text-muted"
    : "text-muted hover:bg-surface-raised hover:text-foreground";
}

/** The gold spine that marks the current destination. */
function ActiveMarker({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
    />
  );
}

function Item({
  href,
  icon: Icon,
  label,
  count,
  active,
  shrunk,
  muted,
  onNavigate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  count?: number;
  active: boolean;
  shrunk: boolean;
  muted?: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={shrunk ? label : undefined}
      className={cn(rowStyle, rowTone(active, muted), shrunk ? "w-11 justify-center" : "px-2.5")}
    >
      <ActiveMarker show={active && !shrunk} />
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!shrunk && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {count !== undefined && count > 0 && (
            <span className="tabular text-micro text-subtle">{count}</span>
          )}
        </>
      )}
    </Link>
  );

  if (!shrunk) return link;
  return (
    <Tooltip content={label} side="right">
      {link}
    </Tooltip>
  );
}

function ActionItem({
  icon: Icon,
  label,
  hint,
  shrunk,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  shrunk: boolean;
  onClick: () => void;
}) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-label={shrunk ? label : undefined}
      className={cn(rowStyle, rowTone(false), shrunk ? "w-11 justify-center" : "w-full px-2.5")}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!shrunk && (
        <>
          <span className="min-w-0 flex-1 truncate text-left">{label}</span>
          {hint && <Kbd>{hint}</Kbd>}
        </>
      )}
    </button>
  );

  if (!shrunk) return button;
  return (
    <Tooltip content={label} side="right">
      {button}
    </Tooltip>
  );
}

function ProjectItem({
  project,
  active,
  shrunk,
  onNavigate,
}: {
  project: SidebarProject;
  active: boolean;
  shrunk: boolean;
  onNavigate?: () => void;
}) {
  const meta = projectStatus(project.status);

  const link = (
    <Link
      href={`/${project.slug}`}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={shrunk ? `${project.name} — ${meta.label}` : undefined}
      className={cn(rowStyle, rowTone(active), shrunk ? "w-11 justify-center" : "px-2.5")}
    >
      <ActiveMarker show={active && !shrunk} />
      {shrunk ? (
        // Collapsed, a bare dot tells you nothing about *which* project this
        // is — so the rail shows the project's own mark, ringed in its status.
        <span
          aria-hidden="true"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-micro
            font-semibold uppercase text-ink-100"
          style={{
            borderColor: `color-mix(in oklab, ${meta.hue} 55%, transparent)`,
            background: `color-mix(in oklab, ${meta.hue} 14%, transparent)`,
          }}
        >
          {project.icon || project.name.slice(0, 1)}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: meta.hue, boxShadow: `0 0 8px -1px ${meta.hue}` }}
        />
      )}
      {!shrunk && (
        <>
          <span className="min-w-0 flex-1 truncate">{project.name}</span>
          {project.queuedCount ? (
            <span
              title={`${project.queuedCount} queued`}
              className="tabular rounded-full bg-cobalt-500/18 px-1.5 text-micro font-semibold text-cobalt-300"
            >
              {project.queuedCount}
            </span>
          ) : null}
        </>
      )}
    </Link>
  );

  if (!shrunk) return link;
  return (
    <Tooltip content={`${project.name} · ${meta.label}`} side="right">
      {link}
    </Tooltip>
  );
}

function CollapseButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <Tooltip content={collapsed ? "Expand sidebar (⌘\\)" : "Collapse sidebar (⌘\\)"} side="right">
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="press grid h-8 w-8 shrink-0 place-items-center rounded-lg text-subtle
          transition-colors hover:bg-surface-raised hover:text-foreground"
      >
        <ChevronsRight
          className={cn(
            "h-4 w-4 transition-transform duration-(--duration-base) ease-(--ease-out)",
            !collapsed && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
}
