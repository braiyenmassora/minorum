import type { Message } from "@/lib/models/message";
import { getMessageText } from "@/lib/models/message-content";

export const CHAT_HISTORY_LIMIT = 30;
const TITLE_MAX_WORDS = 3;
/** Leading lens command (e.g. "/research ") isn't part of the topic. */
const LEADING_COMMAND_RE = /^\/\w+\s*/;

export type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
  pinned: boolean;
};

export function titleFromMessages(messages: Message[]): string {
  const firstUser = messages.find((message) => message.role === "user");
  if (!firstUser) {
    return "New chat";
  }

  const raw = getMessageText(firstUser.content).trim().replace(/\s+/g, " ");
  const text = raw.replace(LEADING_COMMAND_RE, "") || raw;
  if (!text) {
    return "Image";
  }

  const words = text.split(" ").filter(Boolean);
  if (words.length <= TITLE_MAX_WORDS) {
    return words.join(" ");
  }
  return `${words.slice(0, TITLE_MAX_WORDS).join(" ")}…`;
}
