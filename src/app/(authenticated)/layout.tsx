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

  const projects = await db.project.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    select: { id: true, name: true },
    orderBy: { lastActivityAt: "desc" },
    take: 50,
  });

  return (
    <AppShell userDisplayName={actor.displayName} projects={projects}>
      {children}
    </AppShell>
  );
}
