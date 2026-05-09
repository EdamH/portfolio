import { getOtherProjects } from "@/lib/data";
import { ExternalLinkIcon } from "@/components/ui/Icons";

export default function OtherProjects() {
  const projects = getOtherProjects();

  return (
    <section id="other-projects" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // More
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-12">
          Other Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="bg-card border border-card-border hover:bg-card-hover transition-colors duration-300 p-5 group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-foreground leading-tight">
                  {project.title}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent transition-colors shrink-0"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <ExternalLinkIcon size={15} />
                  </a>
                )}
              </div>

              <p className="text-muted text-sm mb-2">{project.subtitle}</p>

              <p className="text-muted text-sm leading-relaxed mb-3 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="tech-badge">
                    {t}
                  </span>
                ))}
              </div>

              {project.collaborator && (
                <p className="font-mono text-muted text-xs mt-3">
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
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
