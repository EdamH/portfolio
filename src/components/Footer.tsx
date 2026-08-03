import { SITE_CONFIG, SOCIAL_LINKS, NAV_ITEMS } from "@/lib/constants";
import { platformIcon } from "@/components/ui/Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-8 md:gap-16 pt-12 md:pt-16 pb-12">
          {/* Brand column */}
          <div className="space-y-4">
            <h2 className="font-serif italic text-2xl text-foreground">
              {SITE_CONFIG.name}
            </h2>
            <p className="font-mono text-xs text-muted tracking-wide uppercase">
              {SITE_CONFIG.role} · {SITE_CONFIG.location}
            </p>
            <p className="text-sm text-muted/70 max-w-xs leading-relaxed">
              Building production AI systems with full architectural ownership,
              from model layer to deployment.
            </p>
          </div>

          {/* Navigation column */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] text-accent tracking-widest uppercase">
              Navigation
            </span>
            <nav className="flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-mono text-sm text-muted hover:text-accent transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect column */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] text-accent tracking-widest uppercase">
              Connect
            </span>
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target={link.platform !== "Email" ? "_blank" : undefined}
                  rel={
                    link.platform !== "Email"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={link.label}
                  className="group flex items-center gap-2.5 font-mono text-sm text-muted hover:text-accent transition-colors duration-300"
                >
                  <span className="text-muted/50 group-hover:text-accent transition-colors duration-300">
                    {platformIcon(link.platform, 14)}
                  </span>
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Colophon ── */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-muted/40 tracking-wide">
            &copy; {year} {SITE_CONFIG.name}
          </p>
          <p className="font-mono text-[11px] text-muted/40 tracking-wide">
            Designed &amp; built from scratch
          </p>
        </div>
      </div>
    </footer>
  );
}
