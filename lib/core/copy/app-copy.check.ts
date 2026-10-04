import { getAppCopy, loadAppCopy } from "@/lib/core/copy/app-copy";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

loadAppCopy();

const copy = getAppCopy();
assert(copy.app_meta.app_name === "Minorum", "app_meta loaded");
assert(
  copy.chat_history_sidebar.title.length > 0,
  "chat_history_sidebar loaded",
);

console.log("app-copy checks passed");
