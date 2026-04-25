import { useEffect, useMemo, useState } from "react";
import {
  Waves, Globe2, Activity, ChevronDown, MapPinned, Sparkles, Building2, Users, ArrowDown,
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
import { CursorRipple } from "@/components/atlas/CursorRipple";
import mumbaiCoast from "@/assets/mumbai-coast.jpg";
import heroOcean from "@/assets/hero-ocean.jpg";

const Index = () => {
  const [state, setState] = useState<AtlasState>(DEFAULT_STATE);
  const result = useMemo(() => calculateImpact(state), [state]);

  useEffect(() => {
    document.title = "Sea Level Rise Impact Atlas — India Coastal Intelligence";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Cinematic climate intelligence atlas modelling sea-level rise impact across 8 Indian coastal regions — area, population, economic loss and risk.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description"; m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <CursorRipple />

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="section-padding mx-auto flex h-16 max-w-[1480px] items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-blue to-ocean-deep text-white shadow-md">
              <Waves className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-sm leading-none text-primary">SLR Atlas</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">India · v2.4</p>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#overview" className="transition-colors hover:text-primary">Overview</a>
            <a href="#scenarios" className="transition-colors hover:text-primary">Scenarios</a>
            <a href="#atlas" className="transition-colors hover:text-primary">Atlas</a>
          </nav>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-[11px] text-muted-foreground md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live model · IPCC AR6
          </div>
        </div>
      </header>

      {/* ============ SECTION 1 — HERO ============ */}
      <section id="overview" className="relative">
        {/* Hero background */}
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            backgroundImage: `url(${heroOcean})`,
            backgroundSize: "cover",
            backgroundPosition: "right center",
            maskImage: "linear-gradient(to left, black 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, transparent 70%)",
          }}
        />
        <WaveBackground variant="hero" className="-z-0" />

        <div className="section-padding relative mx-auto max-w-[1480px] pt-16 pb-32 lg:pt-24 lg:pb-48">
          <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_1fr]">
            {/* Hero copy */}
            <div className="animate-fade-up">
              <span className="chip">
                <Sparkles className="h-3 w-3" />
                Climate Intelligence Platform · 2026
              </span>
              <h1 className="font-display mt-5 text-5xl leading-[1.02] text-primary md:text-6xl lg:text-[5.25rem]">
                The rising tide,{" "}
                <span className="shimmer-text">measured.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                A decision-grade atlas modelling sea-level rise across India's 8 most exposed
                coastal regions — calibrated for cabinet briefings, resilience planning and
                long-horizon capital allocation.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#scenarios"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  Explore scenarios <ArrowDown className="h-4 w-4" />
                </a>
                <a
                  href="#atlas"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-primary backdrop-blur-sm transition-all hover:border-accent hover:text-accent"
                >
                  Open the atlas <Globe2 className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-6">
                <Stat big="8" small="coastal regions modelled" />
                <Stat big="3" small="climate scenarios (IPCC)" />
                <Stat big="100%" small="reproducible methodology" />
              </div>
            </div>

            {/* Executive summary card */}
            <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="premium-card p-7 lg:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Executive Summary</p>
                  <span className="chip">India · {result.region.shortName}</span>
                </div>
                <p className="mt-4 font-display text-2xl leading-snug text-primary">
                  Under your active scenario, <span className="shimmer-text">{fmt.km2(result.areaKm2)} km²</span> of coastline could be inundated, displacing {fmt.pop(result.population * 1000)} residents.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <SummaryStat label="Composite risk" value={fmt.score(result.riskScore)} unit="/ 100" tone={result.riskLabel} />
                  <SummaryStat label="Economic exposure" value={fmt.usd(result.economic)} unit="USD est." />
                </div>
                <div className="mt-5 border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
                  Model blends inundation area (40%), population displacement (35%) and
                  infrastructure sensitivity (25%) into a single 0–100 composite.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2 — SCENARIOS + MUMBAI STORY ============ */}
      <section id="scenarios" className="relative overflow-hidden">
        {/* Mumbai background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${mumbaiCoast})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-background/95" />
        </div>

        <div className="section-padding relative mx-auto max-w-[1480px] py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <span className="chip">
                <MapPinned className="h-3 w-3" /> Coastal storytelling · Mumbai
              </span>
              <h2 className="font-display mt-4 text-4xl leading-[1.05] text-primary md:text-5xl lg:text-6xl">
                When the sea writes the next chapter,
                <br />
                <span className="shimmer-text">cities listen.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base text-muted-foreground lg:text-lg">
                Mumbai sits on reclaimed land barely above mean sea level. Each centimetre of
                rise compounds with monsoon surge and subsidence. Below, every Indian coastline
                modelled in real time against your active scenario.
              </p>
            </div>

            <ControlsPanel state={state} onChange={setState} />
          </div>

          <div className="mt-10">
            <MetricCards result={result} />
          </div>

          <div className="mt-8">
            <RiskBar result={result} />
          </div>

          <div className="mt-8">
            <ImpactChart state={state} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
            <ComparisonTable state={state} />
            <DecisionEngine result={result} />
          </div>
        </div>

        <WaveBackground variant="section" className="-z-0 opacity-90" />
      </section>

      {/* ============ SECTION 3 — INTERACTIVE MAP ============ */}
      <section id="atlas" className="relative overflow-hidden bg-gradient-to-b from-background to-ocean-foam/40">
        <div className="section-padding relative mx-auto max-w-[1600px] pt-24 pb-32 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto">
              <Globe2 className="h-3 w-3" /> Interactive Coastal Atlas
            </span>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] text-primary md:text-5xl lg:text-[4rem]">
              The full <span className="shimmer-text">coastal arc</span> of India.
            </h2>
            <p className="mt-5 text-base text-muted-foreground lg:text-lg">
              Eight regions. One ocean. Click any marker to recalibrate the dashboard for that
              coastline. Halo size and colour reflect live composite risk under your scenario.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
            <CoastalMap
              state={state}
              onSelect={(name) => setState((s) => ({ ...s, region: name }))}
            />
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <InsightCard icon={<Activity className="h-4 w-4" />} label="Highest exposure" value="Sundarbans · Kolkata Delta" />
            <InsightCard icon={<Users className="h-4 w-4" />} label="Largest population at risk" value="Sundarbans · 960k baseline" />
            <InsightCard icon={<Building2 className="h-4 w-4" />} label="Greatest economic stake" value="Mumbai · Gujarat Gulf" />
            <InsightCard icon={<Waves className="h-4 w-4" />} label="Methodology" value="IPCC AR6 · RCP scenarios" />
          </div>
        </div>

        <WaveBackground variant="footer" className="-z-0" />

        <footer className="section-padding relative mx-auto max-w-[1480px] border-t border-border/40 pb-10 pt-16 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>
              © 2026 Sea Level Rise Impact Atlas. Synthetic dataset for educational and
              decision-modelling use only.
            </p>
            <p>Built with React · Recharts · Leaflet · Local JSON.</p>
          </div>
        </footer>
      </section>
    </div>
  );
};

const Stat = ({ big, small }: { big: string; small: string }) => (
  <div>
    <p className="font-display font-mono-num text-3xl text-primary lg:text-4xl">{big}</p>
    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{small}</p>
  </div>
);

const SummaryStat = ({ label, value, unit, tone }: { label: string; value: string; unit: string; tone?: string }) => {
  const c = tone === "High" ? "text-risk-high" : tone === "Moderate" ? "text-[hsl(38_85%_38%)]" : tone === "Low" ? "text-risk-low" : "text-primary";
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className={`font-mono-num font-display mt-1 text-3xl ${c}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{unit}</p>
    </div>
  );
};

const InsightCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="premium-card p-5">
    <div className="flex items-center gap-2 text-accent">
      {icon}
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</p>
    </div>
    <p className="mt-2 font-display text-base text-primary">{value}</p>
  </div>
);

export default Index;
