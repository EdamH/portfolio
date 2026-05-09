import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects, getProjectBySlug } from "@/lib/data";
import { PROJECT_DETAILS } from "@/lib/project-details";
import { GitHubIcon, ArrowLeftIcon } from "@/components/ui/Icons";
import ProjectArchitecture from "@/components/interactive/ProjectArchitecture";
import PageReveal from "@/components/ui/PageReveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getFeaturedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Edam Hamza`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const details = PROJECT_DETAILS[slug];
  const allProjects = getFeaturedProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <PageReveal>
      <main className="min-h-screen pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors duration-300 mb-10 md:mb-16"
          >
            <ArrowLeftIcon size={14} />
            Back to projects
          </Link>

          {/* ── Hero ── */}
          <header className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-accent text-sm tabular-nums">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <div className="w-8 h-px bg-accent/40" />
              <span className="font-mono text-xs text-muted uppercase tracking-[0.15em]">
                {project.subtitle}
              </span>
            </div>

            <h1 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-[1.1]">
              {project.title}
            </h1>

            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-3xl">
              {project.angle}
            </p>
          </header>

          {/* ── Stats ── */}
          {project.stats && project.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-8 border-y border-border">
              {project.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-3xl text-accent font-bold tabular-nums">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── The Story ── */}
          {details?.narrative && (
            <section className="mb-16">
              <h2 className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
                // The Story
              </h2>
              <div className="space-y-4">
                {details.narrative.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-muted leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* ── Screenshots ── */}
          {details?.screenshots && details.screenshots.length > 0 && (
            <section className="mb-16">
              <h2 className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
                // In Action
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.screenshots.map((shot, i) => (
                  <figure
                    key={i}
                    className={`border border-card-border bg-card overflow-hidden ${(shot.span ?? "half") === "full" ? "md:col-span-2" : ""}`}
                  >
                    <div className="relative aspect-video bg-surface saturate-[0.80]">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes={
                          (shot.span ?? "half") === "full"
                            ? "100vw"
                            : "(max-width: 768px) 100vw, 50vw"
                        }
                        className="w-full h-full"
                        style={{ objectFit: shot.fit ?? "cover" }}
                      />
                      <div className="absolute inset-0 bg-accent/10 mix-blend-overlay pointer-events-none" />
                    </div>
                    {shot.caption && (
                      <figcaption className="px-4 py-3 font-mono text-xs text-muted">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* ── Architecture ── */}
          {details?.architecture && (
            <section className="mb-16">
              <ProjectArchitecture layers={details.architecture} />
            </section>
          )}

          {/* ── What I built ── */}
          <section className="mb-16">
            <h2 className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
              // What I Built
            </h2>
            <ul className="space-y-4">
              {project.highlights.map((highlight, i) => (
                <li key={i} className="flex gap-3 text-muted leading-relaxed">
                  <span className="text-accent shrink-0 font-mono text-sm mt-0.5">
                    →
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Tech stack ── */}
          <section className="mb-16">
            <h2 className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
              // Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="tech-badge font-mono text-sm px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* ── Links ── */}
          <div className="flex items-center gap-6 mb-24 pt-8 border-t border-border">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-foreground transition-colors duration-300"
              >
                <GitHubIcon size={16} />
                View on GitHub
              </a>
            )}
            {project.collaborator && (
              <span className="font-mono text-sm text-muted">
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
          </div>

          {/* ── Next project ── */}
          <div className="border-t border-border pt-12">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              Next project
            </span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group block mt-3"
            >
              <h3 className="font-serif italic text-3xl text-foreground group-hover:text-accent transition-colors duration-300">
                {nextProject.title}
              </h3>
              <p className="font-mono text-sm text-muted mt-1">
                {nextProject.subtitle}
              </p>
            </Link>
          </div>
        </div>
      </main>
    </PageReveal>
  );
}
