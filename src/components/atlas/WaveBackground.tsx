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
      <div className="relative h-[420px] w-full">
        {/* Back wave — palest, slow */}
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
      </div>
    </div>
  );
});
WaveBackground.displayName = "WaveBackground";