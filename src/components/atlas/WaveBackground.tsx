import { memo } from "react";

interface WaveBackgroundProps {
  variant?: "hero" | "section" | "footer";
  className?: string;
  isDark?: boolean;
}

/**
 * Layered animated SVG ocean waves — adaptive palette.
 * Calibrated for ultra-dark atmospheric 'Deep Ocean' aesthetic in Dark Mode.
 */
export const WaveBackground = memo(({ variant = "hero", className = "", isDark = true }: WaveBackgroundProps) => {
  // Global opacity reduction for dark mode
  const opacity = isDark
    ? variant === "hero"
      ? 0.22
      : 0.16
    : variant === "hero"
      ? 1
      : 0.6;
  
  // EXACT PALETTE REQUESTED - Near black
  const darkColors = {
    sky: "#000000",
    back: "#010409",
    azure: "#020812",
    mid: "#03111C",
    front: "#041726",
    navy: "#000000"
  };

  const idSuffix = `${variant}-${isDark ? "dark" : "light"}`;
  const waveHeight = variant === "footer" ? "h-[160px]" : "h-[400px]";

  // The critical filter and blend mode for dark mode
  const darkStyle = isDark ? { mixBlendMode: "multiply" as const, filter: "brightness(0.5) saturate(0.45)" } : {};

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Top Fade Overlay for Dark Mode - Blends waves into background */}
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-transparent z-10 pointer-events-none" />
      )}

      <div className={`relative ${waveHeight} w-full`}>
        
        {/* Layer 1 — deepest back */}
        <svg 
          className="absolute bottom-0 left-0 h-[100%] w-[200%] animate-wave-slow" 
          viewBox="0 0 2880 320" 
          preserveAspectRatio="none"
          style={darkStyle}
        >
          {isDark ? (
            <path fill={darkColors.sky} fillOpacity="0.08" d="M0,170 C200,110 400,230 600,170 C800,110 1000,230 1200,170 C1400,110 1600,230 1800,170 C2000,110 2200,230 2400,170 C2600,110 2800,230 2880,170 L2880,320 L0,320 Z" />
          ) : (
            <>
              <defs>
                <linearGradient id={`wv-sky-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(205, 50%, 85%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(210, 60%, 75%)" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path fill={`url(#wv-sky-${idSuffix})`} d="M0,170 C200,110 400,230 600,170 C800,110 1000,230 1200,170 C1400,110 1600,230 1800,170 C2000,110 2200,230 2400,170 C2600,110 2800,230 2880,170 L2880,320 L0,320 Z" />
            </>
          )}
        </svg>

        {/* Layer 2 — mid-back */}
        <svg 
          className="absolute bottom-0 left-0 h-[85%] w-[200%] animate-wave-slow" 
          viewBox="0 0 2880 280" 
          preserveAspectRatio="none"
          style={darkStyle}
        >
          {isDark ? (
            <path fill={darkColors.back} fillOpacity="0.12" d="M0,140 C240,80 480,200 720,140 C960,80 1200,200 1440,140 C1680,80 1920,200 2160,140 C2400,80 2640,200 2880,140 L2880,280 L0,280 Z" />
          ) : (
            <>
              <defs>
                <linearGradient id={`wv-back-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(205, 60%, 80%)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="hsl(210, 65%, 70%)" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path fill={`url(#wv-back-${idSuffix})`} d="M0,140 C240,80 480,200 720,140 C960,80 1200,200 1440,140 C1680,80 1920,200 2160,140 C2400,80 2640,200 2880,140 L2880,280 L0,280 Z" />
            </>
          )}
        </svg>

        {/* Layer 3 — azure mid */}
        <svg 
          className="absolute bottom-0 left-0 h-[70%] w-[200%] animate-wave" 
          viewBox="0 0 2880 240" 
          preserveAspectRatio="none"
          style={darkStyle}
        >
          {isDark ? (
            <path fill={darkColors.azure} fillOpacity="0.16" d="M0,130 C220,70 440,190 660,130 C880,70 1100,190 1320,130 C1540,70 1760,190 1980,130 C2200,70 2420,190 2640,130 C2750,110 2880,150 2880,150 L2880,240 L0,240 Z" />
          ) : (
            <>
              <defs>
                <linearGradient id={`wv-azure-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(200, 70%, 75%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(205, 75%, 65%)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path fill={`url(#wv-azure-${idSuffix})`} d="M0,130 C220,70 440,190 660,130 C880,70 1100,190 1320,130 C1540,70 1760,190 1980,130 C2200,70 2420,190 2640,130 C2750,110 2880,150 2880,150 L2880,240 L0,240 Z" />
            </>
          )}
        </svg>

        {/* Layer 4 — ocean blue */}
        <svg 
          className="absolute bottom-0 left-0 h-[55%] w-[200%] animate-wave-rev" 
          viewBox="0 0 2880 200" 
          preserveAspectRatio="none"
          style={darkStyle}
        >
          {isDark ? (
            <path fill={darkColors.mid} fillOpacity="0.22" d="M0,120 C300,60 600,180 900,120 C1200,60 1500,180 1800,120 C2100,60 2400,180 2700,120 C2790,100 2880,140 2880,140 L2880,200 L0,200 Z" />
          ) : (
            <>
              <defs>
                <linearGradient id={`wv-mid-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(205, 70%, 70%)" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="hsl(210, 75%, 60%)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path fill={`url(#wv-mid-${idSuffix})`} d="M0,120 C300,60 600,180 900,120 C1200,60 1500,180 1800,120 C2100,60 2400,180 2700,120 C2790,100 2880,140 2880,140 L2880,200 L0,200 Z" />
            </>
          )}
        </svg>

        {/* Layer 5 — deepest front */}
        <svg 
          className="absolute bottom-0 left-0 h-[40%] w-[200%] animate-wave" 
          viewBox="0 0 2880 150" 
          preserveAspectRatio="none"
          style={darkStyle}
        >
          {isDark ? (
            <path fill={darkColors.front} fillOpacity="0.30" d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 C1680,40 1920,140 2160,90 C2400,40 2640,140 2880,90 L2880,150 L0,150 Z" />
          ) : (
            <>
              <defs>
                <linearGradient id={`wv-front-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210, 65%, 65%)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="hsl(214, 70%, 55%)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path fill={`url(#wv-front-${idSuffix})`} d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 C1680,40 1920,140 2160,90 C2400,40 2640,140 2880,90 L2880,150 L0,150 Z" />
            </>
          )}
        </svg>

        {/* Layer 6 — tiny crest wave */}
        <svg 
          className="absolute bottom-0 left-0 h-[20%] w-[200%] animate-wave-rev" 
          viewBox="0 0 2880 80" 
          preserveAspectRatio="none"
          style={darkStyle}
        >
          {isDark ? (
            <path fill={darkColors.navy} fillOpacity="0.40" d="M0,40 C180,15 360,65 540,40 C720,15 900,65 1080,40 C1260,15 1440,65 1620,40 C1800,15 1980,65 2160,40 C2340,15 2520,65 2700,40 C2790,28 2880,52 2880,52 L2880,80 L0,80 Z" />
          ) : (
            <>
              <defs>
                <linearGradient id={`wv-navy-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(214, 70%, 60%)" stopOpacity="0.98" />
                  <stop offset="100%" stopColor="hsl(216, 75%, 50%)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path fill={`url(#wv-navy-${idSuffix})`} d="M0,40 C180,15 360,65 540,40 C720,15 900,65 1080,40 C1260,15 1440,65 1620,40 C1800,15 1980,65 2160,40 C2340,15 2520,65 2700,40 C2790,28 2880,52 2880,52 L2880,80 L0,80 Z" />
            </>
          )}
        </svg>

      </div>
    </div>
  );
});

WaveBackground.displayName = "WaveBackground";