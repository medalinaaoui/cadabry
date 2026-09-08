import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { AppShell } from "@/components/shell/app-shell";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;

  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  // Loaded once for the shell so the sidebar and the command menu can route
  // anywhere without a round trip on open.
  const [projects, archivedCount] = await Promise.all([
    db.project.findMany({
      where: { ownerId: actor.userId, archivedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        icon: true,
        _count: { select: { queueItems: { where: { status: "QUEUED" } } } },
      },
      orderBy: [{ lastActivityAt: "desc" }, { updatedAt: "desc" }],
      take: 50,
    }),
    db.project.count({ where: { ownerId: actor.userId, archivedAt: { not: null } } }),
  ]);

  // The rail's width preference is a cookie so the first server render already
  // has the right shape — no flash of a wide sidebar collapsing.
  const collapsed = cookieStore.get("cadabry:sidebar")?.value === "1";

  return (
    <AppShell
      userDisplayName={actor.displayName}
      projects={projects.map((project) => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        status: project.status,
        icon: project.icon,
        queuedCount: project._count.queueItems,
      }))}
      archivedCount={archivedCount}
      defaultCollapsed={collapsed}
    >
      {children}
    </AppShell>
  );
}
