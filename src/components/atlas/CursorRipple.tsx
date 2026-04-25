import { useEffect, useRef } from "react";

/**
 * Subtle ocean-ripple cursor. Premium minimal: a single soft ring follows the
 * pointer, and a brief expanding pulse fires on click.
 */
export const CursorRipple = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch

    let raf = 0;
    let tx = -100, ty = -100;
    let cx = -100, cy = -100;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onClick = (e: MouseEvent) => {
      const el = pulseRef.current;
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.classList.remove("pulse");
      // force reflow
      void el.offsetWidth;
      el.classList.add("pulse");
    };

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      const el = ringRef.current;
      if (el) {
        el.style.left = `${cx}px`;
        el.style.top = `${cy}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ripple" />
      <div ref={pulseRef} className="cursor-ripple" />
    </>
  );
};