CREATE TABLE IF NOT EXISTS "org" (
  "org_id" TEXT,
  "name" TEXT NOT NULL,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("org_id")
);
CREATE TABLE IF NOT EXISTS "user_orgs" (
  "user_id" TEXT NOT NULL REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "org_id" TEXT NOT NULL REFERENCES "org" ("org_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "options" JSONB,
  UNIQUE ("user_id", "org_id"),
  PRIMARY KEY ("user_id", "org_id")
);
CREATE TABLE IF NOT EXISTS "git_credential" (
  "git_credential_id" UUID,
  "provider_type" TEXT NOT NULL DEFAULT '',
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "user_id" TEXT NOT NULL REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("git_credential_id")
);
CREATE TABLE IF NOT EXISTS "git_repository" (
  "git_repository_id" UUID,
  "url" TEXT NOT NULL,
  "branch" TEXT NOT NULL DEFAULT 'master',
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "user_id" TEXT NOT NULL REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("git_repository_id")
);
CREATE TABLE IF NOT EXISTS "infra" (
  "id" UUID,
  "name" TEXT NOT NULL,
  "provider_type" TEXT NOT NULL,
  "provider_name" TEXT NOT NULL,
  "provider_auth" JSONB,
  "project" JSONB,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "user_id" TEXT NOT NULL REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "git_credential_id" UUID REFERENCES "git_credential" ("git_credential_id") ON DELETE
  SET NULL ON UPDATE CASCADE,
    "git_repository_id" UUID REFERENCES "git_repository" ("git_repository_id") ON DELETE
  SET NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "job" (
  "id" UUID,
  "kind" TEXT NOT NULL,
  "options" JSONB,
  "status" TEXT NOT NULL,
  "result" JSONB,
  "error" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "infra_id" UUID NOT NULL REFERENCES "infra" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("id")
)