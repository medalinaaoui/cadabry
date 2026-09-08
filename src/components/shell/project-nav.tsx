"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export type NavSection = { path: string; label: string; count?: number };

/**
 * Horizontal section nav for a project. Scrolls rather than wraps so the
 * project header keeps a fixed height as you move between sections.
 */
export function ProjectNav({ slug, sections }: { slug: string; sections: NavSection[] }) {
  const pathname = usePathname();
  const base = `/${slug}`;

  return (
    <nav aria-label="Project sections" className="-mx-1 mt-5 overflow-x-auto pb-1">
      <ul className="flex w-max items-center gap-0.5 px-1">
        {sections.map((section) => {
          const href = section.path ? `${base}/${section.path}` : base;
          const active = section.path
            ? pathname === href || pathname.startsWith(`${href}/`)
            : pathname === base;

          return (
            <li key={section.path}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3",
                  "text-caption font-semibold transition-colors duration-(--duration-fast)",
                  active
                    ? "bg-cobalt-500/18 text-cobalt-300"
                    : "text-muted hover:bg-surface-raised hover:text-foreground",
                )}
              >
                {section.label}
                {section.count ? (
                  <span className="tabular text-micro text-subtle">{section.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
