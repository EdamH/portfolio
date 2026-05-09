"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NodeInfo {
  id: string;
  label: string;
  detail: string;
}

const INFRA_NODES: NodeInfo[] = [
  { id: "security", label: "Security", detail: "Prompt injection defense · SSRF hardening · JWT + Redis invalidation" },
  { id: "ratelimit", label: "Rate Limiting", detail: "3 layers · IP (1000/min) · Session ($0.50/day) · Per-agent budgets" },
  { id: "caching", label: "Caching", detail: "4 tiers · Context cache · Response · Embedding · Conversation state" },
  { id: "billing", label: "Billing", detail: "nanoUSD precision · 145+ unit tests · Modality-aware pricing" },
  { id: "resilience", label: "Resilience", detail: "Redis graceful degradation · Stream disconnect detection · RabbitMQ async" },
];

const AGENT_FAMILIES: (NodeInfo & { count: string })[] = [
  { id: "storefront", label: "Storefront", count: "1", detail: "Customer-facing AI salesman · 13 languages · 8 tools" },
  { id: "description", label: "Description", count: "3", detail: "Audio / OCR / URL → product descriptions" },
  { id: "lpg", label: "LPG", count: "7", detail: "Photo → landing page pipeline · V1→V4 evolution" },
  { id: "order", label: "Order", count: "1", detail: "Screenshot → structured order data via Gemini Vision" },
];

const HOOK_DETAIL = "pre-hook → execute → post-hook · Blocking / non-blocking modes · Self-registration via registerAgent()";

export default function ArchitectureExplorer() {
  const [active, setActive] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  function handleEnter(id: string, detailText: string) {
    setActive(id);
    setDetail(detailText);
  }

  function handleLeave() {
    setActive(null);
    setDetail(null);
  }

  return (
    <div className="ml-10 mb-8">
      <p className="font-mono text-xs text-muted uppercase tracking-wider mb-4">
        System Architecture
      </p>

      <div className="relative border border-card-border bg-background/50 p-5 md:p-6">
        {/* ── Incoming Request ── */}
        <div className="flex justify-center mb-3">
          <div className="font-mono text-[11px] text-muted tracking-wide uppercase px-3 py-1.5 border border-card-border bg-card">
            Incoming Request
          </div>
        </div>

        {/* Arrow down */}
        <FlowArrow />

        {/* ── Infrastructure Layer ── */}
        <div className="border border-card-border p-4 mb-3">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
            Infrastructure Layer
          </p>
          <div className="flex flex-wrap gap-2">
            {INFRA_NODES.map((node) => (
              <button
                key={node.id}
                onMouseEnter={() => handleEnter(node.id, node.detail)}
                onMouseLeave={handleLeave}
                onFocus={() => handleEnter(node.id, node.detail)}
                onBlur={handleLeave}
                className={`font-mono text-xs px-3 py-1.5 border transition-colors duration-300 cursor-default ${
                  active === node.id
                    ? "border-accent text-accent bg-accent/5"
                    : "border-card-border text-muted hover:border-muted"
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>

        {/* Arrow down */}
        <FlowArrow />

        {/* ── Hook Pipeline ── */}
        <button
          onMouseEnter={() => handleEnter("hooks", HOOK_DETAIL)}
          onMouseLeave={handleLeave}
          onFocus={() => handleEnter("hooks", HOOK_DETAIL)}
          onBlur={handleLeave}
          className={`w-full font-mono text-xs text-center py-2.5 mb-3 border transition-colors duration-300 cursor-default ${
            active === "hooks"
              ? "border-accent text-accent bg-accent/5"
              : "border-card-border text-muted hover:border-muted"
          }`}
        >
          <span className="text-accent/60">pre-hook</span>
          <span className="mx-2 text-card-border">→</span>
          <span>execute</span>
          <span className="mx-2 text-card-border">→</span>
          <span className="text-accent/60">post-hook</span>
        </button>

        {/* Arrow down */}
        <FlowArrow />

        {/* ── Agent Families ── */}
        <div className="border border-card-border p-4">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">
            Agent Families
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {AGENT_FAMILIES.map((agent) => (
              <button
                key={agent.id}
                onMouseEnter={() => handleEnter(agent.id, agent.detail)}
                onMouseLeave={handleLeave}
                onFocus={() => handleEnter(agent.id, agent.detail)}
                onBlur={handleLeave}
                className={`text-left font-mono px-3 py-2.5 border transition-colors duration-300 cursor-default ${
                  active === agent.id
                    ? "border-accent bg-accent/5"
                    : "border-card-border hover:border-muted"
                }`}
              >
                <span className={`text-xs block ${active === agent.id ? "text-accent" : "text-muted"}`}>
                  {agent.label}
                </span>
                <span className={`text-lg font-semibold block mt-0.5 ${active === agent.id ? "text-accent" : "text-foreground"}`}>
                  {agent.count}
                </span>
                <span className="text-[10px] text-muted block">
                  {agent.count === "1" ? "agent" : "agents"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Detail tooltip ── */}
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

function FlowArrow() {
  return (
    <div className="flex justify-center my-1.5">
      <div className="flex flex-col items-center">
        <div className="w-px h-3 bg-card-border" />
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "4px solid var(--card-border)",
          }}
        />
      </div>
    </div>
  );
}
