"use client";

import { useState, useEffect } from "react";
import { LuClock, LuGlobe } from "react-icons/lu";

const TIMEZONE = "Africa/Tunis"; // UTC+1
const WORK_START = 9;
const WORK_END = 19;

export default function AvailabilityStrip() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const localTime = now.toLocaleTimeString("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const hour = parseInt(
    now.toLocaleString("en-GB", { timeZone: TIMEZONE, hour: "numeric", hour12: false })
  );
  const isWorkHours = hour >= WORK_START && hour < WORK_END;
  const dayOfWeek = now.toLocaleDateString("en-GB", { timeZone: TIMEZONE, weekday: "long" });
  const isWeekday = !["Saturday", "Sunday"].includes(dayOfWeek);
  const isOnline = isWorkHours && isWeekday;

  return (
    <div>
      <h3 className="font-mono text-xs tracking-wider uppercase text-muted mb-4">
        Availability
      </h3>

      {/* Status + time + timezone row */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? "bg-green-500 animate-ping" : "bg-muted/50"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-muted/50"
              }`}
            />
          </span>
          <span className="font-mono text-xs text-foreground">
            {isOnline ? "Available now" : "Currently offline"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted">
          <LuClock size={12} className="text-accent shrink-0" />
          <span className="font-mono text-xs">
            {localTime} <span className="text-muted/50">local time</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted">
          <LuGlobe size={12} className="text-accent shrink-0" />
          <span className="font-mono text-xs">
            CET (UTC+1)
          </span>
        </div>
      </div>

      {/* Hours bar */}
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[9px] text-muted/40">0h</span>
          <span className="font-mono text-[9px] text-muted/40">12h</span>
          <span className="font-mono text-[9px] text-muted/40">24h</span>
        </div>
        <div className="flex h-[6px] overflow-hidden">
          {Array.from({ length: 24 }).map((_, h) => {
            const isWork = h >= WORK_START && h < WORK_END;
            const isCurrent = h === hour;
            return (
              <div
                key={h}
                className={`flex-1 transition-colors duration-300 ${
                  isCurrent
                    ? "bg-accent"
                    : isWork
                      ? "bg-accent/25"
                      : "bg-border/50"
                }`}
                style={{ marginRight: h < 23 ? 1 : 0 }}
                title={`${String(h).padStart(2, "0")}:00${isWork ? " (working hours)" : ""}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[9px] text-muted/40">{WORK_START}h–{WORK_END}h</span>
          <span className="font-mono text-[9px] text-muted/40">working hours</span>
        </div>
      </div>
    </div>
  );
}
