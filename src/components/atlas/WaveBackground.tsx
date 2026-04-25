import { memo } from "react";

interface WaveBackgroundProps {
  variant?: "hero" | "section" | "footer";
  className?: string;
  isDark?: boolean;
}

/**
 * Layered animated SVG ocean waves — adaptive palette.
 */
export const WaveBackground = memo(({ variant = "hero", className = "", isDark = true }: WaveBackgroundProps) => {
  const opacity = variant === "hero" ? 1 : variant === "section" ? 0.8 : 0.9;
  
  // Adaptive color palette based on theme
  const colors = {
    sky: isDark ? ["hsl(210, 60%, 18%)", "hsl(216, 70%, 10%)"] : ["hsl(205, 50%, 85%)", "hsl(210, 60%, 75%)"],
    back: isDark ? ["hsl(210, 70%, 16%)", "hsl(216, 75%, 9%)"] : ["hsl(205, 60%, 80%)", "hsl(210, 65%, 70%)"],
    azure: isDark ? ["hsl(200, 80%, 20%)", "hsl(210, 80%, 12%)"] : ["hsl(200, 70%, 75%)", "hsl(205, 75%, 65%)"],
    mid: isDark ? ["hsl(205, 75%, 16%)", "hsl(215, 80%, 8%)"] : ["hsl(205, 70%, 70%)", "hsl(210, 75%, 60%)"],
    front: isDark ? ["hsl(214, 65%, 10%)", "hsl(216, 70%, 6%)"] : ["hsl(210, 65%, 65%)", "hsl(214, 70%, 55%)"],
    navy: isDark ? ["hsl(216, 72%, 7%)", "hsl(218, 75%, 5%)"] : ["hsl(214, 70%, 60%)", "hsl(216, 75%, 50%)"],
    foam: isDark ? ["hsl(188, 100%, 50%)", "hsl(188, 100%, 50%)"] : ["hsl(188, 80%, 90%)", "hsl(188, 80%, 90%)"],
  };

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div className="relative h-[400px] w-full sm:h-[460px]">

        {/* Layer 1 — deepest back, slowest, faintest */}
        <svg
          className="absolute bottom-0 left-0 h-[320px] w-[200%] animate-wave-slow"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wv-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.sky[0]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.sky[1]} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path fill="url(#wv-sky)"
            d="M0,170 C200,110 400,230 600,170 C800,110 1000,230 1200,170 C1400,110 1600,230 1800,170 C2000,110 2200,230 2400,170 C2600,110 2800,230 2880,170 L2880,320 L0,320 Z"
          />
        </svg>

        {/* Layer 2 — mid-back */}
        <svg
          className="absolute bottom-0 left-0 h-[280px] w-[200%] animate-wave-slow"
          viewBox="0 0 2880 280"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wv-back" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.back[0]} stopOpacity="0.55" />
              <stop offset="100%" stopColor={colors.back[1]} stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path fill="url(#wv-back)"
            d="M0,140 C240,80 480,200 720,140 C960,80 1200,200 1440,140 C1680,80 1920,200 2160,140 C2400,80 2640,200 2880,140 L2880,280 L0,280 Z"
          />
        </svg>

        {/* Layer 3 — azure mid */}
        <svg
          className="absolute bottom-0 left-0 h-[240px] w-[200%] animate-wave"
          viewBox="0 0 2880 240"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wv-azure" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.azure[0]} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.azure[1]} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path fill="url(#wv-azure)"
            d="M0,130 C220,70 440,190 660,130 C880,70 1100,190 1320,130 C1540,70 1760,190 1980,130 C2200,70 2420,190 2640,130 C2750,110 2880,150 2880,150 L2880,240 L0,240 Z"
          />
        </svg>

        {/* Layer 4 — ocean blue, faster reverse */}
        <svg
          className="absolute bottom-0 left-0 h-[200px] w-[200%] animate-wave-rev"
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wv-mid" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.mid[0]} stopOpacity="0.75" />
              <stop offset="100%" stopColor={colors.mid[1]} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#wv-mid)"
            d="M0,120 C300,60 600,180 900,120 C1200,60 1500,180 1800,120 C2100,60 2400,180 2700,120 C2790,100 2880,140 2880,140 L2880,200 L0,200 Z"
          />
        </svg>

        {/* Layer 5 — deepest front, fastest */}
        <svg
          className="absolute bottom-0 left-0 h-[150px] w-[200%] animate-wave"
          viewBox="0 0 2880 150"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wv-front" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.front[0]} stopOpacity="0.95" />
              <stop offset="100%" stopColor={colors.front[1]} stopOpacity="1" />
            </linearGradient>
            {/* Subtle cyan crest foam */}
            <linearGradient id="wv-foam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.foam[0]} stopOpacity="0.15" />
              <stop offset="100%" stopColor={colors.foam[1]} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#wv-front)"
            d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 C1680,40 1920,140 2160,90 C2400,40 2640,140 2880,90 L2880,150 L0,150 Z"
          />
          {/* Cyan foam crest */}
          <path fill="url(#wv-foam)"
            d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 C1680,40 1920,140 2160,90 C2400,40 2640,140 2880,90 L2880,97 C2640,147 2400,47 2160,97 C1920,147 1680,47 1440,97 C1200,147 960,47 720,97 C480,147 240,47 0,97 Z"
          />
        </svg>

        {/* Layer 6 — tiny crest wave, deepest navy */}
        <svg
          className="absolute bottom-0 left-0 h-[80px] w-[200%] animate-wave-rev"
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wv-navy" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors.navy[0]} stopOpacity="0.98" />
              <stop offset="100%" stopColor={colors.navy[1]} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#wv-navy)"
            d="M0,40 C180,15 360,65 540,40 C720,15 900,65 1080,40 C1260,15 1440,65 1620,40 C1800,15 1980,65 2160,40 C2340,15 2520,65 2700,40 C2790,28 2880,52 2880,52 L2880,80 L0,80 Z"
          />
        </svg>

      </div>
    </div>
  );
});
WaveBackground.displayName = "WaveBackground";