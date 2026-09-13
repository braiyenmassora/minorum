import { formatChatUsageMeta, parseUsageField } from "./chat-usage";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  formatChatUsageMeta({
    comboModel: "best",
    servedModel: "openai/gpt-5.4",
    totalTokens: 281,
    promptTokens: 194,
    completionTokens: 87,
  }) === "best · openai/gpt-5.4 · 281 tokens (194 in · 87 out)",
  "format combo + served + tokens",
);

assert(
  formatChatUsageMeta({
    comboModel: "fast",
    totalTokens: 42,
  }) === "fast · 42 tokens",
  "format combo-only usage",
);

const parsed = parseUsageField({
  prompt_tokens: 1,
  completion_tokens: 2,
  total_tokens: 3,
});
assert(parsed?.totalTokens === 3, "parse usage field");

console.log("chat-usage checks passed");
