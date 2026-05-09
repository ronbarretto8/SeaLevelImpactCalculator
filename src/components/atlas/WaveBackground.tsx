import { memo } from "react";

interface WaveBackgroundProps {
  variant?: "hero" | "section" | "footer";
  className?: string;
  isDark?: boolean;
}

/**
 * Elegant, layered SVG ocean waves.
 * Designed for a premium night‑ocean aesthetic.
 */
export const WaveBackground = memo(({ variant = "hero", className = "", isDark = true }: WaveBackgroundProps) => {
  // Global opacity – subtle and darker in dark mode
  const opacity = isDark
    ? variant === "hero"
      ? 0.22
      : 0.16
    : variant === "hero"
      ? 1
      : 0.6;

  // Near‑black palette – exact values requested by the user
  const darkColors = {
    sky: "#020617",
    back: "#031525",
    azure: "#06243d",
    mid: "#0b3b63",
    front: "#0f5d8c",
    navy: "#38bdf8",
  };

  const idSuffix = `${variant}-${isDark ? "dark" : "light"}`;
  // Container height per variant
  const containerHeight =
    variant === "footer"
      ? "h-[180px]"
      : variant === "hero"
      ? "h-[120px]"
      : "h-[80px]";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Fade overlay – blends waves into background */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-transparent z-10 pointer-events-none opacity-80" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-transparent to-transparent z-10 pointer-events-none opacity-50" />
      )}

      {/* Subtle atmospheric cyan glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          filter: "blur(12px)",
          boxShadow: "0 0 40px rgba(56,189,248,0.08)",
        }}
      />

      <div className={`relative ${containerHeight} w-full`}> 
        {/* Layer 1 – deepest back */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave"
          style={{
            height: "60px",
            animationDuration: "34s",
            animationTimingFunction: "linear",
            mixBlendMode: "multiply",
            filter: "brightness(0.55) saturate(0.55)",
          }}
          viewBox="0 0 2880 160"
          preserveAspectRatio="none"
        >
          {isDark ? (
            <path fill={darkColors.sky} fillOpacity="0.08" d="M0,60 C200,30 400,90 600,60 C800,30 1000,90 1200,60 C1400,30 1600,90 1800,60 C2000,30 2200,90 2400,60 C2600,30 2800,90 2880,60 L2880,160 L0,160 Z" />
          ) : (
            <defs>
              <linearGradient id={`wv-sky-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(215,20%,90%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(215,25%,85%)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          )}
        </svg>

        {/* Layer 2 – mid back */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave"
          style={{
            height: "50px",
            animationDuration: "26s",
            animationTimingFunction: "linear",
            mixBlendMode: "multiply",
            filter: "brightness(0.55) saturate(0.55)",
          }}
          viewBox="0 0 2880 140"
          preserveAspectRatio="none"
        >
          {isDark ? (
            <path fill={darkColors.back} fillOpacity="0.12" d="M0,50 C240,20 480,80 720,50 C960,20 1200,80 1440,50 C1680,20 1920,80 2160,50 C2400,20 2640,80 2880,50 L2880,140 L0,140 Z" />
          ) : (
            <defs>
              <linearGradient id={`wv-back-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(215,25%,85%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(215,30%,80%)" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          )}
        </svg>

        {/* Layer 3 – azure */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave"
          style={{
            height: "40px",
            animationDuration: "22s",
            animationTimingFunction: "linear",
            mixBlendMode: "multiply",
            filter: "brightness(0.55) saturate(0.55)",
          }}
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
        >
          {isDark ? (
            <path fill={darkColors.azure} fillOpacity="0.16" d="M0,40 C220,15 440,65 660,40 C880,15 1100,65 1320,40 C1540,15 1760,65 1980,40 C2200,15 2420,65 2640,40 C2750,30 2880,50 2880,50 L2880,120 L0,120 Z" />
          ) : (
            <defs>
              <linearGradient id={`wv-azure-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(215,30%,80%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(215,35%,75%)" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          )}
        </svg>

        {/* Layer 4 – ocean blue (reverse) */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave-rev"
          style={{
            height: "36px",
            animationDuration: "18s",
            animationTimingFunction: "linear",
            mixBlendMode: "multiply",
            filter: "brightness(0.55) saturate(0.55)",
          }}
          viewBox="0 0 2880 110"
          preserveAspectRatio="none"
        >
          {isDark ? (
            <path fill={darkColors.mid} fillOpacity="0.22" d="M0,36 C300,18 600,54 900,36 C1200,18 1500,54 1800,36 C2100,18 2400,54 2700,36 C2790,30 2880,42 2880,42 L2880,110 L0,110 Z" />
          ) : (
            <defs>
              <linearGradient id={`wv-mid-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(215,35%,75%)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(215,40%,70%)" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          )}
        </svg>

        {/* Layer 5 – front deep */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave"
          style={{
            height: "32px",
            animationDuration: "30s",
            animationTimingFunction: "linear",
            mixBlendMode: "multiply",
            filter: "brightness(0.55) saturate(0.55)",
          }}
          viewBox="0 0 2880 96"
          preserveAspectRatio="none"
        >
          {isDark ? (
            <path fill={darkColors.front} fillOpacity="0.30" d="M0,32 C240,12 480,52 720,32 C960,12 1200,52 1440,32 C1680,12 1920,52 2160,32 C2400,12 2640,52 2880,32 L2880,96 L0,96 Z" />
          ) : (
            <defs>
              <linearGradient id={`wv-front-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(215,40%,70%)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(215,45%,65%)" stopOpacity="1" />
              </linearGradient>
            </defs>
          )}
        </svg>

        {/* Layer 6 – tiny crest (reverse) */}
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave-rev"
          style={{
            height: "24px",
            animationDuration: "40s",
            animationTimingFunction: "linear",
            mixBlendMode: "multiply",
            filter: "brightness(0.55) saturate(0.55)",
          }}
          viewBox="0 0 2880 64"
          preserveAspectRatio="none"
        >
          {isDark ? (
            <path fill={darkColors.navy} fillOpacity="0.40" d="M0,24 C180,9 360,39 540,24 C720,9 900,39 1080,24 C1260,9 1440,39 1620,24 C1800,9 1980,39 2160,24 C2340,9 2520,39 2700,24 C2790,18 2880,31 2880,31 L2880,64 L0,64 Z" />
          ) : (
            <defs>
              <linearGradient id={`wv-navy-${idSuffix}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(215,45%,65%)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="hsl(215,50%,60%)" stopOpacity="1" />
              </linearGradient>
            </defs>
          )}
        </svg>
      </div>
    </div>
  );
});

WaveBackground.displayName = "WaveBackground";
