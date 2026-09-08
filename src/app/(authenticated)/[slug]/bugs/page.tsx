import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Bug as BugIcon } from "lucide-react";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/server/auth/session";
import { db } from "@/server/db";
import { requireActor } from "@/features/projects/queries";
import { Button } from "@/components/ui/button";
import { BareInput, Field, SelectField, TextField } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { DataList, EmptyState, Row, Stack } from "@/components/ui/page";
import { CreateDisclosure, FormGrid, RowActions, RowButton } from "@/components/ui/disclosure";
import { workStatus } from "@/features/projects/display";

type Props = { params: Promise<{ slug: string }> };

export default async function BugsPage({ params }: Props) {
  const actor = await requireActor();
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { ownerId_slug: { ownerId: actor.userId, slug } },
    include: { bugs: { orderBy: [{ severity: "desc" }, { updatedAt: "desc" }] } },
  });
  if (!project) notFound();

  async function addBug(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const title = (formData.get("title") as string).trim();
    const symptoms = (formData.get("symptoms") as string).trim();
    const reproduction = (formData.get("reproduction") as string).trim();
    const expected = (formData.get("expected") as string).trim();
    const actual = (formData.get("actual") as string).trim();
    const severity = Math.min(5, Math.max(0, parseInt(formData.get("severity") as string, 10) || 1));

    if (!title) redirect(`/${slug}/bugs?error=Title+required`);

    await db.bug.create({
      data: {
        ownerId: actor.userId,
        projectId: project!.id,
        title,
        symptoms: symptoms || null,
        reproduction: reproduction || null,
        expectedBehavior: expected || null,
        actualBehavior: actual || null,
        severity,
        status: "ACTIVE",
      },
    });

    await db.activity.create({
      data: {
        ownerId: actor.userId,
        actorUserId: actor.userId,
        projectId: project!.id,
        type: "BUG_CREATED",
        subjectKind: "BUG",
        summary: `Bug: ${title.slice(0, 80)}`,
      },
    });

    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

    redirect(`/${slug}/bugs`);
  }

  async function resolveOrReopen(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
    if (!token) redirect("/login");
    const actor = await verifySessionToken(token);
    if (!actor) redirect("/login");

    const id = formData.get("id") as string;
    const action = formData.get("action") as string;
    const resolution = (formData.get("resolution") as string).trim();

    const bug = await db.bug.findFirst({ where: { id, ownerId: actor.userId } });
    if (!bug) redirect(`/${slug}/bugs`);
    const bugNonNull = bug;

    if (action === "resolve") {
      await db.bug.update({
        where: { id: bugNonNull.id },
        data: { status: "RESOLVED", resolution: resolution || bugNonNull.resolution, rootCause: resolution || bugNonNull.rootCause },
      });
      await db.activity.create({
        data: {
          ownerId: actor.userId,
          actorUserId: actor.userId,
          projectId: project!.id,
          type: "BUG_RESOLVED",
          subjectKind: "BUG",
          summary: `Resolved: ${bugNonNull.title.slice(0, 80)}`,
        },
      });
    } else if (action === "reopen") {
      await db.bug.update({ where: { id: bugNonNull.id }, data: { status: "ACTIVE" } });
    }

    await db.project.update({ where: { id: project!.id }, data: { lastActivityAt: new Date() } });

    redirect(`/${slug}/bugs`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-2 text-foreground">Bugs &amp; debugging memory</h2>
        <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
          Track what broke, and record how it was fixed. The resolution is the part
          that stops you debugging the same thing twice.
        </p>
      </div>

      <CreateDisclosure label="Report a bug">
        <form action={addBug} className="space-y-4">
          <Field
            label="Title"
            name="title"
            type="text"
            placeholder="Auth redirect fails on Safari"
            required
          />
          <TextField label="Symptoms" name="symptoms" rows={2} placeholder="What goes wrong?" />
          <TextField
            label="Reproduction steps"
            name="reproduction"
            rows={2}
            placeholder="1. Open on Safari  2. Sign in  3. …"
          />
          <FormGrid>
            <Field
              label="Expected"
              name="expected"
              type="text"
              placeholder="Redirects to the dashboard"
            />
            <Field
              label="Actual"
              name="actual"
              type="text"
              placeholder="Bounces back to login"
            />
          </FormGrid>
          <SelectField label="Severity" name="severity" defaultValue="1">
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>
                {s} — {s >= 4 ? "critical" : s === 3 ? "major" : "minor"}
              </option>
            ))}
          </SelectField>
          <Button type="submit" variant="primary">
            Report bug
          </Button>
        </form>
      </CreateDisclosure>

      {project.bugs.length === 0 ? (
        <EmptyState
          icon={<BugIcon className="h-5 w-5" />}
          title="Nothing broken"
          description="No bugs tracked on this project. Keep it that way."
        />
      ) : (
        <Stack>
          {project.bugs.map((bug) => {
            const meta = workStatus(bug.status);
            const open = bug.status !== "RESOLVED" && bug.status !== "ARCHIVED";
            return (
              <Row key={bug.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-title-3 text-foreground">{bug.title}</h3>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  {bug.severity >= 4 && <Badge tone="danger">Severity {bug.severity}</Badge>}
                </div>

                {bug.symptoms && (
                  <p className="mt-1.5 max-w-(--reading-max) text-body text-muted">
                    {bug.symptoms}
                  </p>
                )}

                <DataList
                  className="mt-3"
                  items={[
                    { label: "Expected", value: bug.expectedBehavior },
                    { label: "Actual", value: bug.actualBehavior },
                    { label: "Reproduce", value: bug.reproduction },
                  ]}
                />

                {bug.status === "RESOLVED" && bug.resolution && (
                  <p className="mt-3 rounded-xl border border-success/25 bg-success/8 px-3.5 py-2.5 text-caption text-success">
                    <span className="font-semibold">Fixed · </span>
                    {bug.resolution}
                  </p>
                )}

                {open ? (
                  <form action={resolveOrReopen} className="mt-4 flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={bug.id} />
                    <label htmlFor={`resolution-${bug.id}`} className="sr-only">
                      How {bug.title} was fixed
                    </label>
                    <BareInput
                      id={`resolution-${bug.id}`}
                      name="resolution"
                      placeholder="Root cause and fix…"
                      className="h-9 min-w-0 flex-1 text-caption"
                    />
                    <RowButton name="action" value="resolve" tone="success">
                      Resolve
                    </RowButton>
                  </form>
                ) : bug.status === "RESOLVED" ? (
                  <form action={resolveOrReopen}>
                    <input type="hidden" name="id" value={bug.id} />
                    <RowActions>
                      <RowButton name="action" value="reopen">
                        Reopen
                      </RowButton>
                    </RowActions>
                  </form>
                ) : null}
              </Row>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
