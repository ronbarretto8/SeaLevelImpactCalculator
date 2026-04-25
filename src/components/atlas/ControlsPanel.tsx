import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AtlasState, DEFAULT_STATE } from "@/utils/calculateImpact";
import { REGIONS, SCENARIOS, ScenarioKey } from "@/data/regions";
import { RotateCcw, Waves, Building2, Users, MapPin } from "lucide-react";

interface ControlsPanelProps {
  state: AtlasState;
  onChange: (s: AtlasState) => void;
}

export const ControlsPanel = ({ state, onChange }: ControlsPanelProps) => {
  const update = (patch: Partial<AtlasState>) => onChange({ ...state, ...patch });

  return (
    <div className="premium-card p-6 lg:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Scenario Controls</p>
          <h3 className="mt-1 font-display text-xl text-primary">Calibrate the model</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          onClick={() => onChange(DEFAULT_STATE)}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      {/* Region picker */}
      <div className="mb-5">
        <Label icon={<MapPin className="h-3.5 w-3.5" />}>Region</Label>
        <div className="mt-2 grid grid-cols-2 gap-1.5 md:grid-cols-4">
          {REGIONS.map((r) => {
            const active = state.region === r.name;
            return (
              <button
                key={r.id}
                onClick={() => update({ region: r.name })}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-all ${
                  active
                    ? "border-accent bg-accent text-accent-foreground shadow-md"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-accent/50 hover:text-primary"
                }`}
              >
                {r.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario toggle */}
      <div className="mb-6">
        <Label>Climate scenario</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => {
            const active = state.scenario === k;
            const tone =
              k === "optimistic"
                ? active ? "bg-risk-low text-white border-risk-low" : "border-border text-muted-foreground"
                : k === "moderate"
                ? active ? "bg-risk-mod text-white border-risk-mod" : "border-border text-muted-foreground"
                : active ? "bg-risk-high text-white border-risk-high" : "border-border text-muted-foreground";
            return (
              <button
                key={k}
                onClick={() => update({ scenario: k })}
                className={`rounded-lg border px-2 py-2.5 text-xs font-semibold transition-all hover:scale-[1.02] ${tone}`}
              >
                {SCENARIOS[k].label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {SCENARIOS[state.scenario].narrative}
        </p>
      </div>

      {/* Sliders */}
      <SliderRow
        icon={<Waves className="h-3.5 w-3.5" />}
        label="Sea level rise"
        unit="m"
        value={state.seaLevel}
        min={0}
        max={3}
        step={0.05}
        onChange={(v) => update({ seaLevel: v })}
      />
      <SliderRow
        icon={<Users className="h-3.5 w-3.5" />}
        label="Population density"
        unit="×"
        value={state.popDensity}
        min={0.5}
        max={2}
        step={0.05}
        onChange={(v) => update({ popDensity: v })}
      />
      <SliderRow
        icon={<Building2 className="h-3.5 w-3.5" />}
        label="Infrastructure sensitivity"
        unit="×"
        value={state.infraSensitivity}
        min={0.5}
        max={2}
        step={0.05}
        onChange={(v) => update({ infraSensitivity: v })}
      />
    </div>
  );
};

const Label = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
    {icon}
    {children}
  </div>
);

const SliderRow = ({
  icon, label, unit, value, min, max, step, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: number;
  min: number; max: number; step: number;
  onChange: (v: number) => void;
}) => (
  <div className="mt-4">
    <div className="mb-2 flex items-center justify-between">
      <Label icon={icon}>{label}</Label>
      <span className="font-mono-num text-sm font-semibold text-primary">
        {value.toFixed(2)}{unit}
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(v[0])}
      className="cursor-pointer"
    />
  </div>
);