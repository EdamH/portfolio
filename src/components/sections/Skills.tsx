import { getSkills } from "@/lib/data";

export default function Skills() {
  const skills = getSkills();

  return (
    <section id="skills" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // Stack
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-12">
          Technical Expertise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="font-mono text-accent text-sm uppercase tracking-wider mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span key={skill} className="tech-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
