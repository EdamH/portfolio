import Image from "next/image";
import { getAboutData } from "@/lib/data";
import { SITE_CONFIG, getAge } from "@/lib/constants";
import { LuMapPin, LuBriefcase } from "react-icons/lu";
import { fetchContributions, computeStreaks, fetchTopLanguages } from "@/lib/github";
import GitHubActivity from "@/components/ui/GitHubActivity";
import AvailabilityStrip from "@/components/ui/AvailabilityStrip";

const languages = [
  { name: "Arabic", proficiency: "Native" },
  { name: "French", proficiency: "Bilingual" },
  { name: "English", proficiency: "Full Professional", note: "TOEIC 990/990" },
  { name: "German", proficiency: "Elementary" },
];

const education = [
  {
    institution: "SUP'COM",
    degree: "ICT Engineering",
    distinction: "High Honors",
    years: "2022 – 2025",
  },
  {
    institution: "IPEIS Sfax",
    degree: "Engineering Prep",
    distinction: "Rank 89/1,831",
    years: "2020 – 2022",
    highlightDistinction: true,
  },
];

export default async function About() {
  const [about, contributions, topLanguages] = await Promise.all([
    getAboutData(),
    fetchContributions("EdamH"),
    fetchTopLanguages("EdamH"),
  ]);

  const streak = computeStreaks(contributions.weeks);

  return (
    <section
      id="about"
      className="section-padding border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Section heading ── */}
        <p className="font-mono text-accent text-sm tracking-wider uppercase">
          {"// About"}
        </p>
        <h2 className="mt-2 font-serif italic text-4xl text-foreground">
          The Engineer
        </h2>

        {/* ── Two-column grid ── */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ── Left column: Info card + Bio + Highlights ── */}
          <div className="space-y-10">
            {/* Info card — headshot + quick details */}
            <div className="flex gap-4 md:gap-5 items-start">
              <div className="relative w-24 h-24 md:w-34 md:h-34 shrink-0 overflow-hidden border border-border group/photo">
                <Image
                  src="/headshot.jpg"
                  alt="Edam Hamza"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transition-all duration-500 saturate-[0.8] brightness-[1.05] contrast-[1.05] group-hover/photo:saturate-100 group-hover/photo:brightness-100 group-hover/photo:contrast-100"
                  priority
                />
                {/* Gold overlay that fades on hover */}
                <div className="absolute inset-0 bg-accent/10 mix-blend-overlay transition-opacity duration-500 group-hover/photo:opacity-0" />
              </div>
              <div className="space-y-2 pt-0.5">
                <h3 className="text-foreground font-medium text-lg leading-tight">
                  {SITE_CONFIG.name}
                </h3>
                <p className="text-muted text-sm">
                  {getAge()} years old
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <LuBriefcase size={13} className="text-accent shrink-0" />
                    <span>
                      {SITE_CONFIG.role}{" "}
                      <a
                        href={SITE_CONFIG.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-foreground transition-colors duration-300"
                      >
                        @{SITE_CONFIG.company}
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <LuMapPin size={13} className="text-accent shrink-0" />
                    <span>{SITE_CONFIG.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-muted leading-relaxed text-base">
              I build systems end-to-end&nbsp;&mdash; from the model layer to
              the infrastructure it runs on. My work spans generative AI,
              full-stack development, data engineering, DevOps, and embedded
              systems. Not because I hop between fields, but because the best
              solutions don&rsquo;t respect domain boundaries.
            </p>

            {/* Highlights */}
            {about.highlights && about.highlights.length > 0 && (
              <div>
                <h3 className="font-mono text-xs tracking-wider uppercase text-muted mb-4">
                  Highlights
                </h3>
                <ul className="space-y-3">
                  {about.highlights.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-foreground/80 text-sm leading-relaxed"
                    >
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education */}
            <div>
              <h3 className="font-mono text-xs tracking-wider uppercase text-muted mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.institution}
                    className="border border-border rounded-md p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-foreground text-sm font-medium">
                        {edu.institution}
                      </span>
                      <span className="font-mono text-xs text-muted/60">
                        {edu.years}
                      </span>
                    </div>
                    <p className="mt-1 text-muted text-sm">
                      {edu.degree}{" "}
                      &mdash;{" "}
                      <span
                        className={
                          edu.highlightDistinction
                            ? "text-accent"
                            : "text-foreground/80"
                        }
                      >
                        {edu.distinction}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right column: Education + Availability + GitHub ── */}
          <div className="space-y-10">

            {/* Languages */}
            <div>
              <h3 className="font-mono text-xs tracking-wider uppercase text-muted mb-4">
                Languages
              </h3>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex items-baseline justify-between border-b border-border pb-2"
                  >
                    <span className="text-foreground text-sm">{lang.name}</span>
                    <span className="font-mono text-xs text-muted">
                      {lang.proficiency}
                      {lang.note && (
                        <>
                          {" "}
                          &middot;{" "}
                          <span className="text-accent">{lang.note}</span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <AvailabilityStrip />

            {/* GitHub Activity */}
            <GitHubActivity
              weeks={contributions.weeks}
              months={contributions.months}
              totalContributions={contributions.totalContributions}
              streak={streak}
              languages={topLanguages}
              username="EdamH"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
