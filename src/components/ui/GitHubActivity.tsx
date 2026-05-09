"use client";

import { type ContributionWeek, type MonthLabel, type StreakData, type LanguageStat } from "@/lib/github";
import { LuExternalLink, LuFlame, LuTrophy } from "react-icons/lu";

const LEVEL_CLASSES = [
  "bg-border/40",
  "bg-accent/20",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
] as const;

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

interface GitHubActivityProps {
  weeks: ContributionWeek[];
  months: MonthLabel[];
  totalContributions: number;
  streak: StreakData;
  languages: LanguageStat[];
  username: string;
}

export default function GitHubActivity({
  weeks,
  months,
  totalContributions,
  streak,
  languages,
  username,
}: GitHubActivityProps) {
  if (weeks.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-mono text-xs tracking-wider uppercase text-muted">
          GitHub Activity
        </h3>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors duration-300"
        >
          @{username}
          <LuExternalLink size={11} />
        </a>
      </div>

      {/* Graph — overflow hidden, clips older weeks on the left */}
      <div className="overflow-hidden">
        {/* Inner wrapper: natural week order, pushed right so newest is always visible */}
        <div className="flex justify-end">
          <div style={{ width: weeks.length * 13 + 28 }}>
            {/* Month labels — computed from weeks, same natural order */}
            <div className="flex mb-2" style={{ paddingLeft: 28 }}>
              {months.map((m, i) => (
                <span
                  key={`${m.label}-${i}`}
                  className="font-mono text-[10px] text-muted/50 leading-none"
                  style={{ width: m.colspan * 13 }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid with day-of-week labels */}
            <div className="flex gap-0">
              {/* Day labels column */}
              <div className="flex flex-col gap-[3px] pr-2 shrink-0" style={{ width: 28 }}>
                {DAY_LABELS.map((label, i) => (
                  <div key={i} className="h-[10px] flex items-center justify-end">
                    {label && (
                      <span className="font-mono text-[9px] leading-none text-muted/40">
                        {label}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Contribution columns */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.days.map((day) => (
                      <div
                        key={day.date}
                        className={`w-[10px] h-[10px] ${LEVEL_CLASSES[day.level]} transition-all duration-300 hover:ring-1 hover:ring-accent/50`}
                        title={day.date}
                      />
                    ))}
                    {week.days.length < 7 &&
                      Array.from({ length: 7 - week.days.length }).map((_, pi) => (
                        <div key={`pad-${pi}`} className="w-[10px] h-[10px]" />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — legend */}
      <div className="flex items-center justify-between mt-4">
        <span className="font-mono text-[11px] text-muted/50">
          {totalContributions.toLocaleString()} contributions in the last year
        </span>
        <div className="flex items-center gap-[5px]">
          <span className="font-mono text-[9px] text-muted/40 mr-0.5">Less</span>
          {LEVEL_CLASSES.map((cls, i) => (
            <div key={i} className={`w-[10px] h-[10px] ${cls}`} />
          ))}
          <span className="font-mono text-[9px] text-muted/40 ml-0.5">More</span>
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="border border-border p-3">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <LuFlame size={12} className="text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Current</span>
          </div>
          <span className="font-mono text-lg text-foreground">{streak.current}</span>
          <span className="font-mono text-[10px] text-muted/50 ml-1">days</span>
        </div>
        <div className="border border-border p-3">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <LuTrophy size={12} className="text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Longest</span>
          </div>
          <span className="font-mono text-lg text-foreground">{streak.longest}</span>
          <span className="font-mono text-[10px] text-muted/50 ml-1">days</span>
        </div>
      </div>

      {/* Top Languages */}
      {languages.length > 0 && (
        <div className="mt-6">
          <h4 className="font-mono text-[10px] uppercase tracking-wider text-muted mb-3">
            Top Languages
          </h4>
          {/* Stacked bar */}
          <div className="flex h-[6px] overflow-hidden">
            {languages.map((lang, i) => (
              <div
                key={lang.name}
                className="h-full transition-all duration-300"
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: `var(--accent)`,
                  opacity: 1 - i * 0.18,
                }}
                title={`${lang.name}: ${lang.percent}%`}
              />
            ))}
          </div>
          {/* Labels */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {languages.map((lang, i) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2"
                  style={{
                    backgroundColor: `var(--accent)`,
                    opacity: 1 - i * 0.18,
                  }}
                />
                <span className="font-mono text-[10px] text-muted">
                  {lang.name} <span className="text-muted/50">{lang.percent}%</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
