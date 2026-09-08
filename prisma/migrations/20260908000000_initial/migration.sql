-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- UNAPPLIED: generated and reviewed offline; no database credentials were available.
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'USER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IDEA', 'PLANNING', 'BUILDING', 'BLOCKED', 'PAUSED', 'SHIPPED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BoundaryKind" AS ENUM ('GOAL', 'NON_GOAL', 'ASSUMPTION', 'CONSTRAINT', 'FUTURE_IDEA');

-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PromptStatus" AS ENUM ('DRAFT', 'READY', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('QUEUED', 'SENT', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MemoryStatus" AS ENUM ('INBOX', 'PLANNED', 'ACTIVE', 'RESOLVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'SUPERSEDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "InspirationKind" AS ENUM ('LINK', 'IMAGE', 'SCREENSHOT', 'VIDEO', 'TEXT', 'OTHER');

-- CreateEnum
CREATE TYPE "AttachmentStatus" AS ENUM ('PENDING', 'READY', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "disabled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_installation" (
    "key" TEXT NOT NULL DEFAULT 'primary',
    "owner_user_id" UUID,
    "setup_completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_installation_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_digest" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ,
    "user_agent_hash" TEXT,
    "ip_hash" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "one_line_description" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "project_type" TEXT,
    "repository_url" TEXT,
    "production_url" TEXT,
    "staging_url" TEXT,
    "local_folder_path" TEXT,
    "product_statement" TEXT,
    "problem" TEXT,
    "target_user" TEXT,
    "desired_outcome" TEXT,
    "value_proposition" TEXT,
    "what_works" TEXT,
    "partially_built" TEXT,
    "what_is_broken" TEXT,
    "current_blocker" TEXT,
    "current_task" TEXT,
    "next_task" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IDEA',
    "importance" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "health_override" TEXT,
    "last_activity_at" TIMESTAMPTZ,
    "archived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_technologies" (
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "version" TEXT,
    "note" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_technologies_pkey" PRIMARY KEY ("project_id","technology_id","category")
);

-- CreateTable
CREATE TABLE "project_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "project_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_boundaries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "kind" "BoundaryKind" NOT NULL,
    "content" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_boundaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorkStatus" NOT NULL DEFAULT 'PLANNED',
    "target_date" DATE,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "milestone_id" UUID,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "reason" TEXT,
    "acceptance_criteria" TEXT,
    "status" "WorkStatus" NOT NULL DEFAULT 'PLANNED',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "difficulty" INTEGER,
    "impact" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_dependencies" (
    "owner_id" UUID NOT NULL,
    "feature_id" UUID NOT NULL,
    "depends_on_feature_id" UUID NOT NULL,

    CONSTRAINT "feature_dependencies_pkey" PRIMARY KEY ("feature_id","depends_on_feature_id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID,
    "feature_id" UUID,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "status" "PromptStatus" NOT NULL DEFAULT 'DRAFT',
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "reusable" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "current_version_id" UUID,
    "last_used_at" TIMESTAMPTZ,
    "archived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "prompt_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "change_note" TEXT,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_queue_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "prompt_id" UUID NOT NULL,
    "prompt_version_id" UUID NOT NULL,
    "feature_id" UUID,
    "milestone_id" UUID,
    "idea_id" UUID,
    "bug_id" UUID,
    "status" "QueueStatus" NOT NULL DEFAULT 'QUEUED',
    "position" INTEGER NOT NULL,
    "sent_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "prompt_queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "builder_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "display_name" TEXT,
    "default_agent" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "builder_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "builder_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "builder_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "context_packs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "context_packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "context_pack_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "pack_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "context_pack_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "when_to_use" TEXT,
    "installation_instructions" TEXT,
    "command" TEXT,
    "url" TEXT,
    "agent_instructions" TEXT,
    "notes" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_project_types" (
    "owner_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "project_type" TEXT NOT NULL,

    CONSTRAINT "skill_project_types_pkey" PRIMARY KEY ("skill_id","project_type")
);

-- CreateTable
CREATE TABLE "skill_technologies" (
    "owner_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,

    CONSTRAINT "skill_technologies_pkey" PRIMARY KEY ("skill_id","technology_id")
);

-- CreateTable
CREATE TABLE "skill_use_cases" (
    "owner_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "use_case" TEXT NOT NULL,

    CONSTRAINT "skill_use_cases_pkey" PRIMARY KEY ("skill_id","use_case")
);

-- CreateTable
CREATE TABLE "stack_presets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stack_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stack_preset_technologies" (
    "owner_id" UUID NOT NULL,
    "preset_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "version" TEXT,
    "note" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stack_preset_technologies_pkey" PRIMARY KEY ("preset_id","technology_id","category")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "status" "MemoryStatus" NOT NULL DEFAULT 'INBOX',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "kind" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bugs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "feature_id" UUID,
    "coding_session_id" UUID,
    "title" TEXT NOT NULL,
    "symptoms" TEXT,
    "expected_behavior" TEXT,
    "actual_behavior" TEXT,
    "reproduction" TEXT,
    "suspected_cause" TEXT,
    "status" "MemoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "severity" INTEGER NOT NULL DEFAULT 0,
    "resolution" TEXT,
    "root_cause" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "coding_session_id" UUID,
    "superseded_by_id" UUID,
    "title" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reasoning" TEXT,
    "alternatives" TEXT,
    "affected_system" TEXT,
    "reversible" BOOLEAN NOT NULL DEFAULT true,
    "status" "DecisionStatus" NOT NULL DEFAULT 'PROPOSED',
    "decided_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "objective" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ,
    "notes" TEXT,
    "discoveries" TEXT,
    "what_changed" TEXT,
    "next_task" TEXT,

    CONSTRAINT "coding_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_session_prompts" (
    "owner_id" UUID NOT NULL,
    "coding_session_id" UUID NOT NULL,
    "prompt_id" UUID NOT NULL,

    CONSTRAINT "coding_session_prompts_pkey" PRIMARY KEY ("coding_session_id","prompt_id")
);

-- CreateTable
CREATE TABLE "coding_session_features" (
    "owner_id" UUID NOT NULL,
    "coding_session_id" UUID NOT NULL,
    "feature_id" UUID NOT NULL,

    CONSTRAINT "coding_session_features_pkey" PRIMARY KEY ("coding_session_id","feature_id")
);

-- CreateTable
CREATE TABLE "inspirations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID,
    "kind" "InspirationKind" NOT NULL,
    "title" TEXT NOT NULL,
    "canonical_url" TEXT,
    "text_snippet" TEXT,
    "note" TEXT,
    "inspired_detail" TEXT,
    "external_media_type" TEXT,
    "external_media_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inspirations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspiration_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "inspiration_id" UUID NOT NULL,
    "storage_key" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "checksum_sha256" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "status" "AttachmentStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspiration_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commands" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "command_text" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "environment_variables" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "environment" TEXT NOT NULL,
    "configured" BOOLEAN NOT NULL DEFAULT false,
    "acquisition_note" TEXT,
    "note" TEXT,

    CONSTRAINT "environment_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "project_id" UUID,
    "actor_user_id" UUID NOT NULL,
    "coding_session_id" UUID,
    "type" TEXT NOT NULL,
    "subject_kind" TEXT NOT NULL,
    "subject_id" UUID,
    "summary" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "correlation_id" TEXT,
    "occurred_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_installation_owner_user_id_key" ON "app_installation"("owner_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_token_digest_key" ON "auth_sessions"("token_digest");

-- CreateIndex
CREATE INDEX "auth_sessions_user_id_expires_at_idx" ON "auth_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "projects_owner_id_status_archived_at_idx" ON "projects"("owner_id", "status", "archived_at");

-- CreateIndex
CREATE UNIQUE INDEX "projects_owner_id_id_key" ON "projects"("owner_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_owner_id_slug_key" ON "projects"("owner_id", "slug");

-- CreateIndex
CREATE INDEX "technologies_owner_id_idx" ON "technologies"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_owner_id_id_key" ON "technologies"("owner_id", "id");

-- CreateIndex
CREATE INDEX "project_technologies_owner_id_technology_id_idx" ON "project_technologies"("owner_id", "technology_id");

-- CreateIndex
CREATE INDEX "project_rules_owner_id_project_id_enabled_idx" ON "project_rules"("owner_id", "project_id", "enabled");

-- CreateIndex
CREATE INDEX "project_boundaries_owner_id_project_id_kind_sort_order_idx" ON "project_boundaries"("owner_id", "project_id", "kind", "sort_order");

-- CreateIndex
CREATE INDEX "milestones_owner_id_project_id_status_idx" ON "milestones"("owner_id", "project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "milestones_owner_id_id_key" ON "milestones"("owner_id", "id");

-- CreateIndex
CREATE INDEX "features_owner_id_project_id_status_sort_order_idx" ON "features"("owner_id", "project_id", "status", "sort_order");

-- CreateIndex
CREATE INDEX "features_owner_id_milestone_id_idx" ON "features"("owner_id", "milestone_id");

-- CreateIndex
CREATE UNIQUE INDEX "features_owner_id_id_key" ON "features"("owner_id", "id");

-- CreateIndex
CREATE INDEX "feature_dependencies_owner_id_depends_on_feature_id_idx" ON "feature_dependencies"("owner_id", "depends_on_feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompts_current_version_id_key" ON "prompts"("current_version_id");

-- CreateIndex
CREATE INDEX "prompts_owner_id_project_id_status_idx" ON "prompts"("owner_id", "project_id", "status");

-- CreateIndex
CREATE INDEX "prompts_owner_id_feature_id_idx" ON "prompts"("owner_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompts_owner_id_id_key" ON "prompts"("owner_id", "id");

-- CreateIndex
CREATE INDEX "prompt_versions_owner_id_prompt_id_idx" ON "prompt_versions"("owner_id", "prompt_id");

-- CreateIndex
CREATE INDEX "prompt_versions_created_by_id_idx" ON "prompt_versions"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_versions_owner_id_id_key" ON "prompt_versions"("owner_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_versions_prompt_id_version_number_key" ON "prompt_versions"("prompt_id", "version_number");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_project_id_status_position_idx" ON "prompt_queue_items"("owner_id", "project_id", "status", "position");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_prompt_id_idx" ON "prompt_queue_items"("owner_id", "prompt_id");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_prompt_version_id_idx" ON "prompt_queue_items"("owner_id", "prompt_version_id");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_feature_id_idx" ON "prompt_queue_items"("owner_id", "feature_id");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_milestone_id_idx" ON "prompt_queue_items"("owner_id", "milestone_id");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_idea_id_idx" ON "prompt_queue_items"("owner_id", "idea_id");

-- CreateIndex
CREATE INDEX "prompt_queue_items_owner_id_bug_id_idx" ON "prompt_queue_items"("owner_id", "bug_id");

-- CreateIndex
CREATE UNIQUE INDEX "builder_profiles_owner_id_key" ON "builder_profiles"("owner_id");

-- CreateIndex
CREATE INDEX "builder_rules_owner_id_profile_id_enabled_idx" ON "builder_rules"("owner_id", "profile_id", "enabled");

-- CreateIndex
CREATE INDEX "context_packs_owner_id_project_id_archived_at_idx" ON "context_packs"("owner_id", "project_id", "archived_at");

-- CreateIndex
CREATE UNIQUE INDEX "context_packs_owner_id_id_key" ON "context_packs"("owner_id", "id");

-- CreateIndex
CREATE INDEX "context_pack_rules_owner_id_pack_id_enabled_sort_order_idx" ON "context_pack_rules"("owner_id", "pack_id", "enabled", "sort_order");

-- CreateIndex
CREATE INDEX "skills_owner_id_name_idx" ON "skills"("owner_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_owner_id_id_key" ON "skills"("owner_id", "id");

-- CreateIndex
CREATE INDEX "skill_technologies_owner_id_technology_id_idx" ON "skill_technologies"("owner_id", "technology_id");

-- CreateIndex
CREATE UNIQUE INDEX "stack_presets_owner_id_id_key" ON "stack_presets"("owner_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "stack_presets_owner_id_name_key" ON "stack_presets"("owner_id", "name");

-- CreateIndex
CREATE INDEX "stack_preset_technologies_owner_id_technology_id_idx" ON "stack_preset_technologies"("owner_id", "technology_id");

-- CreateIndex
CREATE INDEX "ideas_owner_id_project_id_status_idx" ON "ideas"("owner_id", "project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ideas_owner_id_id_key" ON "ideas"("owner_id", "id");

-- CreateIndex
CREATE INDEX "notes_owner_id_project_id_pinned_idx" ON "notes"("owner_id", "project_id", "pinned");

-- CreateIndex
CREATE UNIQUE INDEX "notes_owner_id_id_key" ON "notes"("owner_id", "id");

-- CreateIndex
CREATE INDEX "bugs_owner_id_project_id_status_severity_idx" ON "bugs"("owner_id", "project_id", "status", "severity");

-- CreateIndex
CREATE INDEX "bugs_owner_id_feature_id_idx" ON "bugs"("owner_id", "feature_id");

-- CreateIndex
CREATE INDEX "bugs_owner_id_coding_session_id_idx" ON "bugs"("owner_id", "coding_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "bugs_owner_id_id_key" ON "bugs"("owner_id", "id");

-- CreateIndex
CREATE INDEX "decisions_owner_id_project_id_status_decided_at_idx" ON "decisions"("owner_id", "project_id", "status", "decided_at");

-- CreateIndex
CREATE INDEX "decisions_owner_id_coding_session_id_idx" ON "decisions"("owner_id", "coding_session_id");

-- CreateIndex
CREATE INDEX "decisions_owner_id_superseded_by_id_idx" ON "decisions"("owner_id", "superseded_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "decisions_owner_id_id_key" ON "decisions"("owner_id", "id");

-- CreateIndex
CREATE INDEX "coding_sessions_owner_id_project_id_started_at_idx" ON "coding_sessions"("owner_id", "project_id", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "coding_sessions_owner_id_id_key" ON "coding_sessions"("owner_id", "id");

-- CreateIndex
CREATE INDEX "coding_session_prompts_owner_id_prompt_id_idx" ON "coding_session_prompts"("owner_id", "prompt_id");

-- CreateIndex
CREATE INDEX "coding_session_features_owner_id_feature_id_idx" ON "coding_session_features"("owner_id", "feature_id");

-- CreateIndex
CREATE INDEX "inspirations_owner_id_project_id_created_at_idx" ON "inspirations"("owner_id", "project_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "inspirations_owner_id_id_key" ON "inspirations"("owner_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "inspiration_attachments_storage_key_key" ON "inspiration_attachments"("storage_key");

-- CreateIndex
CREATE INDEX "inspiration_attachments_owner_id_inspiration_id_idx" ON "inspiration_attachments"("owner_id", "inspiration_id");

-- CreateIndex
CREATE INDEX "commands_owner_id_project_id_sort_order_idx" ON "commands"("owner_id", "project_id", "sort_order");

-- CreateIndex
CREATE INDEX "environment_variables_owner_id_project_id_idx" ON "environment_variables"("owner_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "environment_variables_project_id_environment_name_key" ON "environment_variables"("project_id", "environment", "name");

-- CreateIndex
CREATE INDEX "activities_owner_id_occurred_at_id_idx" ON "activities"("owner_id", "occurred_at", "id");

-- CreateIndex
CREATE INDEX "activities_owner_id_project_id_occurred_at_id_idx" ON "activities"("owner_id", "project_id", "occurred_at", "id");

-- CreateIndex
CREATE INDEX "activities_actor_user_id_idx" ON "activities"("actor_user_id");

-- CreateIndex
CREATE INDEX "activities_owner_id_coding_session_id_idx" ON "activities"("owner_id", "coding_session_id");

-- AddForeignKey
ALTER TABLE "app_installation" ADD CONSTRAINT "app_installation_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_owner_id_technology_id_fkey" FOREIGN KEY ("owner_id", "technology_id") REFERENCES "technologies"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_rules" ADD CONSTRAINT "project_rules_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_boundaries" ADD CONSTRAINT "project_boundaries_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_owner_id_milestone_id_fkey" FOREIGN KEY ("owner_id", "milestone_id") REFERENCES "milestones"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_dependencies" ADD CONSTRAINT "feature_dependencies_owner_id_feature_id_fkey" FOREIGN KEY ("owner_id", "feature_id") REFERENCES "features"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_dependencies" ADD CONSTRAINT "feature_dependencies_owner_id_depends_on_feature_id_fkey" FOREIGN KEY ("owner_id", "depends_on_feature_id") REFERENCES "features"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_owner_id_feature_id_fkey" FOREIGN KEY ("owner_id", "feature_id") REFERENCES "features"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "prompt_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_owner_id_prompt_id_fkey" FOREIGN KEY ("owner_id", "prompt_id") REFERENCES "prompts"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_prompt_id_fkey" FOREIGN KEY ("owner_id", "prompt_id") REFERENCES "prompts"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_prompt_version_id_fkey" FOREIGN KEY ("owner_id", "prompt_version_id") REFERENCES "prompt_versions"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_feature_id_fkey" FOREIGN KEY ("owner_id", "feature_id") REFERENCES "features"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_milestone_id_fkey" FOREIGN KEY ("owner_id", "milestone_id") REFERENCES "milestones"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_idea_id_fkey" FOREIGN KEY ("owner_id", "idea_id") REFERENCES "ideas"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_owner_id_bug_id_fkey" FOREIGN KEY ("owner_id", "bug_id") REFERENCES "bugs"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "builder_rules" ADD CONSTRAINT "builder_rules_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "builder_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "context_packs" ADD CONSTRAINT "context_packs_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "context_pack_rules" ADD CONSTRAINT "context_pack_rules_owner_id_pack_id_fkey" FOREIGN KEY ("owner_id", "pack_id") REFERENCES "context_packs"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_project_types" ADD CONSTRAINT "skill_project_types_owner_id_skill_id_fkey" FOREIGN KEY ("owner_id", "skill_id") REFERENCES "skills"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_technologies" ADD CONSTRAINT "skill_technologies_owner_id_skill_id_fkey" FOREIGN KEY ("owner_id", "skill_id") REFERENCES "skills"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_technologies" ADD CONSTRAINT "skill_technologies_owner_id_technology_id_fkey" FOREIGN KEY ("owner_id", "technology_id") REFERENCES "technologies"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_use_cases" ADD CONSTRAINT "skill_use_cases_owner_id_skill_id_fkey" FOREIGN KEY ("owner_id", "skill_id") REFERENCES "skills"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_preset_technologies" ADD CONSTRAINT "stack_preset_technologies_owner_id_preset_id_fkey" FOREIGN KEY ("owner_id", "preset_id") REFERENCES "stack_presets"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stack_preset_technologies" ADD CONSTRAINT "stack_preset_technologies_owner_id_technology_id_fkey" FOREIGN KEY ("owner_id", "technology_id") REFERENCES "technologies"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_owner_id_feature_id_fkey" FOREIGN KEY ("owner_id", "feature_id") REFERENCES "features"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_owner_id_coding_session_id_fkey" FOREIGN KEY ("owner_id", "coding_session_id") REFERENCES "coding_sessions"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_owner_id_coding_session_id_fkey" FOREIGN KEY ("owner_id", "coding_session_id") REFERENCES "coding_sessions"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_owner_id_superseded_by_id_fkey" FOREIGN KEY ("owner_id", "superseded_by_id") REFERENCES "decisions"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_sessions" ADD CONSTRAINT "coding_sessions_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_session_prompts" ADD CONSTRAINT "coding_session_prompts_owner_id_coding_session_id_fkey" FOREIGN KEY ("owner_id", "coding_session_id") REFERENCES "coding_sessions"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_session_prompts" ADD CONSTRAINT "coding_session_prompts_owner_id_prompt_id_fkey" FOREIGN KEY ("owner_id", "prompt_id") REFERENCES "prompts"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_session_features" ADD CONSTRAINT "coding_session_features_owner_id_coding_session_id_fkey" FOREIGN KEY ("owner_id", "coding_session_id") REFERENCES "coding_sessions"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_session_features" ADD CONSTRAINT "coding_session_features_owner_id_feature_id_fkey" FOREIGN KEY ("owner_id", "feature_id") REFERENCES "features"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspirations" ADD CONSTRAINT "inspirations_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspiration_attachments" ADD CONSTRAINT "inspiration_attachments_owner_id_inspiration_id_fkey" FOREIGN KEY ("owner_id", "inspiration_id") REFERENCES "inspirations"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commands" ADD CONSTRAINT "commands_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "environment_variables" ADD CONSTRAINT "environment_variables_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_owner_id_project_id_fkey" FOREIGN KEY ("owner_id", "project_id") REFERENCES "projects"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_owner_id_coding_session_id_fkey" FOREIGN KEY ("owner_id", "coding_session_id") REFERENCES "coding_sessions"("owner_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Constraints and expression/partial indexes Prisma cannot represent.
ALTER TABLE "app_installation" ADD CONSTRAINT "app_installation_singleton_key_check" CHECK ("key" = 'primary');
ALTER TABLE "projects" ADD CONSTRAINT "projects_progress_check" CHECK ("progress" BETWEEN 0 AND 100);
ALTER TABLE "feature_dependencies" ADD CONSTRAINT "feature_dependencies_no_self_check" CHECK ("feature_id" <> "depends_on_feature_id");
ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_version_number_check" CHECK ("version_number" > 0);
ALTER TABLE "prompt_queue_items" ADD CONSTRAINT "prompt_queue_items_position_check" CHECK ("position" >= 0);
ALTER TABLE "inspiration_attachments" ADD CONSTRAINT "inspiration_attachments_byte_size_check" CHECK ("byte_size" >= 0);
CREATE UNIQUE INDEX "users_email_lower_key" ON "users" (lower("email"));
CREATE UNIQUE INDEX "users_single_owner_key" ON "users" ("role") WHERE "role" = 'OWNER';
CREATE UNIQUE INDEX "technologies_owner_name_lower_key" ON "technologies" ("owner_id", lower("name"));
CREATE UNIQUE INDEX "prompt_queue_items_active_position_key" ON "prompt_queue_items" ("project_id", "position") WHERE "status" IN ('QUEUED', 'SENT');
INSERT INTO "app_installation" ("key") VALUES ('primary') ON CONFLICT DO NOTHING;
