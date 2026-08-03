"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { CommunityItem } from "@/lib/types";

const FALLBACK_PHOTOS = [
  "/indabax2024_supervisor.jpg",
  "/membershipCommittee.jpg",
  "/studytrip.jpg",
];

function getPhoto(item: CommunityItem, index: number): string {
  return item.photo || FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length];
}

export default function CommunityAccordion({ items }: { items: CommunityItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="border border-card-border overflow-hidden">
      {items.map((item, i) => {
        const isActive = active === i;
        const photo = getPhoto(item, i);

        return (
          <div
            key={`${item.title}-${item.organization}`}
            className={`border-b border-card-border last:border-b-0 cursor-pointer transition-colors duration-300 ${
              isActive ? "bg-transparent" : "bg-card hover:bg-card-hover"
            }`}
            onClick={() => setActive(i)}
          >
            {/* Collapsed row — always visible */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] shrink-0 w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`font-medium truncate transition-colors duration-300 ${
                  isActive ? "text-accent" : "text-foreground"
                }`}>
                  {item.title}
                </h3>
                <span className="text-muted text-sm hidden sm:block">
                  · {item.organization}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {item.period && (
                  <span className="font-mono text-[10px] text-muted hidden sm:block">
                    {item.period}
                  </span>
                )}
                <motion.span
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-muted text-sm"
                >
                  ▾
                </motion.span>
              </div>
            </div>

            {/* Expanded panel — cinematic photo + details */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="relative h-[220px] sm:h-[260px]">
                    <Image
                      src={photo}
                      alt={item.organization}
                      fill
                      className="object-cover saturate-[0.65]"
                      sizes="(max-width: 768px) 100vw, 1152px"
                    />
                    <div className="absolute inset-0 bg-accent/10 mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-1">
                        {item.organization}
                      </p>
                      <p className="text-white/60 text-sm mt-1 max-w-md leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
