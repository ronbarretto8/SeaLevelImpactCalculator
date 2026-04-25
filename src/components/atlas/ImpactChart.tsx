import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Legend,
} from "recharts";
import { calculateAllRegions, AtlasState, fmt } from "@/utils/calculateImpact";

export const ImpactChart = ({ state }: { state: AtlasState }) => {
  const data = calculateAllRegions(state).map((r) => ({
    name: r.region.shortName,
    area: +r.areaKm2.toFixed(1),
    population: +r.population.toFixed(1),
    economic: +(r.economic / 10).toFixed(1), // scaled for display
    risk: +r.riskScore.toFixed(1),
    isActive: r.region.name === state.region,
  }));

  return (
    <div className="premium-card p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Cross-Region Comparison</p>
          <h3 className="mt-1 font-display text-2xl text-primary lg:text-3xl">
            Coastal exposure across India
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Side-by-side modelling of all 8 regions under your active scenario. Highlighted bars
            indicate the currently selected coastline.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <Legend2 swatch="hsl(var(--ocean-blue))" label="Area km²" />
          <Legend2 swatch="hsl(var(--ocean-cyan))" label="Population (k)" />
          <Legend2 swatch="hsl(var(--coral))" label="Economic ($10M)" />
          <Legend2 swatch="hsl(var(--ocean-deep))" label="Risk score" />
        </div>
      </div>

      <div className="h-[460px] w-full lg:h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -12, bottom: 8 }} barCategoryGap="22%">
            <defs>
              <linearGradient id="g-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--ocean-blue))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--ocean-blue))" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="g-pop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--ocean-cyan))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--ocean-cyan))" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="g-econ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--coral))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--coral))" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="g-risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--ocean-deep))" stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--ocean-midnight))" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 600 }}
              dy={6}
            />
            <YAxis axisLine={false} tickLine={false} width={40} />
            <Tooltip
              cursor={{ fill: "hsl(var(--ocean-foam))", opacity: 0.4 }}
              contentStyle={{
                background: "white",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                boxShadow: "var(--shadow-lg)",
                fontSize: 12,
              }}
              labelStyle={{ fontWeight: 700, color: "hsl(var(--primary))" }}
              formatter={(value: number, name: string) => {
                const map: Record<string, string> = {
                  area: "Area km²", population: "Population (k)", economic: "Economic (×$10M)", risk: "Risk score",
                };
                return [value, map[name] ?? name];
              }}
            />
            <Bar dataKey="area" fill="url(#g-area)" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fillOpacity={d.isActive ? 1 : 0.85} />)}
            </Bar>
            <Bar dataKey="population" fill="url(#g-pop)" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fillOpacity={d.isActive ? 1 : 0.85} />)}
            </Bar>
            <Bar dataKey="economic" fill="url(#g-econ)" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fillOpacity={d.isActive ? 1 : 0.85} />)}
            </Bar>
            <Bar dataKey="risk" fill="url(#g-risk)" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fillOpacity={d.isActive ? 1 : 0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Legend2 = ({ swatch, label }: { swatch: string; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-2.5 py-1 font-medium text-muted-foreground">
    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: swatch }} />
    {label}
  </span>
);