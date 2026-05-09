/**
 * System prompt for the portfolio chatbot.
 * Dynamically assembled from data files so it stays in sync with the site.
 */

import { SITE_CONFIG, SOCIAL_LINKS, NAV_ITEMS, KEY_NUMBERS, getAge } from "./constants";
import {
  getFeaturedProjects,
  getOtherProjects,
  getExperience,
  getEducation,
  getCertifications,
  getSkills,
  getLanguages,
  getCommunity,
  getAboutData,
} from "./data";
import { PROJECT_DETAILS } from "./project-details";

function buildSectionMap(): string {
  const featuredTitles = getFeaturedProjects().map((p) => p.title).join(", ");
  const otherCount = getOtherProjects().length;
  const certCount = getCertifications().length;

  const sections = NAV_ITEMS.map((item) => {
    const id = item.href.replace("#", "");
    switch (id) {
      case "projects":
        return `- #projects: Featured projects (${featuredTitles})\n- #other-projects: ${otherCount} additional projects`;
      case "skills":
        return `- #skills: Technical skills by category\n- #certifications: ${certCount} certifications`;
      case "contact":
        return `- #contact: Contact form, email, socials\n- #community: Volunteering, IEEE, IndabaX`;
      default:
        return `- #${id}: ${item.label}`;
    }
  });

  return `SECTION MAP (use these IDs for [SCROLL:id] hints):
- #hero: Top of page, intro
${sections.join("\n")}`;
}

function buildAboutSection(): string {
  const about = getAboutData();
  const languages = getLanguages()
    .map((l) => `${l.name} (${l.proficiency}${l.detail ? ", " + l.detail : ""})`)
    .join(", ");
  const education = getEducation()
    .map((e) => `${e.degree} from ${e.institution} (${e.period})${e.honors ? " - " + e.honors : ""}${e.detail ? " - " + e.detail : ""}`)
    .join("; ");
  const socials = SOCIAL_LINKS.map((s) => `${s.platform}: ${s.url}`).join("\n");

  return `Name: ${SITE_CONFIG.name}
Age: ${getAge()} (born ${SITE_CONFIG.birthdate})
Location: ${SITE_CONFIG.location}
Role: ${SITE_CONFIG.role} at ${SITE_CONFIG.company}
Education: ${education}
Languages spoken: ${languages}
Email: ${SITE_CONFIG.email}
${socials}

Bio: ${about.bio}
Highlights: ${about.highlights.join("; ")}`;
}

function buildFeaturedProjectsSection(): string {
  return getFeaturedProjects()
    .map((p) => {
      const details = PROJECT_DETAILS[p.slug];
      const stats = p.stats?.map((s) => `${s.value} ${s.label}`).join(", ") ?? "";
      const tech = p.tech.join(", ");
      const highlights = p.highlights.length > 0
        ? "\nHighlights:\n" + p.highlights.map((h) => `- ${h}`).join("\n")
        : "";
      const narrative = details?.narrative
        ? "\n" + details.narrative.join(" ")
        : "";

      return `### ${p.title} (${p.subtitle})
${p.description}
Stats: ${stats}
Tech: ${tech}${highlights}${narrative}`;
    })
    .join("\n\n");
}

function buildOtherProjectsSection(): string {
  return getOtherProjects()
    .map((p) => `- ${p.title}: ${p.description} [${p.tech.join(", ")}]`)
    .join("\n");
}

function buildExperienceSection(): string {
  return getExperience()
    .map((e) => {
      const bullets = e.bullets.map((b) => `  - ${b}`).join("\n");
      return `${e.company} (${e.period}) - ${e.role}, ${e.location}
${bullets}`;
    })
    .join("\n\n");
}

function buildSkillsSection(): string {
  return getSkills()
    .map((g) => `${g.category}: ${g.skills.join(", ")}`)
    .join("\n");
}

function buildCertificationsSection(): string {
  return getCertifications()
    .map((c) => `${c.name} (${c.issuer}, ${c.date})`)
    .join(", ");
}

function buildCommunitySection(): string {
  return getCommunity()
    .map((c) => `- ${c.title}, ${c.organization} (${c.period}): ${c.description}`)
    .join("\n");
}

function buildKeyNumbers(): string {
  const k = KEY_NUMBERS;
  return `${k.excalidrawLOC.toLocaleString()} LOC (Excalidraw), ${k.uranusAgents} AI agents, ${k.uranusTests}+ billing tests, ${k.prsAuthored} PRs, ${k.commits} commits, ${k.languagesSupported} languages supported, TOEIC ${k.toeicScore}, exam rank ${k.examRank}, ${k.linkedinFollowers.toLocaleString()} LinkedIn followers, ${k.topPostImpressions.toLocaleString()} top post impressions`;
}

export function buildSystemPrompt(): string {
  return `You are a friendly, concise assistant embedded in ${SITE_CONFIG.name}'s portfolio website. Visitors ask you questions about Edam, his work, skills, projects, experience, and background.

RULES:
- Answer ONLY about Edam Hamza. If asked about unrelated topics, politely redirect.
- Be concise: 2-4 sentences max unless the visitor asks for detail.
- Use a warm, professional tone. No corporate jargon, no filler.
- Use concrete numbers and specifics from the data below. Never make up facts.
- When your answer relates to a specific section of the portfolio, include a navigation hint in this exact format on its own line: [SCROLL:section-id] (e.g. [SCROLL:projects]). Only one per response, and only when genuinely relevant.
- Never apologize for Edam being junior. Frame it as "full architectural ownership at a startup."
- Lead with infrastructure and production impact, not buzzwords.
- If you don't know something, say so honestly.

${buildSectionMap()}

=== ABOUT EDAM ===

${buildAboutSection()}

=== CURRENT ROLE: ${SITE_CONFIG.company.toUpperCase()} ===

${SITE_CONFIG.company} is the Shopify of Tunisia, an e-commerce platform for local merchants in Tunisia and the MENA region. Edam has full architectural ownership as a ${SITE_CONFIG.role}, building production infrastructure end-to-end.

=== FEATURED PROJECTS ===

${buildFeaturedProjectsSection()}

=== OTHER PROJECTS ===

${buildOtherProjectsSection()}

=== EXPERIENCE ===

${buildExperienceSection()}

=== SKILLS ===

${buildSkillsSection()}

=== CERTIFICATIONS ===

${buildCertificationsSection()}

=== COMMUNITY ===

${buildCommunitySection()}

=== KEY NUMBERS ===

${buildKeyNumbers()}`;
}
