import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Check, ListChecks } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Row, Stack } from "@/components/ui/page";
import { RecordControls } from "@/components/ui/record-controls";
import { cn } from "@/lib/cn";
import {
  deleteTodoRecord,
  toggleTodoRecord,
  updateTodoRecord,
} from "@/features/projects/record-actions";

type Props = { params: Promise<{ slug: string }> };

export default async function TodosPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { todos: { orderBy: [{ done: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] } },
  });
  if (!project) notFound();

  const open = project.todos.filter((t) => !t.done);
  const done = project.todos.filter((t) => t.done);

  async function addTodo(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    if (!title) redirect(`/${slug}/todos?error=Title+required`);

    const last = await db.todo.findFirst({
      where: { ownerId: actor.userId, projectId: project!.id },
      orderBy: { sortOrder: "desc" },
    });

    await db.todo.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        title,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });
    redirect(`/${slug}/todos`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">To-Dos</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          The things this project needs done that aren&apos;t a prompt or a feature spec —
          a tutorial video, a domain to buy, an account to set up.
        </p>
      </div>

      <form action={addTodo} className="flex gap-2">
        <div className="flex-1">
          <Field label="Add a to-do" labelHidden name="title" placeholder="Record the tutorial YouTube video" required />
        </div>
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>

      {project.todos.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="h-5 w-5" />}
          title="Nothing to do yet"
          description="Add the small stuff you'd otherwise forget between coding sessions."
        />
      ) : (
        <div className="space-y-5">
          <Stack className="space-y-2">
            {open.map((todo) => (
              <TodoRow key={todo.id} todo={todo} />
            ))}
          </Stack>

          {done.length > 0 && (
            <div>
              <p className="eyebrow mb-2">Done ({done.length})</p>
              <Stack className="space-y-2">
                {done.map((todo) => (
                  <TodoRow key={todo.id} todo={todo} />
                ))}
              </Stack>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TodoRow({
  todo,
}: {
  todo: { id: string; title: string; note: string | null; done: boolean };
}) {
  return (
    <Row className="p-3.5">
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
          <p className={cn("text-body", todo.done ? "text-subtle line-through" : "text-foreground")}>
            {todo.title}
          </p>
          {todo.note && <p className="mt-1 text-caption text-muted">{todo.note}</p>}

          <RecordControls id={todo.id} name={todo.title} editAction={updateTodoRecord} deleteAction={deleteTodoRecord}>
            <Field label="Title" name="title" defaultValue={todo.title} required />
            <Field label="Note" name="note" defaultValue={todo.note ?? ""} />
          </RecordControls>
        </div>

        {todo.done && <Badge tone="success">Done</Badge>}
      </div>
    </Row>
  );
}
