import { ImpactResult, fmt } from "@/utils/calculateImpact";
import { Waves, MapPinned, Users, Coins } from "lucide-react";

interface MetricItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accentColor: string;
  glowColor: string;
}

export const MetricCards = ({ result }: { result: ImpactResult }) => {
  const items: MetricItem[] = [
    {
      icon: <Waves className="h-5 w-5" />,
      label: "Sea level",
      value: fmt.m(result.seaLevel),
      sub: "above 2000 baseline",
      accentColor: "hsl(188 100% 50%)",
      glowColor: "hsl(188 100% 50% / 0.15)",
    },
    {
      icon: <MapPinned className="h-5 w-5" />,
      label: "Area submerged",
      value: fmt.km2(result.areaKm2) + " km²",
      sub: fmt.pct(result.areaPct) + " of vulnerable zone",
      accentColor: "hsl(210 90% 60%)",
      glowColor: "hsl(210 90% 60% / 0.12)",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "People displaced",
      value: fmt.pop(result.population * 1000),
      sub: "projected",
      accentColor: "hsl(38 100% 58%)",
      glowColor: "hsl(38 100% 58% / 0.15)",
    },
    {
      icon: <Coins className="h-5 w-5" />,
      label: "Economic loss",
      value: fmt.usd(result.economic),
      sub: "USD est. damage",
      accentColor: "hsl(var(--coral))",
      glowColor: "hsl(16 92% 62% / 0.15)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {items.map((m, idx) => (
        <MetricCard key={m.label} item={m} delay={idx * 60} />
      ))}
    </div>
  );
};

const MetricCard = ({ item: m, delay }: { item: MetricItem; delay: number }) => (
  <div
    className="premium-card group relative overflow-hidden p-5 lg:p-6"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Top accent line */}
    <div
      className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: `linear-gradient(90deg, transparent, ${m.accentColor}, transparent)` }}
    />

    {/* Ambient glow on hover */}
    <div
      className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${m.glowColor} 0%, transparent 70%)` }}
    />

    <div className="relative">
      {/* Icon */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${m.glowColor}`,
          border: `1px solid ${m.accentColor}22`,
          color: m.accentColor,
        }}
      >
        {m.icon}
      </div>

      {/* Label */}
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {m.label}
      </p>

      {/* Value */}
      <p
        className="font-mono-num font-display mt-1.5 text-2xl font-bold lg:text-3xl"
        style={{ color: m.accentColor }}
      >
        {m.value}
      </p>

      {/* Sub */}
      <p className="mt-1 text-xs text-muted-foreground/70">{m.sub}</p>
    </div>
  </div>
);