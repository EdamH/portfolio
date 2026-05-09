"use client";

import { useState } from "react";
import { getCertifications } from "@/lib/data";
import { ExternalLinkIcon } from "@/components/ui/Icons";

const ALL = "All";

export default function Certifications() {
  const certifications = getCertifications();
  const issuers = [ALL, ...Array.from(new Set(certifications.map((c) => c.issuer)))];
  const [active, setActive] = useState(ALL);

  return (
    <section id="certifications" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // Credentials
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-10">
          Certifications
        </h2>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
          {issuers.map((issuer) => (
            <button
              key={issuer}
              onClick={() => setActive(issuer)}
              className={`font-mono text-xs tracking-wider px-3 py-2 md:py-1 border transition-colors duration-300 ${
                active === issuer
                  ? "border-accent text-accent"
                  : "border-border text-muted hover:text-foreground hover:border-foreground"
              }`}
            >
              {issuer}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((cert) => {
            const Wrapper = cert.link ? "a" : "div";
            const wrapperProps = cert.link
              ? { href: cert.link, target: "_blank", rel: "noopener noreferrer" }
              : {};
            const isVisible = active === ALL || cert.issuer === active;

            return (
              <div
                key={`${cert.name}-${cert.date}`}
                className="grid transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: isVisible ? "1fr" : "0fr",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.95)",
                }}
              >
                <div className="overflow-hidden">
                  <Wrapper
                    {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                    className="bg-card border border-card-border px-4 py-3 hover:bg-card-hover transition-colors duration-300 flex items-center gap-3 group overflow-hidden"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {cert.name}
                      </p>
                      <p className="font-mono text-muted text-xs mt-1">
                        {cert.issuer} &middot; {cert.date}
                      </p>
                    </div>
                    {cert.link && (
                      <span className="shrink-0 text-accent md:translate-x-8 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300">
                        <ExternalLinkIcon size={18} />
                      </span>
                    )}
                  </Wrapper>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
