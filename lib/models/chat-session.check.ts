import {
  CHAT_HISTORY_LIMIT,
  titleFromMessages,
} from "@/lib/models/chat-session";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(CHAT_HISTORY_LIMIT === 30, "history limit is 30");

assert(
  titleFromMessages([
    {
      id: "1",
      role: "user",
      content: "gimana cara scala baca data dengan spark streaming",
    },
  ]) === "gimana cara scala…",
  "title caps at three words",
);

assert(
  titleFromMessages([
    {
      id: "3",
      role: "user",
      content: "/research Jelasin bedanya REST dan GraphQL",
    },
  ]) === "Jelasin bedanya REST…",
  "leading lens command is dropped from the title",
);

assert(
  titleFromMessages([
    {
      id: "2",
      role: "user",
      content: "how it works",
    },
  ]) === "how it works",
  "short title unchanged",
);

assert(titleFromMessages([]) === "New chat", "empty session title");

console.log("chat-session checks passed");
