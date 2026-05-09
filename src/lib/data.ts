import type {
  Project,
  Experience,
  Education,
  Certification,
  SkillGroup,
  CommunityItem,
  Language,
  AboutData,
} from "./types";

export function getFeaturedProjects(): Project[] {
  return [
    {
      slug: "uranus",
      title: "URANUS",
      subtitle: "AI Provider Agnostic Infrastructure Layer",
      description:
        "The AI backbone of Converty. A production AI infrastructure layer with 12 agents across 4 families, orchestrated through a unified runner/hook pipeline with billing, security, rate limiting, and caching built into the core.",
      angle:
        "Not just a chatbot. A production AI infrastructure layer with 12 agents, nanoUSD billing, 3-layer rate limiting, and provider-agnostic architecture. Built from scratch with full architectural ownership.",
      stats: [
        { value: "12", label: "AI agents" },
        { value: "145+", label: "unit tests" },
        { value: "13", label: "languages" },
        { value: "4", label: "agent families" },
      ],
      highlights: [
        "12 agents across 4 families (Storefront, Description, LPG, Order Extraction)",
        "Hook pipeline system: pre-hook → execute → post-hook with blocking/non-blocking modes",
        "nanoUSD billing engine: integer arithmetic at 10^9 scale, 145+ unit tests",
        "3-layer rate limiting: IP (1000 req/min), session (30 RPM, $0.50/day), per-agent budgets",
        "13 languages supported including 10 Arabic dialects (Tunisian, Egyptian, Levantine, Gulf)",
        "Provider-agnostic design. Vertex AI active, OpenAI and Anthropic stubbed and ready",
        "Prompt injection defenses, SSRF hardening, JWT auth with Redis invalidation",
        "Multi-tier caching: Vertex context cache, response cache, embedding cache",
      ],
      tech: [
        "Vertex AI",
        "Gemini",
        "Qdrant",
        "Redis",
        "RabbitMQ",
        "Vercel AI SDK",
        "TypeScript",
        "MongoDB",
        "Zod",
      ],
      featured: true,
      visualOpportunity:
        "Interactive architecture diagram: 12 agents, hook pipeline, billing flow",
    },
    {
      slug: "storefront-chatbot",
      title: "Storefront AI Salesman",
      subtitle: "Multilingual Shopping Assistant",
      description:
        "The customer-facing AI salesman powering every Converty store. Chosen here to represent the many agents I've built at Converty, from product description generators to order extractors to landing page pipelines. This one showcases the full stack: vector search, tool orchestration, multilingual support, and real-time streaming.",
      angle:
        "Not a demo chatbot. A production shopping assistant with 8 tools, 13 languages, vector search, and cart management. Representative of all 12 agents built on the URANUS platform.",
      stats: [
        { value: "8", label: "tools" },
        { value: "13", label: "languages" },
        { value: "384", label: "token cap" },
        { value: "10", label: "Arabic dialects" },
      ],
      highlights: [
        "8 tools: vector product search (Qdrant), FAQ search, browse, add/remove/update cart, create order (single + cart)",
        "13 languages including 10 Arabic dialects (Tunisian, Egyptian, Levantine, Gulf, etc.)",
        "Tools conditionally registered based on store checkout mode (cart/express/both)",
        "Dynamic system prompt built from checkout type, store name, and language",
        "Vertex context caching per store for prompt cost reduction",
        "384-token output cap, max 4 tool steps per turn",
        "Streaming SSE responses with real-time tool call visibility",
        "Seller-managed FAQ knowledge base with vector search, custom product descriptions, and full visual customization (colors, positioning, bubble style, avatar, welcome messages)",
        "Chosen to represent 12 agents across 4 families, all running on URANUS infrastructure",
      ],
      tech: [
        "Gemini",
        "Qdrant",
        "Vertex AI",
        "Vercel AI SDK",
        "TypeScript",
        "Redis",
        "Zod",
      ],
      featured: true,
      visualOpportunity:
        "Live chat demo, tool call flow visualization",
    },
    {
      slug: "excalidraw-atelier",
      title: "Excalidraw Atelier",
      subtitle: "Collaborative Workspace",
      description:
        "What started as 'I just want to save my drawings' became 78,415 lines of production code. A full collaborative workspace with three content types, realtime collaboration, and a distinctive Editorial Atelier design language. Used daily by ~30 people.",
      angle:
        "It started as \"excalidraw-persistence\", just a way to save drawings. Then each solved problem revealed the next. 78,415 lines later, it's a full collaborative workspace used daily by ~30 people. Yes, it has a tamagotchi pet because we are professionals at Converty!",
      stats: [
        { value: "78,415", label: "lines of code" },
        { value: "3", label: "content types" },
        { value: "~30", label: "daily users" },
        { value: "11", label: "test suites" },
      ],
      highlights: [
        "78,415 lines of production TypeScript",
        "3 content types: drawings, documents (TipTap with 6 custom extensions), kanban boards",
        "Realtime collaboration with element reconciliation (union by ID, version + nonce tiebreak)",
        "ClickUp bidirectional sync with AES-256-GCM encrypted tokens",
        "Editorial Atelier design language: cream paper, Instrument Serif, gold accents, paper grain",
        "Tamagotchi pet with 8-directional eye tracking, 7 moods, drag-and-drop interactions",
        "MCP server: 13 resources, 14+ tools, 5 prompts for Claude Desktop/Code",
        "11 smoke test suites, Kubernetes deployment, WAL-backed crash recovery",
      ],
      tech: [
        "TypeScript",
        "React",
        "Socket.IO",
        "MongoDB",
        "Kubernetes",
        "TipTap",
        "Excalidraw",
        "Docker",
      ],
      link: "https://github.com/EdamH/excalidraw-atelier",
      featured: true,
      visualOpportunity:
        "Screenshots of the Editorial Atelier UI, before/after evolution",
    },
    {
      slug: "trading-pipeline",
      title: "Real-Time Trading Pipeline",
      subtitle: "End-to-End Data Engineering",
      description:
        "End-to-end data engineering: ingest, process, forecast, visualize, all containerized with CI/CD. Real-time crypto analytics with Prophet forecasting and GPT-2 market insights.",
      angle:
        "End-to-end data engineering: ingest, process, forecast, visualize, all containerized with CI/CD.",
      stats: [
        { value: "5", label: "pipeline stages" },
        { value: "2", label: "ML models" },
        { value: "Real-time", label: "streaming" },
      ],
      highlights: [
        "Kafka streaming with real-time crypto data ingestion",
        "Spark processing for large-scale data transformation",
        "Prophet forecasting for price predictions",
        "GPT-2 market insights generation",
        "Elasticsearch indexing with live Grafana dashboards",
        "Containerized with Docker, CI/CD via GitHub Actions",
      ],
      tech: [
        "Kafka",
        "Spark",
        "Elasticsearch",
        "Grafana",
        "Python",
        "Docker",
        "GitHub Actions",
      ],
      link: "https://github.com/EdamH/REAL-TIME-TRADING-DATA-FORECAST-LLM-GRAFANA",
      collaborator: "Habib Kammoun",
      collaboratorUrl: "https://github.com/habibkammoun",
      featured: true,
      visualOpportunity: "Grafana dashboard screenshots, architecture diagram",
    },
    {
      slug: "profile-matching",
      title: "Profile Matching Platform",
      subtitle: "AI Recruitment, Amaris",
      description:
        "A 4-repo AI recruitment platform built as a capstone project at Amaris Consulting. LLM-based semantic candidate-job matching with transparent scoring, automated CV parsing, and a full DevOps backbone: Docker Swarm, CI/CD pipelines, reverse proxy, and monitoring.",
      angle:
        "End-to-end AI recruitment system. LLM semantic matching on top of a full DevOps backbone with Docker Swarm, CI/CD, and monitoring.",
      stats: [
        { value: "4", label: "repositories" },
        { value: "3", label: "environments" },
        { value: "LLM", label: "matching" },
      ],
      highlights: [
        "LLM-based semantic candidate-job matching with configurable evaluation axes and transparent scoring",
        "Automated CV parsing from PDFs and LinkedIn profiles",
        "Microservices architecture with SQL for auth, NoSQL for AI and async processing",
        "Docker Swarm orchestration with automated CI/CD pipelines",
        "Nginx reverse proxy with monitoring stack",
        "4-repo system: API (Python), web server, client (TypeScript), test suite",
      ],
      tech: [
        "Python",
        "TypeScript",
        "LLMs",
        "Docker Swarm",
        "PostgreSQL",
        "MongoDB",
        "Nginx",
      ],
      featured: true,
      visualOpportunity: "Matching pipeline diagram, CI/CD infrastructure",
    },
  ];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getFeaturedProjects().find((p) => p.slug === slug);
}

export function getOtherProjects(): Project[] {
  return [
    {
      slug: "store-analytics",
      title: "Store Traffic Analytics",
      subtitle: "ClickHouse Data Warehouse, Converty",
      description:
        "Real-time store analytics dashboard built on ClickHouse. RabbitMQ ingestion, 7 materialized views, and a multi-stage aggregation pipeline (event → session → daily → per-metric tables) powering traffic, retention, conversion, and device breakdowns per store.",
      angle: "ClickHouse analytics pipeline with materialized view aggregation for e-commerce traffic insights.",
      highlights: [],
      tech: ["ClickHouse", "RabbitMQ", "TypeScript", "React"],
      featured: false,
    },
    {
      slug: "aws-water-quality",
      title: "AWS MLOps Water Quality Pipeline",
      subtitle: "End-to-end AWS",
      description:
        "Kinesis → Lambda → Glue → S3 → SageMaker → FastAPI → Grafana. End-to-end AWS pipeline.",
      angle: "End-to-end AWS MLOps pipeline",
      highlights: [],
      tech: ["AWS", "Kinesis", "SageMaker", "FastAPI", "Grafana"],
      link: "https://github.com/EdamH/AWS-MLOPS-WATER-QUALITY-INDEX-FORECAST-VISUALIZE-GRAFANA-GENAI-GPT2",
      collaborator: "Farah Elloumi",
      collaboratorUrl: "https://github.com/faraheloumi",
      featured: false,
    },
    {
      slug: "ddl-optimization",
      title: "DDL Optimization with GenAI",
      subtitle: "EY Project",
      description:
        "LangChain + LLaMA/StarCoder2 for DB schema optimization.",
      angle: "GenAI for database schema optimization",
      highlights: [],
      tech: ["LangChain", "LLaMA", "StarCoder2", "Python"],
      link: "https://github.com/EdamH/DATA-DEFINITION-LANGUAGE-OPTIMIZATION-GENAI-LANGCHAIN",
      collaborator: "Farah Elloumi",
      collaboratorUrl: "https://github.com/faraheloumi",
      featured: false,
    },
    {
      slug: "auto-centering-camera",
      title: "Auto-Centering Camera",
      subtitle: "Drone Inspection, HTWK Leipzig",
      description:
        "Drone power line inspection with marker detection. Flutter + OpenCV + embedded (Raspberry Pi, ESP32).",
      angle: "Computer vision for drone power line inspection",
      highlights: [],
      tech: ["OpenCV", "Flutter", "Raspberry Pi", "ESP32", "C++"],
      link: "https://github.com/EdamH/Auto-Centering-Camera-Marker-Detection",
      featured: false,
    },
    {
      slug: "slack-clone",
      title: "MERN Slack Clone",
      subtitle: "Docker Swarm & Jenkins CI/CD",
      description:
        "Full DevOps showcase: Jenkins CI/CD, Docker Swarm orchestration, Prometheus monitoring, deployed on Azure.",
      angle: "Full DevOps showcase. The real project is the infrastructure.",
      highlights: [],
      tech: ["MERN", "Docker Swarm", "Jenkins", "Prometheus", "Azure"],
      link: "https://github.com/EdamH/MERN-SLACK-CLONE-CICD-DOCKER-SWARM",
      featured: false,
    },
    {
      slug: "multi-agent-examples",
      title: "Multi-Agent System Examples",
      subtitle: "Python Explorations",
      description: "Python multi-agent system explorations.",
      angle: "Multi-agent system patterns",
      highlights: [],
      tech: ["Python"],
      link: "https://github.com/EdamH/MULTIAGENT-SYSTEM-EXAMPLES",
      featured: false,
    },
    {
      slug: "flight-pipeline",
      title: "Real-Time Flight Data Pipeline",
      subtitle: "Kafka/Spark/Elasticsearch",
      description:
        "Real-time flight data pipeline with CI/CD on Azure.",
      angle: "Real-time data pipeline",
      highlights: [],
      tech: ["Kafka", "Spark", "Elasticsearch", "Azure"],
      link: "https://github.com/EdamH/REAL-TIME-FLIGHT-DATA-CICD-PIPELINE",
      collaborator: "Anas Ben Amor",
      collaboratorUrl: "https://github.com/AnasBenAmor10",
      featured: false,
    },
    {
      slug: "analytify",
      title: "Analytify",
      subtitle: "AI-Driven CRM, Acteol",
      description:
        "Full-stack CRM with OpenAI/LangChain at Acteol.",
      angle: "AI-driven CRM insights",
      highlights: [],
      tech: ["JavaScript", "OpenAI", "LangChain", ".NET"],
      link: "https://github.com/EdamH/Analytify",
      featured: false,
    },
    {
      slug: "lostpaws",
      title: "lostPaws",
      subtitle: "Full-Stack JavaScript App",
      description: "Full-stack JavaScript application.",
      angle: "Full-stack web app",
      highlights: [],
      tech: ["JavaScript"],
      link: "https://github.com/EdamH/lostPaws",
      featured: false,
    },
    {
      slug: "indabax-website",
      title: "IndabaX Tunisia Website",
      subtitle: "Team-Coordinated Build",
      description: "IndabaX Tunisia website. Team-coordinated website build.",
      angle: "Conference website",
      highlights: [],
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/EdamH/indaba-website",
      featured: false,
    },
    {
      slug: "mindsdb-forecasting",
      title: "MindsDB MySQL Forecasting",
      subtitle: "Docker Compose Guide",
      description:
        "Docker Compose guide for ML predictions with MindsDB.",
      angle: "ML predictions setup guide",
      highlights: [],
      tech: ["Python", "Docker", "MindsDB", "MySQL"],
      link: "https://github.com/EdamH/mindsdb_mysql_forecast_docker_pythonsdk",
      featured: false,
    },
  ];
}

export function getExperience(): Experience[] {
  return [
    {
      period: "Oct 2025 – Present",
      company: "Converty",
      role: "GenAI Engineer, Platform & Development Automation",
      location: "Ariana, Tunisia",
      type: "Full-time",
      keyPoint:
        "Full architectural ownership. 12 AI agents, 78K LOC internal tool, production infrastructure.",
      bullets: [
        "Designed and built URANUS: 12 AI agents across 4 families with unified runner/hook pipeline",
        "Built nanoUSD billing engine with 145+ unit tests and drift reconciliation",
        "Architected 3-layer rate limiting, multi-tier caching, and prompt injection defenses",
        "Created Excalidraw Atelier: 78,415 LOC collaborative workspace with realtime collab",
        "Built Landing Page Generator pipeline evolving through 4 versions with 7 agents",
        "Integrated delivery providers (Megafast, DV Delivery), backend + admin UI",
      ],
    },
    {
      period: "Feb 2025 – Aug 2025",
      company: "Amaris Consulting",
      role: "AI Intern, AI-Enhanced Modular Recruitment Platform",
      location: "Ariana, Tunisia",
      type: "Internship",
      keyPoint:
        "AI recruitment platform. LLMs for semantic matching. Microservices + Docker Swarm.",
      bullets: [
        "Designed and implemented a modular recruitment platform with microservices architecture",
        "Integrated LLMs for semantic candidate-job matching with transparent scoring",
        "Built automated CV parsing module for data extraction from PDFs and LinkedIn",
        "Deployed on Docker Swarm with CI/CD pipelines, reverse proxy, and monitoring stack",
      ],
    },
    {
      period: "Sep 2024 – Jan 2025",
      company: "EY Tunisia",
      role: "Generative AI Tutored Project, Data Structure Optimization",
      location: "Tunis, Tunisia",
      type: "Internship",
      keyPoint:
        "DB schema optimization with LLaMA/StarCoder2. LangChain.",
      bullets: [
        "Automated data structure testing using ML-based schema optimization",
        "Applied LLaMA and StarCoder2 with LangChain for validation model design",
        "Enhanced database efficiency and reduced manual testing workload",
      ],
    },
    {
      period: "Jul 2024 – Sep 2024",
      company: "HTWK Leipzig",
      role: "Summer Intern, Computer Vision & Embedded Systems",
      location: "Leipzig, Germany",
      type: "Internship",
      keyPoint:
        "Computer vision + embedded systems. OpenCV, Flutter, ESP32. International experience.",
      bullets: [
        "Developed marker detection algorithm using Canny edge detection for power line inspection",
        "Built embedded servo-based controller with 3-axis correction and 3D-printed gimbal",
        "Created Flutter Android app with real-time BLE parameter modifications",
      ],
    },
    {
      period: "Jun 2023 – Aug 2023",
      company: "Acteol",
      role: "GenAI & Full-Stack Development Intern, AI-Driven CRM Insights",
      location: "Sfax, Tunisia",
      type: "Internship",
      keyPoint:
        "CRM with OpenAI/LangChain. First exposure to GenAI.",
      bullets: [
        "Built full-stack CRM application for analyzing client data from Meta platforms",
        "Integrated OpenAI API + LangChain to prompt GPT-3 with Facebook page embeddings",
        "Delivered AI-powered insights for improved CRM decision-making",
      ],
    },
  ];
}

export function getEducation(): Education[] {
  return [
    {
      institution: "SUP'COM",
      degree: "ICT Engineering Degree",
      period: "2022 – 2025",
      honors: "High Honors",
    },
    {
      institution: "IPEIS Sfax",
      degree: "Engineering Preparatory",
      period: "2020 – 2022",
      detail: "National Entrance Exam Rank: 89 / 1,831",
    },
  ];
}

export function getCertifications(): Certification[] {
  return [
    {
      name: "Building RAG Agents with LLMs",
      issuer: "NVIDIA",
      date: "Nov 2024",
      credentialId: "j2Df5LzUQ5SHZbV4YqnMKg",
      link: "https://learn.nvidia.com/certificates?id=j2Df5LzUQ5SHZbV4YqnMKg"
    },
    {
      name: "AWS Academy Data Engineering",
      issuer: "AWS",
      date: "Oct 2024",
      link: "https://www.credly.com/badges/2e04d5cf-9e40-4d95-ab31-32909608fe4d/linked_in_profile"
    },
    {
      name: "AWS Academy Machine Learning Foundations",
      issuer: "AWS",
      date: "Oct 2024",
      link: "https://www.credly.com/badges/353e3bc7-3449-457e-a822-e3b42564fc62/linked_in_profile"
    },
    {
      name: "AWS Academy Cloud Foundations",
      issuer: "AWS",
      date: "Oct 2024",
      link: "https://www.credly.com/badges/3f678c75-1043-4139-8940-7ccd445c9ea1/linked_in_profile"
    },
    {
      name: "Machine Learning with Python",
      issuer: "freeCodeCamp",
      date: "Aug 2023",
      link: "https://freecodecamp.org/certification/EdamHamza/machine-learning-with-python-v7"
    },
    {
      name: "Data Analysis with Python",
      issuer: "freeCodeCamp",
      date: "Aug 2023",
      link: "https://freecodecamp.org/certification/EdamHamza/data-analysis-with-python-v7"
    },
    {
      name: "Scientific Computing with Python",
      issuer: "freeCodeCamp",
      date: "Aug 2023",
      link: "https://freecodecamp.org/certification/EdamHamza/scientific-computing-with-python-v7"
    },
    {
      name: "Data Visualization",
      issuer: "freeCodeCamp",
      date: "Aug 2023",
      link: "https://freecodecamp.org/certification/EdamHamza/data-visualization"
    },
    {
      name: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      date: "Aug 2022",
      link: "https://freecodecamp.org/certification/EdamHamza/javascript-algorithms-and-data-structures"
    },
    {
      name: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "Aug 2022",
      link: "https://freecodecamp.org/certification/EdamHamza/responsive-web-design"
    },
  ];
}

export function getSkills(): SkillGroup[] {
  return [
    {
      category: "Generative AI & NLP",
      skills: [
        "LLMs",
        "RAG",
        "Embeddings",
        "LangChain",
        "Prompt Engineering",
        "Qdrant",
        "Vertex AI",
        "Gemini",
        "OpenAI",
      ],
    },
    {
      category: "Full-Stack",
      skills: [
        "TypeScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Socket.IO",
        "TipTap",
        "Vite",
      ],
    },
    {
      category: "Data Engineering",
      skills: [
        "Kafka",
        "Spark",
        "Elasticsearch",
        "Grafana",
        "AWS Kinesis",
        "AWS Glue",
        "AWS S3",
        "AWS SageMaker",
      ],
    },
    {
      category: "DevOps & Cloud",
      skills: [
        "Docker",
        "Kubernetes",
        "Jenkins",
        "GitHub Actions",
        "Azure",
        "AWS",
        "Prometheus",
        "Nginx",
      ],
    },
    {
      category: "Embedded & CV",
      skills: [
        "OpenCV",
        "Raspberry Pi",
        "ESP32",
        "Flutter/BLE",
        "Dart",
      ],
    },
    {
      category: "Languages",
      skills: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C#", "Dart", "Go"],
    },
  ];
}

export function getLanguages(): Language[] {
  return [
    { name: "Arabic", proficiency: "Native" },
    { name: "French", proficiency: "Second" },
    { name: "English", proficiency: "Full Professional", detail: "TOEIC 990/990" },
    { name: "German", proficiency: "Elementary" },
  ];
}

export function getCommunity(): CommunityItem[] {
  return [
    {
      title: "Supervisory Board Member",
      organization: "IndabaX Tunisia 2024",
      description:
        "Organized Tunisia's chapter of the Deep Learning Indaba AI conference at SUP'COM.",
      period: "May 2024",
      hasPhoto: true,
      photo: "/indabax2024_supervisor.jpg",
    },
    {
      title: "Chair of Membership Committee",
      organization: "IEEE SupCom Student Branch",
      description: "Grew and led the membership committee for 1 year.",
      period: "Jun 2023 – Jun 2024",
      photo: "/membershipCommittee.jpg",
    },
    {
      title: "Team Leader of Project Department",
      organization: "Sup'Com Junior Entreprise",
      description: "Contributed to student enterprise projects.",
      period: "Sep 2022 – Jun 2023",
      photo: "/junior_o2.jpg",
    },
    {
      title: "Participants Coordinator",
      organization: "MTS Metaverse Tunisia Summit",
      description:
        "Involved with organizing team (IEEE SMU & IEEE SupCom Student Branch collaboration).",
      photo: "/mts.jpg",
      period: "Jun 2023 - Dec 2023",
    },
    {
      title: "Study Trip to Barcelona",
      organization: "SUP'COM",
      description:
        "Visited i2CAT Research Centre, Infor, TBS Education Barcelona, and EY.",
      photo: "/studytrip_O2.jpg",
      period: "June 2024",
    },
  ];
}

export function getAboutData(): AboutData {
  return {
    bio: "I build systems end-to-end, from the model layer to the infrastructure it runs on. My work spans generative AI, full-stack development, data engineering, DevOps, and embedded systems. Not because I hop between fields, but because the best solutions don't respect domain boundaries.",
    highlights: [
      "Tunisian engineer with full architectural ownership at Converty",
      "SUP'COM ICT Engineering, High Honors (entrance exam rank 89/1,831)",
      "12 AI agents in production, 78K LOC collaborative workspace, end-to-end infrastructure",
      "Perfect English (TOEIC 990/990), native Arabic and French",
    ],
    languages: getLanguages(),
    education: getEducation(),
  };
}
