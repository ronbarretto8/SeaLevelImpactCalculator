import { ImpactResult, recommendations } from "@/utils/calculateImpact";
import { Sparkles, Shield, Trees, Building, Activity } from "lucide-react";

const ICONS = [Shield, Trees, Building, Activity];

const PRIORITY = {
  Critical: { bg: "hsl(4 90% 60% / 0.1)",   border: "hsl(4 90% 60% / 0.3)",   text: "hsl(4 90% 68%)" },
  High:     { bg: "hsl(38 100% 55% / 0.1)",  border: "hsl(38 100% 55% / 0.3)", text: "hsl(38 100% 62%)" },
  Strategic:{ bg: "hsl(var(--primary) / 0.08)", border: "hsl(var(--primary) / 0.22)", text: "hsl(var(--primary))" },
};

export const DecisionEngine = ({ result }: { result: ImpactResult }) => {
  const recs = recommendations(result);

  return (
    <div
      className="deep-card relative overflow-hidden p-7 lg:p-9"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.45), transparent)" }} />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2" style={{ color: "hsl(var(--primary))" }}>
          <Sparkles className="h-4 w-4" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em]">Decision Engine</p>
        </div>
        <h3 className="font-display text-2xl text-white lg:text-3xl">
          Strategic responses for{" "}
          <span className="text-gradient-cyan">{result.region.shortName}</span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Auto-generated from risk score{" "}
          <span className="font-mono-num" style={{ color: "hsl(var(--primary))" }}>{result.riskScore.toFixed(0)}</span>{" "}
          and regional context.
        </p>

        {/* Cards */}
        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          {recs.map((r, i) => {
            const Icon = ICONS[i % ICONS.length];
            const s = PRIORITY[r.priority] ?? PRIORITY.Strategic;
            return (
              <div
                key={i}
                className="group rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] hover:bg-white/[0.06]"
                style={{ background: "hsl(214 55% 11% / 0.65)", border: "1px solid hsl(214 30% 22% / 0.5)", backdropFilter: "blur(8px)" }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                    {r.priority}
                  </span>
                </div>
                <p className="font-display text-base text-white leading-snug">{r.title}</p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{r.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};