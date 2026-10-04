import { CopyIconButton } from "@/components/chat/copy-icon-button";

type ChatMessageActionsProps = {
  text: string;
};

export function ChatMessageActions({ text }: ChatMessageActionsProps) {
  return (
    <div className="mt-3 flex items-center gap-stack-sm">
      <CopyIconButton text={text} label="Copy message" />
    </div>
  );
}
