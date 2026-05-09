import { Slider } from "@/components/ui/slider";
import { AtlasState, DEFAULT_STATE } from "@/utils/calculateImpact";
import { REGIONS, SCENARIOS, ScenarioKey } from "@/data/regions";
import { RotateCcw, Waves, Building2, Users, MapPin } from "lucide-react";
import { sfx } from "@/utils/sfx";

interface ControlsPanelProps {
  state: AtlasState;
  onChange: (s: AtlasState) => void;
}

export const ControlsPanel = ({ state, onChange }: ControlsPanelProps) => {
  const update = (patch: Partial<AtlasState>) => onChange({ ...state, ...patch });

  return (
    <div className="premium-card p-6 lg:p-7 relative overflow-hidden">
      {/* Subtle interior glow */}
      <div 
        className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[50px] pointer-events-none" 
        style={{ background: "hsl(var(--primary) / 0.15)" }}
      />
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--primary))" }}>
            Scenario Controls
          </p>
          <h3 className="font-display mt-1 text-xl text-foreground">Calibrate the model</h3>
        </div>
        <button
          onClick={() => { sfx.playClick(); onChange(DEFAULT_STATE); }}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
          style={{ background: "hsl(var(--muted) / 0.5)", borderColor: "hsl(var(--border))" }}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Region picker */}
      <div className="mb-6">
        <FieldLabel icon={<MapPin className="h-3.5 w-3.5" />}>Region</FieldLabel>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 md:grid-cols-4">
          {REGIONS.map((r) => {
            const active = state.region === r.name;
            return (
              <button
                key={r.id}
                onClick={() => { sfx.playClick(); update({ region: r.name }); }}
                className="rounded-xl border px-2.5 py-2 text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                style={active ? {
                  background: "hsl(var(--primary) / 0.12)",
                  borderColor: "hsl(var(--primary) / 0.45)",
                  color: "hsl(var(--primary))",
                  boxShadow: "0 0 12px hsl(var(--primary) / 0.15)",
                } : {
                  background: "hsl(var(--muted) / 0.4)",
                  borderColor: "hsl(var(--border) / 0.6)",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {r.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario toggle */}
      <div className="mb-6">
        <FieldLabel>Climate scenario</FieldLabel>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => {
            const active = state.scenario === k;
            const colors = {
              optimistic: { c: "hsl(var(--risk-low))", bg: "hsl(158 85% 42% / 0.12)", bd: "hsl(158 85% 42% / 0.4)" },
              moderate: { c: "hsl(var(--risk-mod))", bg: "hsl(38 100% 55% / 0.12)", bd: "hsl(38 100% 55% / 0.4)" },
              severe: { c: "hsl(var(--risk-high))", bg: "hsl(4 90% 60% / 0.12)", bd: "hsl(4 90% 60% / 0.4)" },
            }[k];
            return (
              <button
                key={k}
                onClick={() => { sfx.playClick(); update({ scenario: k }); }}
                className="rounded-xl border py-2.5 text-xs font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={active ? {
                  background: colors.bg,
                  borderColor: colors.bd,
                  color: colors.c,
                } : {
                  background: "hsl(var(--muted) / 0.4)",
                  borderColor: "hsl(var(--border) / 0.6)",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {SCENARIOS[k].label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {SCENARIOS[state.scenario].narrative}
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <SliderRow icon={<Waves className="h-3.5 w-3.5" />} label="Sea level rise" unit="m" value={state.seaLevel} min={0} max={3} step={0.05} onChange={(v) => update({ seaLevel: v })} />
        <SliderRow icon={<Users className="h-3.5 w-3.5" />} label="Population density" unit="×" value={state.popDensity} min={0.5} max={2} step={0.05} onChange={(v) => update({ popDensity: v })} />
        <SliderRow icon={<Building2 className="h-3.5 w-3.5" />} label="Infrastructure sensitivity" unit="×" value={state.infraSensitivity} min={0.5} max={2} step={0.05} onChange={(v) => update({ infraSensitivity: v })} />
      </div>
    </div>
  );
};

const FieldLabel = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
    {icon && <span style={{ color: "hsl(var(--primary) / 0.7)" }}>{icon}</span>}
    {children}
  </div>
);

const SliderRow = ({
  icon, label, unit, value, min, max, step, onChange,
}: {
  icon: React.ReactNode; label: string; unit: string;
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) => (
  <div>
    <div className="mb-2.5 flex items-center justify-between">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <span
        className="font-mono-num rounded-lg px-2.5 py-1 text-sm font-bold"
        style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.18)" }}
      >
        {value.toFixed(2)}{unit}
      </span>
    </div>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => { sfx.playTick(); onChange(v[0]); }} className="cursor-pointer" />
  </div>
);