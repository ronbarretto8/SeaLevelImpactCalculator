import { useState, useRef, useEffect } from "react";

interface HeroBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  parallaxX?: number;
  parallaxY?: number;
}

/**
 * Immersive hero background with a focused seamless loop.
 * - Restored original video pace with a crisp 1.5s crossfade.
 * - Removed cinematic effects (blur/lifts) to keep the video sharp and fast-paced.
 * - Dual-video stack ensures no blackouts or jumps at the loop point.
 */
export const HeroBackground = ({ imageUrl, videoUrl }: HeroBackgroundProps) => {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Initial Playback
  useEffect(() => {
    if (videoUrl && video1Ref.current) {
      video1Ref.current.play().catch(() => {});
    }
  }, [videoUrl]);

  // Seamless Transition Controller
  useEffect(() => {
    if (!videoUrl || videoError) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const CROSSFADE_WINDOW = 1.5; // Crisper 1.5s blend to maintain original pace

    const monitorLoop = () => {
      const current = activeVideo === 1 ? v1 : v2;
      const next = activeVideo === 1 ? v2 : v1;

      if (current.duration && !isTransitioning) {
        const remaining = current.duration - current.currentTime;
        
        // Initiate crossfade 1.5 seconds before the loop ends
        if (remaining <= CROSSFADE_WINDOW && remaining > 0) {
          setIsTransitioning(true);
          
          // Play next video behind current
          next.currentTime = 0;
          next.play().then(() => {
            setActiveVideo(activeVideo === 1 ? 2 : 1);
            
            // End transition state
            setTimeout(() => {
              setIsTransitioning(false);
            }, CROSSFADE_WINDOW * 1000);
          }).catch(console.error);
        }
      }
    };

    const checker = setInterval(monitorLoop, 200);
    return () => clearInterval(checker);
  }, [videoUrl, activeVideo, isTransitioning, videoError]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#01040a]" aria-hidden>
      {/* Background Layer (Image fallback) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          opacity: (videoUrl && !videoError) ? 0 : 1,
          transition: "opacity 1s ease"
        }}
      />

      {/* Video Instance 1 */}
      {videoUrl && (
        <video
          ref={video1Ref}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          style={{ 
            opacity: activeVideo === 1 ? 1 : 0,
            zIndex: activeVideo === 1 ? 2 : 1,
            transition: "opacity 1500ms ease-in-out",
            willChange: "opacity"
          }}
        />
      )}

      {/* Video Instance 2 */}
      {videoUrl && (
        <video
          ref={video2Ref}
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          style={{ 
            opacity: activeVideo === 2 ? 1 : 0,
            zIndex: activeVideo === 2 ? 2 : 1,
            transition: "opacity 1500ms ease-in-out",
            willChange: "opacity"
          }}
        />
      )}

      {/* Overlays */}
      <div
        className="absolute inset-0 z-[10]"
        style={{
          background: `linear-gradient(180deg, 
            rgba(1, 4, 10, 0.4) 0%, 
            rgba(1, 4, 10, 0.1) 40%, 
            rgba(1, 4, 10, 0.3) 75%, 
            rgba(1, 4, 10, 0.7) 100%
          )`,
        }}
      />
      <div
        className="absolute inset-0 z-[11]"
        style={{
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 40%, rgba(1, 4, 10, 0.5) 100%)",
        }}
      />

      {/* Subtle Animated Light Rays */}
      <div className="absolute inset-0 z-[12] overflow-hidden pointer-events-none opacity-30">
        {[
          { left: "20%", width: "180px", delay: "0s", dur: "18s", rot: "-12deg" },
          { left: "45%", width: "240px", delay: "4s", dur: "22s", rot: "0deg" },
          { left: "70%", width: "160px", delay: "2s", dur: "20s", rot: "15deg" },
        ].map((ray, i) => (
          <div
            key={i}
            className="absolute top-0 h-[70vh] rounded-full blur-[25px]"
            style={{
              left: ray.left,
              width: ray.width,
              background: `linear-gradient(180deg, rgba(140, 230, 255, 0.05) 0%, transparent 100%)`,
              transform: `rotate(${ray.rot})`,
              transformOrigin: "top center",
              animation: `ray-sway ${ray.dur} ${ray.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
