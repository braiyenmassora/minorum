import {
  classifyHttpStatus,
  classifyFetchError,
  isRetryableKind,
} from "./chat-api-error";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(classifyHttpStatus(401) === "auth", "401 → auth");
assert(classifyHttpStatus(403) === "auth", "403 → auth");
assert(classifyHttpStatus(413) === "payload_too_large", "413 → payload_too_large");
assert(classifyHttpStatus(500) === "server", "500 → server");
assert(classifyHttpStatus(503) === "server", "503 → server");
assert(
  classifyHttpStatus(410) === "server",
  "410 (routed model retired upstream) → server, so it auto-retries",
);
assert(isRetryableKind(classifyHttpStatus(410)), "410 is retryable");
assert(classifyHttpStatus(404) === "unknown", "404 → unknown (unmapped)");

assert(
  classifyFetchError(new TypeError("fetch failed")) === "network",
  "TypeError → network",
);

console.log("chat-api-error checks passed");
