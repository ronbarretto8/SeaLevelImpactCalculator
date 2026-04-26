import { useEffect, useRef, useState } from "react";
import udioTrack from "@/assets/ambient-ocean-cinematic.mp3.mp3";

export const CinematicAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return;

    const attemptPlay = () => {
      if (!audioRef.current || hasStarted) return;
      
      audioRef.current.volume = 0; // Start at 0 for fade in
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasStarted(true);
            let vol = 0;
            const maxVol = 0.06; // 6% volume
            const fadeInterval = setInterval(() => {
              vol += 0.006; // Faster increment (0 to 6% in ~2 seconds)
              if (vol >= maxVol) {
                clearInterval(fadeInterval);
                if (audioRef.current) audioRef.current.volume = maxVol;
              } else {
                if (audioRef.current) audioRef.current.volume = vol;
              }
            }, 200);
          })
          .catch((err) => {
            console.log("Autoplay blocked by browser policy:", err);
          });
      }
    };

    attemptPlay();
  }, [hasStarted]);

  // Pause audio when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      
      if (document.hidden) {
        audioRef.current.pause();
      } else if (hasStarted) {
        audioRef.current.play().catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasStarted]);

  return (
    <audio
      ref={audioRef}
      loop
      autoPlay
      src={udioTrack}
      preload="auto"
    />
  );
};
