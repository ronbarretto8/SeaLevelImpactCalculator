import { useEffect, useRef } from "react";
import udioTrack from "@/assets/ambient-ocean-cinematic.mp3.mp3";

export const CinematicAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.08; // Pleasant background volume
        audioRef.current.play().catch(() => {
          // If browser blocks initial autoplay, this ensures it starts on first interaction
          console.log("Autoplay blocked by browser. Waiting for interaction.");
        });
      }
    };

    // Attempt immediate play
    playAudio();

    // Fallback: Ensure it starts on first click/touch if blocked initially
    window.addEventListener("click", playAudio, { once: true });
    window.addEventListener("touchstart", playAudio, { once: true });
    
    return () => {
      window.removeEventListener("click", playAudio);
      window.removeEventListener("touchstart", playAudio);
    };
  }, []);

  // Pause audio when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
