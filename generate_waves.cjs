const fs = require('fs');
const path = require('path');

const NUM_LAYERS = 25;

// Interpolate function
const lerp = (start, end, t) => start + (end - start) * t;

// Generate Paths
let pathsCode = `const WAVE_PATHS = {\n`;
const paths = [];

for (let i = 0; i < NUM_LAYERS; i++) {
  const t = i / (NUM_LAYERS - 1);
  const period = Math.round(lerp(2880, 720, t)); // from 2880 to 720
  // ensure period is divisible by 3 for clean control points
  const p = Math.round(period / 3) * 3;
  const w = p * 2;
  const y = Math.round(lerp(120, 50, t));
  const a = Math.round(lerp(100, 35, t)); // Increased amplitude for more defined shape
  const h = y * 2;
  
  const p3 = p / 3;
  
  const pathString = `M0,${y} C${p3},${y-a} ${2*p3},${y+a} ${p},${y} C${p + p3},${y-a} ${p + 2*p3},${y+a} ${w},${y} L${w},${h} L0,${h} Z`;
  paths.push(`  layer${i+1}: "${pathString}"`);
}
pathsCode += paths.join(',\n');
pathsCode += `\n};\n`;

// Generate DARK_LAYERS
const parseHex = (hex) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return {r, g, b};
}
const toHex = (c) => {
  let hex = Math.round(c).toString(16);
  if (hex.length < 2) hex = '0' + hex;
  return hex;
}

const colorStart = parseHex('#010205'); // deeper black
const colorEnd = parseHex('#0c4c69');

let darkLayersCode = `const DARK_LAYERS = [\n`;
for (let i = 0; i < NUM_LAYERS; i++) {
  const t = i / (NUM_LAYERS - 1);
  const r = lerp(colorStart.r, colorEnd.r, t);
  const g = lerp(colorStart.g, colorEnd.g, t);
  const b = lerp(colorStart.b, colorEnd.b, t);
  const fill = i === NUM_LAYERS - 1 ? `"url(#crest-gradient)"` : `"#${toHex(r)}${toHex(g)}${toHex(b)}"`;
  
  const period = Math.round(lerp(2880, 720, t));
  const p = Math.round(period / 3) * 3;
  const w = p * 2;
  const y = Math.round(lerp(120, 45, t));
  const h = y * 2;
  
  const height = Math.round(lerp(190, 60, t));
  const duration = Math.round(lerp(60, 10, t));
  const reverse = i % 2 !== 0;
  const blur = Math.max(0, Math.round(lerp(12, 0, t)));
  const opacity = lerp(0.08, 0.75, t).toFixed(2);
  const verticalOffset = Math.round(lerp(0, 50, t));
  const fillOpacity = i === NUM_LAYERS - 1 ? 0.9 : 1;
  const stroke = i === NUM_LAYERS - 1 ? `"#38bdf8"` : `"transparent"`;
  const strokeWidth = i === NUM_LAYERS - 1 ? 1.5 : 0;
  const strokeOpacity = i === NUM_LAYERS - 1 ? 0.8 : 0;
  
  darkLayersCode += `  { path: WAVE_PATHS.layer${i+1}, viewBox: "0 0 ${w} ${h}", fill: ${fill}, fillOpacity: ${fillOpacity}, height: ${height}, duration: ${duration}, reverse: ${reverse}, blur: ${blur}, opacity: ${opacity}, verticalOffset: ${verticalOffset}, stroke: ${stroke}, strokeWidth: ${strokeWidth}, strokeOpacity: ${strokeOpacity} },\n`;
}
darkLayersCode += `];\n`;

// Generate LIGHT_LAYERS
let lightLayersCode = `const LIGHT_LAYERS = [\n`;
for (let i = 0; i < NUM_LAYERS; i++) {
  const t = i / (NUM_LAYERS - 1);
  
  // More visible variation for light mode depth
  const h_val = Math.round(lerp(215, 195, t)); // cooler to slightly cyan
  const s_val = Math.round(lerp(40, 80, t)); // increase saturation towards front
  const l_val = Math.round(lerp(95, 45, t)); // very bright back to deep blue front
  
  // Opacities must be very low since 25 layers compound quickly.
  // Add an alternating bump to opacity to separate layers visually.
  let opacity = lerp(0.02, 0.40, t);
  if (i % 2 === 0) opacity += 0.04; // slight striping effect for clarity
  opacity = opacity.toFixed(2);
  
  const fill = i === NUM_LAYERS - 1 ? `"url(#crest-gradient)"` : `"hsl(${h_val} ${s_val}% ${l_val}%)"`;
  const stroke = `"hsl(${h_val} ${s_val}% ${Math.max(20, l_val - 25)}%)"`;
  const strokeWidth = 1.5;
  const strokeOpacity = 0.5;
  
  lightLayersCode += `  { ...DARK_LAYERS[${i}], fill: ${fill}, opacity: ${opacity}, stroke: ${stroke}, strokeWidth: ${strokeWidth}, strokeOpacity: ${strokeOpacity} },\n`;
}
lightLayersCode += `];\n`;


const fileContent = `import { memo } from "react";

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
//   • ${NUM_LAYERS} depth layers: massive immersive overlap
//   • GPU-accelerated translateX animation only (no repaints)
//   • Gradient-mask fade so waves bleed seamlessly into page bg
//   • Deep futuristic ocean palette: #020617 → #38bdf8
// ─────────────────────────────────────────────────────────────────

/** Smooth sinusoidal SVG wave paths (2 periods for seamless looping) */
${pathsCode}

/** ${NUM_LAYERS} Layers ordered back (deepest) → front */
${darkLayersCode}

/** Light-mode layers — cooler steel blues fading upward */
${lightLayersCode}

export const WaveBackground = memo(
  ({ variant = "hero", className = "", isDark = true, style }: WaveBackgroundProps) => {
    const layers = isDark ? DARK_LAYERS : LIGHT_LAYERS;

    // Container heights increased to accommodate ${NUM_LAYERS} massive layers
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
        className={\`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden \${className}\`}
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

        {/* ${NUM_LAYERS} depth layers */}
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
                filter: layer.blur > 0 ? \`blur(\${layer.blur}px)\` : undefined,
                willChange: "transform",
                zIndex: i + 1,
                transition: "opacity 0.5s ease",
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: \`\${svgWidthMultiple * 100}%\`,
                  height: layer.height,
                  animation: \`\${animName} \${layer.duration}s linear infinite\`,
                  willChange: "transform",
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
`;

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'atlas', 'WaveBackground.tsx'), fileContent);
console.log('Successfully generated 25 layers in WaveBackground.tsx');
