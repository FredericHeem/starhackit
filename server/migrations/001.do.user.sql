CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL,
    user_type TEXT,
    username VARCHAR(64) UNIQUE,
    email VARCHAR(64) NOT NULL UNIQUE,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    picture JSONB,
    biography VARCHAR(256),
    password_hash TEXT,
    password_reset_token VARCHAR(32),
    password_reset_date TIMESTAMP WITH TIME ZONE,
    auth_type TEXT,
    auth_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE users
ADD constraint check_min_length CHECK (length(email) >= 6);