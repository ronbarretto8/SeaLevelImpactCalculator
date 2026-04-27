import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { calculateAllRegions, AtlasState } from "@/utils/calculateImpact";
import { useState } from "react";
import { sfx } from "@/utils/sfx";

type Metric = "area" | "population" | "economic" | "risk";

const METRICS: { key: Metric; label: string; unit: string; color: string; dimColor: string; startColor: string; endColor: string }[] = [
  { key: "area",       label: "Area Submerged",  unit: "km²",  color: "hsl(188, 100%, 50%)", dimColor: "hsl(188, 50%, 40%)", startColor: "hsl(188, 100%, 65%)", endColor: "hsl(200, 90%, 45%)" },
  { key: "population", label: "People Displaced", unit: "k",   color: "hsl(230, 90%, 65%)",  dimColor: "hsl(230, 50%, 45%)", startColor: "hsl(240, 100%, 75%)", endColor: "hsl(225, 85%, 55%)" },
  { key: "economic",   label: "Economic Loss",    unit: "×$10M",color: "hsl(38, 100%, 55%)",  dimColor: "hsl(38, 50%, 40%)", startColor: "hsl(45, 100%, 65%)",  endColor: "hsl(32, 95%, 48%)" },
  { key: "risk",       label: "Risk Score",       unit: "/100", color: "hsl(4, 90%, 60%)",    dimColor: "hsl(4, 50%, 45%)",  startColor: "hsl(10, 100%, 68%)",  endColor: "hsl(0, 90%, 55%)" },
];

export const ImpactChart = ({ state }: { state: AtlasState }) => {
  const [active, setActive] = useState<Metric>("risk");
  const metric = METRICS.find((m) => m.key === active)!;

  const data = calculateAllRegions(state).map((r) => ({
    name: r.region.shortName,
    fullName: r.region.name,
    area:       +r.areaKm2.toFixed(1),
    population: +r.population.toFixed(1),
    economic:   +(r.economic / 10).toFixed(1),
    risk:       +r.riskScore.toFixed(1),
    isActive:   r.region.name === state.region,
    riskLabel:  r.riskLabel,
  }));

  const maxVal  = Math.max(...data.map((d) => d[active]));
  const avgVal  = +(data.reduce((s, d) => s + d[active], 0) / data.length).toFixed(1);

  const CustomTooltip = ({ active: a, payload, label }: any) => {
    if (!a || !payload?.length) return null;
    const row = data.find((d) => d.name === label);
    return (
      <div
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 12,
          boxShadow: "var(--shadow-lg)",
          padding: "12px 16px",
          minWidth: 170,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 4 }}>
          {row?.fullName}
        </p>
        <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
          {row?.riskLabel} risk
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{metric.label}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: metric.color }}>
            {payload[0]?.value}{" "}
            <span style={{ fontSize: 10, opacity: 0.7 }}>{metric.unit}</span>
          </span>
        </div>
        <div
          style={{ marginTop: 8, height: 4, borderRadius: 99, background: "hsl(var(--muted))", overflow: "hidden" }}
        >
          <div
            style={{
              height: "100%",
              width: `${(payload[0]?.value / maxVal) * 100}%`,
              background: metric.color,
              borderRadius: 99,
              boxShadow: `0 0 8px ${metric.color}66`,
            }}
          />
        </div>
        <p style={{ marginTop: 4, fontSize: 9, color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>
          {((payload[0]?.value / maxVal) * 100).toFixed(0)}% of max
        </p>
      </div>
    );
  };

  const CustomBar = (props: any) => {
    const { x, y, width, height, isActive: ia } = props;
    const radius = 6;
    const gradId = `grad-${active}-${ia ? "active" : "dim"}-${x}`;
    return (
      <g>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ia ? metric.startColor : metric.dimColor} stopOpacity={ia ? 1 : 0.6} />
            <stop offset="100%" stopColor={ia ? metric.endColor : metric.dimColor} stopOpacity={ia ? 1 : 0.3} />
          </linearGradient>
        </defs>
        {ia && (
          <rect
            x={x - 6} y={0}
            width={width + 12}
            height="100%"
            fill={metric.color}
            fillOpacity={0.06}
            rx={6}
          />
        )}
        <rect
          x={x} y={y}
          width={width} height={Math.max(0, height)}
          fill={`url(#${gradId})`}
          rx={radius}
          style={{
            filter: ia ? `drop-shadow(0 0 12px ${metric.color}66)` : undefined,
            transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />
        {ia && height > 18 && (
          <rect x={x} y={y} width={width} height={3} fill="white" fillOpacity={0.4} rx={radius} />
        )}
      </g>
    );
  };

  return (
    <div className="premium-card overflow-hidden">
      {/* Header */}
      <div className="px-6 pb-0 pt-6 lg:px-8 lg:pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--primary))" }}>
              Cross-Region Comparison
            </p>
            <h3 className="font-display mt-1.5 text-2xl text-foreground lg:text-3xl">Coastal exposure across India</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Select a metric to compare all 8 regions. Highlighted = active selection.
            </p>
          </div>

          {/* Metric selector tabs */}
          <div
            className="flex flex-wrap gap-1.5 rounded-2xl p-1.5"
            style={{ background: "hsl(var(--muted)/0.5)", border: "1px solid hsl(var(--border))" }}
          >
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => { sfx.playClick(); setActive(m.key); }}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-95"
                style={active === m.key ? {
                  background: m.color,
                  color: "hsl(214 90% 6%)",
                  boxShadow: `0 4px 16px ${m.color}66`,
                } : {
                  background: "transparent",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary bar */}
        <div
          className="mb-6 flex flex-wrap items-center gap-4 rounded-xl px-4 py-3"
          style={{ background: `${metric.color}0D`, border: `1px solid ${metric.color}22` }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-0.5">Showing</p>
            <p className="text-sm font-bold" style={{ color: metric.color }}>{metric.label}</p>
          </div>
          <div className="h-6 w-px" style={{ background: "hsl(var(--border))" }} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-0.5">Region avg</p>
            <p className="font-mono-num text-sm font-bold text-foreground">{avgVal} {metric.unit}</p>
          </div>
          <div className="h-6 w-px" style={{ background: "hsl(var(--border))" }} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-0.5">Region max</p>
            <p className="font-mono-num text-sm font-bold text-foreground">{maxVal} {metric.unit}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px] w-full px-2 pb-6 lg:h-[360px] lg:px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: -8, bottom: 4 }}
            barCategoryGap="30%"
            barSize={36}
          >
            <CartesianGrid strokeDasharray="3 8" stroke="hsl(var(--border))" vertical={false} />
            <ReferenceLine
              y={avgVal}
              stroke={metric.color}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              strokeWidth={1.5}
              label={{ value: `avg ${avgVal}`, fill: metric.color, fontSize: 10, dx: 6 }}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={(props) => {
                const { x, y, payload } = props;
                const row = data.find((d) => d.name === payload.value);
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0} y={0} dy={14}
                      textAnchor="middle"
                      fontSize={row?.isActive ? 12 : 11}
                      fontWeight={row?.isActive ? 700 : 500}
                      fontFamily="Inter"
                      fill={row?.isActive ? metric.color : "hsl(var(--muted-foreground))"}
                    >
                      {payload.value}
                    </text>
                    {row?.isActive && (
                      <circle cx={0} cy={24} r={3} fill={metric.color} />
                    )}
                  </g>
                );
              }}
              height={36}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{ fill: "hsl(var(--muted-foreground))", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey={active} shape={<CustomBar />} isAnimationActive animationDuration={600}>
              {data.map((d, i) => (
                <Cell key={i} isActive={d.isActive} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};