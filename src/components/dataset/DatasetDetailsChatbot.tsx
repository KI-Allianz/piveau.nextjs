"use client";

import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { useLocale } from "@/hooks/useLocale";
import { Dataset } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TraceStep {
  step: "tool_call" | "tool_result" | "final_synthesis";
  tool?: string;
  arguments?: Record<string, any>;
  output_preview?: string;
  content?: string;
  iteration?: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  trace?: TraceStep[];
}

type Props = {
  dataset?: Dataset;
  className?: string;
  backendUrl: string;
};

const MAX_TURNS = 3;

// -----------------------------------------------------------------------------
// Subordinate Trace Accordion
// -----------------------------------------------------------------------------
function TraceAccordion({ trace }: { trace: TraceStep[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="mb-3 rounded border border-neutral-200/80 dark:border-neutral-700/60 bg-white/60 dark:bg-neutral-900/40 text-[10px] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1 text-neutral-600 dark:text-neutral-400 font-medium hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer text-left text-[10px]"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[11px]">🛠️</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Agent Trace</span>
          <span className="text-neutral-400 dark:text-neutral-500">({trace.length} {trace.length === 1 ? "step" : "steps"})</span>
        </span>
        <span className="text-[9px] text-neutral-500 font-mono">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="p-2 border-t border-neutral-200/60 dark:border-neutral-800 space-y-1.5 bg-white/80 dark:bg-neutral-950/40 text-[10px]">
          {trace.map((step, idx) => (
            <div key={idx} className="border-b border-neutral-100 dark:border-neutral-800/80 pb-1 last:border-0 last:pb-0">
              {step.step === "tool_call" && (
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="px-1 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[8.5px] tracking-wide">
                    TOOL
                  </span>
                  <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.2 rounded text-purple-700 dark:text-purple-300 font-mono text-[9.5px]">
                    {step.tool}({JSON.stringify(step.arguments || {})})
                  </code>
                </div>
              )}
              {step.step === "tool_result" && (
                <div className="flex flex-wrap items-baseline gap-1 text-neutral-500 dark:text-neutral-400">
                  <span className="px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[8.5px] tracking-wide">
                    OUTPUT
                  </span>
                  <span className="font-mono text-[9.5px] truncate max-w-full">
                    {step.output_preview}
                  </span>
                </div>
              )}
              {step.step === "final_synthesis" && (
                <div className="flex flex-wrap items-baseline gap-1 text-neutral-500 dark:text-neutral-400 italic text-[10px]">
                  <span className="px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[8.5px] tracking-wide not-italic">
                    THOUGHT
                  </span>
                  <span>{step.content}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Distinct Bouncing Typing Indicator
// -----------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-tl-xs bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200/50 dark:border-neutral-700/50 w-fit">
      <div className="flex items-center gap-1.5 h-3">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
      </div>
      <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Agent is thinking...</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function DatasetDetailsChatbot({
  dataset,
  className,
  backendUrl,
}: Props) {
  const [userInput, setUserInput] = useState("");
  const { translations } = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Client Session ID
  const [sessionId, setSessionId] = useState("");
  useEffect(() => {
    setSessionId(`web-${Math.random().toString(36).substring(2, 10)}`);
  }, []);

  const userTurnCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages]
  );

  const isSessionLimitReached = userTurnCount >= MAX_TURNS;

  const dynamicPlaceholder = useMemo(() => {
    if (isSessionLimitReached) {
      return `Session limit reached (${MAX_TURNS}/${MAX_TURNS}). Clear chat to ask more.`;
    }
    if (userTurnCount === 0) {
      return translations.dataset.assistant.placeholder || "E.g. What is the main topic of this dataset?";
    }
    const remaining = MAX_TURNS - userTurnCount;
    if (remaining === 1) {
      return "Ask your final question (1 question left)...";
    }
    return `Ask a follow-up (${remaining} of ${MAX_TURNS} questions left)...`;
  }, [isSessionLimitReached, userTurnCount, translations.dataset.assistant.placeholder]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const submitQuestion = useCallback(
    async (ds?: Dataset) => {
      const query = userInput.trim();
      if (!query || isLoading || isSessionLimitReached) return;
      if (!ds) {
        setError("Dataset is not available.");
        return;
      }

      const userMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: query,
      };

      setMessages((prev) => [...prev, userMsg]);
      setUserInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_input: query,
            json_data: JSON.stringify(ds),
            session_id: sessionId,
          }),
        });

        if (!res.ok) {
          const maybeJson = await res.json().catch(() => null);
          const detail =
            (maybeJson as any)?.detail ||
            res.statusText ||
            `HTTP ${res.status}`;
          throw new Error(detail);
        }

        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: typeof data === "object" && data?.response ? data.response : String(data),
          trace: data?.trace || [],
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (e: any) {
        setError("Error: " + (e?.message ?? "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    },
    [backendUrl, isLoading, isSessionLimitReached, sessionId, userInput]
  );

  const handleClear = () => {
    setMessages([]);
    setSessionId(`web-${Math.random().toString(36).substring(2, 10)}`);
    setError(null);
  };

  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {translations.dataset.assistant.header}
          </h5>
          {userTurnCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
              Turn {userTurnCount}/{MAX_TURNS}
            </span>
          )}
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Chat Bubble Thread with Generous Padding */}
      {messages.length > 0 && (
        <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                // User Chat Bubble with Comfortable Padding
                <div className="max-w-[80%] rounded-2xl rounded-tr-xs bg-(--main-accent)/15 border border-(--main-accent)/25 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 shadow-xs">
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                // Assistant Chat Bubble with Generous Breathing Room (px-5 py-4)
                <div className="max-w-[92%] rounded-2xl rounded-tl-xs bg-neutral-100/90 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60 px-5 py-4 text-neutral-800 dark:text-neutral-200 shadow-xs">
                  {/* Trace Accordion */}
                  {msg.trace && msg.trace.length > 0 && (
                    <TraceAccordion trace={msg.trace} />
                  )}

                  {/* Standardized Markdown Content (Remark/GFM powered) */}
                  <div className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1 break-all"
                          >
                            {props.children}
                            <span className="font-bold text-xs">↗</span>
                          </a>
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="my-1.5 leading-relaxed" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            {...props}
                            className="my-2 ml-5 space-y-1.5 list-disc marker:font-bold marker:text-neutral-700 dark:marker:text-neutral-300"
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="leading-relaxed pl-1" />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            {...props}
                            className="font-bold text-neutral-900 dark:text-neutral-100"
                          />
                        ),
                        code: ({ node, className, children, ...props }) => (
                          <code
                            {...props}
                            className="rounded bg-neutral-200/70 px-1 py-0.5 font-mono text-xs text-pink-600 dark:bg-neutral-700/70 dark:text-pink-400"
                          >
                            {children}
                          </code>
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            {...props}
                            className="mb-1 mt-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                          />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Noticeable Bouncing Dots */}
          {isLoading && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Row at the Bottom */}
      <div className="flex w-full pt-1">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitQuestion(dataset);
          }}
          placeholder={dynamicPlaceholder}
          disabled={isLoading || isSessionLimitReached}
          className="flex-1 h-10 rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus-visible:ring-0 rounded-r-none disabled:bg-neutral-100 disabled:text-neutral-400 shadow-xs"
        />

        <Button
          onClick={() => submitQuestion(dataset)}
          disabled={isLoading || !userInput.trim() || isSessionLimitReached}
          className="inline-flex items-center justify-center h-10 whitespace-nowrap rounded-md bg-(--main-accent) text-xs font-semibold text-white shadow-xs transition-colors hover:bg-(--main-accent)/90 disabled:cursor-not-allowed disabled:opacity-60 rounded-l-none px-5"
        >
          {translations.dataset.assistant.ask}
        </Button>
      </div>

      {/* Error notification */}
      {error && (
        <div
          className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}