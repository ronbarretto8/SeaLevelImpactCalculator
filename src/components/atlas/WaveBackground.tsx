import { memo } from "react";

interface WaveBackgroundProps {
  variant?: "hero" | "section" | "footer";
  className?: string;
}

/**
 * Layered, animated SVG ocean waves. Pure CSS/SVG — no images, GPU-friendly.
 * Visible blue waves on white background, premium and calm.
 */
export const WaveBackground = memo(({ variant = "hero", className = "" }: WaveBackgroundProps) => {
  const opacity = variant === "hero" ? 1 : variant === "section" ? 0.85 : 0.95;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Three stacked wave bands. Each SVG is 200% width to allow seamless translateX(-50%) loop */}
      <div className="relative h-[440px] w-full sm:h-[480px]">
        {/* Faintest back wave — sky cyan */}
        <svg
          className="absolute bottom-0 left-0 h-[300px] w-[200%] animate-wave-slow"
          viewBox="0 0 2880 300"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(190, 95%, 88%)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(195, 90%, 75%)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-sky)"
            d="M0,170 C200,110 400,230 600,170 C800,110 1000,230 1200,170 C1400,110 1600,230 1800,170 C2000,110 2200,230 2400,170 C2600,110 2800,230 2880,170 L2880,300 L0,300 Z"
          />
        </svg>

        {/* Back wave — pale */}
        <svg
          className="absolute bottom-0 left-0 h-[260px] w-[200%] animate-wave-slow"
          viewBox="0 0 2880 260"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-back" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(195, 90%, 78%)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="hsl(200, 95%, 65%)" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-back)"
            d="M0,140 C240,80 480,200 720,140 C960,80 1200,200 1440,140 C1680,80 1920,200 2160,140 C2400,80 2640,200 2880,140 L2880,260 L0,260 Z"
          />
        </svg>

        {/* Mid-back wave — fresh azure */}
        <svg
          className="absolute bottom-0 left-0 h-[230px] w-[200%] animate-wave"
          viewBox="0 0 2880 230"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-azure" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(200, 95%, 62%)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="hsl(208, 90%, 48%)" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-azure)"
            d="M0,130 C220,70 440,190 660,130 C880,70 1100,190 1320,130 C1540,70 1760,190 1980,130 C2200,70 2420,190 2640,130 C2750,110 2880,150 2880,150 L2880,230 L0,230 Z"
          />
        </svg>

        {/* Mid wave — ocean blue */}
        <svg
          className="absolute bottom-0 left-0 h-[210px] w-[200%] animate-wave-rev"
          viewBox="0 0 2880 210"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-mid" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(205, 95%, 55%)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(215, 85%, 38%)" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-mid)"
            d="M0,120 C300,60 600,180 900,120 C1200,60 1500,180 1800,120 C2100,60 2400,180 2700,120 C2790,100 2880,140 2880,140 L2880,210 L0,210 Z"
          />
        </svg>

        {/* Front wave — deepest, fastest */}
        <svg
          className="absolute bottom-0 left-0 h-[160px] w-[200%] animate-wave"
          viewBox="0 0 2880 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-front" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(210, 85%, 42%)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(220, 80%, 22%)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="foam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.85" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-front)"
            d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 C1680,40 1920,140 2160,90 C2400,40 2640,140 2880,90 L2880,160 L0,160 Z"
          />
          {/* Foam highlight */}
          <path
            fill="url(#foam)"
            d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 C1680,40 1920,140 2160,90 C2400,40 2640,140 2880,90 L2880,98 C2640,148 2400,48 2160,98 C1920,148 1680,48 1440,98 C1200,148 960,48 720,98 C480,148 240,48 0,98 Z"
          />
        </svg>

        {/* Tiny crest wave — playful navy */}
        <svg
          className="absolute bottom-0 left-0 h-[80px] w-[200%] animate-wave-rev"
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-navy" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(218, 80%, 28%)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(222, 85%, 14%)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-navy)"
            d="M0,40 C180,15 360,65 540,40 C720,15 900,65 1080,40 C1260,15 1440,65 1620,40 C1800,15 1980,65 2160,40 C2340,15 2520,65 2700,40 C2790,28 2880,52 2880,52 L2880,80 L0,80 Z"
          />
        </svg>
      </div>
    </div>
  );
});
WaveBackground.displayName = "WaveBackground";