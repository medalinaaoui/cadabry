import "server-only";

import { db } from "@/server/db";

/** Segments that belong to the app, not to a project. */
export const RESERVED_SLUGS = new Set([
  "archive",
  "inbox",
  "login",
  "logout",
  "packs",
  "projects",
  "prompts",
  "settings",
  "setup",
  "skills",
  "starter",
  "api",
]);

export function slugify(text: string): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100) || "untitled";
  // A project called "Archive" must not shadow /archive.
  return RESERVED_SLUGS.has(base) ? `${base}-project` : base;
}

/** A slug that is free for this owner, suffixing -2, -3… when it isn't. */
export async function uniqueSlug(ownerId: string, desired: string): Promise<string> {
  const base = slugify(desired);
  const taken = await db.project.findMany({
    where: { ownerId, slug: { startsWith: base } },
    select: { slug: true },
  });
  const used = new Set(taken.map((row) => row.slug));
  if (!used.has(base)) return base;
  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${base}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}
