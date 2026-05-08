import { useRef } from "react";

interface HeroBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  // Parallax props retained for API compatibility but not used
  parallaxX?: number;
  parallaxY?: number;
}

/**
 * Immersive hero background.
 * - Plays an MP4 video at native quality without any parallax or fade effects.
 * - Falls back to a static image when no video is supplied or fails to load.
 * - Preserves dark overlay, vignette, and subtle CSS light‑ray animation.
 */
export const HeroBackground = ({ imageUrl, videoUrl }: HeroBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Fallback Image (Always rendered behind the video) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* Background Video */}
      {videoUrl && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={(e) => {
            // Hide video if it fails to load
            if (e.currentTarget) e.currentTarget.style.display = "none";
          }}
        />
      )}

      {/* Primary dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(3, 9, 22, 0.50) 0%,
            rgba(5, 14, 32, 0.32) 40%,
            rgba(6, 16, 36, 0.45) 72%,
            rgba(4, 10, 24, 0.72) 100%
          )`,
        }}
      />

      {/* Side vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 40%, rgba(2, 6, 18, 0.50) 100%)",
        }}
      />

      {/* Very subtle CSS light rays (no JS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: "22%", width: "160px", delay: "0s", dur: "12s", rot: "-14deg", op: 0.04 },
          { left: "40%", width: "200px", delay: "2s", dur: "15s", rot: "-2deg", op: 0.05 },
          { left: "60%", width: "140px", delay: "1s", dur: "13s", rot: "12deg", op: 0.04 },
          { left: "75%", width: "120px", delay: "3s", dur: "11s", rot: "22deg", op: 0.03 },
        ].map((ray, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: ray.left,
              width: ray.width,
              height: "60vh",
              background: `linear-gradient(180deg, rgba(120, 220, 255, ${ray.op}) 0%, transparent 100%)`,
              transform: `rotate(${ray.rot})`,
              transformOrigin: "top center",
              borderRadius: "0 0 50% 50%",
              filter: "blur(18px)",
              animation: `ray-sway ${ray.dur} ${ray.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
