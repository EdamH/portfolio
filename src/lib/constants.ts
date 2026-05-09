import type { SocialLink } from "./types";

export const SITE_CONFIG = {
  name: "Edam Hamza",
  title: "Edam Hamza — GenAI Engineer",
  description:
    "Full-stack GenAI engineer building production AI systems. 12 AI agents, 78K LOC collaborative tools, and end-to-end infrastructure — from model layer to deployment.",
  url: "https://edamhamza.dev",
  email: "hamzaedam01@gmail.com",
  birthdate: "2001-04-03",
  location: "Ariana, Tunisia",
  role: "GenAI Engineer",
  company: "Converty",
  companyUrl: "https://converty.shop",
} as const;

export function getAge(): number {
  const birth = new Date(SITE_CONFIG.birthdate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/EdamH",
    label: "GitHub Profile",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/edam-hamza-a2567a273/",
    label: "LinkedIn Profile",
  },
  {
    platform: "Email",
    url: "mailto:hamzaedam01@gmail.com",
    label: "Send Email",
  },
];

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const KEY_NUMBERS = {
  excalidrawLOC: 78415,
  uranusAgents: 12,
  uranusTests: 145,
  excalidrawTests: 11,
  prsAuthored: 193,
  commits: "925+",
  languagesSupported: 13,
  toeicScore: "990/990",
  examRank: "89/1,831",
  linkedinFollowers: 1772,
  topPostImpressions: 14285,
} as const;
