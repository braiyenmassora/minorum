-- Run this in Neon's SQL Editor to set up cross-device chat history.
-- Single-user for now: sessions.user_id references one seeded row so a
-- second user can be added later without changing the schema.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB NOT NULL,
  updated_at BIGINT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_sessions_user_updated ON sessions (user_id, pinned DESC, updated_at DESC);

INSERT INTO users (id, username) VALUES ('default', 'braiyenmassora');
