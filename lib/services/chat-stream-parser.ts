import { parseUsageField, type ChatTokenUsage } from "@/lib/models/chat-usage";

function extractDeltaContent(payload: string): string | null {
  if (!payload || payload === "[DONE]") {
    return null;
  }

  try {
    const json = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string } }>;
      usage?: unknown;
    };
    const content = json.choices?.[0]?.delta?.content;
    return typeof content === "string" ? content : null;
  } catch {
    return null;
  }
}

function extractUsage(payload: string): ChatTokenUsage | null {
  if (!payload || payload === "[DONE]") {
    return null;
  }

  try {
    const json = JSON.parse(payload) as { usage?: unknown };
    return parseUsageField(json.usage);
  } catch {
    return null;
  }
}

export function parseSseBlock(block: string): {
  tokens: string[];
  usage: ChatTokenUsage | null;
} {
  const tokens: string[] = [];
  let usage: ChatTokenUsage | null = null;

  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) {
      continue;
    }

    const payload = trimmed.slice(5).trim();
    const content = extractDeltaContent(payload);
    if (content) {
      tokens.push(content);
    }

    const blockUsage = extractUsage(payload);
    if (blockUsage) {
      usage = blockUsage;
    }
  }

  return { tokens, usage };
}

export class ChatStreamParser {
  private buffer = "";
  private lastUsage: ChatTokenUsage | null = null;

  push(chunk: string): string[] {
    this.buffer += chunk;
    // Normalize CRLF → LF so event boundaries match whether the provider
    // sends "\n\n" or "\r\n\r\n". A "\r\n" split across chunks reunites in
    // the buffer before the next scan.
    this.buffer = this.buffer.replace(/\r\n/g, "\n");
    const tokens: string[] = [];

    let boundary = this.buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const block = this.buffer.slice(0, boundary);
      this.buffer = this.buffer.slice(boundary + 2);
      const parsed = parseSseBlock(block);
      tokens.push(...parsed.tokens);
      if (parsed.usage) {
        this.lastUsage = parsed.usage;
      }
      boundary = this.buffer.indexOf("\n\n");
    }

    return tokens;
  }

  flush(): string[] {
    if (!this.buffer.trim()) {
      this.buffer = "";
      return [];
    }

    const parsed = parseSseBlock(this.buffer);
    this.buffer = "";
    if (parsed.usage) {
      this.lastUsage = parsed.usage;
    }
    return parsed.tokens;
  }

  takeUsage(): ChatTokenUsage | undefined {
    const usage = this.lastUsage ?? undefined;
    this.lastUsage = null;
    return usage;
  }
}
