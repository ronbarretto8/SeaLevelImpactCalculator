interface HeroBackgroundProps {
  imageUrl: string;
  parallaxX: number;
  parallaxY: number;
}

/**
 * Clean immersive hero background.
 * - Full-screen underwater image with subtle parallax
 * - Dark overlay for readability
 * - Very soft light rays (CSS only, no canvas, no particles)
 */
export const HeroBackground = ({ imageUrl, parallaxX, parallaxY }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* ── Background image with subtle parallax ── */}
      <div
        className="absolute inset-[-4%]"
        style={{
          transform: `translate(${parallaxX * 0.025}px, ${parallaxY * 0.018}px)`,
          transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>

      {/* ── Primary dark overlay — lighter so image shows through ── */}
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

      {/* ── Side vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 40%, rgba(2, 6, 18, 0.50) 100%)",
        }}
      />

      {/* ── Very subtle light rays (CSS only — no glow, no particles) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          transform: `translate(${parallaxX * 0.008}px, ${parallaxY * 0.005}px)`,
          transition: "transform 2.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {[
          { left: "22%",  width: "160px", delay: "0s",   dur: "12s", rot: "-14deg", op: 0.04 },
          { left: "40%",  width: "200px", delay: "2s",   dur: "15s", rot: "-2deg",  op: 0.05 },
          { left: "60%",  width: "140px", delay: "1s",   dur: "13s", rot: "12deg",  op: 0.04 },
          { left: "75%",  width: "120px", delay: "3s",   dur: "11s", rot: "22deg",  op: 0.03 },
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
