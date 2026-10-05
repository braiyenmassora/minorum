import {
  LENS_COMMANDS,
  type LensCommand,
} from "@/lib/core/config/lens-commands";
import { cn } from "@/lib/utils";

/** Dot + label, same pattern as SystemStatusIndicator's success tone. */
export function LensBadge({
  lens,
  className,
}: {
  lens: LensCommand;
  className?: string;
}) {
  const entry = LENS_COMMANDS.find((item) => item.command === lens);
  if (!entry) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-stack-sm", className)}>
      <span className="size-1.5 shrink-0 rounded-full bg-success" aria-hidden />
      <span className="text-token-label font-medium text-success-text">
        {entry.label}
      </span>
    </div>
  );
}
