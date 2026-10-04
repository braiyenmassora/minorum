import { parseLensCommand, LENS_COMMANDS } from "./lens-commands";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  LENS_COMMANDS.length === 3,
  "three commands — engineer (absorbs data), cto (absorbs architect), research",
);

assert(parseLensCommand("/engineer") === "engineer", "bare command");
assert(
  parseLensCommand("/engineer kenapa job gue OOM?") === "engineer",
  "command with trailing question",
);
assert(
  parseLensCommand("  /cto  should we build or buy this") === "cto",
  "leading whitespace tolerated",
);
assert(parseLensCommand("/CTO caps") === "cto", "case-insensitive");
assert(
  parseLensCommand("/architect redesign this") === undefined,
  "/architect was merged into /cto — no longer recognized",
);
assert(
  parseLensCommand("/data model this") === undefined,
  "/data was merged into /engineer — no longer recognized",
);
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
