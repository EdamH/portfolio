"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChatIcon, CloseIcon, SendIcon, ArrowDownIcon } from "./Icons";

/* ═══ Types ═══ */

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  scrollTarget?: string;
  model?: string;
}

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/* ═══ Lightweight Markdown renderer ═══ */

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  function flushList() {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-0.5 my-1">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listMatch = line.match(/^[\-\*]\s+(.+)/);

    if (listMatch) {
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();

    if (line.trim() === "") {
      if (i > 0 && i < lines.length - 1) {
        nodes.push(<br key={`br-${i}`} />);
      }
      continue;
    }

    nodes.push(
      <span key={`line-${i}`}>
        {i > 0 && lines[i - 1].trim() !== "" && !lines[i - 1].match(/^[\-\*]\s+/) && <br />}
        {renderInline(line)}
      </span>
    );
  }

  flushList();
  return nodes;
}

function renderInline(text: string): React.ReactNode[] {
  // Process: **bold**, *italic*, `code`, URLs
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|https?:\/\/[^\s),]+)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(<strong key={key++} className="font-medium">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={key++} className="font-mono text-accent bg-accent/10 px-1 py-0.5 text-xs">
          {match[4]}
        </code>
      );
    } else if (match[0].startsWith("http")) {
      parts.push(
        <a key={key++} href={match[0]} target="_blank" rel="noopener noreferrer"
           className="text-accent underline underline-offset-2 hover:text-foreground transition-colors duration-300">
          {match[0]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/* ═══ Helpers ═══ */

const SCROLL_RE = /\[SCROLL:([a-z-]+)\]/i;

function parseResponse(raw: string): { text: string; scrollTarget?: string } {
  const match = raw.match(SCROLL_RE);
  const text = raw.replace(SCROLL_RE, "").trim();
  return { text, scrollTarget: match?.[1] };
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ═══ Suggested questions ═══ */

const SUGGESTIONS = [
  "What does Edam do?",
  "Tell me about URANUS",
  "What's Excalidraw Atelier?",
  "What tech does he use?",
];

/* ═══ Component ═══ */

export default function ChatBubble() {
  const [bootDone, setBootDone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [showTeaser, setShowTeaser] = useState(false);
  const teaserDismissed = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ═══ Smooth text reveal buffer ═══
  const textQueueRef = useRef(""); // raw text waiting to be revealed
  const revealedRef = useRef("");  // text already shown
  const rafRef = useRef<number | null>(null);
  const CHARS_PER_FRAME = 3; // characters revealed per animation frame (~180 chars/sec at 60fps)

  const startRevealLoop = useCallback(
    (assistantId: string, modelName?: string) => {
      if (rafRef.current) return; // already running

      let lastTime = 0;
      const INTERVAL = 16; // ~60fps

      const tick = (time: number) => {
        if (time - lastTime >= INTERVAL) {
          lastTime = time;
          const queue = textQueueRef.current;

          if (queue.length > 0) {
            const chunk = queue.slice(0, CHARS_PER_FRAME);
            textQueueRef.current = queue.slice(CHARS_PER_FRAME);
            revealedRef.current += chunk;

            const { text: parsed, scrollTarget } = parseResponse(revealedRef.current);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, text: parsed, scrollTarget, model: modelName }
                  : m
              )
            );
          }
        }

        // Keep ticking as long as there's text or we're still streaming
        if (textQueueRef.current.length > 0 || streamingId) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [streamingId]
  );

  const stopRevealLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Handle open/close with exit animation
  const toggleChat = useCallback(() => {
    if (isAnimating) return;
    if (isOpen) {
      setIsAnimating(true);
      setIsOpen(false);
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 250);
    } else {
      setIsVisible(true);
      setIsAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOpen(true);
          setTimeout(() => setIsAnimating(false), 300);
        });
      });
    }
  }, [isOpen, isAnimating]);

  // Wait for boot sequence to finish
  useEffect(() => {
    // Already booted in a previous session
    if (sessionStorage.getItem("portfolio-booted")) {
      setBootDone(true);
      return;
    }
    // Poll for boot completion (set by BootWrapper)
    const interval = setInterval(() => {
      if (sessionStorage.getItem("portfolio-booted")) {
        setBootDone(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Show teaser bubble 4 seconds after boot completes (only once)
  useEffect(() => {
    if (!bootDone) return;
    const timer = setTimeout(() => {
      if (!teaserDismissed.current && !isOpen) {
        setShowTeaser(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [bootDone, isOpen]);

  // Dismiss teaser when chat opens
  useEffect(() => {
    if (isOpen && showTeaser) {
      setShowTeaser(false);
      teaserDismissed.current = true;
    }
  }, [isOpen, showTeaser]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        toggleChat();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleChat]);

  // Auto-scroll to bottom on new messages / streaming updates
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!showScrollBtn) scrollToBottom();
  }, [messages, showScrollBtn, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Track if user has scrolled up
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 60;
    setShowScrollBtn(!isNearBottom);
  };

  // Build Gemini-format history from messages
  const history = useMemo<GeminiMessage[]>(
    () =>
      messages
        .filter((m) => m.id !== streamingId) // exclude in-progress stream
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: m.text }],
        })),
    [messages, streamingId]
  );

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setStreamingId(assistantId);

    // Reset reveal buffer
    textQueueRef.current = "";
    revealedRef.current = "";
    stopRevealLoop();

    // Add empty assistant message that we'll stream into
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", text: "" },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history,
        }),
        signal: controller.signal,
      });

      // Non-streaming fallback (JSON response)
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        const reply = res.ok
          ? data.text || "No response."
          : data.error || "Something went wrong.";
        const { text: parsed, scrollTarget } = parseResponse(reply);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: parsed, scrollTarget, model: data.model }
              : m
          )
        );
        setIsLoading(false);
        setStreamingId(null);
        return;
      }

      // Streaming SSE response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let modelName: string | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line === "data: [DONE]") continue;
          if (!line.startsWith("data: ")) continue;

          try {
            const parsed = JSON.parse(line.slice(6));

            // First event carries the model name
            if (parsed.model && !parsed.text) {
              modelName = parsed.model;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, model: modelName } : m
                )
              );
              continue;
            }

            if (parsed.text) {
              // Queue text for smooth reveal instead of dumping it all at once
              textQueueRef.current += parsed.text;
              startRevealLoop(assistantId, modelName);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // Drain any remaining queued text immediately
      if (textQueueRef.current.length > 0) {
        revealedRef.current += textQueueRef.current;
        textQueueRef.current = "";
      }
      stopRevealLoop();

      // Final update with complete text
      if (revealedRef.current) {
        const { text: parsed, scrollTarget } = parseResponse(revealedRef.current);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, text: parsed, scrollTarget, model: modelName }
              : m
          )
        );
      }
    } catch (err) {
      stopRevealLoop();
      if ((err as Error).name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, text: "Connection error. Please try again." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      setStreamingId(null);
      abortRef.current = null;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!bootDone) return null;

  return (
    <>
      {/* ═══ Teaser bubble ═══ */}
      {showTeaser && !isOpen && (
        <button
          onClick={() => {
            setShowTeaser(false);
            teaserDismissed.current = true;
            toggleChat();
          }}
          className="fixed bottom-[5.5rem] right-6 z-[9998] max-w-[200px]
                     px-3 py-2 bg-card border border-accent/15 text-sm text-foreground
                     shadow-md cursor-pointer
                     animate-[fadeSlideUp_4s_cubic-bezier(0.23,1,0.32,1)_forwards]
                     hover:border-accent/40 transition-colors duration-500
                     max-sm:bottom-[5rem] max-sm:right-4"
        >
          <p className="font-mono text-xs text-accent leading-relaxed">
            Curious about my work? Ask me anything!
          </p>
          <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-card border-b border-r border-accent/15 rotate-45" />
        </button>
      )}

      {/* ═══ Floating bubble ═══ */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Ask me anything"}
        className="fixed bottom-6 right-6 z-[9998] w-12 h-12 flex items-center justify-center
                   border border-border bg-card text-accent
                   hover:border-accent hover:bg-card-hover
                   transition-all duration-300 cursor-pointer
                   max-sm:bottom-4 max-sm:right-4"
        style={{ borderRadius: 0 }}
      >
        <span
          className="transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          {isOpen ? <CloseIcon size={20} /> : <ChatIcon size={20} />}
        </span>
      </button>

      {/* ═══ Chat panel ═══ */}
      {isVisible && (
        <div
          className="fixed z-[9998]
                     flex flex-col border border-border bg-card
                     shadow-lg overflow-hidden
                     transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]

                     bottom-20 right-6 w-[360px] max-w-[calc(100vw-2rem)]

                     max-sm:inset-0 max-sm:w-full max-sm:max-w-none max-sm:border-0"
          style={{
            height: undefined,
            borderRadius: 0,
            opacity: isOpen ? 1 : 0,
            transform: isOpen
              ? "translateY(0) scale(1)"
              : "translateY(12px) scale(0.97)",
            transformOrigin: "bottom right",
          }}
        >
          {/* Use a wrapper for height — desktop constrained, mobile full */}
          <div className="flex flex-col h-[min(520px,calc(100vh-8rem))] max-sm:h-full">
            {/* Header */}
            <div
              onClick={toggleChat}
              className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface
                         sm:pointer-events-none max-sm:cursor-pointer max-sm:active:bg-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <p className="font-mono text-xs text-accent tracking-wide">
                  // Ask about Edam
                </p>
              </div>
              {/* Close icon — visible on mobile */}
              <div className="sm:hidden text-muted">
                <CloseIcon size={16} />
              </div>
            </div>

            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
              {messages.length === 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted">
                    Hey! Ask me anything about Edam — his work, projects, or
                    skills.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs font-mono px-3 py-1.5 border border-border
                                   text-muted hover:border-accent hover:text-accent
                                   transition-colors duration-300 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent/10 text-foreground border border-accent/20"
                        : "bg-surface text-foreground border border-border"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {msg.text ? renderMarkdown(msg.text) : null}
                        {streamingId === msg.id && !msg.text && (
                          <div className="flex gap-1.5 items-center h-5">
                            <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce" />
                            <span
                              className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce"
                              style={{ animationDelay: "0.15s" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce"
                              style={{ animationDelay: "0.3s" }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {msg.scrollTarget && streamingId !== msg.id && (
                      <button
                        onClick={() => scrollToSection(msg.scrollTarget!)}
                        className="mt-2 flex items-center gap-1.5 text-xs font-mono text-accent
                                   hover:underline cursor-pointer"
                      >
                        <ArrowDownIcon size={12} />
                        Jump to {msg.scrollTarget.replace(/-/g, " ")}
                      </button>
                    )}
                  </div>
                  {msg.role === "assistant" && msg.model && streamingId !== msg.id && (
                    <p className="mt-0.5 text-[10px] font-mono text-muted/50 tracking-wide">
                      {msg.model}
                    </p>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-to-bottom button */}
            {showScrollBtn && (
              <button
                onClick={() => {
                  scrollToBottom();
                  setShowScrollBtn(false);
                }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2
                           w-7 h-7 flex items-center justify-center
                           bg-card border border-border text-muted
                           hover:border-accent hover:text-accent
                           transition-colors duration-300 cursor-pointer"
                aria-label="Scroll to latest"
              >
                <ArrowDownIcon size={14} />
              </button>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-2.5 border-t border-border bg-surface
                         max-sm:pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Edam..."
                maxLength={500}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted
                           outline-none font-sans disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-8 h-8 flex items-center justify-center
                           text-muted hover:text-accent
                           disabled:opacity-30 disabled:cursor-not-allowed
                           transition-colors duration-300 cursor-pointer"
              >
                <SendIcon size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
