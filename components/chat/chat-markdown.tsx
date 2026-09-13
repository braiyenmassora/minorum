"use client";

import { ExternalLink } from "lucide-react";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/chat/code-block";
import { extractNodeText } from "@/lib/utils/extract-node-text";
import { normalizeAssistantMarkdown } from "@/lib/utils/normalize-assistant-markdown";

type ChatMarkdownProps = {
  content: string;
};

function hostnameOf(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function LinkChip({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href) {
    return <>{children}</>;
  }

  const hostname = hostnameOf(href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="chat-markdown-link-chip"
    >
      <ExternalLink className="size-3 shrink-0" aria-hidden />
      <span className="chat-markdown-link-chip-text">{children}</span>
      {hostname ? (
        <span className="chat-markdown-link-chip-host">{hostname}</span>
      ) : null}
    </a>
  );
}

function extractCodeBlock(children: ReactNode): {
  code: string;
  language?: string;
} {
  const child = Children.toArray(children)[0];

  if (isValidElement<{ className?: string; children?: ReactNode }>(child)) {
    const className = child.props.className ?? "";
    const match = /language-([\w-]+)/.exec(className);

    return {
      code: extractNodeText(child).replace(/\n$/, ""),
      language: match?.[1],
    };
  }

  return {
    code: extractNodeText(children).replace(/\n$/, ""),
  };
}

function MarkdownPre({ children }: { children?: ReactNode }) {
  const { code, language } = extractCodeBlock(children);

  return <CodeBlock code={code} language={language} />;
}

export function ChatMarkdown({ content }: ChatMarkdownProps) {
  const markdown = normalizeAssistantMarkdown(content);

  return (
    <div className="chat-markdown break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <LinkChip href={href}>{children}</LinkChip>
          ),
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          h4: ({ children }) => <h4>{children}</h4>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          hr: () => <hr />,
          table: ({ children }) => (
            <div className="chat-markdown-table-wrap">
              <table>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,
          code: ({ className, children }) => {
            const isBlock = Boolean(className);
            if (isBlock) {
              return <code className={className}>{children}</code>;
            }

            return (
              <code className="chat-markdown-inline-code">{children}</code>
            );
          },
          pre: ({ children }) => <MarkdownPre>{children}</MarkdownPre>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
