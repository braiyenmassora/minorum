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
    description: "Squash. Prove. Ship.",
  },
  {
    command: "architect",
    trigger: "/architect",
    description: "Big-picture energy.",
  },
  {
    command: "data",
    trigger: "/data",
    description: "Data's on fire.",
  },
  {
    command: "cto",
    trigger: "/cto",
    description: "Business brain on.",
  },
  {
    command: "research",
    trigger: "/research",
    description: "Receipts or bust.",
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
