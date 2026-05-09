import { getExperience, getEducation } from "@/lib/data";

const ARC_LABELS = ["Autonomy", "Ownership", "Enterprise", "Range", "Curiosity"];

export default function Experience() {
  const experience = getExperience();
  const education = getEducation();

  return (
    <section id="experience" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // Experience
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-16">
          Career Arc
        </h2>

        {/* Timeline */}
        <div className="relative border-l border-border pl-6 md:pl-8 ml-2 md:ml-3 space-y-14">
          {experience.map((exp, index) => (
            <div key={`${exp.company}-${exp.period}`} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 h-2 bg-accent rounded-full" />

              {/* Period + arc label */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                <p className="font-mono text-accent text-sm">{exp.period}</p>
                <span className="font-mono text-[10px] text-accent/50 uppercase tracking-[0.2em]">
                  {ARC_LABELS[index]}
                </span>
              </div>
              <h3 className="font-medium text-lg text-foreground">{exp.role}</h3>
              <div className="flex items-center gap-2 mt-1 mb-4">
                <span className="text-foreground">{exp.company}</span>
                <span className="text-muted">·</span>
                <span className="text-muted text-sm">{exp.location}</span>
              </div>

              <ul className="space-y-1.5">
                {exp.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="text-muted text-sm leading-relaxed flex gap-2"
                  >
                    <span className="text-accent shrink-0">&rarr;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-20">
          <p className="font-mono text-accent text-sm tracking-wider uppercase mb-6">
            // Education
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.institution}
                className="bg-card border border-card-border p-5"
              >
                <p className="font-mono text-accent text-sm mb-1">
                  {edu.period}
                </p>
                <h3 className="font-medium text-foreground">{edu.institution}</h3>
                <p className="text-muted text-sm mt-1">{edu.degree}</p>
                {edu.honors && (
                  <p className="text-accent text-sm font-mono mt-2">
                    {edu.honors}
                  </p>
                )}
                {edu.detail && (
                  <p className="text-accent text-sm font-mono mt-2">
                    {edu.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
