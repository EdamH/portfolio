"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG, SOCIAL_LINKS, KEY_NUMBERS } from "@/lib/constants";
import { platformIcon } from "@/components/ui/Icons";
import { getFeaturedProjects, getCertifications, getSkills } from "@/lib/data";

const ROLES = ["GenAI", "Data", "DevOps", "Full Stack", "Software", "an"];
const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

const featuredCount = getFeaturedProjects().length;
const certCount = getCertifications().length;
const skillGroupCount = getSkills().length;

const TERMINAL_LINES = [
  "$ status portfolio.dev",
  `✓ ${featuredCount} featured projects loaded`,
  `✓ ${certCount} certifications verified`,
  `✓ ${KEY_NUMBERS.commits} commits indexed`,
  `✓ ${skillGroupCount} skill domains mapped`,
  "→ ready to connect",
];

const STATS = [
  { value: "12", label: "agents" },
  { value: "78K", label: "LOC" },
  { value: "145+", label: "tests" },
  { value: "925+", label: "commits" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Role typing effect
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "paused" | "deleting" | "waiting">("typing");

  useEffect(() => {
    const word = ROLES[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing":
        if (displayed.length < word.length) {
          timeout = setTimeout(() => {
            setDisplayed(word.slice(0, displayed.length + 1));
          }, TYPE_SPEED + Math.random() * 40);
        } else {
          setPhase("paused");
        }
        break;
      case "paused":
        timeout = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_TYPE);
        break;
      case "deleting":
        if (displayed.length > 0) {
          timeout = setTimeout(() => {
            setDisplayed(displayed.slice(0, -1));
          }, DELETE_SPEED);
        } else {
          setPhase("waiting");
        }
        break;
      case "waiting":
        timeout = setTimeout(() => {
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
          setPhase("typing");
        }, PAUSE_AFTER_DELETE);
        break;
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, roleIndex]);

  // Terminal line animation
  useEffect(() => {
    if (visibleLines < TERMINAL_LINES.length) {
      const timeout = setTimeout(
        () => setVisibleLines((prev) => prev + 1),
        visibleLines === 0 ? 1200 : 600
      );
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  // Terminal cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--hero-bg)" }}
    >
      {/* Grid background */}
      <div className="grid-bg absolute inset-0 opacity-[0.04] pointer-events-none" />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, var(--hero-glow) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          {/* Left — Text Content */}
          <motion.div
            className="flex-1 max-w-xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Name */}
            <motion.p
              variants={item}
              className="font-mono text-sm tracking-[0.3em] uppercase"
              style={{ color: "var(--hero-subtle)" }}
            >
              {SITE_CONFIG.name}
            </motion.p>

            {/* Title with typing effect */}
            <motion.h1
              variants={item}
              className="mt-4 text-4xl sm:text-5xl lg:text-7xl font-serif italic leading-[1.1]"
              style={{ color: "var(--hero-text)" }}
            >
              <span className="text-gradient-gold">{displayed}</span>
              <span
                className="inline-block w-[3px] ml-0.5 align-baseline"
                style={{
                  height: "0.7em",
                  backgroundColor: "var(--accent)",
                  opacity: phase === "paused" ? (cursorVisible ? 1 : 0) : 1,
                  transition: "opacity 0.1s",
                }}
              />
              <br />
              <span className="text-gradient-gold">Engineer</span>
            </motion.h1>

            {/* One-liner */}
            <motion.p
              variants={item}
              className="mt-6 text-lg sm:text-xl leading-relaxed max-w-md"
              style={{ color: "var(--hero-muted)" }}
            >
              Building production AI systems end-to-end — from the model layer
              to the infrastructure it runs on.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center px-7 py-3 text-sm font-mono tracking-wide uppercase border border-accent text-accent hover:bg-accent-muted transition-colors duration-300"
              >
                View Projects
              </a>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center px-7 py-3 text-sm font-mono tracking-wide uppercase text-muted border border-border hover:text-foreground hover:border-muted transition-colors duration-300"
              >
                Download Resume
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={item}
              className="mt-8 flex items-center gap-6"
            >
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target={link.platform !== "Email" ? "_blank" : undefined}
                  rel={
                    link.platform !== "Email"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={link.label}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                  style={{ color: "var(--hero-subtle)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--hero-subtle)")
                  }
                >
                  {platformIcon(link.platform, 16)}
                  {link.platform}
                </a>
              ))}
            </motion.div>

            {/* Stats bar */}
            <motion.div
              variants={item}
              className="mt-12 pt-8"
              style={{ borderTop: "1px solid var(--hero-border)" }}
            >
              <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 font-mono text-sm">
                {STATS.map((stat, i) => (
                  <span key={stat.label} className="flex items-center gap-2">
                    <span className="font-semibold text-accent">
                      {stat.value}
                    </span>
                    <span style={{ color: "var(--hero-subtle)" }}>
                      {stat.label}
                    </span>
                    {i < STATS.length - 1 && (
                      <span
                        className="ml-2 sm:ml-4 hidden sm:inline"
                        style={{ color: "var(--hero-border)" }}
                      >
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Terminal */}
          <motion.div
            className="flex-1 w-full max-w-lg"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" as const }}
          >
            <div
              className="rounded-lg overflow-hidden shadow-2xl"
              style={{
                backgroundColor: "var(--terminal-bg)",
                border: "1px solid var(--terminal-border)",
              }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  borderBottom: "1px solid var(--terminal-header-border)",
                }}
              >
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span
                  className="ml-3 text-[11px] font-mono tracking-wide"
                  style={{ color: "var(--terminal-dim)" }}
                >
                  portfolio — deploy
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 font-mono text-sm leading-7 min-h-[220px]">
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => {
                  const isCommand = line.startsWith("$");
                  const isSuccess = line.startsWith("✓");
                  const isArrow = line.startsWith("→");

                  let textColor = "var(--terminal-dim)";
                  if (isCommand) textColor = "var(--terminal-text)";
                  if (isSuccess) textColor = "#28c840";
                  if (isArrow) textColor = "var(--accent)";

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: textColor }}
                    >
                      {line}
                    </motion.div>
                  );
                })}

                {/* Blinking cursor */}
                <span
                  className="inline-block w-2 h-4 mt-1 align-middle"
                  style={{
                    backgroundColor: cursorVisible
                      ? "var(--accent)"
                      : "transparent",
                    transition: "background-color 0.1s",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
