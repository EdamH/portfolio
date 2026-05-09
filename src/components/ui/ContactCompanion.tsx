"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Kaomoji Faces ──────────────────────────────────────────────────────

const MOOD_FACES = {
  content: {
    base: "(◕‿◕)",
    idle: [
      "(◕ᴗ◕)",
      "(◕‿◕)ノ",
      "(◕ω◕)",
      "(◕‿◕)♪",
      "(◕‿◕)☕",
      "(◕ᴗ◕)~♡",
      "(◕‿◕)✎",
      "( ◕‿◕)",
      "(◕‿◕ )",
      "( ◕ᴗ◕)",
      "(◕ᴗ◕ )",
    ],
  },
  excited: {
    base: "(★‿★)",
    idle: [
      "(★▽★)",
      "(★‿★)ノ",
      "(★ω★)",
      "(★‿★)♪",
      "(★‿★)◝",
      "(★▽★)✎",
      "( ★‿★)",
      "(★‿★ )",
      "( ★▽★)",
      "(★▽★ )",
    ],
  },
  ecstatic: {
    base: "(★▽★)🔥",
    idle: [
      "(★▽★)♪",
      "(★‿★)ノ🔥",
      "(★ω★)~",
      "(★▽★)◝♪",
      "(★‿★)🔥",
      "( ★▽★)🔥",
      "(★▽★ )🔥",
    ],
  },
};

const REACTION_SEQUENCES: Record<string, string[]> = {
  feed:    ["(◕△◕)", "(◕ᴗ◕)", "(◕△◕)", "(◕ᴗ◕)", "(◕△◕)", "(◕ᴗ◕)", "(◕‿◕)~", "(  ‿  )~♡"],
  splash:  ["( ◕‿◕)", "(◕‿◕ )", "( ◕‿◕)", "(◕‿◕ )", "( ◕‿◕)", "(◕‿◕ )", "(◕‿◕)", "(◕ ◕)°"],
  pet:     ["(◕ω◕)", "(◕ω◕)", "(◕ω◕)", "(♥‿♥)"],
  bonk:    ["(◕_◕)", "(◕_◕)!", "(×_×)", "( ×  _ × )", "(@_@)~", "(@_@)~✧"],
  success: ["(★‿★)", "(★▽★)", "(★‿★)♪", "(♥‿♥)~♡"],
  error:   ["(◕_◕)", "(◕_◕)!", "(×_×)", "(×_×)~"],
  secret:  ["(◕_◕)", "(◕_◕)...", "(◣‿◢)", "(◣▽◢)", "(◣‿◢)~🔥", "(◣ω◢)", "(◣‿◢)", "(◕‿◕)"],
};

const ACTION_PARTICLES: Record<string, string[]> = {
  feed:    ["·", "◦", "°", "·", "◦"],
  splash:  ["·", "✧", "°", "·", "✧"],
  pet:     ["♡", "♡", "♡"],
  bonk:    ["★", "✦", "✧", "※", "☆", "✦", "★"],
  success: ["♡", "✧", "★", "♡", "✧", "★", "♡"],
  error:   ["·", "·", "·"],
  secret:  ["🔥", "◣", "◢", "🔥", "◣", "◢"],
};

const ACTION_SPEECH: Record<string, string[]> = {
  feed:    ["num num~", "nom nom!", "num num num~"],
  splash:  ["scrub scrub~", "splish splash~", "so fresh!"],
  pet:     ["*purr*", "*purr purr*", "*purrrrr*~"],
  bonk:    ["ouch!", "ow!", "$&@!!", "owie!"],
  success: ["yay! sent!", "message away~♡", "woohoo!"],
  error:   ["oh no...", "something broke!", "try again?"],
  secret:  ["heh heh heh~", "...boo.", "i'm free~", "*evil giggle*"],
};

const GREETING_VARIANTS = [
  "oh, a message?",
  "don't be shy~",
  "hewwo~",
  "hii~",
  "oh! hi!",
  "let's talk!",
  "~hi hi~",
];

const FIELD_FOCUS_MESSAGES: Record<string, string[]> = {
  name:    ["→ who's writing?", "→ ooh, introductions~"],
  email:   ["→ noting email...", "→ how to reach you~"],
  subject: ["→ what's this about?", "→ a subject!"],
  message: ["→ composing message...", "→ tell me everything~"],
};

// ─── Easter Egg Overlay ─────────────────────────────────────────────────

const EGG_SPARKLES = ["✦", "✧", "★", "☆", "·", "°", "♡"];

function EasterEggOverlay({ count, onDone }: { count: number; onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const sparkles = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      char: EGG_SPARKLES[Math.floor(Math.random() * EGG_SPARKLES.length)],
      sx: `${(Math.random() - 0.5) * 200}px`,
      sy: `${(Math.random() - 0.5) * 200}px`,
      delay: `${Math.random() * 0.3}s`,
      size: 12 + Math.random() * 20,
    }))
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => setPhase("out"), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none ${
        phase === "in" ? "animate-egg-in" : "animate-egg-out"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onAnimationEnd={() => {
        if (phase === "out") onDone();
      }}
    >
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <span className="animate-egg-cup inline-block text-8xl sm:text-9xl">🏆</span>
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute animate-egg-sparkle"
              style={{
                left: "50%",
                top: "50%",
                fontSize: `${s.size}px`,
                color: "var(--accent)",
                animationDelay: s.delay,
                "--sx": s.sx,
                "--sy": s.sy,
              } as React.CSSProperties}
            >
              {s.char}
            </span>
          ))}
        </div>
        <p className="font-serif italic text-4xl sm:text-5xl text-white text-center leading-tight tracking-tight">
          Certified Petter
        </p>
        <p className="font-mono text-accent text-sm tracking-widest uppercase">
          {count} pets and counting
        </p>
      </div>
    </div>
  );
}

// ─── Floating Particles ─────────────────────────────────────────────────

interface FloatingParticle {
  id: number;
  content: string;
  x: number;
  y: number;
  isText: boolean;
}

function FloatingParticles({
  items,
  onDone,
}: {
  items: FloatingParticle[];
  onDone: (id: number) => void;
}) {
  return (
    <>
      {items.map((p) => (
        <span
          key={p.id}
          className={
            p.isText
              ? "pointer-events-none absolute whitespace-nowrap font-mono text-xs animate-pet-text-float"
              : "pointer-events-none absolute whitespace-nowrap text-sm animate-pet-heart-float"
          }
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.isText ? "var(--terminal-dim)" : "var(--accent)",
          }}
          onAnimationEnd={() => onDone(p.id)}
        >
          {p.isText ? <>«&thinsp;{p.content}&thinsp;»</> : p.content}
        </span>
      ))}
    </>
  );
}

// ─── Idle Animation Hook ────────────────────────────────────────────────

type Mood = "content" | "excited" | "ecstatic";

function usePetAnimation(mood: Mood) {
  const faces = MOOD_FACES[mood];
  const [face, setFace] = useState(faces.base);
  const sequenceRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function scheduleNext() {
      const delay = mood === "ecstatic" ? 1500 + Math.random() * 1500 : 3000 + Math.random() * 3000;
      timerRef.current = setTimeout(() => {
        if (sequenceRef.current) {
          scheduleNext();
          return;
        }
        const variant =
          faces.idle[Math.floor(Math.random() * faces.idle.length)];
        setFace(variant);
        setTimeout(() => {
          if (!sequenceRef.current) setFace(faces.base);
          scheduleNext();
        }, 800);
      }, delay);
    }
    setFace(faces.base);
    scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, [mood, faces]);

  const playSequence = useCallback(
    (frames: string[], frameDuration: number, holdCount = 1, holdDuration = 800) => {
      sequenceRef.current = true;
      let i = 0;
      function next() {
        if (i < frames.length) {
          setFace(frames[i]);
          const isHold = i >= frames.length - holdCount;
          const delay = isHold ? holdDuration : frameDuration;
          i++;
          setTimeout(next, delay);
        } else {
          sequenceRef.current = false;
          setFace(faces.base);
        }
      }
      next();
    },
    [faces]
  );

  return { face, playSequence };
}

// ─── 8-Directional Eye Tracking ─────────────────────────────────────────

function RotatedEye({ deg }: { deg: number }) {
  return (
    <span className="inline-block" style={{ transform: `rotate(${deg}deg)` }}>
      ◕
    </span>
  );
}

const GAZE_FACES: Record<string, React.ReactNode> = {
  n: (
    <>
      (
      <span className="inline-block" style={{ transform: "translateY(-4px)" }}>
        ◒‿◒
      </span>
      )
    </>
  ),
  ne: (
    <>
      ( <RotatedEye deg={90} />‿<RotatedEye deg={90} />)
    </>
  ),
  e: "( ◐‿◐)",
  se: (
    <>
      ( <RotatedEye deg={180} />‿<RotatedEye deg={180} />)
    </>
  ),
  s: "(◓‿◓)",
  sw: (
    <>
      (<RotatedEye deg={270} />‿<RotatedEye deg={270} /> )
    </>
  ),
  w: "(◑‿◑ )",
  nw: "(◕‿◕ )",
};

// ─── Terminal Log Line ──────────────────────────────────────────────────

interface TerminalLine {
  text: string;
  type: "command" | "success" | "dim" | "accent" | "error";
}

function TerminalLog({ lines }: { lines: TerminalLine[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  const colorMap: Record<TerminalLine["type"], string> = {
    command: "var(--terminal-text)",
    success: "#28c840",
    dim: "var(--terminal-dim)",
    accent: "var(--accent)",
    error: "#ff5f57",
  };

  return (
    <div ref={containerRef} className="font-mono text-xs leading-6 flex-1 min-h-[72px] max-h-[180px] overflow-y-auto scrollbar-thin">
      {lines.map((line, i) => (
        <div key={i} style={{ color: colorMap[line.type] }}>
          {line.text}
        </div>
      ))}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────

const VALID_COMMANDS = ["feed", "splash", "bonk", "pet", "pets", "secret", "help", "clear"] as const;
type Command = (typeof VALID_COMMANDS)[number];

const HELP_LINES: TerminalLine[] = [
  { text: "available commands:", type: "accent" },
  { text: "  /feed    — feed the companion", type: "dim" },
  { text: "  /splash  — give it a bath", type: "dim" },
  { text: "  /bonk    — bonk it (not recommended)", type: "dim" },
  { text: "  /pet     — pet the companion", type: "dim" },
  { text: "  /pets    — show pet counter", type: "dim" },
  { text: "  /clear   — clear terminal", type: "dim" },
  { text: "  /help    — show this message", type: "dim" },
];

interface ContactCompanionProps {
  focusedField?: string | null;
  messageLength?: number;
  formStatus?: "idle" | "sending" | "success" | "error";
}

export default function ContactCompanion({
  focusedField = null,
  messageLength = 0,
  formStatus = "idle",
}: ContactCompanionProps) {
  // Mood: ecstatic if long message while focused, excited if any field focused, content otherwise
  const mood: Mood =
    focusedField && messageLength > 150
      ? "ecstatic"
      : focusedField
        ? "excited"
        : "content";

  const { face, playSequence } = usePetAnimation(mood);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [gazeFace, setGazeFace] = useState<React.ReactNode | null>(null);
  const [actionCooldown, setActionCooldown] = useState(false);
  const [input, setInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: "$ ./spawn_companion.sh", type: "command" },
    { text: "✓ companion spawned", type: "success" },
    { text: "→ type /help for commands", type: "accent" },
    { text: "psst... try petting it a few times", type: "dim" },
  ]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [petCount, setPetCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const particleIdRef = useRef(0);
  const petFaceRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFieldRef = useRef<string | null>(null);
  const prevStatusRef = useRef(formStatus);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // ── Spawn particles ──

  const spawnParticles = useCallback(
    (items: { content: string; isText: boolean }[]) => {
      items.forEach((item, i) => {
        setTimeout(() => {
          setParticles((prev) => [
            ...prev,
            {
              id: particleIdRef.current++,
              content: item.content,
              x: item.isText ? 35 + Math.random() * 30 : 15 + Math.random() * 70,
              y: item.isText ? 0 + Math.random() * 15 : 10 + Math.random() * 60,
              isText: item.isText,
            },
          ]);
        }, i * 80);
      });
    },
    []
  );

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── React to field focus changes ──

  useEffect(() => {
    if (focusedField && focusedField !== prevFieldRef.current) {
      const messages = FIELD_FOCUS_MESSAGES[focusedField];
      if (messages) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        setTerminalLines((prev) => [...prev, { text: msg, type: "dim" }]);
      }
    }
    // Look toward the form field's vertical position
    const fieldGaze: Record<string, string> = {
      name: "nw",
      email: "w",
      subject: "sw",
      message: "sw",
    };
    if (focusedField && !actionCooldown) {
      setGazeFace(GAZE_FACES[fieldGaze[focusedField] || "w"]);
    } else if (!focusedField && prevFieldRef.current) {
      setGazeFace(null);
    }
    prevFieldRef.current = focusedField;
  }, [focusedField, actionCooldown]);

  // ── React to form submission status ──

  useEffect(() => {
    if (formStatus === prevStatusRef.current) return;
    prevStatusRef.current = formStatus;

    if (formStatus === "sending") {
      setTerminalLines((prev) => [
        ...prev,
        { text: "$ sending message...", type: "command" },
      ]);
    }

    if (formStatus === "success") {
      setTerminalLines((prev) => [
        ...prev,
        { text: "✓ message delivered!", type: "success" },
      ]);
      // Play success reaction
      if (!actionCooldown) {
        setActionCooldown(true);
        playSequence(REACTION_SEQUENCES.success, 200, 1, 1000);
        spawnParticles(
          ACTION_PARTICLES.success.map((s) => ({ content: s, isText: false }))
        );
        const speech =
          ACTION_SPEECH.success[
            Math.floor(Math.random() * ACTION_SPEECH.success.length)
          ];
        setTimeout(() => {
          spawnParticles([{ content: speech, isText: true }]);
        }, 400);
        setTimeout(() => setActionCooldown(false), 2000);
      }
    }

    if (formStatus === "error") {
      setTerminalLines((prev) => [
        ...prev,
        { text: "✗ delivery failed", type: "error" },
      ]);
      if (!actionCooldown) {
        setActionCooldown(true);
        playSequence(REACTION_SEQUENCES.error, 250, 1, 1000);
        spawnParticles(
          ACTION_PARTICLES.error.map((s) => ({ content: s, isText: false }))
        );
        const speech =
          ACTION_SPEECH.error[
            Math.floor(Math.random() * ACTION_SPEECH.error.length)
          ];
        setTimeout(() => {
          spawnParticles([{ content: speech, isText: true }]);
        }, 500);
        setTimeout(() => setActionCooldown(false), 2000);
      }
    }
  }, [formStatus, actionCooldown, playSequence, spawnParticles]);

  // ── Execute action ──

  const executeAction = useCallback(
    (action: string) => {
      if (actionCooldown) return;

      const sequences = REACTION_SEQUENCES[action];
      const particleSymbols = ACTION_PARTICLES[action];
      const speechPool = ACTION_SPEECH[action];

      if (!sequences) return;

      setActionCooldown(true);

      const frameDuration = action === "secret" ? 250 : action === "bonk" ? 200 : 150;
      const holdDuration = action === "secret" ? 1000 : action === "bonk" ? 1200 : 800;
      const holdCount = action === "bonk" ? 2 : 1;
      playSequence(sequences, frameDuration, holdCount, holdDuration);

      if (particleSymbols) {
        spawnParticles(particleSymbols.map((s) => ({ content: s, isText: false })));
      }

      if (speechPool) {
        const speech = speechPool[Math.floor(Math.random() * speechPool.length)];
        setTimeout(() => {
          spawnParticles([{ content: speech, isText: true }]);
        }, frameDuration * 2);
      }

      const totalDuration =
        (sequences.length - holdCount) * frameDuration + holdDuration;
      setTimeout(() => setActionCooldown(false), totalDuration);
    },
    [actionCooldown, playSequence, spawnParticles]
  );

  // ── Handle command input ──

  const handleCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim().toLowerCase();
      const cmd = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

      setTerminalLines((prev) => [...prev, { text: `$ /${cmd}`, type: "command" }]);

      if (cmd === "help") {
        setTerminalLines((prev) => [...prev, ...HELP_LINES]);
        return;
      }

      if (cmd === "clear") {
        setTerminalLines([
          { text: "$ clear", type: "command" },
          { text: "✓ terminal cleared", type: "success" },
        ]);
        return;
      }

      if (!VALID_COMMANDS.includes(cmd as Command)) {
        setTerminalLines((prev) => [
          ...prev,
          { text: `✗ unknown command: /${cmd}`, type: "error" },
          { text: "→ type /help for available commands", type: "accent" },
        ]);
        return;
      }

      if (actionCooldown) {
        setTerminalLines((prev) => [
          ...prev,
          { text: "⏳ companion is busy, wait a moment...", type: "dim" },
        ]);
        return;
      }

      if (cmd === "pets") {
        setTerminalLines((prev) => [
          ...prev,
          { text: `♡ petted ${petCount} time${petCount !== 1 ? "s" : ""} this session`, type: "accent" },
        ]);
        return;
      }

      // Secret doesn't show in /help — an actual easter egg
      if (cmd === "secret") {
        executeAction("secret");
        setTerminalLines((prev) => [
          ...prev,
          { text: "⚡ demon mode activated", type: "error" },
          { text: "→ ...a nod to excalidraw-persistence", type: "accent" },
        ]);
        return;
      }

      executeAction(cmd);

      if (cmd === "pet") {
        setPetCount((c) => {
          const next = c + 1;
          if (next % 4 === 0) setShowEgg(true);
          return next;
        });
      }

      const responseMap: Record<string, string> = {
        feed: "✓ nom nom nom~",
        splash: "✓ splish splash~",
        bonk: "✓ ...ouch!",
        pet: "✓ *purr purr*",
      };

      setTerminalLines((prev) => [
        ...prev,
        { text: responseMap[cmd] || "✓ done", type: "success" },
      ]);
    },
    [actionCooldown, executeAction]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        handleCommand(input);
        setInput("");
      }
    }
  };

  // ── 8-directional eye tracking ──

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (actionCooldown) return;
      const petEl = petFaceRef.current;
      if (!petEl) return;
      const rect = petEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) {
        setGazeFace(null);
        return;
      }

      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      let dir: string;
      if (angle >= -22.5 && angle < 22.5) dir = "e";
      else if (angle >= 22.5 && angle < 67.5) dir = "se";
      else if (angle >= 67.5 && angle < 112.5) dir = "s";
      else if (angle >= 112.5 && angle < 157.5) dir = "sw";
      else if (angle >= 157.5 || angle < -157.5) dir = "w";
      else if (angle >= -157.5 && angle < -112.5) dir = "nw";
      else if (angle >= -112.5 && angle < -67.5) dir = "n";
      else dir = "ne";

      setGazeFace(GAZE_FACES[dir]);
    },
    [actionCooldown]
  );

  const handleMouseEnter = useCallback(() => {
    if (!greetedRef.current && !actionCooldown) {
      greetedRef.current = true;
      const greeting =
        GREETING_VARIANTS[Math.floor(Math.random() * GREETING_VARIANTS.length)];
      spawnParticles([{ content: greeting, isText: true }]);
    }
  }, [actionCooldown, spawnParticles]);

  const handleMouseLeave = useCallback(() => {
    setGazeFace(null);
    greetedRef.current = false;
  }, []);

  // Determine body animation class
  const animationClass =
    mood === "ecstatic"
      ? "animate-pet-wiggle"
      : mood === "excited"
        ? "animate-pet-hop"
        : "animate-pet-breathe";

  return (
    <div
      className="rounded-t-lg overflow-hidden flex-1 flex flex-col"
      style={{
        backgroundColor: "var(--terminal-bg)",
        border: "1px solid var(--terminal-border)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Terminal header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid var(--terminal-header-border)" }}
      >
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span
          className="ml-3 text-[11px] font-mono tracking-wide flex-1"
          style={{ color: "var(--terminal-dim)" }}
        >
          excalidraw-persistence — spawn_companion.sh
        </span>
        {petCount > 0 && (
          <span
            className="text-[10px] font-mono tracking-wide"
            style={{ color: "var(--terminal-dim)" }}
          >
            ♡ {petCount}
          </span>
        )}
      </div>

      {/* Terminal body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Pet face area */}
        <div className="flex flex-col items-center mb-4">
          <div
            ref={petFaceRef}
            className="relative inline-block px-2 py-3 overflow-visible cursor-pointer select-none"
            onMouseDown={() => {
              if (!actionCooldown) {
                handleCommand("/pet");
              }
            }}
          >
            <span
              role="img"
              className={`font-mono text-3xl whitespace-nowrap inline-block origin-bottom ${animationClass}`}
              style={{ color: "var(--terminal-text)" }}
              aria-label="Companion pet"
            >
              {gazeFace && !actionCooldown ? gazeFace : face}
            </span>

            <FloatingParticles items={particles} onDone={removeParticle} />
          </div>
        </div>

        {/* Terminal log */}
        <div className="flex-1 flex flex-col justify-end">
          <TerminalLog lines={terminalLines} />
        </div>

        {/* Command input */}
        <div
          className="flex items-center gap-2 mt-3 pt-3"
          style={{ borderTop: "1px solid var(--terminal-header-border)" }}
        >
          <span
            className="font-mono text-xs shrink-0"
            style={{ color: "var(--accent)" }}
          >
            $
          </span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="/help"
              className="w-full bg-transparent font-mono text-xs outline-none placeholder:opacity-40"
              style={{ color: "var(--terminal-text)" }}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <span
            className="inline-block w-2 h-4 shrink-0"
            style={{
              backgroundColor: cursorVisible
                ? "var(--accent)"
                : "transparent",
              transition: "background-color 0.1s",
            }}
          />
        </div>
      </div>

      {showEgg && <EasterEggOverlay count={petCount} onDone={() => setShowEgg(false)} />}
    </div>
  );
}
