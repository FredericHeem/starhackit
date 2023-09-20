-- User Pending
CREATE TABLE IF NOT EXISTS "user_pending" (
    "user_pending_id" SERIAL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    code CHAR(16) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE user_pending
ADD constraint check_min_length_email CHECK (length(email) >= 6);