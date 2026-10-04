import {
  type AppConfig,
  validateAppConfig,
} from "@/lib/core/config/app-config";

const STORAGE_KEYS = {
  apiBaseUrl: "api_base_url",
  modelName: "model_name",
  fullName: "full_name",
} as const;

/** Pre-fix builds stored the real API key here — wipe any leftover. */
const LEGACY_API_KEY_STORAGE_KEY = "api_key";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadConfig(): AppConfig | null {
  if (!isBrowser()) {
    return null;
  }

  localStorage.removeItem(LEGACY_API_KEY_STORAGE_KEY);

  const apiBaseUrl = localStorage.getItem(STORAGE_KEYS.apiBaseUrl);
  const modelName = localStorage.getItem(STORAGE_KEYS.modelName);
  const fullName = localStorage.getItem(STORAGE_KEYS.fullName) ?? "";

  if (!apiBaseUrl) {
    return null;
  }

  try {
    return validateAppConfig({
      apiBaseUrl,
      modelName: modelName ?? "",
      fullName,
    });
  } catch {
    return null;
  }
}

export function saveConfig(config: AppConfig): void {
  if (!isBrowser()) {
    throw new Error("localStorage tidak tersedia");
  }

  const valid = validateAppConfig(config);
  localStorage.setItem(STORAGE_KEYS.apiBaseUrl, valid.apiBaseUrl);
  localStorage.setItem(STORAGE_KEYS.modelName, valid.modelName);
  localStorage.setItem(STORAGE_KEYS.fullName, valid.fullName);
}

export function updateConfigModel(
  config: AppConfig,
  modelName: string,
): AppConfig {
  const updated = validateAppConfig({ ...config, modelName });
  saveConfig(updated);
  return updated;
}

export function clearConfig(): void {
  if (!isBrowser()) {
    return;
  }

  for (const key of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(key);
  }
  localStorage.removeItem(LEGACY_API_KEY_STORAGE_KEY);
}
