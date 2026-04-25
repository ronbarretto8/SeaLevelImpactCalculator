import { ImpactResult, fmt } from "@/utils/calculateImpact";
import { ShieldAlert, ShieldCheck, ShieldHalf } from "lucide-react";

export const RiskBar = ({ result }: { result: ImpactResult }) => {
  const tone =
    result.riskLabel === "High"
      ? { color: "hsl(var(--risk-high))", bg: "bg-[hsl(8_85%_96%)]", text: "text-risk-high", icon: <ShieldAlert className="h-5 w-5" /> }
      : result.riskLabel === "Moderate"
      ? { color: "hsl(var(--risk-mod))", bg: "bg-[hsl(38_95%_94%)]", text: "text-[hsl(38_85%_38%)]", icon: <ShieldHalf className="h-5 w-5" /> }
      : { color: "hsl(var(--risk-low))", bg: "bg-[hsl(158_70%_94%)]", text: "text-risk-low", icon: <ShieldCheck className="h-5 w-5" /> };

  return (
    <div className="premium-card p-6 lg:p-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Composite Risk Score</p>
          <h3 className="mt-1 font-display text-2xl text-primary">{result.region.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{result.region.highlight}</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 ${tone.bg} ${tone.text} font-semibold text-sm`}>
          {tone.icon}
          {result.riskLabel} risk
        </div>
      </div>

      {/* Bar */}
      <div className="mt-6">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          {/* Gradient track */}
          <div
            className="absolute inset-0 opacity-25"
            style={{ background: "var(--gradient-risk)" }}
          />
          {/* Fill */}
          <div
            className="relative h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${result.riskScore}%`,
              background: "var(--gradient-risk)",
              boxShadow: `0 0 20px ${tone.color}55`,
            }}
          />
          {/* Indicator dot */}
          <div
            className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-[3px] border-white bg-white shadow-lg transition-all duration-700"
            style={{
              left: `calc(${result.riskScore}% - 12px)`,
              boxShadow: `0 0 0 2px ${tone.color}, 0 6px 16px ${tone.color}55`,
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>0 · Low</span>
          <span>30</span>
          <span>70</span>
          <span>100 · Critical</span>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Composite score</p>
          <p className="font-mono-num font-display text-5xl text-primary">{fmt.score(result.riskScore)}</p>
        </div>
        <p className="max-w-xs text-right text-xs text-muted-foreground">
          Weighted blend of inundated area (40%), population exposure (35%), and economic sensitivity (25%).
        </p>
      </div>
    </div>
  );
};