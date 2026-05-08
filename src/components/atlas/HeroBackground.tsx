import { useState, useRef, useEffect } from "react";

interface HeroBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  parallaxX?: number;
  parallaxY?: number;
}

/**
 * Immersive hero background with cinematic-grade seamless looping.
 * - Uses a deep 5-second crossfade buffer for an invisible loop transition.
 * - Applies a subtle Gaussian blur pulse during the crossfade to mask any frame mismatches.
 * - Performance optimized for 4K video playback.
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
      video1Ref.current.play().catch(err => console.warn("Playback blocked:", err));
    }
  }, [videoUrl]);

  // Seamless Transition Controller
  useEffect(() => {
    if (!videoUrl || videoError) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    const CROSSFADE_WINDOW = 5; // Deep 5-second blend for cinematic smoothness

    const monitorLoop = () => {
      const current = activeVideo === 1 ? v1 : v2;
      const next = activeVideo === 1 ? v2 : v1;

      if (current.duration && !isTransitioning) {
        const remaining = current.duration - current.currentTime;
        
        // Initiate crossfade 5 seconds before the loop ends
        if (remaining <= CROSSFADE_WINDOW && remaining > 0) {
          setIsTransitioning(true);
          
          // Prepare next video at start and play behind current
          next.currentTime = 0;
          next.play().then(() => {
            // Wait a brief moment to ensure playback is stable
            setTimeout(() => {
              setActiveVideo(activeVideo === 1 ? 2 : 1);
              
              // End transition state after the fade duration
              setTimeout(() => {
                setIsTransitioning(false);
              }, CROSSFADE_WINDOW * 1000);
            }, 150);
          }).catch(console.error);
        }
      }
    };

    const checker = setInterval(monitorLoop, 300);
    return () => clearInterval(checker);
  }, [videoUrl, activeVideo, isTransitioning, videoError]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#01040a]" aria-hidden>
      {/* Background Layer (Image fallback + dark depth) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          opacity: 0.25,
          transition: "opacity 1.5s ease"
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
            transition: "opacity 5000ms cubic-bezier(0.4, 0, 0.2, 1), filter 5000ms ease",
            filter: isTransitioning ? "blur(8px) brightness(1.1)" : "blur(0px) brightness(1)",
            willChange: "opacity, filter"
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
            transition: "opacity 5000ms cubic-bezier(0.4, 0, 0.2, 1), filter 5000ms ease",
            filter: isTransitioning ? "blur(8px) brightness(1.1)" : "blur(0px) brightness(1)",
            willChange: "opacity, filter"
          }}
        />
      )}

      {/* Vignette & Gradients (Reduced opacity for better video visibility) */}
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

      {/* Cinematic Light Rays (Wider and softer) */}
      <div className="absolute inset-0 z-[12] overflow-hidden pointer-events-none opacity-20">
        {[
          { left: "15%", width: "250px", delay: "0s", dur: "25s", rot: "-10deg" },
          { left: "45%", width: "350px", delay: "5s", dur: "30s", rot: "0deg" },
          { left: "75%", width: "250px", delay: "3s", dur: "28s", rot: "10deg" },
        ].map((ray, i) => (
          <div
            key={i}
            className="absolute top-0 h-[80vh] rounded-full blur-[40px]"
            style={{
              left: ray.left,
              width: ray.width,
              background: `linear-gradient(180deg, rgba(160, 240, 255, 0.1) 0%, transparent 100%)`,
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
