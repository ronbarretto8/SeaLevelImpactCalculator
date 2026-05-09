import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { REGIONS } from "@/data/regions";
import { AtlasState, calculateAllRegions, fmt } from "@/utils/calculateImpact";

const RISK_COLOR = (label: string) =>
  label === "High"      ? "hsl(4, 90%, 60%)"
  : label === "Moderate" ? "hsl(38, 100%, 55%)"
  : "hsl(158, 85%, 42%)";

const FlyTo = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 6, { duration: 1.4 }); }, [lat, lng, map]);
  return null;
};

interface CoastalMapProps {
  state: AtlasState;
  onSelect: (regionName: string) => void;
  isDark?: boolean;
}

export const CoastalMap = ({ state, onSelect, isDark = true }: CoastalMapProps) => {
  const all    = useMemo(() => calculateAllRegions(state), [state]);
  const active = all.find((r) => r.region.name === state.region) ?? all[0];

  /* Card backgrounds adapt to theme */
  const overlayBg     = isDark ? "hsl(214 55% 9% / 0.88)"  : "hsl(0 0% 100% / 0.92)";
  const overlayBorder = isDark ? "hsl(214 30% 22%)"        : "hsl(210 35% 82%)";
  const overlayText   = isDark ? "hsl(200 25% 88%)"        : "hsl(215 60% 12%)";
  const overlaySub    = isDark ? "hsl(210 15% 52%)"        : "hsl(215 25% 45%)";
  const statBg        = isDark ? "hsl(214 55% 12%)"        : "hsl(210 40% 95%)";
  const statBorder    = isDark ? "hsl(214 30% 20%)"        : "hsl(210 35% 84%)";

  return (
    <div className="relative h-[480px] w-full overflow-hidden sm:h-[600px] lg:h-[700px]">
      <MapContainer
        center={[active.region.lat, active.region.lng]}
        zoom={5} minZoom={4} maxZoom={9}
        scrollWheelZoom
        className="absolute inset-0"
        style={{ background: isDark ? "hsl(214, 65%, 6%)" : "hsl(200, 50%, 88%)", transition: "background 0.3s ease" }}
        worldCopyJump
        attributionControl={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
          keepBuffer={12}
          updateWhenZooming={false}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}"
          opacity={0.5}
          keepBuffer={12}
          updateWhenZooming={false}
        />
        <FlyTo lat={active.region.lat} lng={active.region.lng} />

        {all.map((r) => {
          const color    = RISK_COLOR(r.riskLabel);
          const isActive = r.region.name === state.region;
          const haloR    = 16 + (r.riskScore / 100) * 26;
          return (
            <div key={r.region.id}>
              <CircleMarker
                center={[r.region.lat, r.region.lng]}
                radius={haloR}
                pathOptions={{ color, fillColor: color, fillOpacity: isActive ? 0.13 : 0.05, weight: isActive ? 1.5 : 0.8, opacity: isActive ? 0.45 : 0.2 }}
                interactive={false}
              />
              <CircleMarker
                center={[r.region.lat, r.region.lng]}
                radius={isActive ? 11 : 7}
                pathOptions={{ color: "white", fillColor: color, fillOpacity: 1, weight: isActive ? 3 : 2 }}
                eventHandlers={{ click: () => onSelect(r.region.name) }}
              >
                <Tooltip direction="top" offset={[0, -12]} opacity={1} className="!rounded-xl !border-0 !p-0 !shadow-2xl">
                  <div style={{ minWidth: 190, padding: "12px 14px", background: isDark ? "hsl(214 55% 9%)" : "hsl(0 0% 100%)", border: `1px solid ${isDark ? "hsl(214 30% 22%)" : "hsl(210 35% 82%)"}`, borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
                    <p style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 700, color: overlayText, marginBottom: 2 }}>{r.region.name}</p>
                    <p style={{ fontSize: 11, color: overlaySub, marginBottom: 8 }}>{r.region.state}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                      {[["Risk", `${r.riskLabel} · ${fmt.score(r.riskScore)}`, color], ["People", fmt.pop(r.population * 1000), undefined], ["Economic", fmt.usd(r.economic), undefined], ["Area", `${fmt.km2(r.areaKm2)} km²`, undefined]].map(([label, value, col]) => (
                        <div key={label as string}>
                          <p style={{ fontSize: 9, color: overlaySub, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: (col as string) ?? overlayText }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${isDark ? "hsl(214 30% 20%)" : "hsl(210 35% 88%)"}`, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "hsl(var(--primary))" }}>
                      Click to focus
                    </p>
                  </div>
                </Tooltip>
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>

      {/* ── Dark Mode Sci-Fi Overlays (Pointer Events None) ── */}
      <div 
        className="absolute inset-0 z-[399] pointer-events-none transition-opacity duration-500"
        style={{ opacity: isDark ? 1 : 0 }}
      >
        {/* Darkening layer to replace TileLayer opacity changes */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 mix-blend-screen opacity-60">
          <div className="absolute inset-0 bg-ocean-fog" />
          <div className="absolute inset-0 bg-contour-lines opacity-40" />
        </div>
        {/* Subtle radial vignette to blend the map edges into the dark theme */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(214_60%_6%_/_0.8)_100%)]" />
      </div>

      {/* ── Legend — bottom-left to avoid zoom controls ── */}
      <div className="pointer-events-none absolute bottom-14 left-3 z-[400] hidden md:block lg:bottom-16 lg:left-4">
        <div
          className="pointer-events-auto rounded-2xl p-3.5 lg:p-4"
          style={{ background: overlayBg, border: `1px solid ${overlayBorder}`, backdropFilter: "blur(16px)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2.5" style={{ color: "hsl(var(--primary))" }}>Risk Legend</p>
          <div className="space-y-1.5 text-xs">
            {[{ color: "hsl(158,85%,42%)", label: "Low · 0–30" }, { color: "hsl(38,100%,55%)", label: "Moderate · 30–70" }, { color: "hsl(4,90%,60%)", label: "High · 70–100" }].map((d) => (
              <div key={d.label} className="flex items-center gap-2.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                <span style={{ color: overlaySub }}>{d.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2.5 border-t pt-2 text-[10px]" style={{ borderColor: isDark ? "rgba(255,255,255,0.07)" : "hsl(210 35% 84%)", color: overlaySub }}>
            Halo size ∝ risk score
          </p>
        </div>
      </div>

      {/* ── Now viewing card — top-right ── */}
      <div className="pointer-events-none absolute right-3 top-3 z-[400] hidden max-w-[260px] md:block lg:right-4 lg:top-4 lg:max-w-xs">
        <div
          className="pointer-events-auto rounded-2xl p-5"
          style={{ background: overlayBg, border: `1px solid hsl(var(--primary)/0.22)`, backdropFilter: "blur(16px)", boxShadow: "0 8px 30px rgba(0,0,0,0.2), 0 0 0 1px hsl(var(--primary)/0.06)" }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: "hsl(var(--primary))" }}>Now viewing</p>
          <p className="font-display text-lg font-bold" style={{ color: overlayText }}>{active.region.name}</p>
          <p className="text-xs mb-3" style={{ color: overlaySub }}>{active.region.state}</p>
          <p className="text-xs leading-relaxed line-clamp-3 mb-4" style={{ color: overlaySub }}>{active.region.highlight}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Risk",     value: `${fmt.score(active.riskScore)} · ${active.riskLabel}`, color: RISK_COLOR(active.riskLabel) },
              { label: "People",   value: fmt.pop(active.population * 1000),   color: undefined },
              { label: "Area",     value: `${fmt.km2(active.areaKm2)} km²`,    color: undefined },
              { label: "USD loss", value: fmt.usd(active.economic),             color: undefined },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl px-2.5 py-2" style={{ background: statBg, border: `1px solid ${statBorder}` }}>
                <p className="text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: overlaySub }}>{label}</p>
                <p className="font-mono-num text-sm font-semibold" style={{ color: color ?? overlayText }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile strip ── */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[400] md:hidden">
        <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3" style={{ background: overlayBg, border: `1px solid hsl(var(--primary)/0.18)`, backdropFilter: "blur(16px)" }}>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-0.5" style={{ color: "hsl(var(--primary))" }}>Viewing</p>
            <p className="font-display truncate text-sm font-bold" style={{ color: overlayText }}>{active.region.name}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white" style={{ background: RISK_COLOR(active.riskLabel), boxShadow: `0 0 12px ${RISK_COLOR(active.riskLabel)}66` }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            {active.riskLabel} · {fmt.score(active.riskScore)}
          </div>
        </div>
      </div>
    </div>
  );
};