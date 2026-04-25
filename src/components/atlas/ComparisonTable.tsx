import { AtlasState, calculateImpact, fmt } from "@/utils/calculateImpact";
import { ArrowRight } from "lucide-react";

/**
 * Before vs After table — shows the active region under baseline (today, 0.3m)
 * vs the user's selected scenario.
 */
export const ComparisonTable = ({ state }: { state: AtlasState }) => {
  const before = calculateImpact({ ...state, seaLevel: 0.3, scenario: "optimistic", popDensity: 1, infraSensitivity: 1 });
  const after = calculateImpact(state);

  const rows = [
    { label: "Sea level rise",       a: fmt.m(before.seaLevel),                  b: fmt.m(after.seaLevel) },
    { label: "Area submerged",       a: fmt.km2(before.areaKm2) + " km²",        b: fmt.km2(after.areaKm2) + " km²" },
    { label: "Vulnerable zone lost", a: fmt.pct(before.areaPct),                 b: fmt.pct(after.areaPct) },
    { label: "People displaced",     a: fmt.pop(before.population * 1000),       b: fmt.pop(after.population * 1000) },
    { label: "Economic loss",        a: fmt.usd(before.economic),                b: fmt.usd(after.economic) },
    { label: "Composite risk",       a: fmt.score(before.riskScore) + " · " + before.riskLabel, b: fmt.score(after.riskScore) + " · " + after.riskLabel },
  ];

  return (
    <div className="premium-card overflow-hidden">
      <div className="border-b border-border/70 bg-secondary/40 px-5 py-5 sm:px-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Before · After</p>
        <h3 className="mt-1 font-display text-2xl text-primary">{after.region.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Baseline (2020s, optimistic) compared with your active scenario.
        </p>
      </div>

      {/* Mobile: stacked rows */}
      <div className="divide-y divide-border/40 sm:hidden">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-2 gap-3 px-5 py-3">
            <div className="col-span-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {r.label}
            </div>
            <div className="font-mono-num text-sm text-muted-foreground">
              <span className="mb-0.5 block text-[9px] uppercase tracking-wider text-muted-foreground/70">Baseline</span>
              {r.a}
            </div>
            <div className="rounded-md bg-ocean-foam/40 px-2 py-1 text-right">
              <span className="mb-0.5 block text-[9px] uppercase tracking-wider text-ocean-deep/80">Projected</span>
              <span className="font-mono-num font-display text-base text-primary">{r.b}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / tablet: 3-col grid with arrow */}
      <div className="hidden grid-cols-[1fr_auto_1fr] items-stretch text-sm sm:grid">
        <div className="border-b border-border/60 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Baseline today
        </div>
        <div className="border-b border-border/60" />
        <div className="border-b border-border/60 bg-ocean-foam/40 px-7 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean-deep">
          Projected scenario
        </div>

        {rows.map((r) => (
          <div key={r.label} className="contents">
            <div className="border-b border-border/40 px-7 py-4 font-mono-num text-base text-muted-foreground">
              {r.a}
            </div>
            <div className="flex items-center justify-center border-b border-border/40 px-3 text-muted-foreground/40">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-3 border-b border-border/40 bg-ocean-foam/20 px-7 py-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{r.label}</span>
              <span className="font-mono-num font-display text-lg text-primary">{r.b}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};