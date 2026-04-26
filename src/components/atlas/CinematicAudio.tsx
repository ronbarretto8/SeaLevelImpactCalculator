import { useEffect, useRef, useState } from "react";
import udioTrack from "@/assets/ambient-ocean-cinematic.mp3.mp3";

export const CinematicAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Attempt to start audio immediately in a muted state (Browsers ALWAYS allow muted autoplay)
    if (audioRef.current) {
      audioRef.current.muted = true;
      audioRef.current.play().catch(err => console.log("Muted autoplay effort:", err));
    }

    const activateAudio = () => {
      if (!audioRef.current || hasStarted) return;
      
      // Unmute and start the fade-in to a pleasant level
      audioRef.current.muted = false;
      setHasStarted(true);

      let vol = 0;
      const maxVol = 0.12; // Pleasant background level (12%)
      audioRef.current.volume = 0;
      
      const fadeInterval = setInterval(() => {
        vol += 0.01; // Quick but smooth ramp up
        if (vol >= maxVol) {
          clearInterval(fadeInterval);
          if (audioRef.current) audioRef.current.volume = maxVol;
        } else {
          if (audioRef.current) audioRef.current.volume = vol;
        }
      }, 100);

      // Clean up listeners
      window.removeEventListener("click", activateAudio);
      window.removeEventListener("touchstart", activateAudio);
      window.removeEventListener("scroll", activateAudio);
    };

    // We attach to any natural interaction to "activate" the audio the user wants to hear
    window.addEventListener("click", activateAudio);
    window.addEventListener("touchstart", activateAudio);
    window.addEventListener("scroll", activateAudio);
    
    return () => {
      window.removeEventListener("click", activateAudio);
      window.removeEventListener("touchstart", activateAudio);
      window.removeEventListener("scroll", activateAudio);
    };
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
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted]);

  return (
    <audio
      ref={audioRef}
      loop
      autoPlay
      playsInline
      src={udioTrack}
      preload="auto"
    />
  );
};
