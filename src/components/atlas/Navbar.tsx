import { useState, useEffect, useRef } from "react";
import { Waves, Globe2, Menu, X, Sun, Moon } from "lucide-react";
import { Theme } from "@/hooks/useTheme";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { href: "#overview",  label: "Overview"  },
  { href: "#scenarios", label: "Scenarios" },
  { href: "#atlas",     label: "Atlas"     },
];

export const Navbar = ({ theme, onToggleTheme }: NavbarProps) => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeLink, setActive]   = useState("#overview");
  const menuRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isDark = theme === "dark";

  const handleNavClick = (href: string) => {
    setActive(href);
    isClickScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Track active section
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navBg = scrolled
    ? isDark
      ? "rgba(4, 10, 24, 0.88)"
      : "rgba(240, 248, 255, 0.88)"
    : "transparent";

  const navBorder = scrolled
    ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
    : "transparent";

  return (
    <>
      <header
        id="top"
        className="fixed inset-x-0 top-0 z-50"
        style={{
          background: navBg,
          backdropFilter: scrolled ? "blur(24px) saturate(1.6)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.6)" : "none",
          borderBottom: `1px solid ${navBorder}`,
          transition: "background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease",
        }}
        ref={menuRef}
      >
        <div className="section-padding mx-auto flex h-16 max-w-[1520px] items-center justify-between">

          {/* ── Logo ── */}
          <a href="#top" className="group flex items-center gap-3 no-underline">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(188 100% 50%), hsl(210 95% 42%))",
                boxShadow: "0 0 20px hsl(188 100% 50% / 0.4)",
                backgroundSize: "200% 200%",
                animation: "logo-gradient 4s ease infinite",
              }}
            >
              <Waves className="h-4 w-4" style={{ color: "hsl(214 90% 6%)" }} />
            </div>
            <div>
              <p
                className="text-[13px] sm:text-sm font-bold leading-none tracking-tight whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, hsl(188 100% 60%), hsl(210 90% 52%))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "200% auto",
                  animation: "logo-gradient 4s ease infinite",
                }}
              >
                Sea Level Rise Impact
              </p>
              <p
                className="mt-0.5 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: isDark ? "hsl(210 15% 52%)" : "hsl(210 40% 50%)" }}
              >
                India · v2.4
              </p>
            </div>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center md:flex gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = activeLink === href;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href)}
                  className="relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive
                      ? "hsl(188 100% 60%)"
                      : isDark ? "hsl(210 15% 60%)" : "hsl(210 40% 40%)",
                    background: isActive
                      ? "hsl(188 100% 50% / 0.08)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = isDark ? "hsl(200 30% 88%)" : "hsl(210 60% 25%)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = isDark ? "hsl(210 15% 60%)" : "hsl(210 40% 40%)";
                  }}
                >
                  {label}
                  <span
                    className="absolute inset-x-3 bottom-1 h-0.5 rounded-full transition-opacity duration-200"
                    style={{
                      background: "linear-gradient(90deg, hsl(188 100% 50%), hsl(210 90% 52%))",
                      boxShadow: "0 0 8px hsl(188 100% 50% / 0.6)",
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </a>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div
              className="hidden items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium md:flex"
              style={{
                background: isDark ? "hsl(214 50% 10% / 0.7)" : "hsl(200 60% 96% / 0.8)",
                borderColor: isDark ? "hsl(214 30% 22%)" : "hsl(200 40% 85%)",
                color: isDark ? "hsl(210 15% 55%)" : "hsl(210 40% 45%)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: "hsl(158 85% 42%)", boxShadow: "0 0 8px hsl(158 85% 42% / 0.7)" }}
              />
              Live · IPCC AR6
            </div>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105"
              aria-label="Toggle theme"
              style={{
                background: isDark ? "hsl(214 50% 12%)" : "hsl(200 50% 92%)",
                border: `1px solid ${isDark ? "hsl(214 30% 22%)" : "hsl(200 40% 80%)"}`,
                color: isDark ? "hsl(188 100% 60%)" : "hsl(210 70% 40%)",
              }}
            >
              {isDark
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                background: isDark ? "hsl(214 50% 12%)" : "hsl(200 50% 92%)",
                border: `1px solid ${isDark ? "hsl(214 30% 22%)" : "hsl(200 40% 80%)"}`,
                color: isDark ? "hsl(200 30% 80%)" : "hsl(210 50% 35%)",
              }}
            >
              <span
                className="transition-all duration-300"
                style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </span>
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className="overflow-hidden transition-all duration-400 md:hidden"
          style={{
            maxHeight: menuOpen ? "320px" : "0px",
            opacity: menuOpen ? 1 : 0,
            transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
          }}
        >
          <nav
            className="section-padding mx-auto max-w-[1520px] flex flex-col gap-1 pb-4 pt-2"
            style={{
              background: isDark
                ? "hsl(214 60% 6% / 0.95)"
                : "hsl(200 60% 98% / 0.95)",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = activeLink === href;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href)}
                  className="rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive ? "hsl(188 100% 60%)" : isDark ? "hsl(210 15% 60%)" : "hsl(210 40% 40%)",
                    background: isActive ? "hsl(188 100% 50% / 0.08)" : "transparent",
                    borderLeft: isActive ? "2px solid hsl(188 100% 50%)" : "2px solid transparent",
                  }}
                >
                  {label}
                </a>
              );
            })}

            {/* Mobile live indicator */}
            <div
              className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-xs"
              style={{
                background: isDark ? "hsl(214 50% 10%)" : "hsl(200 60% 95%)",
                color: isDark ? "hsl(210 15% 50%)" : "hsl(210 40% 45%)",
              }}
            >
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: "hsl(158 85% 42%)" }}
              />
              Live model · IPCC AR6
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
