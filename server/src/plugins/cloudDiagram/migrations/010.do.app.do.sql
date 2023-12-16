-- org
CREATE TABLE IF NOT EXISTS org (
  org_id TEXT NOT NULL,
  org_name TEXT,
  org_description TEXT,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id)
);
-- user_orgs
CREATE TABLE IF NOT EXISTS user_orgs (
  user_id TEXT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  org_id TEXT NOT NULL REFERENCES org (org_id) ON DELETE CASCADE ON UPDATE CASCADE,
  options JSONB,
  UNIQUE (user_id, org_id),
  PRIMARY KEY (user_id, org_id)
);
-- project
CREATE TABLE IF NOT EXISTS project (
  org_id TEXT NOT NULL REFERENCES org (org_id) ON DELETE CASCADE ON UPDATE CASCADE,
  project_id TEXT NOT NULL,
  project_name TEXT,
  project_description TEXT,
  options JSONB,
  git_provider_type TEXT,
  git_auth_type TEXT,
  username TEXT,
  password TEXT,
  repository_url TEXT,
  branch TEXT NOT NULL DEFAULT 'main',
  working_directory TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id, project_id)
);
-- workspace
CREATE TABLE IF NOT EXISTS workspace (
  org_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  workspace_name TEXT,
  workspace_description TEXT,
  env_vars JSONB,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY(org_id, project_id) REFERENCES project ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (org_id, project_id, workspace_id)
);
-- run
CREATE TABLE IF NOT EXISTS run (
  org_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  run_id SERIAL,
  reason TEXT,
  kind TEXT NOT NULL,
  args TEXT,
  engine TEXT,
  container_id TEXT,
  container_state JSONB,
  options JSONB,
  status TEXT NOT NULL,
  result JSONB,
  error JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY(org_id, project_id, workspace_id) REFERENCES workspace ON DELETE CASCADE,
  PRIMARY KEY (org_id, project_id, workspace_id, run_id)
);
-- cloud_authentication
CREATE TABLE IF NOT EXISTS cloud_authentication (
  org_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  cloud_authentication_id SERIAL,
  provider_type TEXT NOT NULL,
  options JSONB,
  env_vars JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY(org_id, project_id, workspace_id) REFERENCES workspace ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (
    org_id,
    project_id,
    workspace_id,
    cloud_authentication_id
  )
)