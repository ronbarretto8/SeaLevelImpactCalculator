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


/** 7 Entangled Layers ordered back (deepest) → front */
const DARK_LAYERS = [
  // Deepest background wave (slow, long, anchors the base)
  { path: WAVE_PATHS.layer1, viewBox: "0 0 5760 240", fill: "hsl(202, 60%, 18%)", fillOpacity: 0.8, height: 170, duration: 35, reverse: false, blur: 0, opacity: 1, verticalOffset: 0, stroke: "none", strokeWidth: 0, strokeOpacity: 0 },
  // Second wave (moves opposite, tall, slightly transparent to show intersections)
  { path: WAVE_PATHS.layer5, viewBox: "0 0 5040 216", fill: "hsl(202, 65%, 22%)", fillOpacity: 0.75, height: 155, duration: 28, reverse: true, blur: 0, opacity: 1, verticalOffset: 5, stroke: "none", strokeWidth: 0, strokeOpacity: 0 },
  // Third wave (moves forward, shorter wavelength, high overlap)
  { path: WAVE_PATHS.layer12, viewBox: "0 0 3780 172", fill: "hsl(202, 70%, 26%)", fillOpacity: 0.75, height: 165, duration: 22, reverse: false, blur: 0, opacity: 1, verticalOffset: -10, stroke: "none", strokeWidth: 0, strokeOpacity: 0 },
  // Fourth wave (moves opposite, medium height, creates criss-cross)
  { path: WAVE_PATHS.layer17, viewBox: "0 0 2880 140", fill: "hsl(202, 75%, 30%)", fillOpacity: 0.75, height: 140, duration: 18, reverse: true, blur: 0, opacity: 1, verticalOffset: 15, stroke: "none", strokeWidth: 0, strokeOpacity: 0 },
  // Fifth wave (moves forward, quite tall but fast)
  { path: WAVE_PATHS.layer22, viewBox: "0 0 1980 108", fill: "hsl(202, 80%, 35%)", fillOpacity: 0.75, height: 170, duration: 14, reverse: false, blur: 0, opacity: 1, verticalOffset: 0, stroke: "none", strokeWidth: 0, strokeOpacity: 0 },
  // Sixth wave (deep rich oceanic blue)
  { path: WAVE_PATHS.layer25, viewBox: "0 0 1440 90", fill: "hsl(202, 85%, 40%)", fillOpacity: 0.8, height: 160, duration: 10, reverse: true, blur: 0, opacity: 1, verticalOffset: 10, stroke: "rgba(17,82,120,0.5)", strokeWidth: 1, strokeOpacity: 1 },
  // Seventh wave (Front-most solid rich navy to complete the look)
  { path: WAVE_PATHS.layer8, viewBox: "0 0 4500 196", fill: "hsl(205, 90%, 10%)", fillOpacity: 0.95, height: 130, duration: 8, reverse: false, blur: 0, opacity: 1, verticalOffset: -10, stroke: "none", strokeWidth: 0, strokeOpacity: 0 },
];

/** Light-mode layers — cooler steel blues with reduced opacity to emphasize entanglement */
const LIGHT_LAYERS = [
  { ...DARK_LAYERS[0], fill: "hsl(210 45% 88%)", fillOpacity: 0.6, stroke: "none", strokeWidth: 0 },
  { ...DARK_LAYERS[1], fill: "hsl(208 50% 82%)", fillOpacity: 0.5, stroke: "none", strokeWidth: 0 },
  { ...DARK_LAYERS[2], fill: "hsl(206 55% 75%)", fillOpacity: 0.6, stroke: "none", strokeWidth: 0 },
  { ...DARK_LAYERS[3], fill: "hsl(204 60% 68%)", fillOpacity: 0.5, stroke: "none", strokeWidth: 0 },
  { ...DARK_LAYERS[4], fill: "hsl(202 65% 60%)", fillOpacity: 0.65, stroke: "none", strokeWidth: 0 },
  { ...DARK_LAYERS[5], fill: "url(#crest-gradient)", fillOpacity: 0.8, stroke: "hsl(200 70% 50%)", strokeWidth: 1, strokeOpacity: 0.4 },
  { ...DARK_LAYERS[6], fill: "hsl(200 65% 45%)", fillOpacity: 0.95, stroke: "none", strokeWidth: 0 },
];


export const WaveBackground = memo(
  ({ variant = "hero", className = "", isDark = true, style }: WaveBackgroundProps) => {
    const layers = isDark ? DARK_LAYERS : LIGHT_LAYERS;

    // Container heights adjusted for 6 distinct layers
    const containerH =
      variant === "footer" ? 300
      : variant === "hero"  ? 240
      :                       200; // section

    // Soft elegant ambient light — strictly limit to dark mode (hero/footer) to prevent the "grey block" overlay haze
    const showGlow = isDark && variant !== "section";

    // gradient-mask: waves dissolve up into the page background
    const maskGradient =
      variant === "footer"
        ? "linear-gradient(to top, black 80%, transparent 100%)"
        : "linear-gradient(to top, black 70%, transparent 100%)";

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
              <stop offset="0%" stopColor={isDark ? "#0ea5e9" : "#3b82f6"} stopOpacity={isDark ? 0.9 : 0.8} style={{ transition: "all 0.5s ease" }} />
              <stop offset="100%" stopColor={isDark ? "#082f49" : "#93c5fd"} stopOpacity={isDark ? 0.4 : 0.6} style={{ transition: "all 0.5s ease" }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Soft elegant ambient light — subtle cinematic bloom */}
        {showGlow && (
          <div
            className="absolute inset-x-0 bottom-0 z-0 transition-all duration-500 ease-in-out"
            style={{
              height: "100%",
              background: isDark
                ? "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(14,165,233,0.15) 0%, transparent 80%)"
                : "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 80%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* 6 Distinct Depth Layers */}
        {layers.map((layer, i) => {
          const animName = layer.reverse ? "wave-flow-rev-cin" : "wave-flow-cin";
          // SVG width is 2× the viewBox horizontal so it can slide -50% seamlessly
          const svgWidthMultiple = 2;

          return (
            <div
              key={i}
              className={`absolute inset-x-0 bottom-0`}
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
