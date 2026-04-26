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
            // Smooth fade-in over 4 seconds to an even softer volume
            let vol = 0;
            const maxVol = 0.02; // Reduced to 2% volume
            const fadeInterval = setInterval(() => {
              vol += 0.001;
              if (vol >= maxVol) {
                clearInterval(fadeInterval);
                if (audioRef.current) audioRef.current.volume = maxVol;
              } else {
                if (audioRef.current) audioRef.current.volume = vol;
              }
            }, 200);
            
            // Remove click listener once successfully started
            document.removeEventListener("click", attemptPlay);
          })
          .catch((err) => {
            // Autoplay blocked by browser policy (expected).
            // The click listener will catch the user's first interaction.
            console.log("Waiting for user interaction to start audio.");
          });
      }
    };

    // Attempt to play immediately (works if browser allows, e.g. after refresh)
    attemptPlay();

    // Fallback: attach to the very first click ANYWHERE on the document
    document.addEventListener("click", attemptPlay);
    
    return () => {
      document.removeEventListener("click", attemptPlay);
    };
  }, [hasStarted]);

  // Pause audio when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      
      if (document.hidden) {
        audioRef.current.pause();
      } else if (hasStarted) {
        // Only resume if the user had already triggered the initial playback
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
      src={udioTrack}
      preload="auto"
    />
  );
};
