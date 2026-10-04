"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { IconButton } from "@/components/ui/icon-button";

type CopyIconButtonProps = {
  text: string;
  className?: string;
  label?: string;
};

export function CopyIconButton({
  text,
  className,
  label = "Copy",
}: CopyIconButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <IconButton
      size="xs"
      onClick={() => void handleCopy()}
      aria-label={label}
      className={className}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Disalin" : ""}
      </span>
    </IconButton>
  );
}
