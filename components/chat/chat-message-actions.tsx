"use client";

import { Square, Volume2 } from "lucide-react";
import { useSyncExternalStore } from "react";

import { CopyIconButton } from "@/components/chat/copy-icon-button";
import { IconButton } from "@/components/ui/icon-button";
import {
  getActiveMessageSpeechId,
  subscribeMessageSpeech,
  toggleMessageSpeech,
} from "@/lib/utils/message-speech";

type ChatMessageActionsProps = {
  messageId: string;
  text: string;
};

export function ChatMessageActions({
  messageId,
  text,
}: ChatMessageActionsProps) {
  const activeMessageId = useSyncExternalStore(
    subscribeMessageSpeech,
    getActiveMessageSpeechId,
    () => null,
  );
  const isPlaying = activeMessageId === messageId;

  return (
    <div className="mt-3 flex items-center gap-stack-sm">
      <CopyIconButton text={text} label="Copy message" />
      <IconButton
        size="xs"
        active={isPlaying}
        onClick={() => {
          void toggleMessageSpeech(messageId, text);
        }}
        aria-label={isPlaying ? "Stop reading message" : "Read message aloud"}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <Square className="size-3 fill-current" aria-hidden />
        ) : (
          <Volume2 className="size-3.5" aria-hidden />
        )}
      </IconButton>
    </div>
  );
}
