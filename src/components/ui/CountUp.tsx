"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  className?: string;
}

function parseNumeric(val: string): { prefix: string; number: number; suffix: string } | null {
  const match = val.match(/^([^0-9]*?)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    number: parseFloat(match[2].replace(/,/g, "")),
    suffix: match[3],
  };
}

function formatNumber(n: number, hasCommas: boolean): string {
  const rounded = Math.round(n);
  if (hasCommas) return rounded.toLocaleString("en-US");
  return String(rounded);
}

export default function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parseNumeric(value);
    if (!parsed) return; // not a number, just show as-is

    const hasCommas = value.includes(",");
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let step = 0;

          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(parsed.number * eased);
            setDisplayed(parsed.prefix + formatNumber(current, hasCommas) + parsed.suffix);

            if (step >= steps) {
              clearInterval(interval);
              setDisplayed(value); // ensure exact final value
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
