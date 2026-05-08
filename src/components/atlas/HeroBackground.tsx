import { useState, useRef, useEffect } from "react";

interface HeroBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  parallaxX?: number;
  parallaxY?: number;
}

/**
 * Immersive hero background with seamless crossfade looping.
 * - Uses two video elements to crossfade near the loop point, eliminating jumps or "blackouts".
 * - Fallback to image if video fails or is missing.
 * - Optimized for performance (no parallax on video).
 */
export const HeroBackground = ({ imageUrl, videoUrl }: HeroBackgroundProps) => {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const CROSSFADE_TIME = 2; // seconds before end to start transition

    const handleTimeUpdate = () => {
      const currentVideo = activeVideo === 1 ? v1 : v2;
      const nextVideo = activeVideo === 1 ? v2 : v1;

      if (currentVideo.duration && !isTransitioning) {
        const remaining = currentVideo.duration - currentVideo.currentTime;
        
        if (remaining <= CROSSFADE_TIME) {
          setIsTransitioning(true);
          
          // Prepare and play the next video
          nextVideo.currentTime = 0;
          nextVideo.play().then(() => {
            // Switch active video
            setTimeout(() => {
              setActiveVideo(activeVideo === 1 ? 2 : 1);
              setIsTransitioning(false);
            }, CROSSFADE_TIME * 1000 - 100);
          }).catch(console.error);
        }
      }
    };

    v1.addEventListener("timeupdate", handleTimeUpdate);
    v2.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      v1.removeEventListener("timeupdate", handleTimeUpdate);
      v2.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoUrl, activeVideo, isTransitioning]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030916]" aria-hidden>
      {/* Fallback Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          opacity: videoUrl ? 0 : 1 
        }}
      />

      {/* Video Instance 1 */}
      {videoUrl && (
        <video
          ref={video1Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          style={{ 
            opacity: activeVideo === 1 ? 1 : 0,
            zIndex: activeVideo === 1 ? 2 : 1
          }}
        />
      )}

      {/* Video Instance 2 */}
      {videoUrl && (
        <video
          ref={video2Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          style={{ 
            opacity: activeVideo === 2 ? 1 : 0,
            zIndex: activeVideo === 2 ? 2 : 1
          }}
        />
      )}

      {/* Overlays */}
      <div
        className="absolute inset-0 z-[10]"
        style={{
          background: `linear-gradient(180deg, rgba(3, 9, 22, 0.4) 0%, rgba(5, 14, 32, 0.2) 40%, rgba(6, 16, 36, 0.4) 72%, rgba(4, 10, 24, 0.7) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 z-[11]"
        style={{
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 40%, rgba(2, 6, 18, 0.4) 100%)",
        }}
      />

      {/* Light Rays */}
      <div className="absolute inset-0 z-[12] overflow-hidden pointer-events-none opacity-40">
        {[
          { left: "22%", width: "160px", delay: "0s", dur: "12s", rot: "-14deg" },
          { left: "40%", width: "200px", delay: "2s", dur: "15s", rot: "-2deg" },
          { left: "60%", width: "140px", delay: "1s", dur: "13s", rot: "12deg" },
          { left: "75%", width: "120px", delay: "3s", dur: "11s", rot: "22deg" },
        ].map((ray, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: ray.left,
              width: ray.width,
              height: "60vh",
              background: `linear-gradient(180deg, rgba(120, 220, 255, 0.05) 0%, transparent 100%)`,
              transform: `rotate(${ray.rot})`,
              transformOrigin: "top center",
              borderRadius: "0 0 50% 50%",
              filter: "blur(20px)",
              animation: `ray-sway ${ray.dur} ${ray.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
