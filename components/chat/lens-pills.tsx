"use client";

import {
  LENS_COMMANDS,
  type LensCommand,
} from "@/lib/core/config/lens-commands";
import { cn } from "@/lib/utils";

type LensPillsProps = {
  activeLens: LensCommand | undefined;
  disabled?: boolean;
  onSelect: (lens: LensCommand) => void;
  className?: string;
};

export function LensPills({
  activeLens,
  disabled = false,
  onSelect,
  className,
}: LensPillsProps) {
  return (
    <div
      role="group"
      aria-label="Lens"
      className={cn("flex min-w-0 items-center gap-1.5", className)}
    >
      {LENS_COMMANDS.map((entry) => {
        const active = activeLens === entry.command;
        return (
          <button
            key={entry.command}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            title={`${entry.trigger} — ${entry.description}`}
            onClick={() => onSelect(entry.command)}
            className={cn(
              "shrink-0 rounded-token-sm px-2 py-1 text-token-label font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
              active
                ? "bg-success text-text-on-accent"
                : "bg-surface-raised text-text-secondary hover:text-text-primary",
            )}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}
