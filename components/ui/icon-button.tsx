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
};

/**
 * Shared base for the plain icon-only buttons scattered across the chat UI
 * (toolbar actions, message actions, composer attach buttons) — one place
 * for the rounded/hover/disabled visual instead of re-typing it per file.
 */
export function IconButton({
  size,
  tone = "default",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-token-sm text-text-muted transition-colors hover:bg-surface-raised",
        SIZE_CLASS[size],
        TONE_HOVER_CLASS[tone],
        className,
      )}
      {...props}
    />
  );
}
