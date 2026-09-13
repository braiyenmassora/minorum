import { neon } from "@neondatabase/serverless";

import { CHAT_HISTORY_LIMIT, type ChatSession } from "@/lib/models/chat-session";
import type { Message } from "@/lib/models/message";

/** Single-user for now — sessions.user_id references this seeded row. */
const DEFAULT_USER_ID = "default";

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(url);
}

type SessionRow = {
  id: string;
  title: string;
  messages: Message[];
  updated_at: string | number;
  pinned: boolean;
};

function toChatSession(row: SessionRow): ChatSession {
  return {
    id: row.id,
    title: row.title,
    messages: row.messages,
    updatedAt: Number(row.updated_at),
    pinned: row.pinned,
  };
}

export async function listSessions(): Promise<ChatSession[]> {
  const rows = (await sql()`
    SELECT id, title, messages, updated_at, pinned FROM sessions
    WHERE user_id = ${DEFAULT_USER_ID}
    ORDER BY pinned DESC, updated_at DESC
  `) as SessionRow[];
  return rows.map(toChatSession);
}

export async function getSession(id: string): Promise<ChatSession | null> {
  const rows = (await sql()`
    SELECT id, title, messages, updated_at, pinned FROM sessions
    WHERE user_id = ${DEFAULT_USER_ID} AND id = ${id}
  `) as SessionRow[];
  return rows[0] ? toChatSession(rows[0]) : null;
}

export async function upsertSession(input: {
  id: string;
  title: string;
  messages: Message[];
}): Promise<ChatSession> {
  const updatedAt = Date.now();
  const rows = (await sql()`
    INSERT INTO sessions (id, user_id, title, messages, updated_at, pinned)
    VALUES (${input.id}, ${DEFAULT_USER_ID}, ${input.title}, ${JSON.stringify(input.messages)}::jsonb, ${updatedAt}, false)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      messages = EXCLUDED.messages,
      updated_at = EXCLUDED.updated_at
    RETURNING id, title, messages, updated_at, pinned
  `) as SessionRow[];

  // Evict the oldest UNPINNED sessions beyond the cap — pinned ones never
  // age out, so a chat kept for later doesn't silently disappear.
  await sql()`
    DELETE FROM sessions
    WHERE user_id = ${DEFAULT_USER_ID} AND pinned = false
    AND id NOT IN (
      SELECT id FROM sessions
      WHERE user_id = ${DEFAULT_USER_ID} AND pinned = false
      ORDER BY updated_at DESC
      LIMIT ${CHAT_HISTORY_LIMIT}
    )
  `;

  return toChatSession(rows[0]);
}

export async function setSessionPinned(
  id: string,
  pinned: boolean,
): Promise<ChatSession | null> {
  const rows = (await sql()`
    UPDATE sessions SET pinned = ${pinned}
    WHERE user_id = ${DEFAULT_USER_ID} AND id = ${id}
    RETURNING id, title, messages, updated_at, pinned
  `) as SessionRow[];
  return rows[0] ? toChatSession(rows[0]) : null;
}

export async function deleteSession(id: string): Promise<void> {
  await sql()`
    DELETE FROM sessions WHERE user_id = ${DEFAULT_USER_ID} AND id = ${id}
  `;
}

export async function clearSessions(): Promise<void> {
  await sql()`DELETE FROM sessions WHERE user_id = ${DEFAULT_USER_ID}`;
}
