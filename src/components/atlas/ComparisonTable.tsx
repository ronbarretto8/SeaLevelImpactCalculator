import { AtlasState, calculateImpact, fmt } from "@/utils/calculateImpact";
import { ArrowRight } from "lucide-react";

export const ComparisonTable = ({ state }: { state: AtlasState }) => {
  const before = calculateImpact({ ...state, seaLevel: 0.3, scenario: "optimistic", popDensity: 1, infraSensitivity: 1 });
  const after  = calculateImpact(state);

  const rows = [
    { label: "Sea level rise",       a: fmt.m(before.seaLevel),              b: fmt.m(after.seaLevel) },
    { label: "Area submerged",       a: fmt.km2(before.areaKm2) + " km²",    b: fmt.km2(after.areaKm2) + " km²" },
    { label: "Vulnerable zone lost", a: fmt.pct(before.areaPct),              b: fmt.pct(after.areaPct) },
    { label: "People displaced",     a: fmt.pop(before.population * 1000),    b: fmt.pop(after.population * 1000) },
    { label: "Economic loss",        a: fmt.usd(before.economic),              b: fmt.usd(after.economic) },
    { label: "Composite risk",       a: fmt.score(before.riskScore) + " · " + before.riskLabel, b: fmt.score(after.riskScore) + " · " + after.riskLabel },
  ];

  return (
    <div className="premium-card overflow-hidden">
      {/* Header */}
      <div className="border-b px-6 py-5 sm:px-7" style={{ borderColor: "hsl(var(--border) / 0.4)", background: "hsl(var(--muted) / 0.35)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--primary))" }}>
          Before · After
        </p>
        <h3 className="font-display mt-1 text-xl text-foreground">{after.region.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Baseline (2020s, optimistic) vs. your active scenario.
        </p>
      </div>

      {/* Mobile: stacked */}
      <div className="divide-y sm:hidden" style={{ borderColor: "hsl(var(--border) / 0.3)" }}>
        {rows.map((r) => (
          <div key={r.label} className="px-5 py-3.5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">{r.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-0.5">Baseline</p>
                <p className="font-mono-num text-sm text-muted-foreground">{r.a}</p>
              </div>
              <div className="rounded-xl px-3 py-2" style={{ background: "hsl(var(--primary) / 0.07)", border: "1px solid hsl(var(--primary) / 0.14)" }}>
                <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "hsl(var(--primary) / 0.6)" }}>Projected</p>
                <p className="font-mono-num font-display text-base font-bold text-foreground">{r.b}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: 3-col */}
      <div className="hidden text-sm sm:block">
        <div className="grid grid-cols-[1fr_32px_1fr] border-b" style={{ borderColor: "hsl(var(--border) / 0.3)", background: "hsl(var(--muted) / 0.2)" }}>
          <div className="px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Baseline today</div>
          <div />
          <div className="px-7 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(var(--primary) / 0.7)" }}>
            Projected scenario
          </div>
        </div>
        {rows.map((r, idx) => (
          <div
            key={r.label}
            className="grid grid-cols-[1fr_32px_1fr] items-center border-b transition-colors duration-150 hover:bg-primary/[0.02]"
            style={{ borderColor: "hsl(var(--border) / 0.25)" }}
          >
            <div className="px-7 py-4">
              <p className="font-mono-num text-base text-muted-foreground">{r.a}</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary) / 0.35)" }} />
            </div>
            <div className="px-7 py-4" style={idx % 2 === 0 ? { background: "hsl(var(--primary) / 0.03)" } : {}}>
              <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">{r.label}</p>
              <p className="font-mono-num font-display text-lg font-bold text-foreground">{r.b}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};