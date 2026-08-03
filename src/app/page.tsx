import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Services from "@/components/sections/Services";
import OtherProjects from "@/components/sections/OtherProjects";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Certifications from "@/components/sections/Certifications";
import Community from "@/components/sections/Community";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import AnimateInView from "@/components/ui/AnimateInView";
import BootWrapper from "@/components/BootWrapper";
import { SITE_CONFIG } from "@/lib/constants";

function JsonLd() {
  const personId = `${SITE_CONFIG.url}/#person`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: "Edam Hamza",
    alternateName: ["Hamza Edam", "Edam Hamza"],
    givenName: "Edam",
    familyName: "Hamza",
    jobTitle: "GenAI Engineer",
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}/headshot.jpg`,
    email: `mailto:${SITE_CONFIG.email}`,
    sameAs: [
      "https://github.com/EdamH",
      "https://www.linkedin.com/in/edam-hamza-a2567a273/",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Converty",
      url: "https://converty.shop",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "SUP'COM",
      url: "https://www.supcom.tn/",
    },
    knowsAbout: [
      "Generative AI",
      "Large Language Models",
      "AI Agents",
      "Retrieval-Augmented Generation",
      "Model Context Protocol",
      "Full-Stack Development",
      "Backend Engineering",
      "Data Engineering",
      "DevOps",
      "Kubernetes",
      "TypeScript",
      "Python",
      "Node.js",
    ],
    knowsLanguage: ["Arabic", "French", "English", "German"],
    nationality: {
      "@type": "Country",
      name: "Tunisia",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ariana",
      addressCountry: "TN",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    inLanguage: "en",
    author: { "@id": personId },
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_CONFIG.url}/#profilepage`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.title,
    isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
    mainEntity: { "@id": personId },
    about: { "@id": personId },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <BootWrapper>
        <main>
          <Hero />
          <AnimateInView>
            <About />
          </AnimateInView>
          <AnimateInView>
            <FeaturedProjects />
          </AnimateInView>
          <AnimateInView>
            <Services />
          </AnimateInView>
          <AnimateInView>
            <Experience />
          </AnimateInView>
          <AnimateInView delay={0.1}>
            <OtherProjects />
          </AnimateInView>
          <AnimateInView>
            <Skills />
          </AnimateInView>
          <AnimateInView delay={0.05}>
            <Certifications />
          </AnimateInView>
          <AnimateInView>
            <Community />
          </AnimateInView>
          <AnimateInView>
            <Contact />
          </AnimateInView>
        </main>
        <Footer />
      </BootWrapper>
    </>
  );
}
