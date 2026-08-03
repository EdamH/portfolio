export interface ArchNode {
  id: string;
  label: string;
  detail: string;
}

export interface ArchLayer {
  title: string;
  nodes: ArchNode[];
}

export interface Screenshot {
  src: string;
  alt: string;
  caption?: string;
  /** "full" spans both columns, "half" takes one column. Default: "half" */
  span?: "full" | "half";
  /** CSS object-fit value. Default: "cover" */
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export interface ProjectDetail {
  narrative: string[];
  screenshots?: Screenshot[];
  architecture: ArchLayer[];
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  uranus: {
    screenshots: [
      { 
        src: "/projects/URANUS/uranus-in-action.jpeg", 
        alt: "URANUS storefront agent in action", 
        caption: "Storefront AI salesman , streaming response with product recommendations", 
        span: "full" 
      },
      { 
        src: "/projects/URANUS/uranus-config.png", 
        alt: "URANUS storefront agent configuration", 
        caption: "Storefront AI salesman , in-app configuration screen" 
      },
      { 
        src: "/projects/URANUS/lpg-config.png", 
        alt: "LPG Configuration Form", 
        caption: "LPG configuration form for setting up the landing page generation pipeline" 
      },
    ],
    narrative: [
      "URANUS is the AI backbone of Converty. Not a single chatbot , it's the foundational infrastructure that all current and future AI integrations at Converty run on. Every agent inherits production-grade billing, security, rate limiting, and caching from the core.",
      "The core contribution isn't any single agent , it's the platform-level infrastructure. New agents self-register via registerAgent() and inherit the full hook pipeline, billing engine, and security stack. No central wiring needed. Adding a new provider means installing an SDK package and uncommenting one line.",
      "All costs are computed in nanoUSD , integer arithmetic at 10^9 scale , to eliminate floating-point accumulation errors. Preflight estimation uses script-aware heuristics (Latin ~4 chars/token, Arabic/CJK ~1.5), and post-flight reconciliation corrects drift via atomic Redis Lua scripts.",
      "Spending runs through a credit ledger with a reserve, settle, void lifecycle. Every run reserves credits atomically , the store balance and the ledger row move together inside one MongoDB transaction , then settles in-band with its own product write so the two commit as a single unit. If a run stalls or the process dies mid-flight, a recovery cron sweeps every 30 seconds and refunds the reservation, with claim-first arbitration guaranteeing a run can never be double-refunded. Usage rolls up into per-store invoices broken down by agent, model, and modality.",
      "The system has made it trivial so far for us, at Converty, to add AI features at will. Only 1 month since its inception, it has already powered 12 agents across 4 families, with more in development. The unified runner/hook pipeline means every agent benefits from the same security, billing, and rate limiting features without extra work , a force multiplier for our AI development velocity.",
      "The whole system is deployed on a Kubernetes cluster (k3s). Startup, readiness, and liveness probes ensure zero-downtime deploys. Resource limits and security hardening are baked into the deployment manifests, not bolted on after the fact.",
      "If you'd like to see more of it in action, check out Converty's Platform. If it's AI-powered, chances are it's running on URANUS.",
    ],
    architecture: [
      {
        title: "Incoming Request",
        nodes: [
          { id: "auth", label: "JWT Auth", detail: "JWT with Redis-based token invalidation · Admin endpoint protection" },
          { id: "ssrf", label: "SSRF Hardening", detail: "URL validation · Input sanitization · Data-only sandboxing for OCR/seller content" },
        ],
      },
      {
        title: "Infrastructure Layer",
        nodes: [
          { id: "security", label: "Security", detail: "Prompt injection defense · Identity lock · Authority impersonation blocks · Tool-call integrity" },
          { id: "ratelimit", label: "Rate Limiting", detail: "3 layers · IP (1000/min) · Session (30 RPM, $0.50/day) · Per-agent budgets" },
          { id: "caching", label: "Caching", detail: "4 tiers · Vertex context cache · Response cache · Embedding cache · Conversation state" },
          { id: "billing", label: "Billing", detail: "nanoUSD precision (10^9 scale) · Modality-aware pricing · 145+ unit tests · Drift reconciliation" },
          { id: "ledger", label: "Credit Ledger", detail: "Reserve → settle → void · Atomic balance + ledger row in one transaction · 30s recovery cron auto-refunds stalled runs · Per-store invoices" },
          { id: "resilience", label: "Resilience", detail: "Redis graceful degradation · Stream disconnect detection · RabbitMQ async persistence" },
        ],
      },
      {
        title: "Hook Pipeline",
        nodes: [
          { id: "prehook", label: "Pre-Hook", detail: "Request policy guard · Session rate limit guard · Budget reservation · Blocking mode" },
          { id: "execute", label: "Execute", detail: "Agent invocation · Streaming SSE · Provider-agnostic via Vercel AI SDK" },
          { id: "posthook", label: "Post-Hook", detail: "Cost reconciliation · Invoice persistence · Usage logging · Non-blocking fire-and-forget" },
        ],
      },
      {
        title: "Agent Families",
        nodes: [
          { id: "storefront", label: "Storefront (1)", detail: "AI Salesman · 13 languages incl. 10 Arabic dialects · 8 tools · Qdrant vector search" },
          { id: "description", label: "Description (3)", detail: "Audio → description · Image OCR → description · URL analysis → description" },
          { id: "lpg", label: "LPG (7)", detail: "Product photos → landing page creative · Skeleton → image generation → stitch · quick-shot, editorial, and creative modes" },
          { id: "order", label: "Order (1)", detail: "Screenshot → structured order · Gemini Vision · Confidence-scored catalog matching" },
        ],
      },
      {
        title: "Deployment",
        nodes: [
          { id: "k8s", label: "Kubernetes (k3s)", detail: "Startup/readiness/liveness probes · Resource limits · Zero-downtime deploys" },
          { id: "security-hardening", label: "Security Hardening", detail: "Network policies · Pod security · Hardened deployment manifests" },
          { id: "infra-ops", label: "CI/CD & Infra", detail: "Automated deployments · Shell tooling · Response cache management" },
        ],
      },
    ],
  },

  "excalidraw-atelier": {
    screenshots: [
      { 
        src: "/projects/Atelier/atelier-home.png", 
        alt: "Excalidraw Atelier drawing editor", 
        caption: "Drawing editor with Editorial Atelier design language", 
        span: "full"
      },
      { 
        src: "/projects/Atelier/atelier-docs.png", 
        alt: "Excalidraw Atelier document editor", 
        caption: "TipTap document editor with custom extensions, powering a docs interface" 
      },
      { 
        src: "/projects/Atelier/atelier-kanban.png", 
        alt: "Excalidraw Atelier kanban board", 
        caption: "Kanban board with priorities, dependencies, and analytics" 
      },
    ],
    narrative: [
      "The name \"excalidraw-persistence\" tells the origin story. It started as a way to save Excalidraw drawings , just persistence, nothing more. A simple backend to store scenes in MongoDB, a login screen so they'd be private. That was the whole idea.",
      "But each solved problem revealed the next one. Saving led to autosave, autosave needed crash safety (WAL-backed recovery), sharing led to permissions, multiple drawings led to folders, folders needed search , and then the team needed more than just drawings. Documents arrived via TipTap with 6 custom extensions. Kanban boards followed with full project management capabilities.",
      "78,415 lines later, it's a full collaborative workspace with realtime collaboration, ClickUp bidirectional sync, an MCP server for Claude integration, and a tamagotchi pet with 8-directional eye tracking , because we are professionals at Converty.",
    ],
    architecture: [
      {
        title: "Frontend , 3 Content Types",
        nodes: [
          { id: "drawing", label: "Drawing Editor", detail: "Excalidraw 0.17.6 · Real-time canvas · Delta saves · Rolling int32 hash change detection" },
          { id: "document", label: "Document Editor", detail: "TipTap with 6 custom extensions · Callouts, toggles, bookmarks, @mentions, comments, templates" },
          { id: "kanban", label: "Kanban Board", detail: "Drag-drop · 4 priority levels · Dependencies with circular prevention · Board analytics" },
        ],
      },
      {
        title: "Collaboration Engine",
        nodes: [
          { id: "websocket", label: "WebSocket", detail: "Socket.IO · Cursor presence · Ghost mode after 30s idle · Solo optimization" },
          { id: "sync", label: "Delta Sync", detail: "Element reconciliation (union by ID, version+nonce tiebreak) · Adaptive debounce 200-500ms" },
          { id: "offline", label: "Offline Resilience", detail: "Exponential backoff 2s-30s · WAL guard on beforeunload · Visibility change handler" },
        ],
      },
      {
        title: "Backend Services",
        nodes: [
          { id: "auth", label: "Auth & Roles", detail: "4-tier: user → team-lead → admin → dev · JWT 30-day · Disabled user enforcement (HTTP + WS)" },
          { id: "persist", label: "Persistence", detail: "Delta saves (only changed elements) · WAL crash recovery · 5-minute snapshot versioning" },
          { id: "clickup", label: "ClickUp Sync", detail: "Bidirectional · AES-256-GCM encrypted tokens · Conflict detection · Rich import" },
          { id: "mcp", label: "MCP Server", detail: "13 resources · 14+ tools · 5 prompts · Claude Desktop/Code integration" },
        ],
      },
      {
        title: "Infrastructure",
        nodes: [
          { id: "mongo", label: "MongoDB", detail: "Replica set · Scenes, users, activity log · 90-day TTL auto-expire" },
          { id: "k8s", label: "Kubernetes", detail: "k3s · PodDisruptionBudget · Startup/readiness/liveness probes · Resource limits" },
          { id: "ci", label: "CI/CD", detail: "11 smoke test suites · GitHub Actions on self-hosted runner · Docker Compose for dev" },
        ],
      },
    ],
  },

  lpg: {
    screenshots: [
      {
        src: "/projects/URANUS/lpg-config.png",
        alt: "Landing Page Generator configuration form",
        caption: "LPG configuration form , product input, market, and creative mode",
        span: "full",
      },
    ],
    narrative: [
      "The Landing Page Generator answers one question for a Converty seller: I have a product, now give me something that sells it. A few product photos go in, a finished landing page creative comes out. No templates to wrestle with, no designer to brief.",
      "It is live in production. In its first month it drove over 1,000 generations as a new paid feature sellers pay to use.",
      "The output is an image, not code. Rather than assemble HTML, the pipeline drives image-generation models (Gemini 3 Pro Image, with an optional OpenAI path) to render the landing page directly as a polished visual creative, exported as WebP for display with lossless PNG masters kept for clean regeneration.",
      "Under the hood it is a multi-agent pipeline, not a single prompt. A skeleton agent turns the product input into a structured page layout, then image agents render that layout: either section by section with a hero-anchored style, or as a single full-page shot for the faster modes. Sharp stitches the pieces into one tall creative.",
      "There are three live modes, each a different creative posture: a quick-shot single-pass mode for fast, conversion-first creatives, an editorial mode for a more designed look, and a section-by-section creative-director mode for maximum control. None is a legacy fallback , sellers pick the voice that fits the product.",
      "Copy is dialect-aware. Arabic rendered into the creative follows per-market conventions: Maghreb and Modern Standard markets get Western numerals, Mashreq and Egyptian markets get Eastern Arabic numerals, and Latin proper nouns are preserved rather than transliterated. A creative for a Tunisian store reads like it was written in Tunis, not machine-translated.",
      "The pipeline runs on the URANUS infrastructure, so it inherits billing, rate limiting, caching, and security for free. Every generation is metered in credits against the seller's balance, reserved before the run and settled when the final image lands.",
    ],
    architecture: [
      {
        title: "Input",
        nodes: [
          { id: "product", label: "Product Input", detail: "Single product , name, description, images , as the only required input" },
          { id: "mode", label: "Creative Mode", detail: "3 live modes · V3 quick-shot · Editorial · V1 creative · Market + dialect selection" },
        ],
      },
      {
        title: "Generation Pipeline",
        nodes: [
          { id: "skeleton", label: "Skeleton", detail: "Product photos → structured page layout · Gemini 3 Flash · Section planning · Dialect-aware copy rules" },
          { id: "image", label: "Image Generation", detail: "Gemini 3 Pro Image · Section-by-section or single full-page · Hero-anchored style · Optional OpenAI path" },
          { id: "stitch", label: "Stitch & Export", detail: "Sharp vertical stitching · WebP creative + PNG master + thumbnail · CDN upload · Per-section regeneration" },
        ],
      },
      {
        title: "Inherited from URANUS",
        nodes: [
          { id: "billing", label: "Billing", detail: "nanoUSD per-request costing · Per-session budgets · Per-agent budget caps" },
          { id: "ratelimit", label: "Rate Limiting", detail: "IP + session limits · Pre-hook policy and rate limit guards" },
          { id: "caching", label: "Caching", detail: "Vertex context cache · Response cache · Embedding cache" },
          { id: "security", label: "Security", detail: "Prompt injection defense · SSRF hardening · Data-only sandboxing for seller content" },
        ],
      },
    ],
  },

  "converty-mcp": {
    narrative: [
      "The Converty MCP Server brings a seller's store into the chat. It is a Model Context Protocol server that lets an AI assistant read and manage a Converty store , orders, products, categories, statistics, and store settings , through a safe, well-scoped surface.",
      "Every session is scoped to a single authenticated store. The assistant never passes a store id and can never reach across tenants: the OAuth service resolves identity once, and every tool call inherits that boundary. One store per session, no exceptions.",
      "All data is sourced through the OAuth service, not the database. The MCP is a consumer of one served surface, with no direct DB coupling. When a tool needs a field the served surface does not expose yet, the fix lives in oauth's response, not in a patch inside the MCP. That keeps the boundary honest and the blast radius small.",
      "Access is scoped per tool. Each tool declares the OAuth scope it needs, and if the seller did not grant it, the tool surfaces a clear insufficient-permission error naming the missing scope instead of failing silently or leaking data. The assistant tells the seller exactly what to grant.",
      "Staff management is read-only by design. Create, update, and delete on staff were deliberately removed from the OAuth and MCP surface: unbounded staff permissions were a privilege-escalation path, so the MCP can read the staff roster but never mutate it. Some doors stay closed on purpose.",
    ],
    architecture: [
      {
        title: "AI Assistant",
        nodes: [
          { id: "mcp", label: "MCP Transport", detail: "Model Context Protocol · Tool discovery · One store per session · No store id passed by the client" },
        ],
      },
      {
        title: "Access Control",
        nodes: [
          { id: "oauth", label: "OAuth Scoping", detail: "Identity resolved once · Single authenticated store · Per-tool scope requirements" },
          { id: "perms", label: "Permission Surfacing", detail: "Insufficient-permission errors name the missing scope · No silent failure · No data leak" },
          { id: "readonly", label: "Read-only Staff", detail: "Staff create/update/delete removed · Privilege-escalation boundary · Read-only roster" },
        ],
      },
      {
        title: "Served Surface , via OAuth",
        nodes: [
          { id: "orders", label: "Orders", detail: "List, read, and manage orders · Status vocabulary · Reference vs internal id" },
          { id: "products", label: "Products & Categories", detail: "Catalog items, stock, variants, bundles · Category tree" },
          { id: "stats", label: "Statistics", detail: "Store performance · Custom breakdowns · Aggregated metrics" },
          { id: "settings", label: "Store Settings", detail: "Store info · Configuration · Currency and delivery context" },
        ],
      },
    ],
  },

  "storefront-chatbot": {
    screenshots: [
      {
        src: "/projects/URANUS/uranus-in-action.jpeg",
        alt: "Storefront AI salesman in action",
        caption: "Live storefront conversation , streaming response with product recommendations",
        span: "full"
      },
    ],
    narrative: [
      "Every Converty store gets its own AI salesman. Not a generic chatbot widget , a production shopping assistant that understands the store's catalog, speaks the customer's language, and manages their cart in real time.",
      "I chose to feature this agent because it represents the work I do at Converty. Behind it sit 11 other agents , description generators that turn audio, images, and URLs into product copy; a 7-agent landing page pipeline; an order extractor that reads WhatsApp screenshots. They all run on the same URANUS infrastructure, but the storefront is where everything comes together: vector search, tool orchestration, multilingual understanding, and streaming responses.",
      "The agent has 8 tools at its disposal , Qdrant vector search for semantic product discovery, FAQ retrieval, catalog browsing, and full cart management (add, remove, update, checkout). Tools are conditionally registered based on the store's checkout mode, so an express-checkout store won't expose cart operations.",
      "Language support covers 13 languages including 10 Arabic dialects. The system prompt is dynamically assembled from the store's checkout type, name, and detected language , a Tunisian customer gets Tunisian Arabic, not Modern Standard.",
      "Sellers get extensive customization to make the chatbot truly theirs. They manage their own FAQ knowledge base , the agent retrieves answers via Qdrant vector search, so it handles phrasing variations naturally. Product descriptions feed directly into the semantic search layer. Beyond behavior, every visual aspect of the chat widget is configurable: colors, positioning, chat bubble style, welcome messages, and avatar , so it blends into the store's branding rather than looking like a bolted-on third-party widget.",
    ],
    architecture: [
      {
        title: "Customer Request",
        nodes: [
          { id: "sse", label: "Streaming SSE", detail: "Real-time token streaming · Tool call visibility · Connection resilience" },
          { id: "lang", label: "Language Detection", detail: "13 languages · 10 Arabic dialects (Tunisian, Egyptian, Levantine, Gulf, etc.)" },
        ],
      },
      {
        title: "Agent Core",
        nodes: [
          { id: "prompt", label: "Dynamic Prompt", detail: "Assembled per-request from checkout type, store name, language · Vertex context caching" },
          { id: "model", label: "Gemini 3 Flash", detail: "384-token output cap · Max 4 tool steps per turn · Temperature tuned for sales" },
        ],
      },
      {
        title: "Tool Suite , 8 Tools",
        nodes: [
          { id: "search", label: "Product Search", detail: "querySimilarProducts · Qdrant vector search · Semantic product discovery" },
          { id: "browse", label: "Browse & FAQ", detail: "browseProducts · queryStoreFaqs (Qdrant FAQ search) · Catalog navigation" },
          { id: "cart", label: "Cart Management", detail: "addToCart · removeFromCart · updateCartItem · Conditionally registered per checkout mode" },
          { id: "order", label: "Order Creation", detail: "createOrderFromCart · createOrderForSingleProduct · Express + cart checkout paths" },
        ],
      },
      {
        title: "Inherited from URANUS",
        nodes: [
          { id: "billing", label: "Billing", detail: "nanoUSD per-request costing · Session budget ($0.50/day) · Per-agent budget caps" },
          { id: "security", label: "Security", detail: "Prompt injection defense · SSRF hardening · Data-only sandboxing for seller content" },
          { id: "ratelimit", label: "Rate Limiting", detail: "IP (1000/min) · Session (30 RPM) · Pre-hook policy + rate limit guards" },
          { id: "cache", label: "Caching", detail: "Vertex context cache per store · Response cache · Embedding cache" },
        ],
      },
    ],
  },

  "trading-pipeline": {
    screenshots: [
      { src: "/projects/trading-pipeline/trading-architecture.png", alt: "Trading pipeline architecture", caption: "Trading pipeline architecture", span: "full" },
      { src: "/projects/trading-pipeline/tading-dashboard-one.png", alt: "Grafana trading dashboard", caption: "Grafana trading dashboard", fit: "contain" },
      { src: "/projects/trading-pipeline/forecast-dashboard.png", alt: "Grafana forecast dashboard", caption: "Grafana forecast dashboard", fit: "contain" },
    ],
    narrative: [
      "An end-to-end data engineering project , ingest, process, forecast, visualize, all containerized with CI/CD. Real-time crypto data flows from exchanges through Kafka, gets transformed by Spark, forecasted by Prophet, and lands in Grafana dashboards.",
      "The pipeline includes two ML models: Prophet for time-series price predictions and GPT-2 for generating natural language market insights from the processed data. Everything indexes into Elasticsearch for fast querying and live visualization.",
    ],
    architecture: [
      {
        title: "Data Ingestion",
        nodes: [
          { id: "kafka", label: "Kafka", detail: "Real-time crypto data streaming · Exchange API connectors · Topic partitioning" },
        ],
      },
      {
        title: "Processing & ML",
        nodes: [
          { id: "spark", label: "Spark", detail: "Large-scale data transformation · Batch + streaming modes · Feature engineering" },
          { id: "prophet", label: "Prophet", detail: "Time-series forecasting · Price predictions · Trend + seasonality decomposition" },
          { id: "gpt2", label: "GPT-2", detail: "Market insights generation · Natural language summaries from processed data" },
        ],
      },
      {
        title: "Storage & Visualization",
        nodes: [
          { id: "elastic", label: "Elasticsearch", detail: "Indexed data storage · Fast aggregation queries · Time-series optimized" },
          { id: "grafana", label: "Grafana", detail: "Live dashboards · Real-time price charts · Forecast overlays · Alert rules" },
        ],
      },
      {
        title: "Infrastructure",
        nodes: [
          { id: "docker", label: "Docker", detail: "Containerized services · Docker Compose orchestration · Environment parity" },
          { id: "ghactions", label: "GitHub Actions", detail: "CI/CD pipeline · Automated testing · Container builds · Deployment" },
        ],
      },
    ],
  },

  "profile-matching": {
    screenshots: [
      { 
        src: "/projects/profile-matching/profile-global-archi.png", 
        alt: "Profile Matching platform", 
        caption: "Global architecture diagram", 
        span: "full", 
        fit: "fill" 
      },
    ],
    narrative: [
      "A 7-month capstone project at Amaris Consulting that grew into a full AI recruitment platform. The core problem: match candidates to job postings semantically , not just keyword overlap, but real understanding of skills, experience, and role fit.",
      "LLMs handle the semantic matching with configurable evaluation axes and transparent scoring , recruiters see why a candidate ranked where they did. An automated CV parsing module extracts structured data from PDFs and LinkedIn profiles, feeding the matching pipeline.",
      "Under the hood, it's a microservices architecture split across 4 repositories , SQL (PostgreSQL) for authentication, NoSQL for AI processing and async jobs. The DevOps backbone mirrors production patterns: Docker Swarm orchestration, CI/CD pipelines across 3 environments, Nginx reverse proxy, and a full monitoring stack.",
    ],
    architecture: [
      {
        title: "AI Layer",
        nodes: [
          { id: "matching", label: "Semantic Matching", detail: "LLM-based candidate-job pairing · Configurable evaluation axes · Transparent scoring" },
          { id: "parsing", label: "CV Parsing", detail: "Automated extraction from PDFs and LinkedIn · Structured data output · Profile normalization" },
        ],
      },
      {
        title: "Application",
        nodes: [
          { id: "api", label: "API (Python)", detail: "Core backend · Matching engine · Candidate & job management · REST endpoints" },
          { id: "client", label: "Client (TypeScript)", detail: "Recruiter dashboard · Candidate profiles · Match results with score breakdowns" },
          { id: "server", label: "Web Server (Python)", detail: "Request routing · Session management · API gateway" },
        ],
      },
      {
        title: "Data Layer",
        nodes: [
          { id: "sql", label: "PostgreSQL", detail: "Authentication · User management · Role-based access" },
          { id: "nosql", label: "MongoDB", detail: "AI processing results · Async job state · Parsed profiles · Match history" },
        ],
      },
      {
        title: "Infrastructure",
        nodes: [
          { id: "swarm", label: "Docker Swarm", detail: "Service orchestration · Automatic scaling · Rolling updates · Health checks" },
          { id: "cicd", label: "CI/CD Pipeline", detail: "3 environments (dev → staging → prod) · Automated testing · Deployment gates" },
          { id: "nginx", label: "Nginx", detail: "Reverse proxy · Load balancing · Security hardening" },
          { id: "monitoring", label: "Monitoring", detail: "Service health · Resource utilization · Alert rules" },
        ],
      },
    ],
  },
};
