-- org
CREATE TABLE IF NOT EXISTS "org" (
  "org_id" TEXT,
  "name" TEXT NOT NULL,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("org_id")
);
-- user_orgs
CREATE TABLE IF NOT EXISTS "user_orgs" (
  "user_id" TEXT NOT NULL REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "org_id" TEXT NOT NULL REFERENCES "org" ("org_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "options" JSONB,
  UNIQUE ("user_id", "org_id"),
  PRIMARY KEY ("user_id", "org_id")
);
-- git_credential
CREATE TABLE IF NOT EXISTS "git_credential" (
  "git_credential_id" TEXT,
  "provider_type" TEXT NOT NULL DEFAULT '',
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "org_id" TEXT NOT NULL REFERENCES "org" ("org_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("git_credential_id")
);
-- project
CREATE TABLE IF NOT EXISTS "project" (
  "project_id" TEXT,
  "project_name" TEXT,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "org_id" TEXT NOT NULL REFERENCES "org" ("org_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("project_id")
);
-- git_repository
CREATE TABLE IF NOT EXISTS "git_repository" (
  "git_repository_id" TEXT,
  "url" TEXT NOT NULL,
  "branch" TEXT NOT NULL DEFAULT 'main',
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "project_id" TEXT NOT NULL REFERENCES "project" ("project_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "git_credential_id" TEXT NOT NULL REFERENCES "git_credential" ("git_credential_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("git_repository_id")
);
-- workspace
CREATE TABLE IF NOT EXISTS "workspace" (
  "workspace_id" TEXT,
  "workspace_name" TEXT,
  "env_vars" JSONB,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "project_id" TEXT NOT NULL REFERENCES "project" ("project_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("workspace_id")
);
-- run
CREATE TABLE IF NOT EXISTS "run" (
  run_id TEXT,
  reason TEXT,
  kind TEXT NOT NULL,
  container_id TEXT,
  container_state JSONB,
  options JSONB,
  status TEXT NOT NULL,
  result JSONB,
  error JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  workspace_id TEXT NOT NULL REFERENCES workspace (workspace_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (run_id)
)