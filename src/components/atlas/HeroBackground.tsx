import { useState, useRef, useEffect } from "react";

interface HeroBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  parallaxX?: number;
  parallaxY?: number;
}

/**
 * Immersive hero background with ultra-smooth crossfade looping.
 * - Uses a dual-video buffer to blend the end and start of the loop perfectly.
 * - Gradual 3-second crossfade to mask transitions.
 * - Reliable playback management for Vercel and slow connections.
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
      video1Ref.current.play().catch((err) => {
        console.warn("Initial playback waiting for interaction:", err);
      });
    }
  }, [videoUrl]);

  // Seamless Loop Controller
  useEffect(() => {
    if (!videoUrl || videoError) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const CROSSFADE_DURATION = 3; // 3-second blend for maximum smoothness

    const checkLoop = () => {
      const current = activeVideo === 1 ? v1 : v2;
      const next = activeVideo === 1 ? v2 : v1;

      if (current.duration && !isTransitioning) {
        const remaining = current.duration - current.currentTime;
        
        // Start crossfade 3 seconds before the end
        if (remaining <= CROSSFADE_DURATION && remaining > 0) {
          setIsTransitioning(true);
          
          // Reset and start the background video
          next.currentTime = 0;
          next.play().then(() => {
            // Trigger the state switch slightly after playback starts
            setTimeout(() => {
              setActiveVideo(activeVideo === 1 ? 2 : 1);
              
              // Finish transition after crossfade duration
              setTimeout(() => {
                setIsTransitioning(false);
              }, CROSSFADE_DURATION * 1000);
            }, 100);
          }).catch(console.error);
        }
      }
    };

    const interval = setInterval(checkLoop, 500); // Check frequently for precise timing
    return () => clearInterval(interval);
  }, [videoUrl, activeVideo, isTransitioning, videoError]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020611]" aria-hidden>
      {/* Background Fallback (Always Ready) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          opacity: (videoUrl && !videoError) ? 0.3 : 1, // Keep a hint of image behind for depth
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
            transition: "opacity 3000ms ease-in-out", // Matches CROSSFADE_DURATION
            filter: isTransitioning ? "brightness(1.1) contrast(1.05)" : "none", // Subtle visual lift during blend
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
            transition: "opacity 3000ms ease-in-out", // Matches CROSSFADE_DURATION
            filter: isTransitioning ? "brightness(1.1) contrast(1.05)" : "none",
            willChange: "opacity"
          }}
        />
      )}

      {/* Cinematic Overlays */}
      <div
        className="absolute inset-0 z-[10]"
        style={{
          background: `linear-gradient(180deg, 
            rgba(2, 6, 18, 0.5) 0%, 
            rgba(2, 6, 18, 0.2) 40%, 
            rgba(2, 6, 18, 0.4) 75%, 
            rgba(2, 6, 18, 0.8) 100%
          )`,
        }}
      />
      <div
        className="absolute inset-0 z-[11]"
        style={{
          background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 30%, rgba(2, 6, 18, 0.6) 100%)",
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
              background: `linear-gradient(180deg, rgba(140, 230, 255, 0.08) 0%, transparent 100%)`,
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
