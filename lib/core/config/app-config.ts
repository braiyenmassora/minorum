/**
 * Client-side config only — never carries the API key. The key stays
 * server-only (lib/env.ts) and is injected by /api/proxy; the browser only
 * needs the base URL for display and the chosen model name.
 */
export type AppConfig = {
  apiBaseUrl: string;
  modelName: string;
  fullName: string;
};

export function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("API URL kosong");
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  if (withoutTrailingSlash.endsWith("/v1")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/v1`;
}

export function validateAppConfig(input: Partial<AppConfig>): AppConfig {
  const apiBaseUrl = input.apiBaseUrl?.trim() ?? "";
  const modelName = input.modelName?.trim() ?? "";
  const fullName = input.fullName?.trim() ?? "";

  if (!apiBaseUrl) {
    throw new Error("Config belum lengkap");
  }

  return {
    apiBaseUrl: normalizeApiBaseUrl(apiBaseUrl),
    modelName,
    fullName,
  };
}
