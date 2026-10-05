export type LensCommand = "engineer" | "research";

export type LensCommandDefinition = {
  command: LensCommand;
  trigger: `/${LensCommand}`;
  label: string;
  description: string;
};

export const LENS_COMMANDS: readonly LensCommandDefinition[] = [
  {
    command: "engineer",
    trigger: "/engineer",
    label: "engineer",
    description: "Code to roadmap. Squash. Design. Ship.",
  },
  {
    command: "research",
    trigger: "/research",
    label: "research",
    description: "Sources first. Verify. Cite. Decide.",
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
