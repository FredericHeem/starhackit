-- document
CREATE TABLE IF NOT EXISTS document (
  document_id TEXT PRIMARY KEY,
  type TEXT,
  file_type TEXT,
  size BIGINT,
  meta JSONB,
  content bytea,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users
);