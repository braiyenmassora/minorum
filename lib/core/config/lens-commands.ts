export type LensCommand =
  "engineer" | "architect" | "data" | "cto" | "research" | "auto";

export type LensCommandDefinition = {
  command: LensCommand;
  trigger: `/${LensCommand}`;
  description: string;
};

export const LENS_COMMANDS: readonly LensCommandDefinition[] = [
  {
    command: "engineer",
    trigger: "/engineer",
    description:
      "Pure problem solver — root cause, fix, how to verify. No architecture/strategy detour.",
  },
  {
    command: "architect",
    trigger: "/architect",
    description: "System design, integration, NFRs, trade-offs, ADR.",
  },
  {
    command: "data",
    trigger: "/data",
    description: "Data modeling, layering, governance, quality, cost.",
  },
  {
    command: "cto",
    trigger: "/cto",
    description: "Business decisions — build vs buy, TCO, risk, roadmap, team.",
  },
  {
    command: "research",
    trigger: "/research",
    description:
      "Research with sources and citations, closes with a conclusion.",
  },
  {
    command: "auto",
    trigger: "/auto",
    description: "Back to default — the agent picks the lens itself.",
  },
];

const COMMAND_RE = /^\/(\w+)\b/;

/** Detect a leading "/command" in raw composer text. Undefined if none/unrecognized. */
export function parseLensCommand(text: string): LensCommand | undefined {
  const match = COMMAND_RE.exec(text.trimStart());
  if (!match) {
    return undefined;
  }
  const word = match[1].toLowerCase();
  return LENS_COMMANDS.find((entry) => entry.command === word)?.command;
}
