"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { LayoutList, Orbit, Plus, Sparkles } from "lucide-react";
import { StarField } from "./star-field";
import { ProjectNode, type UniverseProject } from "./project-node";
import { ConstellationLines } from "./constellation-lines";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/page";
import { FilterBar } from "@/components/ui/filter-bar";
import { Tooltip } from "@/components/ui/menu";
import { PROJECT_STATUS_ORDER, projectStatus } from "@/features/projects/display";

const VIEW_KEY = "cadabry:universe-view";

type View = "map" | "list";

/**
 * The stored view preference, read through useSyncExternalStore.
 *
 * This is browser state that React does not own, so subscribing to it is the
 * correct model — and it gives us a server snapshot for free, which keeps the
 * first paint identical on both sides of hydration.
 */
const viewStore = {
  subscribe(onChange: () => void) {
    window.addEventListener("cadabry:view", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cadabry:view", onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  get(): View {
    try {
      const stored = localStorage.getItem(VIEW_KEY);
      return stored === "list" ? "list" : "map";
    } catch {
      // Storage can be unavailable (private mode); the default view is fine.
      return "map";
    }
  },
  set(next: View) {
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Non-fatal: the preference just won't persist.
    }
    window.dispatchEvent(new Event("cadabry:view"));
  },
};

export function Universe({ projects }: { projects: UniverseProject[] }) {
  const view = useSyncExternalStore(
    viewStore.subscribe,
    viewStore.get,
    () => "map" as View,
  );
  const [filter, setFilter] = useState("ALL");

  const changeView = viewStore.set;

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) map.set(p.status, (map.get(p.status) ?? 0) + 1);
    return map;
  }, [projects]);

  const filters = useMemo(
    () => [
      { value: "ALL", label: "All", count: projects.length },
      ...PROJECT_STATUS_ORDER.filter((s) => counts.get(s)).map((s) => ({
        value: s,
        label: projectStatus(s).label,
        count: counts.get(s),
      })),
    ],
    [counts, projects.length],
  );

  const matching = useMemo(
    () => projects.filter((p) => filter === "ALL" || p.status === filter),
    [projects, filter],
  );

  // The field grows with the constellation. A fixed 620px of sky around four
  // projects reads as empty rather than spacious.
  const fieldHeight = Math.min(660, 380 + projects.length * 34);

  if (projects.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-line">
        <StarField />
        <div className="relative px-6 py-8">
          <EmptyState
            icon={<Sparkles className="h-5 w-5" />}
            title="Your universe is empty"
            description="Create a project and it becomes a star here — brighter while you build, dimmer as it goes quiet."
            action={
              <Button asChild variant="primary" size="lg">
                <Link href="/projects/new">
                  <Plus className="h-4 w-4" />
                  Create your first project
                </Link>
              </Button>
            }
            className="border-transparent bg-transparent"
          />
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Project universe" className="relative">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterBar
          options={filters}
          value={filter}
          onValueChange={setFilter}
          label="Filter projects by status"
        />

        {/*
          Below md the map collapses to a list regardless of preference, so the
          toggle would offer a choice that has no effect. Hide it there.
        */}
        <div
          className="hidden items-center gap-1 rounded-full border border-line bg-surface/70 p-1 md:inline-flex"
          role="group"
          aria-label="View"
        >
          <Tooltip content="Star map">
            <button
              type="button"
              onClick={() => changeView("map")}
              aria-pressed={view === "map"}
              className="press inline-flex h-8 w-8 items-center justify-center rounded-full text-muted
                transition-colors hover:text-foreground aria-pressed:bg-cobalt-500/18
                aria-pressed:text-cobalt-300"
            >
              <Orbit className="h-4 w-4" />
              <span className="sr-only">Star map view</span>
            </button>
          </Tooltip>
          <Tooltip content="List">
            <button
              type="button"
              onClick={() => changeView("list")}
              aria-pressed={view === "list"}
              className="press inline-flex h-8 w-8 items-center justify-center rounded-full text-muted
                transition-colors hover:text-foreground aria-pressed:bg-cobalt-500/18
                aria-pressed:text-cobalt-300"
            >
              <LayoutList className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        className={
          view === "map"
            ? "relative overflow-hidden rounded-3xl border border-line"
            : "relative"
        }
      >
        {view === "map" && <StarField />}

        <div className={view === "map" ? "relative p-4 md:p-8" : ""}>
          {/*
            One list, two presentations. The DOM never changes between views,
            so tab order and the announced item count stay stable.
          */}
          <div className="relative">
            {view === "map" && <ConstellationLines projects={projects} />}
            <ul
              className="universe"
              data-view={view}
              style={
                view === "map"
                  ? ({ "--field-height": `${fieldHeight}px` } as React.CSSProperties)
                  : undefined
              }
            >
              {projects.map((project, i) => (
                <ProjectNode
                  key={project.id}
                  project={project}
                  index={i}
                  total={projects.length}
                  dimmed={filter !== "ALL" && project.status !== filter}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {matching.length} of {projects.length} projects match the current filter.
      </p>

      {matching.length === 0 && (
        <p className="mt-4 text-center text-caption text-subtle">
          No {projectStatus(filter).label.toLowerCase()} projects. The rest of your universe is
          dimmed, not gone.
        </p>
      )}
    </section>
  );
}
