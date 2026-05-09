"use client";

import { useState, useEffect } from "react";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import { LuMenu, LuX } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map((item) =>
        document.querySelector(item.href)
      ).filter(Boolean) as Element[];

      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveSection(NAV_ITEMS[i].href);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <a
            href="/"
            className="font-serif italic text-lg text-foreground hover:text-accent transition-colors"
          >
            {SITE_CONFIG.name}
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  activeSection === item.href
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/resume.pdf"
              download
              className="text-sm px-4 py-1.5 border border-accent/40 text-accent hover:bg-accent/10 transition-all"
            >
              Resume
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(true)}
              className="text-foreground p-1"
              aria-label="Open menu"
            >
              <LuMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col md:hidden"
          >
            {/* Overlay header */}
            <div className="flex items-center justify-between px-6 h-14">
              <a
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-serif italic text-lg text-foreground hover:text-accent transition-colors"
              >
                {SITE_CONFIG.name.split(" ")[0]}
              </a>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-foreground p-1"
                  aria-label="Close menu"
                >
                  <LuX size={24} />
                </button>
              </div>
            </div>

            {/* Overlay links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-lg font-mono transition-colors ${
                    activeSection === item.href
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/resume.pdf"
                download
                onClick={() => setMenuOpen(false)}
                className="text-lg font-mono px-6 py-2 border border-accent/40 text-accent hover:bg-accent/10 transition-all"
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
