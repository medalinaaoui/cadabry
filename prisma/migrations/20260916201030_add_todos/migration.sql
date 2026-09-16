-- CreateTable
CREATE TABLE "todos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "todos_owner_id_project_id_done_sort_order_idx" ON "todos"("owner_id", "project_id", "done", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "todos_owner_id_id_key" ON "todos"("owner_id", "id");

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;
