import { useEffect, useRef, useState } from "react";
import udioTrack from "@/assets/ambient-ocean-cinematic.mp3.mp3";

export const CinematicAudio = () => {
  const [ctx, setCtx] = useState<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const newCtx = new AudioContextClass();
    setCtx(newCtx);

    // Load the audio file as a buffer to avoid the OS "Media Session" notification shade
    fetch(udioTrack)
      .then(res => res.arrayBuffer())
      .then(data => newCtx.decodeAudioData(data))
      .then(buffer => {
        bufferRef.current = buffer;
        // Attempt to start immediately
        startPlayback(newCtx, buffer);
      })
      .catch(err => console.error("Web Audio background error:", err));

    return () => {
      newCtx.close();
    };
  }, []);

  const startPlayback = (audioCtx: AudioContext, buffer: AudioBuffer) => {
    if (sourceRef.current) return;

    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    
    source.buffer = buffer;
    source.loop = true;
    
    // Pleasant background volume (7%)
    gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
    
    source.connect(gain);
    gain.connect(audioCtx.destination);
    
    source.start(0);
    sourceRef.current = source;
    gainRef.current = gain;
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!ctx) return;

    const handleInteraction = () => {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      if (bufferRef.current && !isPlaying) {
        startPlayback(ctx, bufferRef.current);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        ctx.suspend();
      } else {
        ctx.resume();
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("scroll", handleInteraction);
    window.addEventListener("mousemove", handleInteraction);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [ctx, isPlaying]);

  return null; // No <audio> tag means no "Media Session" pop-up on mobile lock screens
};
