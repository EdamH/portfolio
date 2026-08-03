export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  angle: string;
  highlights: string[];
  tech: string[];
  link?: string;
  collaborator?: string;
  collaboratorUrl?: string;
  stats?: { value: string; label: string }[];
  featured: boolean;
  visualOpportunity?: string;
}

export interface Experience {
  period: string;
  company: string;
  role: string;
  location: string;
  type: string;
  bullets: string[];
  keyPoint: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  honors?: string;
  detail?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  link?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  idealFor: string;
}

export interface CommunityItem {
  title: string;
  organization: string;
  description: string;
  period?: string;
  hasPhoto?: boolean;
  photo?: string;
}

export interface Language {
  name: string;
  proficiency: string;
  detail?: string;
}

export interface AboutData {
  bio: string;
  highlights: string[];
  languages: Language[];
  education: Education[];
}

export interface KeyNumbers {
  excalidrawLOC: number;
  uranusAgents: number;
  uranusTests: number;
  excalidrawTests: number;
  prsAuthored: number;
  commits: string;
  languagesSupported: number;
  toeicScore: string;
  examRank: string;
  linkedinFollowers: number;
  topPostImpressions: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  _honey?: string;
  _loadTime?: number;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}
