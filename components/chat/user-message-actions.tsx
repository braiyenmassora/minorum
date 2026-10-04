import { RotateCcw } from "lucide-react";

import { CopyIconButton } from "@/components/chat/copy-icon-button";
import { IconButton } from "@/components/ui/icon-button";
import { getAppCopy } from "@/lib/core/copy/app-copy";

type UserMessageActionsProps = {
  text: string;
  disabled?: boolean;
  onRetry: () => void;
};

export function UserMessageActions({
  text,
  disabled = false,
  onRetry,
}: UserMessageActionsProps) {
  const copy = getAppCopy().chat_bubble;

  return (
    <div className="mt-1 flex items-center justify-end gap-stack-sm">
      {text.trim() ? <CopyIconButton text={text} label={copy.copy} /> : null}
      <IconButton
        size="xs"
        onClick={onRetry}
        disabled={disabled}
        aria-label={copy.retry}
        className="disabled:pointer-events-none disabled:opacity-40"
      >
        <RotateCcw className="size-3.5" aria-hidden />
      </IconButton>
    </div>
  );
}
