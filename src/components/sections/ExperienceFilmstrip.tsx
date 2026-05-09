"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { getExperience, getEducation } from "@/lib/data";

const ARC_CHAPTERS = [
  { label: "Autonomy", year: "2025" },
  { label: "Ownership", year: "2025" },
  { label: "Enterprise", year: "2024" },
  { label: "Range", year: "2024" },
  { label: "Curiosity", year: "2023" },
];

const ITEM_HEIGHT = 180;

export default function ExperienceFilmstrip() {
  const experience = getExperience();
  const education = getEducation();
  const n = experience.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [subProgress, setSubProgress] = useState(0);
  const [continuousIndex, setContinuousIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const rawIndex = clamped * n;
    const index = Math.min(Math.floor(rawIndex), n - 1);
    setActiveIndex(Math.max(0, index));
    setSubProgress(rawIndex - Math.max(0, index));
    setContinuousIndex(Math.min(rawIndex, n - 0.001));
  });

  return (
    <section id="experience-v3" className="border-t border-border">
      {/* Scroll container */}
      <div
        ref={containerRef}
        style={{ height: `${(n + 1) * 100}vh` }}
        className="relative"
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex flex-col">
          <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col py-16 lg:py-20">
            {/* Section header */}
            <div className="mb-10 md:mb-14">
              <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
                // Experience
              </p>
              <h2 className="font-serif italic text-4xl text-foreground">
                Career Arc
              </h2>
            </div>

            {/* Main content */}
            <div className="flex-1 flex relative min-h-0">
              {/* ── Left: Filmstrip timeline ── */}
              <div className="hidden md:block w-[240px] lg:w-[280px] shrink-0 relative overflow-hidden">
                {/* Gradient masks — milestones emerge from fog */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />

                {/* Center marker — the "playhead" */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
                  <div className="flex-1 h-px bg-accent/25" />
                  <div className="w-[7px] h-[7px] bg-accent rounded-full shadow-[0_0_10px_3px_var(--accent-muted)]" />
                </div>

                {/* The moving strip */}
                <div
                  className="absolute inset-x-0"
                  style={{
                    top: "50%",
                    transform: `translateY(-${continuousIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2}px)`,
                    transition: "transform 0.06s linear",
                  }}
                >
                  {experience.map((exp, i) => {
                    const distance = Math.abs(i - continuousIndex);
                    const opacity = Math.max(0.08, 1 - distance * 0.45);
                    const scale = Math.max(0.85, 1 - distance * 0.06);
                    const isActive = i === activeIndex;

                    return (
                      <div
                        key={i}
                        className="flex flex-col justify-center pr-6"
                        style={{
                          height: ITEM_HEIGHT,
                          opacity,
                          transform: `scale(${scale})`,
                          transformOrigin: "right center",
                          transition:
                            "opacity 0.25s ease-out, transform 0.25s ease-out",
                        }}
                      >
                        {/* Year — large mono */}
                        <span
                          className={`font-mono text-5xl lg:text-6xl font-bold leading-none mb-3 tabular-nums transition-colors duration-500 ${
                            isActive
                              ? "text-foreground"
                              : "text-foreground/50"
                          }`}
                        >
                          {ARC_CHAPTERS[i].year}
                        </span>
                        {/* Gold dash */}
                        <div
                          className={`h-px mb-2.5 transition-all duration-500 ${
                            isActive
                              ? "w-16 bg-accent"
                              : "w-10 bg-border"
                          }`}
                        />
                        {/* Company */}
                        <span
                          className={`font-mono text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-500 ${
                            isActive
                              ? "text-foreground"
                              : "text-muted/60"
                          }`}
                        >
                          {exp.company}
                        </span>
                        {/* Arc label */}
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.25em] mt-1.5 transition-colors duration-500 ${
                            isActive
                              ? "text-accent"
                              : "text-accent/30"
                          }`}
                        >
                          {ARC_CHAPTERS[i].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="hidden md:block w-px bg-border mx-6 lg:mx-10 shrink-0" />

              {/* ── Right: Content panels ── */}
              <div className="flex-1 relative min-h-0">
                {/* Mobile: inline chapter indicator */}
                <div className="md:hidden flex items-center gap-2 mb-6">
                  <span className="font-mono text-accent text-lg tabular-nums">
                    {ARC_CHAPTERS[activeIndex].year}
                  </span>
                  <span className="text-border">·</span>
                  <span className="font-mono text-foreground/70 text-sm">
                    {experience[activeIndex].company}
                  </span>
                </div>

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
                      style={{ pointerEvents: isActive ? "auto" : "none" }}
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

                      {/* Role */}
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

                      {/* Bullets — scroll-staggered */}
                      <ul className="space-y-2.5">
                        {exp.bullets.map((bullet, bi) => {
                          const threshold =
                            0.08 + (bi / exp.bullets.length) * 0.55;
                          const visible =
                            isActive && subProgress >= threshold;

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

                      {/* Key insight */}
                      <motion.div
                        className="mt-auto pt-6"
                        animate={{
                          opacity:
                            isActive && subProgress > 0.72 ? 1 : 0,
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
                          ? "duration-75"
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

      {/* Education — after scroll exit */}
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
