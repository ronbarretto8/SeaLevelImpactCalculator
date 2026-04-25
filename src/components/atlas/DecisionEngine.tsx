import { ImpactResult, recommendations } from "@/utils/calculateImpact";
import { Sparkles, Shield, Trees, Building, Activity } from "lucide-react";

const ICONS = [Shield, Trees, Building, Activity];

export const DecisionEngine = ({ result }: { result: ImpactResult }) => {
  const recs = recommendations(result);
  return (
    <div className="deep-card relative overflow-hidden p-7 lg:p-9">
      {/* subtle deep-water shine */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ocean-bright/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-ocean-cyan/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 text-ocean-cyan">
          <Sparkles className="h-4 w-4" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">Decision Engine</p>
        </div>
        <h3 className="mt-2 font-display text-2xl text-primary-foreground lg:text-3xl">
          Strategic responses for {result.region.shortName}
        </h3>
        <p className="mt-2 max-w-xl text-sm text-primary-foreground/70">
          Auto-generated from current risk score ({result.riskScore.toFixed(0)}) and
          regional context. Three prioritised actions ready for cabinet review.
        </p>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {recs.map((r, i) => {
            const Icon = ICONS[i % ICONS.length];
            const tone =
              r.priority === "Critical"
                ? "border-risk-high/50 bg-risk-high/10 text-risk-high"
                : r.priority === "High"
                ? "border-amber-warn/50 bg-[hsl(38_95%_55%/0.1)] text-amber-warn"
                : "border-ocean-cyan/40 bg-ocean-cyan/10 text-ocean-cyan";
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-ocean-cyan">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}>
                    {r.priority}
                  </span>
                </div>
                <p className="mt-4 font-display text-lg text-primary-foreground">{r.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/65">
                  {r.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};