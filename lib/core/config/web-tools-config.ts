/** Server-only — import from `@/lib/env`, not from client bundles. */
export type WebToolsConfig = {
  enabled: boolean;
  /** Empty = any model when enabled. Non-empty = allowlist only. */
  modelAllowlist: readonly string[];
  /** 9Router search provider/combo id used by the fallback tool loop. */
  searchProvider: string;
  /** 9Router fetch provider/combo id used by the fallback tool loop. */
  fetchProvider: string;
};

export const DEFAULT_WEB_TOOLS_CONFIG: WebToolsConfig = {
  enabled: false,
  modelAllowlist: [],
  searchProvider: "search-combo",
  fetchProvider: "fetch-combo",
};

export function modelOnWebToolsAllowlist(
  modelName: string,
  allowlist: readonly string[],
): boolean {
  if (allowlist.length === 0) {
    return true;
  }
  const model = modelName.trim();
  return allowlist.some((entry) => entry === model);
}

/** Gate + env enabled, and model is on allowlist (if any). */
export function webToolsEligible(
  modelName: string,
  config: WebToolsConfig,
): boolean {
  if (!config.enabled) {
    return false;
  }
  return modelOnWebToolsAllowlist(modelName, config.modelAllowlist);
}

export type WebToolProvider = "anthropic" | "openai" | "none";

/** Guess provider tool schema from model id (9Router alias conventions). */
export function detectWebToolProvider(modelName: string): WebToolProvider {
  const model = modelName.trim().toLowerCase();
  if (!model) {
    return "none";
  }
  if (
    model.includes("claude") ||
    model.startsWith("kr/") ||
    model.startsWith("cc/") ||
    model.startsWith("anthropic/")
  ) {
    return "anthropic";
  }
  if (
    model.startsWith("o") ||
    model.includes("gpt") ||
    model.startsWith("openai/")
  ) {
    return "openai";
  }
  return "none";
}

export type ChatRequestTool = Record<string, unknown>;

/** Provider-native tool definitions for the upstream (9Router translates). */
export function resolveWebToolsForModel(
  modelName: string,
): ChatRequestTool[] | null {
  switch (detectWebToolProvider(modelName)) {
    case "anthropic":
      return [{ type: "web_search_20250305", name: "web_search" }];
    case "openai":
      // OpenAI web search on chat/completions varies by proxy; use preview type
      // many routers accept. Returns null if unsupported — caller falls back.
      return [{ type: "web_search_preview" }];
    default:
      return null;
  }
}

/** True when this request will attach tools (eligible + known provider schema). */
export function webToolsActiveForRequest(
  modelName: string,
  config: WebToolsConfig,
): boolean {
  return (
    webToolsEligible(modelName, config) &&
    resolveWebToolsForModel(modelName) !== null
  );
}

/**
 * Generic OpenAI-style function tools for models without a native browsing
 * tool (i.e. resolveWebToolsForModel returns null). The caller executes these
 * itself against 9Router's /v1/search and /v1/web/fetch REST endpoints —
 * see chat-service.ts's fallback tool loop.
 */
export const FALLBACK_WEB_TOOLS: ChatRequestTool[] = [
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "Search the web for current information, articles, or facts. Use before answering anything that may have changed after your training cutoff, or that needs a real source.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query." },
          max_results: {
            type: "integer",
            description: "Number of results to return (default 5).",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "web_fetch",
      description:
        "Fetch the full content of a specific URL as markdown. Use after web_search to read a promising result in full, or when the user gives a direct link.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to fetch." },
        },
        required: ["url"],
      },
    },
  },
];

/** Heuristic: upstream rejected the tools parameter — retry without tools. */
export function looksLikeToolRejection(status: number, body: string): boolean {
  if (status !== 400 && status !== 422 && status !== 501 && status !== 502) {
    return false;
  }
  const lower = body.toLowerCase();
  return (
    lower.includes("web_search") ||
    lower.includes("tool") ||
    lower.includes("unsupported")
  );
}
