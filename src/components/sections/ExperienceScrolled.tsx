"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { getExperience, getEducation } from "@/lib/data";

const ARC_CHAPTERS = [
  { label: "Autonomy", year: "'25" },
  { label: "Ownership", year: "'25" },
  { label: "Enterprise", year: "'24" },
  { label: "Range", year: "'24" },
  { label: "Curiosity", year: "'23" },
];

export default function ExperienceScrolled() {
  const experience = getExperience(); // latest first
  const education = getEducation();
  const n = experience.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [subProgress, setSubProgress] = useState(0);
  const [linePercent, setLinePercent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const rawIndex = clamped * n;
    const index = Math.min(Math.floor(rawIndex), n - 1);
    setActiveIndex(Math.max(0, index));
    setSubProgress(rawIndex - Math.max(0, index));
    // Map progress so line reaches each dot exactly when that item activates
    setLinePercent(Math.min((clamped * n) / (n - 1), 1) * 100);
  });

  return (
    <section id="experience-v2" className="border-t border-border">
      {/* Scroll space — each career chapter gets 100vh of travel */}
      <div
        ref={containerRef}
        style={{ height: `${(n + 1) * 100}vh` }}
        className="relative"
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex flex-col">
          <div className="max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col py-16 lg:py-20">
            {/* Section header */}
            <div className="mb-10 md:mb-14">
              <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
                // Experience
              </p>
              <h2 className="font-serif italic text-4xl text-foreground">
                Career Arc
              </h2>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex gap-10 md:gap-16 relative overflow-hidden min-h-0">
              {/* Background year watermark */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute -right-4 md:right-0 top-1/2 -translate-y-1/2 font-mono text-[160px] md:text-[220px] lg:text-[280px] font-bold text-foreground/[0.03] select-none pointer-events-none leading-none tracking-tighter"
                >
                  {experience[activeIndex].period.match(/\d{4}/)?.[0]}
                </motion.div>
              </AnimatePresence>

              {/* Left: Timeline rail */}
              <div className="hidden md:block relative w-16 shrink-0 py-3">
                {/* Background track line */}
                <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />
                {/* Gold progress fill */}
                <div
                  className="absolute left-[7px] top-3 w-px bg-accent origin-top"
                  style={{
                    height: `${linePercent}%`,
                    maxHeight: "calc(100% - 24px)",
                    transition: "height 0.08s linear",
                  }}
                />

                {/* Dots + year labels */}
                <div className="relative h-full">
                  {experience.map((_, i) => {
                    const isActive = i === activeIndex;
                    const isPast = i < activeIndex;
                    return (
                      <div
                        key={i}
                        className="absolute flex items-center"
                        style={{
                          top: `${(i / (n - 1)) * 100}%`,
                          transform: "translateY(-50%)",
                        }}
                      >
                        {/* Glow */}
                        <div
                          className={`absolute -inset-[3px] rounded-full transition-all duration-700 ${
                            isActive
                              ? "bg-accent/20 shadow-[0_0_20px_6px_var(--accent-muted)]"
                              : "bg-transparent shadow-none"
                          }`}
                        />
                        {/* Dot */}
                        <div
                          className={`relative w-[15px] h-[15px] rounded-full border-2 transition-all duration-500 ${
                            isActive
                              ? "border-accent bg-accent"
                              : isPast
                                ? "border-accent/60 bg-accent/40"
                                : "border-border bg-background"
                          }`}
                        />
                        {/* Year */}
                        <span
                          className={`ml-5 font-mono text-[11px] tracking-wider whitespace-nowrap transition-all duration-500 ${
                            isActive
                              ? "text-accent"
                              : isPast
                                ? "text-muted/50"
                                : "text-muted/25"
                          }`}
                        >
                          {ARC_CHAPTERS[i].year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Content panels */}
              <div className="flex-1 relative min-h-0">
                {experience.map((exp, i) => {
                  const isActive = i === activeIndex;
                  const chapter = ARC_CHAPTERS[i];
                  const roleName = exp.role.includes(" — ")
                    ? exp.role.split(" — ")[1]
                    : exp.role;

                  return (
                    <motion.div
                      key={i}
                      className="absolute inset-0 flex flex-col"
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : i < activeIndex ? -50 : 50,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      {/* Chapter marker */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="font-mono text-accent text-sm tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="w-8 h-px bg-accent/40" />
                        <span className="font-mono text-accent/70 text-xs uppercase tracking-[0.2em]">
                          {chapter.label}
                        </span>
                      </div>

                      {/* Period */}
                      <p className="font-mono text-muted text-sm mb-3">
                        {exp.period}
                      </p>

                      {/* Role title */}
                      <h3 className="font-serif italic text-2xl md:text-3xl text-foreground mb-1 leading-tight">
                        {roleName}
                      </h3>

                      {/* Company + Location */}
                      <div className="flex items-center gap-2 mb-8">
                        <span className="text-foreground font-medium text-sm">
                          {exp.company}
                        </span>
                        <span className="text-border">·</span>
                        <span className="text-muted text-sm">
                          {exp.location}
                        </span>
                      </div>

                      {/* Bullets — stagger in based on scroll sub-progress */}
                      <ul className="space-y-2.5">
                        {exp.bullets.map((bullet, bi) => {
                          const threshold =
                            0.08 + (bi / exp.bullets.length) * 0.55;
                          const visible = isActive && subProgress >= threshold;

                          return (
                            <motion.li
                              key={bi}
                              className="text-muted text-sm leading-relaxed flex gap-3"
                              animate={{
                                opacity: visible ? 1 : 0,
                                x: visible ? 0 : 14,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: "easeOut",
                              }}
                            >
                              <span className="text-accent shrink-0 font-mono text-xs mt-[3px]">
                                →
                              </span>
                              <span>{bullet}</span>
                            </motion.li>
                          );
                        })}
                      </ul>

                      {/* Key insight — appears last */}
                      <motion.div
                        className="mt-auto pt-6"
                        animate={{
                          opacity: isActive && subProgress > 0.72 ? 1 : 0,
                          y: isActive && subProgress > 0.72 ? 0 : 8,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="pl-4 border-l border-accent/30">
                          <p className="font-serif italic text-foreground/50 text-base md:text-lg leading-relaxed">
                            &ldquo;{exp.keyPoint}&rdquo;
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom progress rail */}
            <div className="mt-6 flex items-center gap-2">
              {experience.map((_, i) => (
                <div
                  key={i}
                  className="relative h-[2px] flex-1 bg-border overflow-hidden"
                >
                  <div
                    className={`absolute inset-y-0 left-0 bg-accent transition-all ease-out ${
                      i < activeIndex
                        ? "w-full duration-500"
                        : i === activeIndex
                          ? "duration-100"
                          : "w-0 duration-500"
                    }`}
                    style={
                      i === activeIndex
                        ? { width: `${subProgress * 100}%` }
                        : undefined
                    }
                  />
                </div>
              ))}
              <span className="font-mono text-[11px] text-muted/60 ml-2 tabular-nums">
                {String(activeIndex + 1).padStart(2, "0")}/
                {String(n).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Education — renders after scroll exit */}
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
