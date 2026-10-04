import { normalizeApiBaseUrl, validateAppConfig } from "./app-config";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  normalizeApiBaseUrl("https://api.example.com/") ===
    "https://api.example.com/v1",
  "trailing slash",
);
assert(
  normalizeApiBaseUrl("https://api.example.com") ===
    "https://api.example.com/v1",
  "no v1 suffix",
);
assert(
  normalizeApiBaseUrl("https://api.example.com/v1") ===
    "https://api.example.com/v1",
  "existing v1",
);

let threw = false;
try {
  validateAppConfig({ apiBaseUrl: "", modelName: "m" });
} catch {
  threw = true;
}
assert(threw, "validate rejects incomplete config");

const valid = validateAppConfig({
  apiBaseUrl: "https://api.example.com/",
  modelName: "auto",
});
assert(
  valid.apiBaseUrl === "https://api.example.com/v1",
  "validate normalizes url",
);
assert(valid.modelName === "auto", "validate keeps model");
assert(valid.fullName === "", "validate defaults empty full name");

const withoutModel = validateAppConfig({
  apiBaseUrl: "https://api.example.com/",
});
assert(withoutModel.modelName === "", "model optional");

const withName = validateAppConfig({
  apiBaseUrl: "https://api.example.com/",
  modelName: "auto",
  fullName: "  Braiyen Massora  ",
});
assert(withName.fullName === "Braiyen Massora", "validate trims full name");

console.log("app-config checks passed");
