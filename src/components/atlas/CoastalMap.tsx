import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { REGIONS } from "@/data/regions";
import { AtlasState, calculateAllRegions, fmt } from "@/utils/calculateImpact";

const RISK_COLOR = (label: string) =>
  label === "High" ? "hsl(8, 85%, 58%)" : label === "Moderate" ? "hsl(38, 95%, 55%)" : "hsl(158, 70%, 42%)";

const FlyTo = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 6, { duration: 1.4 });
  }, [lat, lng, map]);
  return null;
};

interface CoastalMapProps {
  state: AtlasState;
  onSelect: (regionName: string) => void;
}

export const CoastalMap = ({ state, onSelect }: CoastalMapProps) => {
  const all = useMemo(() => calculateAllRegions(state), [state]);
  const active = all.find((r) => r.region.name === state.region) ?? all[0];

  return (
    <div className="relative h-[480px] w-full overflow-hidden sm:h-[600px] lg:h-[760px]">
      <MapContainer
        center={[active.region.lat, active.region.lng]}
        zoom={5}
        minZoom={4}
        maxZoom={9}
        scrollWheelZoom
        className="absolute inset-0"
        style={{ background: "hsl(195, 80%, 92%)" }}
        worldCopyJump
        attributionControl={false}
      >
        <TileLayer
          attribution='Tiles © Esri — Source: Esri, USGS, NOAA · Atlas dataset © Climate Intelligence Lab'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}"
          opacity={0.7}
        />
        <FlyTo lat={active.region.lat} lng={active.region.lng} />

        {all.map((r) => {
          const color = RISK_COLOR(r.riskLabel);
          const isActive = r.region.name === state.region;
          // Soft halo proportional to risk
          const haloRadius = 14 + (r.riskScore / 100) * 26;
          return (
            <div key={r.region.id}>
              <CircleMarker
                center={[r.region.lat, r.region.lng]}
                radius={haloRadius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.12,
                  weight: 1,
                  opacity: 0.4,
                }}
                interactive={false}
              />
              <CircleMarker
                center={[r.region.lat, r.region.lng]}
                radius={isActive ? 11 : 8}
                pathOptions={{
                  color: "white",
                  fillColor: color,
                  fillOpacity: 1,
                  weight: 3,
                }}
                eventHandlers={{
                  click: () => onSelect(r.region.name),
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} className="!rounded-xl !border-0 !bg-white !p-0 !shadow-xl">
                  <div className="min-w-[200px] p-3">
                    <p className="font-display text-sm font-bold text-primary">{r.region.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.region.state}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                      <span className="text-muted-foreground">Risk</span>
                      <span className="font-mono-num text-right font-semibold" style={{ color }}>
                        {r.riskLabel} · {fmt.score(r.riskScore)}
                      </span>
                      <span className="text-muted-foreground">People</span>
                      <span className="font-mono-num text-right font-semibold text-primary">
                        {fmt.pop(r.population * 1000)}
                      </span>
                      <span className="text-muted-foreground">Economic</span>
                      <span className="font-mono-num text-right font-semibold text-primary">
                        {fmt.usd(r.economic)}
                      </span>
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-mono-num text-right font-semibold text-primary">
                        {fmt.km2(r.areaKm2)} km²
                      </span>
                    </div>
                    <p className="mt-2 border-t border-border pt-2 text-[10px] uppercase tracking-wider text-accent">
                      Click to focus
                    </p>
                  </div>
                </Tooltip>
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>

      {/* Floating legend — hidden on mobile, shown md+ */}
      <div className="pointer-events-none absolute left-3 top-3 z-[400] hidden md:block lg:left-5 lg:top-5">
        <div className="glass-card pointer-events-auto p-3 lg:p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Legend</p>
          <div className="mt-2 space-y-1.5 text-xs">
            <LegendDot color="hsl(158, 70%, 42%)" label="Low · 0–30" />
            <LegendDot color="hsl(38, 95%, 55%)" label="Moderate · 30–70" />
            <LegendDot color="hsl(8, 85%, 58%)" label="High · 70–100" />
          </div>
          <div className="mt-2 border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
            Halo scales with risk.
          </div>
        </div>
      </div>

      {/* Floating active card — hidden on mobile, shown md+ */}
      <div className="pointer-events-none absolute right-3 top-3 z-[400] hidden max-w-[260px] md:block lg:right-5 lg:top-5 lg:max-w-xs">
        <div className="glass-card pointer-events-auto p-4 lg:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Now viewing</p>
          <p className="font-display mt-1 text-lg text-primary lg:text-xl">{active.region.name}</p>
          <p className="text-xs text-muted-foreground">{active.region.state}</p>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground lg:mt-3 lg:line-clamp-none">
            {active.region.highlight}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] lg:mt-4">
            <Stat label="Risk" value={`${fmt.score(active.riskScore)} · ${active.riskLabel}`} color={RISK_COLOR(active.riskLabel)} />
            <Stat label="People" value={fmt.pop(active.population * 1000)} />
            <Stat label="Area" value={`${fmt.km2(active.areaKm2)} km²`} />
            <Stat label="USD loss" value={fmt.usd(active.economic)} />
          </div>
        </div>
      </div>

      {/* Mobile compact strip — replaces stacked floating cards */}
      <div className="pointer-events-none absolute inset-x-2 bottom-2 z-[400] md:hidden">
        <div className="glass-card pointer-events-auto flex items-center justify-between gap-3 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">Now viewing</p>
            <p className="font-display truncate text-sm text-primary">{active.region.name}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold text-white" style={{ background: RISK_COLOR(active.riskLabel) }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
            {active.riskLabel} · {fmt.score(active.riskScore)}
          </div>
        </div>
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
    <span className="text-muted-foreground">{label}</span>
  </div>
);

const Stat = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="rounded-lg bg-secondary/60 px-2.5 py-1.5">
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="font-mono-num text-sm font-semibold" style={{ color: color ?? "hsl(var(--primary))" }}>
      {value}
    </p>
  </div>
);