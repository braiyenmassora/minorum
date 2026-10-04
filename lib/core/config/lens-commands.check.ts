import { parseLensCommand, LENS_COMMANDS } from "./lens-commands";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  LENS_COMMANDS.length === 5,
  "five commands defined (no /auto — it's a no-op, same as typing nothing)",
);

assert(parseLensCommand("/engineer") === "engineer", "bare command");
assert(
  parseLensCommand("/engineer kenapa job gue OOM?") === "engineer",
  "command with trailing question",
);
assert(
  parseLensCommand("  /architect  desain ulang ini") === "architect",
  "leading whitespace tolerated",
);
assert(parseLensCommand("/ARCHITECT caps") === "architect", "case-insensitive");
assert(
  parseLensCommand("/auto") === undefined,
  "/auto is gone — unrecognized, falls through as plain text",
);
assert(
  parseLensCommand("/notarealcommand do x") === undefined,
  "unknown command → undefined",
);
assert(
  parseLensCommand("just a normal message") === undefined,
  "no leading slash → undefined",
);
assert(
  parseLensCommand("check out /engineer mid-sentence") === undefined,
  "slash must lead the message, not appear mid-sentence",
);
assert(parseLensCommand("") === undefined, "empty string → undefined");

console.log("lens-commands checks passed");
