"use client";

import { useEffect, useRef, useState } from "react";
import { SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants";
import { EmailIcon, GitHubIcon, LinkedInIcon, DownloadIcon } from "@/components/ui/Icons";
import ContactCompanion from "@/components/ui/ContactCompanion";
import type { ContactFormData } from "@/lib/types";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [messageLength, setMessageLength] = useState(0);
  const [subject, setSubject] = useState("");
  const loadTimeRef = useRef<number>(0);
  const subjectRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTimeRef.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: (formData.get("subject") as string) || undefined,
      message: formData.get("message") as string,
      _honey: formData.get("_honey") as string,
      _loadTime: loadTimeRef.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setMessageLength(0);
      setSubject("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  function handleCTA(preset: string) {
    setSubject(preset);
    // Focus the subject field after setting
    setTimeout(() => subjectRef.current?.focus(), 0);
  }

  const linkedin = SOCIAL_LINKS.find((l) => l.platform === "LinkedIn");
  const github = SOCIAL_LINKS.find((l) => l.platform === "GitHub");

  const inputClass =
    "block w-full bg-card border-l-2 border border-card-border text-foreground placeholder-muted px-3 py-2.5 text-sm transition-all duration-200 focus:border-l-accent focus:border-card-border focus:outline-none";

  return (
    <section id="contact" className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-mono text-accent text-sm tracking-wider uppercase mb-2">
          // Contact
        </p>
        <h2 className="font-serif italic text-4xl text-foreground mb-4">
          Let&apos;s Build Something Together
        </h2>

        {/* Dual CTA */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            type="button"
            onClick={() => handleCTA("I have a project in mind")}
            className="font-mono text-xs border border-border px-4 py-2 text-muted hover:border-accent hover:text-accent transition-colors duration-200"
          >
            Have a project in mind?
          </button>
          <button
            type="button"
            onClick={() => handleCTA("Just saying hi")}
            className="font-mono text-xs border border-border px-4 py-2 text-muted hover:border-accent hover:text-accent transition-colors duration-200"
          >
            Just want to say hi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Honeypot */}
            <div style={{ position: "absolute", left: "-9999px" }}>
              <label htmlFor="_honey">Do not fill this</label>
              <input
                type="text"
                id="_honey"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={inputClass}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={inputClass}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5"
              >
                Subject{" "}
                <span className="normal-case tracking-normal text-muted">(optional)</span>
              </label>
              <input
                ref={subjectRef}
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
                onFocus={() => setFocusedField("subject")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block font-mono text-xs text-muted uppercase tracking-wider mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className={`${inputClass} resize-y`}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setMessageLength(e.target.value.length)}
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-accent text-background font-medium py-2.5 text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-accent text-sm font-mono">
                Message sent. I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm font-mono">{errorMessage}</p>
            )}
          </form>

          {/* Right column */}
          <div className="flex flex-col">
            <ContactCompanion
              focusedField={focusedField}
              messageLength={messageLength}
              formStatus={status}
            />

            {/* Status bar — visually attached to terminal bottom */}
            <div
              className="rounded-b-lg px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] -mt-px"
              style={{
                backgroundColor: "var(--terminal-bg)",
                borderLeft: "1px solid var(--terminal-border)",
                borderRight: "1px solid var(--terminal-border)",
                borderBottom: "1px solid var(--terminal-border)",
                borderTop: "1px solid var(--terminal-header-border)",
              }}
            >
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                style={{ color: "var(--terminal-dim)" }}
              >
                <EmailIcon size={12} />
                mail
              </a>
              {linkedin && (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                  style={{ color: "var(--terminal-dim)" }}
                >
                  <LinkedInIcon size={12} />
                  in
                </a>
              )}
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                  style={{ color: "var(--terminal-dim)" }}
                >
                  <GitHubIcon size={12} />
                  gh
                </a>
              )}
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
                style={{ color: "var(--terminal-dim)" }}
              >
                <DownloadIcon size={12} />
                cv
              </a>
              <span
                className="ml-auto hidden sm:inline"
                style={{ color: "var(--terminal-dim)" }}
              >
                {SITE_CONFIG.name} · {SITE_CONFIG.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
