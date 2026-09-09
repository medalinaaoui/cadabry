import { notFound } from "next/navigation";
import { History } from "lucide-react";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { EmptyState } from "@/components/ui/page";
import { Field } from "@/components/ui/field";
import { RecordControls } from "@/components/ui/record-controls";
import { deleteActivityRecord, updateActivityRecord } from "@/features/projects/record-actions";
import { humanize } from "@/features/projects/display";

type Props = { params: Promise<{ slug: string }> };

/** Same colour language as the rest of the app: gold acts, green completes. */
const TYPE_HUE: Record<string, string> = {
  PROJECT_CREATED: "var(--cobalt-400)",
  FEATURE_CREATED: "var(--cobalt-400)",
  FEATURE_COMPLETED: "var(--success-500)",
  PROMPT_CREATED: "var(--gold-400)",
  PROMPT_USED: "var(--gold-400)",
  BUG_CREATED: "var(--danger-500)",
  BUG_RESOLVED: "var(--success-500)",
  DECISION_CREATED: "var(--cobalt-400)",
  SESSION_COMPLETED: "var(--gold-400)",
  MILESTONE_REACHED: "var(--success-500)",
  PROJECT_STATUS_CHANGED: "var(--gold-400)",
  THOUGHT_CAPTURED: "var(--cyan-400)",
};

export default async function TimelinePage({ params }: Props) {
  const actor = await requireActor();
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Timeline</h2>
        <p className="mt-1.5 text-body text-muted">
          What happened on this project, most recent first.
        </p>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          icon={<History className="h-5 w-5" />}
          title="Nothing recorded yet"
          description="Features shipped, bugs resolved and decisions made all land here automatically."
        />
      ) : (
        <div className="space-y-7">
          {groups.map((group) => (
            <section key={group.day}>
              <h3 className="eyebrow mb-3">{group.label}</h3>
              <ol className="space-y-3 border-l border-line pl-5">
                {group.items.map((item) => (
                  <li key={item.id} className="relative">
                    <span
                      className="absolute -left-[1.4rem] top-2 h-2 w-2 rounded-full ring-4 ring-background"
                      style={{ background: TYPE_HUE[item.type] ?? "var(--ink-500)" }}
                      aria-hidden="true"
                    />
                    <p className="text-body text-ink-100">{item.summary}</p>
                    <p className="mt-0.5 text-micro text-subtle">
                      <time dateTime={item.occurredAt.toISOString()}>
                        {item.occurredAt.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                      <span className="mx-1.5" aria-hidden="true">
                        ·
                      </span>
                      {humanize(item.type)}
                    </p>
                    <RecordControls
                      id={item.id}
                      name={item.summary}
                      editAction={updateActivityRecord}
                      deleteAction={deleteActivityRecord}
                    >
                      <Field label="Summary" name="summary" defaultValue={item.summary} required />
                    </RecordControls>
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
