import type { ChatSession } from "@/lib/models/chat-session";
import type { Message } from "@/lib/models/message";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function listChatSessions(): Promise<ChatSession[]> {
  try {
    const response = await fetch("/api/sessions");
    const data = await parseJson<{ sessions: ChatSession[] }>(response);
    return data.sessions;
  } catch {
    return [];
  }
}

export async function getChatSession(id: string): Promise<ChatSession | null> {
  try {
    const response = await fetch(`/api/sessions/${id}`);
    if (response.status === 404) {
      return null;
    }
    const data = await parseJson<{ session: ChatSession }>(response);
    return data.session;
  } catch {
    return null;
  }
}

export async function upsertChatSession(input: {
  id: string;
  messages: Message[];
}): Promise<ChatSession | null> {
  if (input.messages.length === 0) {
    return null;
  }

  try {
    const response = await fetch(`/api/sessions/${input.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: input.messages }),
    });
    const data = await parseJson<{ session: ChatSession }>(response);
    return data.session;
  } catch {
    return null;
  }
}

export async function setChatSessionPinned(
  id: string,
  pinned: boolean,
): Promise<ChatSession | null> {
  try {
    const response = await fetch(`/api/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned }),
    });
    const data = await parseJson<{ session: ChatSession }>(response);
    return data.session;
  } catch {
    return null;
  }
}

export async function deleteChatSession(id: string): Promise<void> {
  try {
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
  } catch {
    // Best-effort — the sidebar refetches the list regardless.
  }
}

export async function clearChatSessions(): Promise<void> {
  try {
    await fetch("/api/sessions", { method: "DELETE" });
  } catch {
    // Best-effort — the sidebar refetches the list regardless.
  }
}
