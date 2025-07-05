-- Users table to store information about authenticated athletes
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  strava_id BIGINT UNIQUE NOT NULL,
  access_token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  token_expires_at TIMESTAMP NOT NULL,
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Processed activities table to ensure idempotency
CREATE TABLE processed_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_id BIGINT NOT NULL,
  original_title TEXT,
  generated_title TEXT,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_id)
);

-- Sessions table for connect-pg-simple
CREATE TABLE "sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");

-- Error logs table
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(50) NOT NULL, -- e.g., 'error', 'info', 'warn'
  message TEXT NOT NULL,
  context JSONB, -- To store relevant data like user_id, activity_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 