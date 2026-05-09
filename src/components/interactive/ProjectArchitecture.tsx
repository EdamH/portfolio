"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArchLayer } from "@/lib/project-details";

function FlowArrow() {
  return (
    <div className="flex justify-center my-2">
      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-border" />
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "4px solid var(--border)",
          }}
        />
      </div>
    </div>
  );
}

export default function ProjectArchitecture({
  layers,
}: {
  layers: ArchLayer[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  function handleEnter(id: string, text: string) {
    setActiveId(id);
    setDetail(text);
  }

  function handleLeave() {
    setActiveId(null);
    setDetail(null);
  }

  return (
    <div>
      <h2 className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
        // Architecture
      </h2>

      <div className="relative border border-card-border bg-background/50 p-5 md:p-6">
        {layers.map((layer, li) => (
          <div key={layer.title}>
            {li > 0 && <FlowArrow />}

            <div className="border border-card-border p-4">
              <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
                {layer.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {layer.nodes.map((node) => (
                  <button
                    key={node.id}
                    onMouseEnter={() => handleEnter(node.id, node.detail)}
                    onMouseLeave={handleLeave}
                    onFocus={() => handleEnter(node.id, node.detail)}
                    onBlur={handleLeave}
                    className={`font-mono text-xs px-3 py-1.5 border transition-colors duration-300 cursor-default ${
                      activeId === node.id
                        ? "border-accent text-accent bg-accent/5"
                        : "border-card-border text-muted hover:border-muted"
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Detail panel */}
        <AnimatePresence>
          {detail && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="mt-4 px-4 py-3 border-l-2 border-l-accent bg-card font-mono text-xs text-muted leading-relaxed"
            >
              {detail}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
