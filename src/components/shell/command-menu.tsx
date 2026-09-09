"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Archive,
  BookOpen,
  Bug,
  FileText,
  GitBranch,
  Inbox,
  Layers,
  LogOut,
  Lightbulb,
  Orbit,
  PlayCircle,
  Plus,
  Settings,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Kbd } from "@/components/ui/badge";
import { projectStatus } from "@/features/projects/display";
import { logout } from "@/features/auth/actions";

export type CommandProject = { id: string; name: string; slug: string; status: string };

/** Sections available inside every project, mirrored from the project nav. */
const PROJECT_SECTIONS = [
  { path: "resume", label: "Resume Building", icon: PlayCircle },
  { path: "features", label: "Features", icon: Sparkles },
  { path: "queue", label: "Prompt Queue", icon: Layers },
  { path: "bugs", label: "Bugs", icon: Bug },
  { path: "decisions", label: "Decisions", icon: GitBranch },
  { path: "milestones", label: "Milestones", icon: Orbit },
  { path: "notes", label: "Notes", icon: FileText },
  { path: "sessions", label: "Sessions", icon: Terminal },
  { path: "commands", label: "Commands", icon: Terminal },
  { path: "env", label: "Environment", icon: Settings },
  { path: "inspirations", label: "Inspiration", icon: Lightbulb },
  { path: "timeline", label: "Timeline", icon: GitBranch },
  { path: "export", label: "Export", icon: FileText },
  { path: "edit", label: "Edit project", icon: Settings },
];

const GLOBAL_PAGES = [
  { href: "/", label: "Universe", icon: Orbit },
  { href: "/prompts", label: "Prompt Library", icon: FileText },
  { href: "/packs", label: "Context Packs", icon: Layers },
  { href: "/skills", label: "Skills", icon: BookOpen },
  { href: "/inbox", label: "Idea Inbox", icon: Inbox },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/settings", label: "Settings", icon: Settings },
];

/**
 * ⌘K navigation. The sidebar covers the same ground by pointing; this is the
 * fast path for people who already know where they are going, so it has to
 * cover every destination, not just search.
 */
export function CommandMenu({
  open,
  onOpenChange,
  projects,
  onQuickCapture,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: CommandProject[];
  onQuickCapture: () => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Reset the query as part of closing rather than in an effect watching
  // `open` — the close is the event, so that's where the state belongs.
  const setOpen = useCallback(
    (next: boolean) => {
      if (!next) setSearch("");
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [setOpen, router],
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-(--z-overlay) bg-veil backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-label="Command menu"
          className="fixed left-1/2 top-[12vh] z-(--z-command) w-[calc(100vw-2rem)] max-w-xl
            -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong bg-overlay
            shadow-[var(--shadow-xl)]
            data-[state=open]:animate-[cadabry-scale-in_var(--duration-base)_var(--ease-out)]"
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search projects, sections, and actions.
          </DialogPrimitive.Description>

          <Command loop className="flex max-h-[65vh] flex-col">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Jump to a project, section, or action…"
                className="h-13 w-full bg-transparent py-4 text-body text-foreground
                  placeholder:text-ink-300 focus:outline-none"
              />
              <Kbd className="hidden sm:inline-flex">esc</Kbd>
            </div>

            <Command.List className="flex-1 overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="px-3 py-8 text-center text-caption text-subtle">
                Nothing matches “{search}”.
              </Command.Empty>

              <Group heading="Actions">
                <Item
                  onSelect={() => {
                    setOpen(false);
                    onQuickCapture();
                  }}
                  icon={<Plus className="h-4 w-4" />}
                  label="Capture a thought"
                  hint="C"
                />
                <Item
                  onSelect={() => go("/projects/new")}
                  icon={<Plus className="h-4 w-4" />}
                  label="New project"
                />
              </Group>

              {projects.length > 0 && (
                <Group heading="Projects">
                  {projects.map((project) => {
                    const meta = projectStatus(project.status);
                    return (
                      <Item
                        key={project.id}
                        value={`project ${project.name} ${project.slug}`}
                        onSelect={() => go(`/${project.slug}`)}
                        icon={
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: meta.hue }}
                            aria-hidden="true"
                          />
                        }
                        label={project.name}
                        hint={meta.label}
                      />
                    );
                  })}
                </Group>
              )}

              {/*
                Project sections are only listed once you've typed something —
                otherwise 14 sections × N projects would bury everything else.
              */}
              {search.length > 0 &&
                projects.map((project) => (
                  <Group key={project.id} heading={`${project.name} · sections`}>
                    {PROJECT_SECTIONS.map((section) => (
                      <Item
                        key={section.path}
                        value={`${project.name} ${section.label} ${project.slug}/${section.path}`}
                        onSelect={() => go(`/${project.slug}/${section.path}`)}
                        icon={<section.icon className="h-4 w-4" />}
                        label={section.label}
                        hint={project.name}
                      />
                    ))}
                  </Group>
                ))}

              <Group heading="Go to">
                {GLOBAL_PAGES.map((page) => (
                  <Item
                    key={page.href}
                    onSelect={() => go(page.href)}
                    icon={<page.icon className="h-4 w-4" />}
                    label={page.label}
                  />
                ))}
                <Item
                  onSelect={() => {
                    setOpen(false);
                    void logout();
                  }}
                  icon={<LogOut className="h-4 w-4" />}
                  label="Sign out"
                />
              </Group>
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      // `eyebrow` is a component class, not a utility, so it can't ride an
      // arbitrary variant — the heading styles are spelled out instead.
      className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1
        [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-micro
        [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase
        [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-subtle"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  onSelect,
  icon,
  label,
  hint,
  value,
}: {
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value?: string;
}) {
  return (
    <Command.Item
      value={value ?? label}
      onSelect={onSelect}
      className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-2.5 py-2.5
        text-body text-ink-100 data-[selected=true]:bg-cobalt-500/16
        data-[selected=true]:text-foreground"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-subtle">
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {hint && <span className="shrink-0 text-micro text-subtle">{hint}</span>}
    </Command.Item>
  );
}
