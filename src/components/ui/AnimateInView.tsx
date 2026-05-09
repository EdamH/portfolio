"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimateInViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimateInView({
  children,
  className,
  delay = 0,
}: AnimateInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
