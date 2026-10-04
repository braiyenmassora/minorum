"use client";

import {
  LENS_COMMANDS,
  type LensCommandDefinition,
} from "@/lib/core/config/lens-commands";

type LensCommandMenuProps = {
  /** Text typed after "/" so far (e.g. "" for bare "/", "eng" for "/eng"). */
  query: string;
  onSelect: (command: LensCommandDefinition) => void;
};

export function LensCommandMenu({ query, onSelect }: LensCommandMenuProps) {
  const q = query.toLowerCase();
  const filtered = LENS_COMMANDS.filter((entry) => entry.command.startsWith(q));

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div
      id="lens-command-menu"
      role="listbox"
      aria-label="Lens commands"
      className="flex max-h-[min(50dvh,20rem)] flex-col gap-inline-xs overflow-y-auto border-b border-border-subtle px-composer py-composer"
    >
      {filtered.map((entry) => (
        <button
          key={entry.command}
          type="button"
          role="option"
          aria-selected={false}
          className="flex w-full min-w-0 flex-col items-start gap-0.5 rounded-token-sm px-sidebar py-sidebar-item text-left transition-colors hover:bg-surface-raised"
          onClick={() => onSelect(entry)}
        >
          <span className="text-token-body-medium font-medium text-text-primary">
            {entry.trigger}
          </span>
          <span className="text-token-label text-text-muted">
            {entry.description}
          </span>
        </button>
      ))}
    </div>
  );
}
