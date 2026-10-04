import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type IconButtonSize = "xs" | "responsive" | "composer";
type IconButtonTone = "default" | "danger";

const SIZE_CLASS: Record<IconButtonSize, string> = {
  xs: "size-control-xs",
  responsive: "icon-btn-responsive",
  composer: "size-[var(--composer-icon-size)]",
};

const TONE_HOVER_CLASS: Record<IconButtonTone, string> = {
  default: "hover:text-text-primary",
  danger: "hover:text-error",
};

export type IconButtonProps = ComponentProps<"button"> & {
  size: IconButtonSize;
  tone?: IconButtonTone;
  /** Pressed/toggled visual (TTS playing, pinned, …) instead of hover-only. */
  active?: boolean;
};

/**
 * Shared base for the plain icon-only buttons scattered across the chat UI
 * (toolbar actions, message actions, composer attach buttons) — one place
 * for the rounded/hover/disabled visual instead of re-typing it per file.
 */
export function IconButton({
  size,
  tone = "default",
  active = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-token-sm transition-colors",
        SIZE_CLASS[size],
        active
          ? "bg-surface-raised text-text-primary"
          : cn(
              "text-text-muted hover:bg-surface-raised",
              TONE_HOVER_CLASS[tone],
            ),
        className,
      )}
      {...props}
    />
  );
}
