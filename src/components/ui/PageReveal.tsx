"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Slide-up page reveal — mirrors the boot sequence exit (which slides up to leave).
 * This slides up to arrive: content starts below viewport and rises into place.
 */
export default function PageReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: "4%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
