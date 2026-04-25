import { ImpactResult, fmt } from "@/utils/calculateImpact";
import { ShieldAlert, ShieldCheck, ShieldHalf } from "lucide-react";

export const RiskBar = ({ result }: { result: ImpactResult }) => {
  const isHigh = result.riskLabel === "High";
  const isMod  = result.riskLabel === "Moderate";

  const tone = isHigh
    ? { color: "hsl(4 90% 60%)",   glow: "hsl(4 90% 60% / 0.3)",   bgColor: "hsl(4 90% 60% / 0.08)",   text: "hsl(4 90% 70%)",   border: "hsl(4 90% 60% / 0.25)",   icon: <ShieldAlert className="h-4 w-4" /> }
    : isMod
    ? { color: "hsl(38 100% 55%)", glow: "hsl(38 100% 55% / 0.3)", bgColor: "hsl(38 100% 55% / 0.08)", text: "hsl(38 100% 65%)", border: "hsl(38 100% 55% / 0.25)", icon: <ShieldHalf className="h-4 w-4" /> }
    : { color: "hsl(158 85% 42%)", glow: "hsl(158 85% 42% / 0.3)", bgColor: "hsl(158 85% 42% / 0.08)", text: "hsl(158 85% 52%)", border: "hsl(158 85% 42% / 0.25)", icon: <ShieldCheck className="h-4 w-4" /> };

  return (
    <div className="premium-card overflow-hidden p-6 lg:p-8">
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "hsl(var(--primary))" }}
          >
            Composite Risk Score
          </p>
          <h3 className="font-display mt-1.5 text-2xl text-foreground">{result.region.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{result.region.highlight}</p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            background: tone.bgColor,
            border: `1px solid ${tone.border}`,
            color: tone.text,
          }}
        >
          {tone.icon}
          {result.riskLabel} Risk
        </div>
      </div>

      {/* Score + bar */}
      <div className="mt-8">
        {/* Large score */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Composite score</p>
            <p
              className="font-mono-num font-display mt-1 text-6xl font-bold leading-none"
              style={{ color: tone.color, textShadow: `0 0 40px ${tone.glow}` }}
            >
              {fmt.score(result.riskScore)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">out of 100</p>
          </div>
          <p className="max-w-[240px] text-right text-xs leading-relaxed text-muted-foreground">
            Weighted blend: inundated area (40%), population exposure (35%), economic sensitivity (25%).
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative">
          {/* Track */}
          <div
            className="relative h-3 w-full overflow-hidden rounded-full"
            style={{ background: "hsl(214 40% 14%)" }}
          >
            {/* Background gradient track */}
            <div
              className="absolute inset-0 opacity-15 rounded-full"
              style={{ background: "var(--gradient-risk)" }}
            />
            {/* Animated fill */}
            <div
              className="relative h-full rounded-full transition-all duration-700"
              style={{
                width: `${result.riskScore}%`,
                background: "var(--gradient-risk)",
                boxShadow: `0 0 20px ${tone.glow}`,
              }}
            />
          </div>

          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-background bg-background transition-all duration-700"
            style={{
              left: `calc(${result.riskScore}% - 10px)`,
              boxShadow: `0 0 0 2px ${tone.color}, 0 4px 12px ${tone.glow}`,
              background: tone.color,
            }}
          />
        </div>

        {/* Scale labels */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-muted-foreground/60">
          <span style={{ color: "hsl(158 85% 42%)" }}>0 · Safe</span>
          <span>30</span>
          <span>70</span>
          <span style={{ color: "hsl(4 90% 60%)" }}>100 · Critical</span>
        </div>
      </div>
    </div>
  );
};