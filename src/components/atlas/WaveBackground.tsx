import { memo } from "react";

interface WaveBackgroundProps {
  variant?: "hero" | "section" | "footer";
  className?: string;
  isDark?: boolean;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────────────────────────
// Cinematic layered SVG ocean wave system
// Design goals:
//   • Long, low-amplitude sinusoidal bands — elegant, noticeable presence
//   • 25 depth layers: massive immersive overlap
//   • GPU-accelerated translateX animation only (no repaints)
//   • Gradient-mask fade so waves bleed seamlessly into page bg
//   • Deep futuristic ocean palette: #020617 → #38bdf8
// ─────────────────────────────────────────────────────────────────

/** Smooth sinusoidal SVG wave paths (2 periods for seamless looping) */
const WAVE_PATHS = {
  layer1: "M0,120 C960,20 1920,220 2880,120 C3840,20 4800,220 5760,120 L5760,240 L0,240 Z",
  layer2: "M0,117 C930,20 1860,214 2790,117 C3720,20 4650,214 5580,117 L5580,234 L0,234 Z",
  layer3: "M0,114 C900,19 1800,209 2700,114 C3600,19 4500,209 5400,114 L5400,228 L0,228 Z",
  layer4: "M0,111 C870,19 1740,203 2610,111 C3480,19 4350,203 5220,111 L5220,222 L0,222 Z",
  layer5: "M0,108 C840,19 1680,197 2520,108 C3360,19 4200,197 5040,108 L5040,216 L0,216 Z",
  layer6: "M0,105 C810,19 1620,191 2430,105 C3240,19 4050,191 4860,105 L4860,210 L0,210 Z",
  layer7: "M0,103 C780,19 1560,187 2340,103 C3120,19 3900,187 4680,103 L4680,206 L0,206 Z",
  layer8: "M0,100 C750,19 1500,181 2250,100 C3000,19 3750,181 4500,100 L4500,200 L0,200 Z",
  layer9: "M0,97 C720,19 1440,175 2160,97 C2880,19 3600,175 4320,97 L4320,194 L0,194 Z",
  layer10: "M0,94 C690,18 1380,170 2070,94 C2760,18 3450,170 4140,94 L4140,188 L0,188 Z",
  layer11: "M0,91 C660,18 1320,164 1980,91 C2640,18 3300,164 3960,91 L3960,182 L0,182 Z",
  layer12: "M0,88 C630,18 1260,158 1890,88 C2520,18 3150,158 3780,88 L3780,176 L0,176 Z",
  layer13: "M0,85 C600,17 1200,153 1800,85 C2400,17 3000,153 3600,85 L3600,170 L0,170 Z",
  layer14: "M0,82 C570,17 1140,147 1710,82 C2280,17 2850,147 3420,82 L3420,164 L0,164 Z",
  layer15: "M0,79 C540,17 1080,141 1620,79 C2160,17 2700,141 3240,79 L3240,158 L0,158 Z",
  layer16: "M0,76 C510,17 1020,135 1530,76 C2040,17 2550,135 3060,76 L3060,152 L0,152 Z",
  layer17: "M0,73 C480,16 960,130 1440,73 C1920,16 2400,130 2880,73 L2880,146 L0,146 Z",
  layer18: "M0,70 C450,16 900,124 1350,70 C1800,16 2250,124 2700,70 L2700,140 L0,140 Z",
  layer19: "M0,68 C420,17 840,119 1260,68 C1680,17 2100,119 2520,68 L2520,136 L0,136 Z",
  layer20: "M0,65 C390,16 780,114 1170,65 C1560,16 1950,114 2340,65 L2340,130 L0,130 Z",
  layer21: "M0,62 C360,16 720,108 1080,62 C1440,16 1800,108 2160,62 L2160,124 L0,124 Z",
  layer22: "M0,59 C330,16 660,102 990,59 C1320,16 1650,102 1980,59 L1980,118 L0,118 Z",
  layer23: "M0,56 C300,16 600,96 900,56 C1200,16 1500,96 1800,56 L1800,112 L0,112 Z",
  layer24: "M0,53 C270,15 540,91 810,53 C1080,15 1350,91 1620,53 L1620,106 L0,106 Z",
  layer25: "M0,50 C240,15 480,85 720,50 C960,15 1200,85 1440,50 L1440,100 L0,100 Z"
};


/** 25 Layers ordered back (deepest) → front */
const DARK_LAYERS = [
  { path: WAVE_PATHS.layer1, viewBox: "0 0 5760 240", fill: "#010205", fillOpacity: 1, height: 190, duration: 60, reverse: false, blur: 12, opacity: 0.08, verticalOffset: 0, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer2, viewBox: "0 0 5580 234", fill: "#010509", fillOpacity: 1, height: 185, duration: 58, reverse: true, blur: 12, opacity: 0.11, verticalOffset: 2, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer3, viewBox: "0 0 5400 228", fill: "#02080d", fillOpacity: 1, height: 179, duration: 56, reverse: false, blur: 11, opacity: 0.14, verticalOffset: 4, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer4, viewBox: "0 0 5220 222", fill: "#020b12", fillOpacity: 1, height: 174, duration: 54, reverse: true, blur: 11, opacity: 0.16, verticalOffset: 6, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer5, viewBox: "0 0 5040 216", fill: "#030e16", fillOpacity: 1, height: 168, duration: 52, reverse: false, blur: 10, opacity: 0.19, verticalOffset: 8, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer6, viewBox: "0 0 4860 208", fill: "#03111a", fillOpacity: 1, height: 163, duration: 50, reverse: true, blur: 10, opacity: 0.22, verticalOffset: 10, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer7, viewBox: "0 0 4680 202", fill: "#04151e", fillOpacity: 1, height: 158, duration: 48, reverse: false, blur: 9, opacity: 0.25, verticalOffset: 13, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer8, viewBox: "0 0 4500 196", fill: "#041822", fillOpacity: 1, height: 152, duration: 45, reverse: true, blur: 9, opacity: 0.28, verticalOffset: 15, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer9, viewBox: "0 0 4320 190", fill: "#051b26", fillOpacity: 1, height: 147, duration: 43, reverse: false, blur: 8, opacity: 0.30, verticalOffset: 17, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer10, viewBox: "0 0 4140 184", fill: "#051e2b", fillOpacity: 1, height: 141, duration: 41, reverse: true, blur: 8, opacity: 0.33, verticalOffset: 19, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer11, viewBox: "0 0 3960 178", fill: "#06212f", fillOpacity: 1, height: 136, duration: 39, reverse: false, blur: 7, opacity: 0.36, verticalOffset: 21, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer12, viewBox: "0 0 3780 172", fill: "#062433", fillOpacity: 1, height: 130, duration: 37, reverse: true, blur: 7, opacity: 0.39, verticalOffset: 23, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer13, viewBox: "0 0 3600 166", fill: "#072737", fillOpacity: 1, height: 125, duration: 35, reverse: false, blur: 6, opacity: 0.42, verticalOffset: 25, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer14, viewBox: "0 0 3420 158", fill: "#072a3b", fillOpacity: 1, height: 120, duration: 33, reverse: true, blur: 6, opacity: 0.44, verticalOffset: 27, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer15, viewBox: "0 0 3240 152", fill: "#072d3f", fillOpacity: 1, height: 114, duration: 31, reverse: false, blur: 5, opacity: 0.47, verticalOffset: 29, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer16, viewBox: "0 0 3060 146", fill: "#083044", fillOpacity: 1, height: 109, duration: 29, reverse: true, blur: 5, opacity: 0.50, verticalOffset: 31, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer17, viewBox: "0 0 2880 140", fill: "#083348", fillOpacity: 1, height: 103, duration: 27, reverse: false, blur: 4, opacity: 0.53, verticalOffset: 33, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer18, viewBox: "0 0 2700 134", fill: "#09364c", fillOpacity: 1, height: 98, duration: 25, reverse: true, blur: 4, opacity: 0.55, verticalOffset: 35, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer19, viewBox: "0 0 2520 128", fill: "#093a50", fillOpacity: 1, height: 93, duration: 23, reverse: false, blur: 3, opacity: 0.58, verticalOffset: 38, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer20, viewBox: "0 0 2340 122", fill: "#0a3d54", fillOpacity: 1, height: 87, duration: 20, reverse: true, blur: 3, opacity: 0.61, verticalOffset: 40, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer21, viewBox: "0 0 2160 116", fill: "#0a4058", fillOpacity: 1, height: 82, duration: 18, reverse: false, blur: 2, opacity: 0.64, verticalOffset: 42, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer22, viewBox: "0 0 1980 108", fill: "#0b435d", fillOpacity: 1, height: 76, duration: 16, reverse: true, blur: 2, opacity: 0.67, verticalOffset: 44, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer23, viewBox: "0 0 1800 102", fill: "#0b4661", fillOpacity: 1, height: 71, duration: 14, reverse: false, blur: 1, opacity: 0.69, verticalOffset: 46, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer24, viewBox: "0 0 1620 96", fill: "#0c4965", fillOpacity: 1, height: 65, duration: 12, reverse: true, blur: 1, opacity: 0.72, verticalOffset: 48, stroke: "transparent", strokeWidth: 0, strokeOpacity: 0 },
  { path: WAVE_PATHS.layer25, viewBox: "0 0 1440 90", fill: "url(#crest-gradient)", fillOpacity: 0.9, height: 60, duration: 10, reverse: false, blur: 0, opacity: 0.75, verticalOffset: 50, stroke: "#38bdf8", strokeWidth: 1.5, strokeOpacity: 0.8 },
];


/** Light-mode layers — cooler steel blues fading upward */
const LIGHT_LAYERS = [
  { ...DARK_LAYERS[0], fill: "hsl(215 40% 95%)", opacity: 0.06, stroke: "hsl(215 40% 70%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[1], fill: "hsl(214 42% 93%)", opacity: 0.04, stroke: "hsl(214 42% 68%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[2], fill: "hsl(213 43% 91%)", opacity: 0.09, stroke: "hsl(213 43% 66%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[3], fill: "hsl(213 45% 89%)", opacity: 0.07, stroke: "hsl(213 45% 64%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[4], fill: "hsl(212 47% 87%)", opacity: 0.12, stroke: "hsl(212 47% 62%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[5], fill: "hsl(211 48% 85%)", opacity: 0.10, stroke: "hsl(211 48% 60%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[6], fill: "hsl(210 50% 83%)", opacity: 0.15, stroke: "hsl(210 50% 58%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[7], fill: "hsl(209 52% 80%)", opacity: 0.13, stroke: "hsl(209 52% 55%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[8], fill: "hsl(208 53% 78%)", opacity: 0.19, stroke: "hsl(208 53% 53%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[9], fill: "hsl(208 55% 76%)", opacity: 0.16, stroke: "hsl(208 55% 51%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[10], fill: "hsl(207 57% 74%)", opacity: 0.22, stroke: "hsl(207 57% 49%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[11], fill: "hsl(206 58% 72%)", opacity: 0.19, stroke: "hsl(206 58% 47%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[12], fill: "hsl(205 60% 70%)", opacity: 0.25, stroke: "hsl(205 60% 45%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[13], fill: "hsl(204 62% 68%)", opacity: 0.23, stroke: "hsl(204 62% 43%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[14], fill: "hsl(203 63% 66%)", opacity: 0.28, stroke: "hsl(203 63% 41%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[15], fill: "hsl(203 65% 64%)", opacity: 0.26, stroke: "hsl(203 65% 39%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[16], fill: "hsl(202 67% 62%)", opacity: 0.31, stroke: "hsl(202 67% 37%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[17], fill: "hsl(201 68% 60%)", opacity: 0.29, stroke: "hsl(201 68% 35%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[18], fill: "hsl(200 70% 58%)", opacity: 0.35, stroke: "hsl(200 70% 33%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[19], fill: "hsl(199 72% 55%)", opacity: 0.32, stroke: "hsl(199 72% 30%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[20], fill: "hsl(198 73% 53%)", opacity: 0.38, stroke: "hsl(198 73% 28%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[21], fill: "hsl(198 75% 51%)", opacity: 0.35, stroke: "hsl(198 75% 26%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[22], fill: "hsl(197 77% 49%)", opacity: 0.41, stroke: "hsl(197 77% 24%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[23], fill: "hsl(196 78% 47%)", opacity: 0.38, stroke: "hsl(196 78% 22%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
  { ...DARK_LAYERS[24], fill: "url(#crest-gradient)", opacity: 0.44, stroke: "hsl(195 80% 20%)", strokeWidth: 1.5, strokeOpacity: 0.5 },
];


export const WaveBackground = memo(
  ({ variant = "hero", className = "", isDark = true, style }: WaveBackgroundProps) => {
    const layers = isDark ? DARK_LAYERS : LIGHT_LAYERS;

    // Container heights increased to accommodate 25 massive layers
    const containerH =
      variant === "footer" ? 320
      : variant === "hero"  ? 220
      :                       160; // section

    // Ambient glow — only on dark mode, footer / hero
    const showGlow = isDark && variant !== "section";

    // gradient-mask: waves dissolve up into the page background
    const maskGradient =
      variant === "footer"
        ? "linear-gradient(to top, black 80%, transparent 100%)"
        : "linear-gradient(to top, black 65%, transparent 100%)";

    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
        style={{
          height: containerH,
          maskImage: maskGradient,
          WebkitMaskImage: maskGradient,
          ...style,
        }}
      >
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="crest-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#38bdf8" : "#0284c7"} stopOpacity="1" style={{ transition: "stop-color 0.5s ease" }} />
              <stop offset="100%" stopColor={isDark ? "#0f4c75" : "#38bdf8"} stopOpacity={isDark ? 0.1 : 0.2} style={{ transition: "stop-color 0.5s ease, stop-opacity 0.5s ease" }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient cyan glow — cinematic depth bloom */}
        {showGlow && (
          <div
            className="absolute inset-x-0 bottom-0 z-0 transition-all duration-500 ease-in-out"
            style={{
              height: "90%",
              background: isDark
                ? "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(56,189,248,0.25) 0%, transparent 80%)"
                : "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(14,116,180,0.18) 0%, transparent 80%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* 25 depth layers */}
        {layers.map((layer, i) => {
          const animName = layer.reverse ? "wave-flow-rev-cin" : "wave-flow-cin";
          // SVG width is 2× the viewBox horizontal so it can slide -50% seamlessly
          const svgWidthMultiple = 2;

          return (
            <div
              key={i}
              className="absolute inset-x-0 bottom-0"
              style={{
                height: layer.height + layer.verticalOffset,
                bottom: layer.verticalOffset,
                opacity: layer.opacity,
                zIndex: i + 1,
                transition: "opacity 0.5s ease",
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: `${svgWidthMultiple * 100}%`,
                  height: layer.height,
                  filter: layer.blur > 0 ? `blur(${layer.blur}px)` : undefined,
                  animation: `${animName} ${layer.duration}s linear infinite`,
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
                viewBox={layer.viewBox}
                preserveAspectRatio="none"
              >
                <path
                  d={layer.path}
                  fill={layer.fill}
                  fillOpacity={layer.fillOpacity}
                  stroke={layer.stroke}
                  strokeWidth={layer.strokeWidth}
                  strokeOpacity={layer.strokeOpacity}
                  style={{ transition: "fill 0.5s ease, stroke 0.5s ease, stroke-opacity 0.5s ease" }}
                />
              </svg>
            </div>
          );
        })}
      </div>
    );
  }
);

WaveBackground.displayName = "WaveBackground";
