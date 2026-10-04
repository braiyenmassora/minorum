import { getAppCopy } from "@/lib/core/copy/app-copy";
import {
  getStatusDefinition,
  type StatusTone,
  type SystemStatus,
} from "@/lib/services/system-status-service";
import { cn } from "@/lib/utils";

type SystemStatusIndicatorProps = {
  status: SystemStatus;
  className?: string;
};

const DOT_BY_TONE: Record<StatusTone, string> = {
  neutral: "bg-text-muted",
  success: "bg-success",
  warning: "bg-warning",
  severe: "bg-severe",
  danger: "bg-error",
  info: "bg-info",
};

const TEXT_BY_TONE: Record<StatusTone, string> = {
  neutral: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  severe: "font-medium text-severe",
  danger: "font-medium text-error",
  info: "text-info",
};

export function SystemStatusIndicator({
  status,
  className,
}: SystemStatusIndicatorProps) {
  const checkingLabel = getAppCopy().system_status.checking;

  if (status === "checking") {
    return (
      <div
        className={cn("flex items-center gap-stack-sm", className)}
        role="status"
        aria-live="polite"
        aria-label={checkingLabel}
      >
        <span
          className="size-1.5 shrink-0 animate-pulse rounded-full bg-text-muted"
          aria-hidden
        />
        <span className="truncate text-token-label text-text-muted">
          {checkingLabel}
        </span>
      </div>
    );
  }

  const definition = getStatusDefinition(status);

  return (
    <div
      className={cn("flex items-center gap-stack-sm", className)}
      role="status"
      aria-live="polite"
      aria-label={definition.label}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          DOT_BY_TONE[definition.tone],
        )}
        aria-hidden
      />
      <span
        className={cn(
          "truncate text-token-label",
          TEXT_BY_TONE[definition.tone],
        )}
      >
        {definition.label}
      </span>
    </div>
  );
}
