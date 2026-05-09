import Image from "next/image";
import { getCommunity } from "@/lib/data";

const FALLBACK_PHOTOS = [
  "/indabax2024_supervisor.jpg",
  "/membershipCommittee.jpg",
  "/studytrip.jpg",
];

function getPhoto(item: { photo?: string }, index: number): string {
  return item.photo || FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length];
}

export default function Community() {
  const items = getCommunity();

  return (
    <section id="community" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // Community
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-12">
          Beyond Code
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={`${item.title}-${item.organization}`}
              className="relative border border-card-border overflow-hidden group h-[260px] md:h-[340px]"
            >
              {/* Photo — fills entire card */}
              <Image
                src={getPhoto(item, i)}
                alt={item.organization}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-[1.05] saturate-[0.80] group-hover:saturate-100"
                sizes="576px"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay pointer-events-none" />

              {/* Dark overlay — always visible on mobile, fades on hover for desktop */}
              <div className="absolute inset-0 bg-black/50 md:transition-opacity md:duration-600 md:group-hover:opacity-0 pointer-events-none" />

              {/* Title — centered, fades on hover (desktop only) */}
              <div className="absolute inset-x-0 top-0 h-[120px] md:h-[200px] flex items-center justify-center md:transition-all md:duration-500 md:group-hover:-translate-y-4 md:group-hover:opacity-0">
                <h3 className="text-white font-serif italic text-2xl md:text-3xl text-center px-6">
                  {item.title}
                </h3>
              </div>

              {/* Content panel — always visible on mobile, slides down on hover for desktop */}
              <div className="absolute inset-x-0 bottom-0 h-[140px] bg-card p-5 pt-3 flex flex-col md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.23,1,0.32,1)] md:group-hover:translate-y-full">
                <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-1">
                  {item.organization}
                </p>
                <p className="text-muted text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                {/* Period pinned to bottom */}
                <div className="mt-auto pt-1">
                  {item.period && (
                    <p className="font-mono text-[10px] text-muted">
                      {item.period}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Placeholder card — mimics real cards but pure CSS */}
          <div className="relative border border-card-border overflow-hidden group h-[260px] md:h-[340px]">
            {/* "Photo" — dark bg with gold text as the visual */}
            <div className="absolute inset-0 bg-surface flex items-center justify-center">
              <span className="text-accent/20 font-serif italic text-6xl md:text-7xl select-none">
                ?
              </span>
            </div>

            {/* Dark overlay — always visible on mobile, fades on hover for desktop */}
            <div className="absolute inset-0 bg-black/30 md:transition-opacity md:duration-600 md:group-hover:opacity-0 pointer-events-none" />

            {/* Title — centered, fades on hover (desktop only) */}
            <div className="absolute inset-x-0 top-0 h-[120px] md:h-[200px] flex items-center justify-center md:transition-all md:duration-500 md:group-hover:-translate-y-4 md:group-hover:opacity-0">
              <h3 className="text-accent font-serif italic text-2xl md:text-3xl text-center px-6">
                What&apos;s next?
              </h3>
            </div>

            {/* Content panel — always visible on mobile, slides down on hover for desktop */}
            <div className="absolute inset-x-0 bottom-0 h-[140px] bg-card p-5 pt-3 flex flex-col md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.23,1,0.32,1)] md:group-hover:translate-y-full">
              <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-1">
                The story continues
              </p>
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                More chapters to be written. Stay tuned.
              </p>
              <div className="mt-auto pt-2">
                <p className="font-mono text-[10px] text-muted">
                  2026 – ???
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
