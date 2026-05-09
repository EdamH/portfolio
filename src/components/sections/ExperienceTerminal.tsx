"use client";

import { useRef, useState, useMemo } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { getExperience, getEducation } from "@/lib/data";

const ARC_CHAPTERS = [
  { label: "autonomy", cmd: "current" },
  { label: "ownership", cmd: "history" },
  { label: "enterprise", cmd: "history" },
  { label: "range", cmd: "history" },
  { label: "curiosity", cmd: "history" },
];

interface TerminalLine {
  type:
    | "prompt"
    | "command"
    | "blank"
    | "header"
    | "meta"
    | "bullet"
    | "quote"
    | "divider";
  text: string;
  itemIndex: number;
}

function buildTerminalLines(
  experience: ReturnType<typeof getExperience>
): TerminalLine[] {
  const lines: TerminalLine[] = [];

  experience.forEach((exp, i) => {
    const chapter = ARC_CHAPTERS[i];
    const roleName = exp.role.includes(" — ")
      ? exp.role.split(" — ")[1]
      : exp.role;

    lines.push({
      type: "prompt",
      text: `career ${chapter.cmd} --chapter=${String(i + 1).padStart(2, "0")} --arc="${chapter.label}"`,
      itemIndex: i,
    });
    lines.push({ type: "blank", text: "", itemIndex: i });
    lines.push({ type: "header", text: roleName, itemIndex: i });
    lines.push({
      type: "meta",
      text: `${exp.company} · ${exp.location}`,
      itemIndex: i,
    });
    lines.push({ type: "meta", text: exp.period, itemIndex: i });
    lines.push({ type: "blank", text: "", itemIndex: i });

    exp.bullets.forEach((bullet) => {
      lines.push({ type: "bullet", text: bullet, itemIndex: i });
    });

    lines.push({ type: "blank", text: "", itemIndex: i });
    lines.push({ type: "quote", text: exp.keyPoint, itemIndex: i });

    if (i < experience.length - 1) {
      lines.push({ type: "blank", text: "", itemIndex: i });
      lines.push({
        type: "divider",
        text: "\u2500".repeat(48),
        itemIndex: i,
      });
      lines.push({ type: "blank", text: "", itemIndex: i });
    }
  });

  return lines;
}

// ── Weighted scroll: commands get 1 unit per word, other lines get 1 unit ──

function computeWeights(lines: TerminalLine[]): number[] {
  return lines.map((line) => {
    if (line.type === "prompt") {
      // Each word is a scroll unit — types word-by-word
      return line.text.split(" ").length;
    }
    if (line.type === "blank" || line.type === "divider") {
      return 0.3;
    }
    return 1;
  });
}

function computeCumulative(weights: number[]): number[] {
  const cum: number[] = [];
  let sum = 0;
  for (const w of weights) {
    sum += w;
    cum.push(sum);
  }
  return cum;
}

// ── Line renderer ──

function TerminalLineContent({
  line,
  revealFraction,
}: {
  line: TerminalLine;
  revealFraction: number;
}) {
  if (revealFraction <= 0) return null;

  switch (line.type) {
    case "prompt": {
      const words = line.text.split(" ");
      const count =
        revealFraction >= 1
          ? words.length
          : Math.max(1, Math.ceil(revealFraction * words.length));
      const visible = words.slice(0, count).join(" ");
      const isTyping = revealFraction < 1;

      return (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-accent shrink-0">$</span>
          <span className="text-terminal-text">{visible}</span>
          {isTyping && (
            <span className="inline-block w-[7px] h-[16px] bg-terminal-text/80 animate-[blink_1s_step-end_infinite]" />
          )}
        </div>
      );
    }
    case "command":
      return <span className="text-terminal-text">{line.text}</span>;
    case "header":
      return (
        <span className="text-accent font-medium text-base">{line.text}</span>
      );
    case "meta":
      return <span className="text-terminal-dim">{line.text}</span>;
    case "bullet":
      return (
        <div className="flex gap-2 pl-2">
          <span className="text-accent shrink-0">&rarr;</span>
          <span className="text-terminal-text/80">{line.text}</span>
        </div>
      );
    case "quote":
      return (
        <div className="pl-2 border-l border-accent/30 ml-1">
          <span className="text-terminal-dim italic">
            &quot;{line.text}&quot;
          </span>
        </div>
      );
    case "divider":
      return <span className="text-terminal-dim/30">{line.text}</span>;
    case "blank":
      return <span>&nbsp;</span>;
    default:
      return null;
  }
}

// ── Main component ──

export default function ExperienceTerminal() {
  const experience = getExperience();
  const education = getEducation();
  const n = experience.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const terminalLines = useMemo(
    () => buildTerminalLines(experience),
    [experience]
  );
  const totalLines = terminalLines.length;

  const weights = useMemo(() => computeWeights(terminalLines), [terminalLines]);
  const cumWeights = useMemo(() => computeCumulative(weights), [weights]);
  const totalWeight = cumWeights[cumWeights.length - 1] ?? 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // currentLineIdx = index of the line being typed / just completed
  // lineFraction   = 0..1 progress within that line (matters for prompts)
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [lineFraction, setLineFraction] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const pos = clamped * totalWeight;

    // Find which line this scroll position falls into
    let idx = 0;
    for (let i = 0; i < totalLines; i++) {
      if (cumWeights[i] >= pos) {
        idx = i;
        break;
      }
      if (i === totalLines - 1) idx = totalLines; // past all lines
    }

    if (idx >= totalLines) {
      setCurrentLineIdx(totalLines - 1);
      setLineFraction(1);
      return;
    }

    const prevCum = idx > 0 ? cumWeights[idx - 1] : 0;
    const frac = weights[idx] > 0 ? (pos - prevCum) / weights[idx] : 1;

    setCurrentLineIdx(idx);
    setLineFraction(Math.max(0, Math.min(1, frac)));
  });

  // Fully completed lines = everything before currentLineIdx
  // currentLineIdx itself is partially revealed (lineFraction)
  const fullyVisibleCount = currentLineIdx;

  // Active career entry (for title bar + status)
  const activeItemIndex =
    currentLineIdx >= 0
      ? terminalLines[Math.min(currentLineIdx, totalLines - 1)].itemIndex
      : 0;

  // Is the current line done typing? (for showing cursor at end vs inline)
  const allDone = currentLineIdx >= totalLines - 1 && lineFraction >= 1;

  return (
    <section id="experience-v4" className="border-t border-border">
      <div
        ref={containerRef}
        style={{ height: `${(n + 1) * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex flex-col">
          <div className="max-w-5xl mx-auto px-6 w-full flex-1 flex flex-col py-16 lg:py-20">
            {/* Section header */}
            <div className="mb-8 md:mb-10">
              <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
                // Experience
              </p>
              <h2 className="font-serif italic text-4xl text-foreground">
                Career Arc
              </h2>
            </div>

            {/* Terminal window */}
            <div className="flex-1 flex flex-col min-h-0 max-h-[calc(100vh-220px)] border border-card-border bg-[var(--terminal-bg)] overflow-hidden rounded-lg">
              {/* Title bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--terminal-header-border)] shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-[11px] text-terminal-dim flex-1 text-center -ml-12">
                  career-arc &mdash;{" "}
                  {experience[activeItemIndex].company.toLowerCase()} &mdash;
                  zsh
                </span>
              </div>

              {/* Terminal body — pinned to bottom, overflow clips top */}
              <div className="flex-1 relative overflow-hidden font-mono text-sm leading-relaxed">
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  {/* Intro */}
                  {currentLineIdx >= 0 && (
                    <div className="text-terminal-dim mb-4 text-xs">
                      Last login: Oct 2025 on ttys001
                    </div>
                  )}

                  {/* Fully visible lines */}
                  {terminalLines
                    .slice(0, Math.max(0, fullyVisibleCount))
                    .map((line, i) => {
                      const distFromCurrent = fullyVisibleCount - i;
                      const dim = distFromCurrent > 4;
                      return (
                        <div
                          key={i}
                          className={
                            dim ? "opacity-50" : "opacity-100"
                          }
                          style={{
                            minHeight:
                              line.type === "blank" ? "0.75rem" : undefined,
                          }}
                        >
                          <TerminalLineContent
                            line={line}
                            revealFraction={1}
                          />
                        </div>
                      );
                    })}

                  {/* Currently typing line */}
                  {currentLineIdx >= 0 && currentLineIdx < totalLines && (
                    <div
                      style={{
                        minHeight:
                          terminalLines[currentLineIdx].type === "blank"
                            ? "0.75rem"
                            : undefined,
                      }}
                    >
                      <TerminalLineContent
                        line={terminalLines[currentLineIdx]}
                        revealFraction={lineFraction}
                      />
                    </div>
                  )}

                  {/* Final cursor — only when not mid-typing a prompt */}
                  {(allDone ||
                    (currentLineIdx >= 0 &&
                      terminalLines[currentLineIdx]?.type !== "prompt")) && (
                    <div className="flex items-center gap-2 mt-1">
                      {allDone && <span className="text-accent">$</span>}
                      <span className="inline-block w-[7px] h-[16px] bg-terminal-text/70 animate-[blink_1s_step-end_infinite]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--terminal-header-border)] shrink-0">
                <span className="font-mono text-[10px] text-terminal-dim">
                  {String(activeItemIndex + 1).padStart(2, "0")}/
                  {String(n).padStart(2, "0")} chapters
                </span>
                <span className="font-mono text-[10px] text-terminal-dim">
                  {Math.min(fullyVisibleCount + 1, totalLines)}/{totalLines}{" "}
                  lines
                </span>
                <span className="font-mono text-[10px] text-accent/60">
                  {ARC_CHAPTERS[activeItemIndex].label}
                </span>
              </div>
            </div>

            {/* Bottom progress rail */}
            <div className="mt-6 flex items-center gap-2">
              {experience.map((_, i) => {
                const segLines = terminalLines.reduce<number[]>(
                  (acc, l, idx) => (l.itemIndex === i ? [...acc, idx] : acc),
                  []
                );
                const first = segLines[0] ?? 0;
                const last = segLines[segLines.length - 1] ?? 0;
                const total = last - first + 1;
                const visible = Math.max(
                  0,
                  Math.min(fullyVisibleCount + 1 - first, total)
                );
                const pct = total > 0 ? visible / total : 0;

                return (
                  <div
                    key={i}
                    className="relative h-[2px] flex-1 bg-border overflow-hidden"
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-accent transition-all duration-100 ease-out"
                      style={{
                        width: `${Math.min(pct * 100, 100)}%`,
                      }}
                    />
                  </div>
                );
              })}
              <span className="font-mono text-[11px] text-muted/60 ml-2 tabular-nums">
                {String(activeItemIndex + 1).padStart(2, "0")}/
                {String(n).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="section-padding border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <p className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
            // Education
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.institution}
                className="bg-card border border-card-border p-5"
              >
                <p className="font-mono text-accent text-sm mb-1">
                  {edu.period}
                </p>
                <h3 className="font-medium text-foreground">
                  {edu.institution}
                </h3>
                <p className="text-muted text-sm mt-1">{edu.degree}</p>
                {edu.honors && (
                  <p className="text-accent text-sm font-mono mt-2">
                    {edu.honors}
                  </p>
                )}
                {edu.detail && (
                  <p className="text-accent text-sm font-mono mt-2">
                    {edu.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
