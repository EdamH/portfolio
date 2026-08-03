"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

// ── Boot script lines ──
// Each line has: text, delay before showing (ms), color type
type LineType = "command" | "output" | "success" | "info" | "accent" | "dim" | "banner";

interface BootLine {
  text: string;
  type: LineType;
  delay: number; // ms to wait BEFORE showing this line
  typing?: boolean; // true = type char by char
}

const BOOT_SCRIPT: BootLine[] = [
  { text: "$ ssh edam@portfolio.dev", type: "command", delay: 400, typing: true },
  { text: "Connecting to 185.92.xx.xx:22...", type: "dim", delay: 600 },
  { text: "Authenticated (publickey).", type: "success", delay: 800 },
  { text: "", type: "dim", delay: 200 },
  { text: "Last login: Fri Apr 25 2026 from 10.0.0.1", type: "dim", delay: 300 },
  { text: "", type: "dim", delay: 100 },
  { text: "  ╔══════════════════════════════════════╗", type: "banner", delay: 100 },
  { text: "  ║   EDAM HAMZA · Portfolio v2.0        ║", type: "banner", delay: 80 },
  { text: "  ╚══════════════════════════════════════╝", type: "banner", delay: 80 },
  { text: "", type: "dim", delay: 400 },
  { text: "$ npm test", type: "command", delay: 200, typing: true },
  { text: "", type: "dim", delay: 500 },
  { text: "✓ 145 unit tests passed (billing engine)", type: "success", delay: 300 },
  { text: "✓ 11 smoke test suites passed (excalidraw-atelier)", type: "success", delay: 300 },
  { text: "✓ Claude contribution hidden. Shhhhhh.", type: "success", delay: 200 },
  { text: "", type: "dim", delay: 400 },
  { text: "$ systemctl status portfolio", type: "command", delay: 200, typing: true },
  { text: "● portfolio.service · active (running)", type: "accent", delay: 500 },
  { text: "  ├── hero .................. loaded", type: "info", delay: 120 },
  { text: "  ├── about ................. loaded", type: "info", delay: 120 },
  { text: "  ├── projects .............. loaded", type: "info", delay: 120 },
  { text: "  ├── experience ............ loaded", type: "info", delay: 120 },
  { text: "  ├── skills ................ loaded", type: "info", delay: 120 },
  { text: "  └── contact ............... loaded", type: "info", delay: 120 },
  { text: "", type: "dim", delay: 400 },
  { text: "$ ./launch --production", type: "command", delay: 200, typing: true },
  { text: "→ Initializing systems...", type: "accent", delay: 600 },
  { text: "→ All services operational", type: "accent", delay: 400 },
];

// Progress bar is handled separately after the lines

const TYPE_CHAR_SPEED = 35;

function getLineColor(type: LineType): string {
  switch (type) {
    case "command": return "var(--terminal-text)";
    case "output": return "var(--terminal-dim)";
    case "success": return "#28c840";
    case "info": return "var(--terminal-dim)";
    case "accent": return "var(--accent)";
    case "dim": return "var(--terminal-dim)";
    case "banner": return "var(--accent)";
  }
}

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<{ text: string; type: LineType }[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(-1); // -1 = not started, 0-100
  const [morphing, setMorphing] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [skipHintVisible, setSkipHintVisible] = useState(false);
  const [skipPrimed, setSkipPrimed] = useState(false); // first interaction primes, second skips
  const skipRef = useRef(false); // to break out of the async loop

  // Show skip hint after 2s
  useEffect(() => {
    const t = setTimeout(() => setSkipHintVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Skip handler — first tap primes, second tap skips
  const handleSkip = useCallback(() => {
    if (morphing) return;
    if (!skipPrimed) {
      setSkipPrimed(true);
      // Auto-reset after 3s if they don't follow through
      setTimeout(() => setSkipPrimed(false), 3000);
      return;
    }
    // Second tap — actually skip
    skipRef.current = true;
    setMorphing(true);
    setTimeout(() => onComplete(), 900);
  }, [skipPrimed, morphing, onComplete]);

  // Listen for keypress + click/tap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Shift" || e.key === "Alt" || e.key === "Control" || e.key === "Meta") return;
      handleSkip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSkip]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  // Type a single line character by character with human-like timing
  const typeLine = useCallback(
    (text: string): Promise<void> =>
      new Promise((resolve) => {
        setIsTyping(true);
        setTypingText("");
        let i = 0;

        function typeNext() {
          i++;
          setTypingText(text.slice(0, i));
          if (i >= text.length) {
            setIsTyping(false);
            resolve();
            return;
          }

          // Human-like delay per character
          const char = text[i];
          let delay = TYPE_CHAR_SPEED + Math.random() * 50;

          // Slightly longer pause after spaces (word boundaries)
          if (char === " ") delay += 30 + Math.random() * 40;
          // Brief stumble on special chars
          if ("-/.@".includes(char)) delay += 20 + Math.random() * 30;
          // Occasional micro-pause (5% chance) — like a human hesitating
          if (Math.random() < 0.05) delay += 80 + Math.random() * 100;
          // Burst of speed on easy stretches (20% chance)
          if (Math.random() < 0.2) delay *= 0.5;

          setTimeout(typeNext, delay);
        }

        setTimeout(typeNext, TYPE_CHAR_SPEED);
      }),
    []
  );

  // Main boot sequence
  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const t = setTimeout(r, ms);
        if (cancelled) clearTimeout(t);
      });

    async function run() {
      for (const line of BOOT_SCRIPT) {
        if (cancelled || skipRef.current) return;
        // Jitter the delay ±30% for organic feel
        const jitter = line.delay * (0.7 + Math.random() * 0.6);
        await sleep(jitter);
        if (cancelled || skipRef.current) return;

        if (line.typing) {
          await typeLine(line.text);
          if (cancelled) return;
          setLines((prev) => [...prev, { text: line.text, type: line.type }]);
          setTypingText("");
        } else {
          setLines((prev) => [...prev, { text: line.text, type: line.type }]);
        }
      }

      // Progress bar
      if (cancelled) return;
      await sleep(300);
      setProgress(0);

      for (let i = 0; i <= 100; i += 4) {
        if (cancelled) return;
        setProgress(i);
        await sleep(30 + Math.random() * 20);
      }
      setProgress(100);

      // Brief pause then slide away
      await sleep(800);
      if (cancelled) return;
      setMorphing(true);

      // Wait for slide animation to finish then unmount
      await sleep(900);
      if (cancelled) return;
      onComplete();
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [typeLine, onComplete]);

  const progressBar = progress >= 0
    ? "→ Launching portfolio " +
      "▓".repeat(Math.floor(progress / 4)) +
      "░".repeat(25 - Math.floor(progress / 4)) +
      ` ${progress}%`
    : null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] cursor-pointer"
      style={{ backgroundColor: "#0c0c0e" }}
      animate={morphing ? { y: "-100%" } : { y: 0 }}
      transition={
        morphing
          ? { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0 }
      }
      onClick={handleSkip}
    >
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Skip hint — bottom right */}
      {skipHintVisible && !morphing && (
        <div className="absolute bottom-6 right-6 z-10 font-mono text-xs animate-fade-in">
          {skipPrimed ? (
            <span className="text-accent">press again to skip ▸</span>
          ) : (
            <span className="text-neutral-600">click or press any key to skip ▸</span>
          )}
        </div>
      )}

      {/* Fullscreen terminal */}
      <div className="relative h-full flex flex-col">
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 px-6 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] font-mono tracking-wide text-neutral-600">
            edam@portfolio · boot
          </span>
        </div>

        {/* Terminal body — fills the screen */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 font-mono text-sm leading-7">
          {lines.map((line, i) => (
            <div key={i} style={{ color: getLineColor(line.type), minHeight: line.text ? undefined : "1.5em" }}>
              {line.text}
            </div>
          ))}

          {/* Currently typing line */}
          {isTyping && (
            <div style={{ color: "var(--terminal-text)" }}>
              {typingText}
              <span
                className="inline-block w-2 h-4 ml-px align-middle"
                style={{
                  backgroundColor: cursorVisible ? "var(--accent)" : "transparent",
                }}
              />
            </div>
          )}

          {/* Progress bar */}
          {progressBar && !isTyping && (
            <div style={{ color: "var(--accent)" }}>{progressBar}</div>
          )}

          {/* Idle cursor */}
          {!isTyping && progress < 100 && (
            <span
              className="inline-block w-2 h-4 mt-1 align-middle"
              style={{
                backgroundColor: cursorVisible ? "var(--accent)" : "transparent",
              }}
            />
          )}

          {/* Final message */}
          {progress >= 100 && !morphing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: "#28c840" }}
              className="mt-2"
            >
              ✓ Portfolio ready. Welcome.
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
