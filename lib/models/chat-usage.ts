export type ChatTokenUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

/** Per assistant reply: combo picked + model that served + token counts. */
export type ChatMessageUsage = ChatTokenUsage & {
  comboModel: string;
  servedModel?: string;
};

export function formatChatUsageMeta(usage: ChatMessageUsage): string {
  const parts: string[] = [usage.comboModel];

  if (
    usage.servedModel &&
    usage.servedModel !== usage.comboModel
  ) {
    parts.push(usage.servedModel);
  }

  if (usage.totalTokens != null) {
    const detail =
      usage.promptTokens != null && usage.completionTokens != null
        ? ` (${usage.promptTokens} in · ${usage.completionTokens} out)`
        : "";
    parts.push(`${usage.totalTokens} tokens${detail}`);
  }

  return parts.join(" · ");
}

export function parseUsageField(raw: unknown): ChatTokenUsage | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const usage = raw as Record<string, unknown>;
  const promptTokens =
    typeof usage.prompt_tokens === "number" ? usage.prompt_tokens : undefined;
  const completionTokens =
    typeof usage.completion_tokens === "number"
      ? usage.completion_tokens
      : undefined;
  const totalTokens =
    typeof usage.total_tokens === "number" ? usage.total_tokens : undefined;

  if (
    promptTokens == null &&
    completionTokens == null &&
    totalTokens == null
  ) {
    return null;
  }

  return { promptTokens, completionTokens, totalTokens };
}
