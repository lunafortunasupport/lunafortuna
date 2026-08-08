"use client";

import { useEffect, useRef } from "react";

// کرسرِ ظریفِ لوکس: یک حلقهٔ طلایی که نرم دنبال نشانگر می‌آید و روی لینک/دکمه بزرگ می‌شود.
// روی دستگاه لمسی یا حالتِ کاهش حرکت غیرفعال است.
export default function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.body.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; if (dot.current) { dot.current.style.left = mx + "px"; dot.current.style.top = my + "px"; } };
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, input, textarea, select, [role='button']");
      ring.current?.classList.toggle("grow", !!interactive);
    };
    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerover", onOver, { passive: true });
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); removeEventListener("pointerover", onOver); document.body.classList.remove("has-cursor"); };
  }, []);

  return (
    <>
      <div ref={ring} className="luna-cursor-ring" aria-hidden />
      <div ref={dot} className="luna-cursor-dot" aria-hidden />
    </>
  );
}
