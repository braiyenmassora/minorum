"use client";

import Image from "next/image";
import { Eraser, LogOut, Pin, PinOff, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppLogo } from "@/components/ui/app-logo";
import { ResetChatPanel } from "@/components/chat/reset-chat-panel";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { SystemStatusIndicator } from "@/components/chat/system-status-indicator";
import type { ChatSession } from "@/lib/models/chat-session";
import { getMessageText } from "@/lib/models/message-content";
import { getAppCopy } from "@/lib/core/copy/app-copy";
import type { SystemStatus } from "@/lib/services/system-status-service";
import { cn } from "@/lib/utils";

function sessionMatches(session: ChatSession, query: string): boolean {
  if (session.title.toLowerCase().includes(query)) {
    return true;
  }
  return session.messages.some((message) =>
    getMessageText(message.content).toLowerCase().includes(query),
  );
}

type SidebarCopy = ReturnType<typeof getAppCopy>["chat_history_sidebar"];

function SessionItem({
  session,
  isActive,
  copy,
  onSelect,
  onDelete,
  onTogglePin,
}: {
  session: ChatSession;
  isActive: boolean;
  copy: SidebarCopy;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onTogglePin: (sessionId: string, pinned: boolean) => void;
}) {
  return (
    <li className="group relative">
      <button
        type="button"
        className={cn(
          "w-full rounded-token-sm px-2 py-2 pr-16 text-left text-token-body-medium transition-colors",
          isActive
            ? "bg-surface-raised text-text-primary"
            : "text-text-secondary hover:bg-surface-raised/60 hover:text-text-primary",
        )}
        aria-current={isActive ? "true" : undefined}
        onClick={() => onSelect(session.id)}
      >
        <span className="line-clamp-2">{session.title}</span>
      </button>
      <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-0.5">
        <button
          type="button"
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-token-sm transition-opacity md:size-7",
            session.pinned
              ? "text-text-primary opacity-100"
              : "text-text-muted opacity-70 hover:bg-surface-raised hover:text-text-primary focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onTogglePin(session.id, !session.pinned);
          }}
          aria-label={session.pinned ? copy.unpin : copy.pin}
          aria-pressed={session.pinned}
        >
          {session.pinned ? (
            <PinOff className="size-3.5" />
          ) : (
            <Pin className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-token-sm text-text-muted opacity-70 transition-opacity hover:bg-surface-raised hover:text-error focus-visible:opacity-100 md:size-7 md:opacity-0 md:group-hover:opacity-100"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(session.id);
          }}
          aria-label={copy.delete}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
}

type ChatHistorySidebarProps = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  accountName?: string;
  systemStatus: SystemStatus;
  onNewChat: () => void;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onTogglePin: (sessionId: string, pinned: boolean) => void;
  onClearAll: () => void;
  onLogout: () => void;
  className?: string;
};

export function ChatHistorySidebar({
  sessions,
  activeSessionId,
  accountName,
  systemStatus,
  onNewChat,
  onSelect,
  onDelete,
  onTogglePin,
  onClearAll,
  onLogout,
  className,
}: ChatHistorySidebarProps) {
  const copy = getAppCopy().chat_history_sidebar;
  const displayName = accountName?.trim() || copy.account;
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);
  const [query, setQuery] = useState("");

  const filteredSessions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return sessions;
    }
    return sessions.filter((session) => sessionMatches(session, trimmed));
  }, [sessions, query]);

  // `sessions` already arrives pinned-first (see chat-session-db.ts); split
  // here just to render a "Pinned" heading above that group.
  const pinnedSessions = useMemo(
    () => filteredSessions.filter((session) => session.pinned),
    [filteredSessions],
  );
  const otherSessions = useMemo(
    () => filteredSessions.filter((session) => !session.pinned),
    [filteredSessions],
  );

  return (
    <aside
      className={cn(
        "relative flex h-full min-h-0 w-[280px] shrink-0 flex-col self-stretch bg-background after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-px after:bg-border-subtle",
        className,
      )}
      aria-label={copy.title}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-composer py-composer">
        <div className="flex min-w-0 items-center gap-2">
          <AppLogo size={24} className="shrink-0 rounded-full" priority />
          <h2 className="font-display truncate text-token-body font-extrabold tracking-tight text-text-primary">
            {copy.title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-token-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-error disabled:opacity-40 md:size-7"
            onClick={() => setConfirmingClearAll(true)}
            disabled={sessions.length === 0}
            aria-label={copy.clear_all}
            title={copy.clear_all}
          >
            <Eraser className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-token-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary md:size-7"
            onClick={onNewChat}
            aria-label={copy.new_chat}
            title={copy.new_chat}
          >
            <Plus className="size-4" />
          </button>
          <ThemeToggleButton />
        </div>
      </div>

      <ResetChatPanel
        open={confirmingClearAll}
        body={copy.clear_all_confirm_body}
        confirmLabel={copy.clear_all_confirm}
        cancelLabel={copy.clear_all_cancel}
        onCancel={() => setConfirmingClearAll(false)}
        onConfirm={() => {
          setConfirmingClearAll(false);
          onClearAll();
        }}
      />

      {sessions.length > 0 ? (
        <div className="relative px-2 pt-2">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search_placeholder}
            className="w-full rounded-token-sm border border-border-subtle bg-transparent py-1.5 pr-2 pl-7 text-token-body-medium text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:border-focus-ring"
            aria-label={copy.search_placeholder}
          />
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {sessions.length === 0 ? (
          <p className="px-2 py-4 text-center text-token-body-medium text-text-muted">
            {copy.empty}
          </p>
        ) : filteredSessions.length === 0 ? (
          <p className="px-2 py-4 text-center text-token-body-medium text-text-muted">
            {copy.no_search_results}
          </p>
        ) : (
          <>
            {pinnedSessions.length > 0 ? (
              <>
                <p className="px-2 pt-1 pb-1 text-token-label font-semibold tracking-wide text-text-muted uppercase">
                  {copy.pinned_section}
                </p>
                <ul className="mb-2 flex flex-col gap-0.5">
                  {pinnedSessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      copy={copy}
                      onSelect={onSelect}
                      onDelete={onDelete}
                      onTogglePin={onTogglePin}
                    />
                  ))}
                </ul>
              </>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {otherSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  copy={copy}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="border-t border-border-subtle p-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center gap-1 rounded-token-sm px-2 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Image
              src="/me.jpeg"
              alt={displayName}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover"
              priority
              unoptimized
            />
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-token-body font-extrabold tracking-tight text-text-primary">
                {displayName}
              </span>
              <SystemStatusIndicator status={systemStatus} className="mt-0.5" />
            </span>
          </div>
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-token-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-error md:size-7"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
