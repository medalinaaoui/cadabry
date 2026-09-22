import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { Check, ListChecks } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, PageShell, Row, Stack } from "@/components/ui/page";
import { FormGrid } from "@/components/ui/disclosure";
import { RecordControls } from "@/components/ui/record-controls";
import { cn } from "@/lib/cn";
import {
  deleteTodoRecord,
  toggleTodoRecord,
  updateTodoRecord,
} from "@/features/projects/record-actions";

export const metadata = { title: "To-Dos" };

const STATUS_FILTERS = [
  { value: "open", label: "Open" },
  { value: "done", label: "Done" },
  { value: "all", label: "All" },
] as const;

export default async function TodosLibrary({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; project?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!token) redirect("/login");

  const actor = await verifySessionToken(token);
  if (!actor) redirect("/login");

  const { status: rawStatus, project: projectId } = await searchParams;
  const status = STATUS_FILTERS.some((s) => s.value === rawStatus) ? rawStatus! : "open";

  const projects = await db.project.findMany({
    where: { ownerId: actor.userId, archivedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const todos = await db.todo.findMany({
    where: {
      ownerId: actor.userId,
      ...(status === "open" ? { done: false } : {}),
      ...(status === "done" ? { done: true } : {}),
      ...(projectId ? { projectId } : {}),
    },
    include: { project: { select: { name: true, slug: true } } },
    orderBy: [{ done: "asc" }, { createdAt: "desc" }],
    take: 300,
  });

  async function createTodo(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const note = (formData.get("note") as string).trim();
    const projectId = (formData.get("projectId") as string) || "";
    if (!title || !projectId) redirect("/todos?error=Title+and+project+are+required");

    const project = await db.project.findFirst({
      where: { id: projectId, ownerId: actor.userId },
    });
    if (!project) redirect("/todos?error=Project+not+found");

    const last = await db.todo.findFirst({
      where: { ownerId: actor.userId, projectId },
      orderBy: { sortOrder: "desc" },
    });

    await db.todo.create({
      data: {
        ownerId: actor.userId,
        projectId,
        title,
        note: note || null,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    redirect("/todos");
  }

  return (
    <PageShell>
      <PageHeader
        title="To-Dos"
        description="Everything left to do across every project that isn't a prompt or a feature spec — one list, sortable by project."
      />

      <form action={createTodo} className="mb-6 space-y-4 rounded-2xl border border-line bg-surface p-4">
        <FormGrid>
          <Field label="To-do" name="title" placeholder="Record the tutorial YouTube video" required />
          <SelectField label="Project" name="projectId" defaultValue="" required>
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectField>
        </FormGrid>
        <TextField
          label="Description"
          labelHidden
          name="note"
          rows={3}
          placeholder="Optional — add more context (script outline, links, notes…)"
        />
        <Button type="submit" variant="primary">
          Add to-do
        </Button>
      </form>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => {
            const active = s.value === status;
            const params = new URLSearchParams();
            if (s.value !== "open") params.set("status", s.value);
            if (projectId) params.set("project", projectId);
            const query = params.toString();
            return (
              <Link
                key={s.value}
                href={query ? `/todos?${query}` : "/todos"}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "press inline-flex h-8 items-center rounded-full px-3 text-caption font-semibold",
                  "transition-colors duration-(--duration-fast)",
                  active
                    ? "bg-cobalt-500/18 text-cobalt-300"
                    : "border border-line text-muted hover:bg-surface-raised hover:text-foreground",
                )}
              >
                {s.label}
              </Link>
            );
          })}
        </div>

        <form method="get" className="flex items-center gap-2">
          {status !== "open" && <input type="hidden" name="status" value={status} />}
          <SelectField
            label="Project"
            labelHidden
            name="project"
            defaultValue={projectId ?? ""}
            className="min-w-44"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectField>
          <Button type="submit">Filter</Button>
          {projectId && (
            <Button asChild variant="ghost">
              <Link href={status !== "open" ? `/todos?status=${status}` : "/todos"}>Clear</Link>
            </Button>
          )}
        </form>
      </div>

      {todos.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-5 w-5" />}
          title={projectId || status !== "open" ? "No to-dos match" : "No to-dos yet"}
          description={
            projectId || status !== "open"
              ? "Try a different filter."
              : "Add the small stuff you'd otherwise forget between coding sessions."
          }
        />
      ) : (
        <Stack className="space-y-2">
          {todos.map((todo) => (
            <Row key={todo.id} className="p-3.5">
              <div className="flex items-start gap-3">
                <form action={toggleTodoRecord} className="shrink-0">
                  <input type="hidden" name="id" value={todo.id} />
                  <button
                    type="submit"
                    aria-label={todo.done ? "Mark not done" : "Mark done"}
                    className={cn(
                      "press mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                      todo.done
                        ? "border-success/50 bg-success/15 text-success"
                        : "border-line text-transparent hover:border-line-strong",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </form>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn("text-body", todo.done ? "text-subtle line-through" : "text-foreground")}>
                      {todo.title}
                    </p>
                    <Link href={`/${todo.project.slug}/todos`}>
                      <Badge tone="quiet">{todo.project.name}</Badge>
                    </Link>
                  </div>
                  {todo.note && (
                    <p className="mt-1 whitespace-pre-wrap text-caption text-muted">{todo.note}</p>
                  )}

                  <RecordControls id={todo.id} name={todo.title} editAction={updateTodoRecord} deleteAction={deleteTodoRecord}>
                    <Field label="Title" name="title" defaultValue={todo.title} required />
                    <TextField label="Description" name="note" rows={4} defaultValue={todo.note ?? ""} />
                  </RecordControls>
                </div>

                {todo.done && <Badge tone="success">Done</Badge>}
              </div>
            </Row>
          ))}
        </Stack>
      )}
    </PageShell>
  );
}
