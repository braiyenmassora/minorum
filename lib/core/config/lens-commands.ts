export type LensCommand =
  "engineer" | "architect" | "data" | "cto" | "research";

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
      "Straight to the bug — root cause, fix, and proof it works. No scenic detour through architecture land.",
  },
  {
    command: "architect",
    trigger: "/architect",
    description:
      "Zooms out: system design, integration, trade-offs — plus the ADR nobody reads but should.",
  },
  {
    command: "data",
    trigger: "/data",
    description:
      "Data modeling, layering, governance, cost — basically where your data lives and why it's on fire.",
  },
  {
    command: "cto",
    trigger: "/cto",
    description:
      "Business-brain mode: build vs buy, budget, risk, and the roadmap you'll defend in standup.",
  },
  {
    command: "research",
    trigger: "/research",
    description:
      "Real sources, real citations, an actual conclusion — not just a pile of half-read links.",
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
