import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Edam Hamza",
    jobTitle: "GenAI Engineer",
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
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
    },
    knowsAbout: [
      "Generative AI",
      "Large Language Models",
      "Full-Stack Development",
      "Data Engineering",
      "DevOps",
      "TypeScript",
      "Python",
    ],
    nationality: {
      "@type": "Country",
      name: "Tunisia",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
