import { ImpactResult, fmt } from "@/utils/calculateImpact";
import { Waves, MapPinned, Users, Coins, ArrowUpRight } from "lucide-react";

export const MetricCards = ({ result }: { result: ImpactResult }) => {
  const items = [
    {
      icon: <Waves className="h-5 w-5" />,
      label: "Sea level",
      value: fmt.m(result.seaLevel),
      sub: "above 2000 baseline",
      tone: "ocean",
    },
    {
      icon: <MapPinned className="h-5 w-5" />,
      label: "Area submerged",
      value: fmt.km2(result.areaKm2) + " km²",
      sub: fmt.pct(result.areaPct) + " of vulnerable zone",
      tone: "ocean",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "People displaced",
      value: fmt.pop(result.population * 1000), // back to absolute
      sub: "projected",
      tone: "amber",
    },
    {
      icon: <Coins className="h-5 w-5" />,
      label: "Economic loss",
      value: fmt.usd(result.economic),
      sub: "USD est. damage",
      tone: "coral",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {items.map((m) => (
        <div key={m.label} className="premium-card group relative overflow-hidden p-5 lg:p-6">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                m.tone === "ocean"
                  ? "bg-ocean-foam text-ocean-deep"
                  : m.tone === "amber"
                  ? "bg-[hsl(38_95%_92%)] text-[hsl(38_85%_35%)]"
                  : "bg-[hsl(16_90%_94%)] text-coral"
              }`}
            >
              {m.icon}
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {m.label}
          </p>
          <p className="font-mono-num mt-1 font-display text-3xl text-primary lg:text-[2rem]">
            {m.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>

          {/* Decorative wave bottom */}
          <svg viewBox="0 0 200 20" className="pointer-events-none absolute inset-x-0 bottom-0 h-3 w-full opacity-60" preserveAspectRatio="none">
            <path d="M0,10 C50,0 100,20 150,10 C175,5 200,15 200,15 L200,20 L0,20 Z" fill="hsl(var(--ocean-foam))" />
          </svg>
        </div>
      ))}
    </div>
  );
};