import { getServices } from "@/lib/data";

export default function Services() {
  const services = getServices();

  return (
    <section id="services" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // Work With Me
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-4">
          What I Can Build For You
        </h2>
        <p className="text-muted max-w-2xl mb-12 leading-relaxed">
          I ship production AI systems end to end, from the model layer down to
          the infrastructure they run on. Here is where I do my best work for
          clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="flex flex-col border border-card-border bg-card p-6 hover:border-accent/40 transition-colors duration-200"
            >
              <span className="font-mono text-accent/60 text-xs mb-4">
                0{i + 1}
              </span>
              <h3 className="font-serif italic text-2xl text-foreground mb-1">
                {service.title}
              </h3>
              <p className="font-mono text-accent text-xs uppercase tracking-wider mb-4">
                {service.tagline}
              </p>
              <p className="text-muted text-sm leading-relaxed mb-5">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-foreground/80 flex gap-2.5 leading-relaxed"
                  >
                    <span className="text-accent mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-muted leading-relaxed mt-auto pt-4 border-t border-card-border">
                <span className="font-mono text-accent/70 uppercase tracking-wider">
                  Best for:{" "}
                </span>
                {service.idealFor}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-muted text-sm leading-relaxed">
            Not sure which one fits? Tell me the outcome you want, and I will
            tell you how I would build it.
          </p>
          <a
            href="#contact"
            className="font-mono text-sm px-5 py-2.5 bg-accent text-background hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Start a project
          </a>
        </div>
      </div>
    </section>
  );
}
