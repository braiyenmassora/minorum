import {
  attachmentUnsupportedBy,
  comboEntriesOnly,
  getModelDisplayName,
  getProviderCategory,
  groupModelsForPicker,
  pickDefaultModel,
  resolveModelSelection,
} from "./model-label";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(getModelDisplayName("openai/gpt-4o") === "gpt-4o", "provider model");
assert(getModelDisplayName("flex") === "flex", "combo id");

assert(
  pickDefaultModel(["openai/gpt-4o", "flex", "nvidia/x"], undefined, [
    "flex",
  ]) === "flex",
  "default to flex combo",
);
assert(
  pickDefaultModel(["a/b"], "a/b") === "a/b",
  "honor preferred when listed",
);
assert(
  pickDefaultModel(["openai/gpt-4o", "flex"], "flex", ["flex"]) === "flex",
  "honor preferred combo",
);

assert(
  resolveModelSelection(
    "stale/id",
    ["flex", "openai/gpt-4o"],
    "flex",
    ["flex"],
  ) === "flex",
  "stale → flex",
);

assert(
  getProviderCategory({ id: "flex", ownedBy: "combo" }) === "Combo",
  "combo category",
);
assert(
  getProviderCategory({ id: "nvidia/foo", ownedBy: "nvidia" }) === "Nvidia",
  "nvidia category",
);

const grouped = groupModelsForPicker([
  { id: "flex", ownedBy: "combo" },
  { id: "nvidia/a", ownedBy: "nvidia" },
  { id: "gemini/b", ownedBy: "gemini" },
]);
assert(grouped[0]?.category === "Combo", "combo group first");
assert(grouped[0]?.models[0]?.id === "flex", "combo listed");
assert(grouped.length === 3, "three groups");

const onlyCombos = comboEntriesOnly([
  { id: "flex", ownedBy: "combo" },
  { id: "chill", ownedBy: "combo" },
  { id: "openai/gpt-5", ownedBy: "openai" },
  { id: "auto/best-chat" },
]);
assert(
  onlyCombos.map((e) => e.id).join(",") === "flex,chill,auto/best-chat",
  "comboEntriesOnly keeps owned_by=combo and auto/*",
);
assert(
  groupModelsForPicker(onlyCombos).length === 1,
  "filtered picker is one Combo group",
);

assert(
  attachmentUnsupportedBy({ id: "chill", capabilities: { pdf: false } }, "pdf"),
  "warns when catalog explicitly says pdf unsupported",
);
assert(
  !attachmentUnsupportedBy({ id: "flex", capabilities: { pdf: true } }, "pdf"),
  "no warning when capability is explicitly supported",
);
assert(
  !attachmentUnsupportedBy({ id: "unknown/model" }, "image"),
  "no warning when capabilities are missing entirely (unknown, not false)",
);
assert(
  !attachmentUnsupportedBy(undefined, "image"),
  "no warning when the model isn't in the fetched catalog at all",
);

console.log("model-label checks passed");
