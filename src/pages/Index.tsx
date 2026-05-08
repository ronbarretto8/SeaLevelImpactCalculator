import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import {
  Waves, Globe2, Activity, MapPinned, Sparkles,
  Building2, Users, ArrowDown, TrendingUp, Shield, Zap,
} from "lucide-react";
import { AtlasState, DEFAULT_STATE, calculateImpact, fmt } from "@/utils/calculateImpact";
import { ControlsPanel } from "@/components/atlas/ControlsPanel";
import { MetricCards } from "@/components/atlas/MetricCards";
import { RiskBar } from "@/components/atlas/RiskBar";
import { ImpactChart } from "@/components/atlas/ImpactChart";
import { ComparisonTable } from "@/components/atlas/ComparisonTable";
import { DecisionEngine } from "@/components/atlas/DecisionEngine";
import { CoastalMap } from "@/components/atlas/CoastalMap";
import { WaveBackground } from "@/components/atlas/WaveBackground";
import { HeroBackground } from "@/components/atlas/HeroBackground";
import { Navbar } from "@/components/atlas/Navbar";
import { CinematicAudio } from "@/components/atlas/CinematicAudio";
import { useTheme } from "@/hooks/useTheme";
import heroOcean from "@/assets/hero-ocean.jpg";
const heroVideo = "/338904.mp4";

/* ── Scroll-reveal ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const Index = () => {
  const { theme, toggle, isDark } = useTheme();
  const [state, setState] = useState<AtlasState>(DEFAULT_STATE);
  const result = useMemo(() => calculateImpact(state), [state]);

  /* Parallax and Cursor Tracking */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setMouse({ x: e.clientX - cx, y: e.clientY - cy });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useScrollReveal();

  useEffect(() => {
    document.title = "Sea Level Rise Impact — India Coastal Intelligence";
  }, []);

  /* Section divider style adapts to theme */
  const dividerColor = isDark
    ? "hsl(214 50% 10%)"
    : "hsl(210 40% 92%)";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: isDark ? "hsl(214 60% 6%)" : "hsl(210 35% 95%)", transition: "background 0.4s ease" }}
    >
      <Navbar theme={theme} onToggleTheme={toggle} />

      {/* ════════════════════════════════════════
          HERO — full-viewport, image background
          ════════════════════════════════════════ */}
      <section id="overview" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <HeroBackground imageUrl={heroOcean} videoUrl={heroVideo} parallaxX={mouse.x} parallaxY={mouse.y} />

        <div className="section-padding relative z-10 mx-auto w-full max-w-[1520px] pb-28 pt-24 text-center">
          <div className="mx-auto max-w-4xl animate-fade-up">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-7"
              style={{
                background: "rgba(0,229,255,0.08)",
                borderColor: "rgba(0,229,255,0.22)",
                color: "hsl(188 100% 75%)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles className="h-3 w-3" />
              Climate Intelligence Platform · India 2026
            </div>

            <h1
              className="font-display mb-6 text-[2.8rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
              style={{ color: "hsl(200 30% 96%)", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              Sea Level Rise
              <br />
              <span className="shimmer-text-hero">Impact.</span>
            </h1>

            <p
              className="mx-auto mb-10 max-w-2xl text-base leading-7 sm:text-lg lg:text-xl"
              style={{ color: "hsl(210 25% 78%)", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              A decision-grade atlas modelling sea-level rise across India's 8 most
              exposed coastal regions — built for cabinet briefings, resilience
              planning &amp; long-horizon capital allocation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 reveal-delay-2">
              <a 
                href="#scenarios" 
                className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-500 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #00E5FF 0%, #0091FF 100%)",
                  color: "#030916",
                  boxShadow: "0 10px 30px -5px rgba(0, 229, 255, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Internal Shimmer */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-2">
                  Explore scenarios <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
                </span>
              </a>
              
              <a
                href="#atlas"
                className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-500 hover:scale-105 hover:bg-white/10 active:scale-95"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Border Glow Pulse */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10 flex items-center gap-2">
                  Open the atlas <Globe2 className="h-4 w-4 transition-transform duration-700 group-hover:rotate-[180deg]" />
                </span>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-20 flex flex-wrap items-center justify-center gap-12 sm:gap-20 reveal-delay-3">
              {[["8", "Coastal regions"], ["3", "IPCC scenarios"], ["100%", "Reproducible"]].map(([big, small], i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center cursor-default"
                >
                  {/* Subtle Background Glow Pulse */}
                  <div className="absolute top-1/2 left-1/2 -z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/0 blur-3xl transition-all duration-700 group-hover:bg-cyan-400/15" />
                  
                  <p
                    className="font-mono-num font-display text-5xl font-bold sm:text-6xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:translate-y-[-8px]"
                    style={{ 
                      color: "#00E5FF", 
                      textShadow: "0 0 40px rgba(0, 229, 255, 0.5)",
                      letterSpacing: "-0.02em"
                    }}
                  >
                    {big}
                  </p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 group-hover:text-white group-hover:tracking-[0.4em]" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                    {small}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.45 }}>
            <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "hsl(200 20% 68%)" }}>Scroll</span>
            <div className="h-8 w-px" style={{ background: "linear-gradient(to bottom, hsl(188 100% 50%/0.55), transparent)" }} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURE STRIP
          ════════════════════════════════════════ */}
      <section className="relative z-10 section-padding mx-auto max-w-[1520px] pb-8 pt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: <TrendingUp className="h-4 w-4" />, title: "Real-time modelling", body: "Sliders update all 8 regions instantly under any scenario.", delay: "0ms" },
            { icon: <Shield className="h-4 w-4" />, title: "IPCC AR6 aligned", body: "RCP 2.6, 4.5 and 8.5 — calibrated for policy use.", delay: "70ms" },
            { icon: <Zap className="h-4 w-4" />, title: "Decision-ready", body: "Auto-generated strategic response playbooks per region.", delay: "140ms" },
          ].map((f) => (
            <div
              key={f.title}
              className="reveal flex items-start gap-4 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: isDark ? "hsl(214 50% 9%/0.8)" : "hsl(0 0% 100%/0.85)",
                border: `1px solid ${isDark ? "hsl(214 30% 20%)" : "hsl(210 35% 85%)"}`,
                backdropFilter: "blur(8px)",
                boxShadow: isDark ? "var(--shadow-sm)" : "0 2px 12px hsl(210 40% 70%/0.2)",
                transitionDelay: f.delay,
              }}
            >
              <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "hsl(var(--primary)/0.12)", color: "hsl(var(--primary))" }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SCENARIOS + CONTROLS
          ════════════════════════════════════════ */}
      <section id="scenarios" className="relative py-16 sm:py-24 lg:py-28">
        <div className="section-padding relative z-10 mx-auto max-w-[1520px]">
          <div className="mb-10 grid gap-8 sm:mb-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <div className="reveal">
              <div className="chip mb-4">
                <MapPinned className="h-3 w-3" />
                Coastal Scenario Engine
              </div>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                When the sea writes,
                <br />
                <span className="shimmer-text">cities listen.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
                Mumbai sits on reclaimed land barely above mean sea level.
                Model every Indian coastline in real time against your active scenario.
              </p>

              {/* Added info boxes to balance the layout */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
                <div className="group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ border: "1px solid hsl(var(--border) / 0.5)", background: "hsl(var(--muted) / 0.2)" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                      <Activity className="h-3 w-3" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Dynamic Engine</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                    Adjust environmental variables to instantly recalibrate economic and demographic risk models.
                  </p>
                </div>

                <div className="group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ border: "1px solid hsl(var(--border) / 0.5)", background: "hsl(var(--muted) / 0.2)" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                      <Zap className="h-3 w-3" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Non-Linear Risk</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                    Vulnerability scores scale exponentially once critical coastal infrastructure thresholds are breached.
                  </p>
                </div>
              </div>
            </div>
            <div className="reveal reveal-delay-2">
              <ControlsPanel state={state} onChange={setState} />
            </div>
          </div>

          <div className="reveal mt-2"><MetricCards result={result} /></div>
          <div className="reveal reveal-delay-1 mt-5"><RiskBar result={result} /></div>
          <div className="reveal reveal-delay-1 mt-5"><ImpactChart state={state} /></div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
            <div className="reveal"><ComparisonTable state={state} /></div>
            <div className="reveal reveal-delay-2"><DecisionEngine result={result} /></div>
          </div>
        </div>

        {/* Show waves in both modes now, WaveBackground handles the theme */}
        <WaveBackground variant="section" className="z-0 opacity-50" isDark={isDark} />
      </section>

      {/* ════════════════════════════════════════
          INTERACTIVE MAP
          ════════════════════════════════════════ */}
      <section
        id="atlas"
        className="relative py-16 sm:py-24 lg:py-28"
        style={{ borderTop: `1px solid ${dividerColor}` }}
      >
        <div className="section-padding relative z-10 mx-auto max-w-[1600px]">
          <div className="reveal mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <div className="chip mx-auto mb-4">
              <Globe2 className="h-3 w-3" />
              Interactive Coastal Atlas
            </div>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              The full <span className="shimmer-text">coastal arc</span> of India.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Eight regions. One ocean. Click any marker to recalibrate the dashboard.
            </p>
          </div>

          <div
            className="reveal overflow-hidden rounded-2xl"
            style={{
              border: `1px solid hsl(var(--primary)/0.14)`,
              boxShadow: isDark ? "0 24px 80px hsl(214 80% 3%/0.5)" : "0 8px 40px hsl(210 50% 50%/0.15)",
            }}
          >
            <CoastalMap state={state} onSelect={(name) => setState((s) => ({ ...s, region: name }))} isDark={isDark} />
          </div>

          <div className="mt-5 grid gap-3 sm:mt-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Activity className="h-4 w-4" />, label: "Highest exposure", value: "Sundarbans · Kolkata Delta", delay: "0ms" },
              { icon: <Users className="h-4 w-4" />, label: "Largest at-risk pop.", value: "Sundarbans · 960k baseline", delay: "70ms" },
              { icon: <Building2 className="h-4 w-4" />, label: "Greatest economic stake", value: "Mumbai · Gujarat Gulf", delay: "140ms" },
              { icon: <Waves className="h-4 w-4" />, label: "Methodology", value: "IPCC AR6 · RCP scenarios", delay: "210ms" },
            ].map((c) => (
              <div key={c.label} className="reveal premium-card p-5" style={{ transitionDelay: c.delay }}>
                <div className="mb-3 flex items-center gap-2" style={{ color: "hsl(var(--primary))" }}>
                  {c.icon}
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{c.label}</p>
                </div>
                <p className="font-display text-sm text-foreground">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

        <WaveBackground variant="footer" className="z-0 opacity-60" isDark={isDark} />

        <footer
          className="section-padding relative z-10 mx-auto max-w-[1520px] border-t pb-8 pt-10 text-xs text-muted-foreground"
          style={{ borderColor: dividerColor }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "hsl(var(--primary)/0.12)", border: "1px solid hsl(var(--primary)/0.2)" }}
              >
                <Waves className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <p>© 2026 Sea Level Rise Impact Atlas. Synthetic dataset — educational use only.</p>
            </div>
            <p className="text-muted-foreground/50">React · Recharts · Leaflet · TypeScript</p>
          </div>
        </footer>
      </section>

      {/* Invisible Background Audio */}
      <CinematicAudio />
    </div>
  );
};

export default Index;
