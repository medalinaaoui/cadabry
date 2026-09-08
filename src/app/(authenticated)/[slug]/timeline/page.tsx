import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";

type Props = { params: Promise<{ slug: string }> };

const TYPE_DOT: Record<string, string> = {
  PROJECT_CREATED: "bg-cobalt-400",
  FEATURE_CREATED: "bg-cobalt-400",
  FEATURE_COMPLETED: "bg-success",
  PROMPT_CREATED: "bg-accent",
  PROMPT_USED: "bg-accent",
  BUG_CREATED: "bg-danger",
  BUG_RESOLVED: "bg-success",
  DECISION_CREATED: "bg-cobalt-400",
  SESSION_COMPLETED: "bg-accent",
  PROJECT_STATUS_CHANGED: "bg-gold-400",
  THOUGHT_CAPTURED: "bg-cyan",
};

export default async function TimelinePage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    select: { id: true, slug: true, name: true, createdAt: true },
  });
  if (!project) notFound();

  const activities = await db.activity.findMany({
    where: { ownerId: actor.userId, projectId: project.id },
    orderBy: [{ occurredAt: "desc" }, { id: "desc" }],
    take: 200,
  });

  // Group by day
  const groups: { day: string; label: string; items: typeof activities }[] = [];
  for (const activity of activities) {
    const day = activity.occurredAt.toISOString().slice(0, 10);
    const last = groups[groups.length - 1];
    if (last && last.day === day) {
      last.items.push(activity);
    } else {
      groups.push({
        day,
        label: activity.occurredAt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        items: [activity],
      });
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href={`/${project.slug}`} className="text-sm text-muted transition-colors hover:text-foreground">
          ← {project.name}
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground">Timeline</h1>
      <p className="mt-1 text-sm text-muted">
        What happened in this project, in order.
      </p>

      {groups.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface py-16 text-center">
          <p className="text-sm text-muted">
            Nothing recorded yet. Actions you take will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <section key={group.day}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
                {group.label}
              </h2>
              <ol className="space-y-2 border-l border-line pl-4">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[item.type] ?? "bg-line"}`} />
                    <div>
                      <p className="text-foreground">{item.summary}</p>
                      <p className="text-xs text-subtle">
                        {item.occurredAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        <span className="text-muted"> · {item.type.replaceAll("_", " ").toLowerCase()}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
