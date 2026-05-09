import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data";
import { GitHubIcon, ArrowRightIcon } from "@/components/ui/Icons";
import CountUp from "@/components/ui/CountUp";

export default function FeaturedProjects() {
  const projects = getFeaturedProjects();

  return (
    <section
      id="projects"
      className="section-padding border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="mb-10 md:mb-16">
          <span className="font-mono text-accent text-sm tracking-wider uppercase">
            // Projects
          </span>
          <h2 className="font-serif italic text-4xl mt-2 text-foreground">
            Featured Work
          </h2>
        </div>

        {/* Project cards */}
        <div className="space-y-10 md:space-y-14">
          {projects.map((project, index) => {
            const num = String(index + 1).padStart(2, "0");

            return (
              <article
                key={project.slug}
                className="border border-card-border border-l-2 border-l-accent bg-card hover:bg-card-hover p-6 md:p-8 lg:p-10 transition-colors duration-300"
              >
                {/* Number + Title row */}
                <div className="flex items-start gap-4 mb-1">
                  <span className="font-mono text-accent text-sm leading-[1.8]">
                    {num}
                  </span>
                  <h3 className="font-serif italic text-2xl text-foreground">
                    {project.title}
                  </h3>
                </div>

                {/* Subtitle badge */}
                {project.subtitle && (
                  <div className="ml-0 md:ml-10 mb-4">
                    <span className="font-mono text-xs tracking-wide uppercase px-2 py-0.5 border border-card-border text-muted">
                      {project.subtitle}
                    </span>
                  </div>
                )}

                {/* Angle / lead text */}
                {project.angle && (
                  <p className="text-base md:text-lg text-muted ml-0 md:ml-10 mb-6 leading-relaxed">
                    {project.angle}
                  </p>
                )}

                {/* Stats strip */}
                {project.stats && project.stats.length > 0 && (
                  <div className="flex flex-wrap gap-x-8 gap-y-3 ml-0 md:ml-10 mb-8 py-4 border-y border-card-border">
                    {project.stats.map((stat) => (
                      <div key={stat.label} className="font-mono">
                        <CountUp
                          value={stat.value}
                          className="text-accent text-lg font-semibold"
                        />
                        <span className="text-muted text-xs ml-1.5">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {project.highlights.length > 0 && (
                  <ul className="space-y-2 mb-6 ml-0 md:ml-10">
                    {project.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-muted text-sm"
                      >
                        <span className="text-accent mt-px shrink-0">→</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-6 ml-0 md:ml-10">
                  {project.tech.map((t) => (
                    <span key={t} className="tech-badge font-mono">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer: link + collaborator */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 ml-0 md:ml-10">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:text-accent transition-colors duration-300"
                    >
                      <GitHubIcon size={14} />
                      View on GitHub
                    </a>
                  )}

                  {project.collaborator && (
                    <span className="font-mono text-xs text-muted">
                      w/{" "}
                      {project.collaboratorUrl ? (
                        <a
                          href={project.collaboratorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-accent transition-colors duration-300"
                        >
                          {project.collaborator}
                        </a>
                      ) : (
                        project.collaborator
                      )}
                    </span>
                  )}

                  <Link
                    href={`/projects/${project.slug}`}
                    className="md:ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent transition-colors duration-300"
                  >
                    View project
                    <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
