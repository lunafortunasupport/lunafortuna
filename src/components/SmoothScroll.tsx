"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// اسکرولِ نرمِ لوکس (Lenis). سبک (~۳kb) و رویدادِ اسکرولِ نیتیو می‌فرستد، پس Reveal و
// نوارِ Nav (که به window scroll گوش می‌دهند) دست‌نخورده کار می‌کنند. با prefers-reduced-motion
// اصلاً اجرا نمی‌شود تا برای کاربرانِ حساس به حرکت، اسکرول کاملاً طبیعی بماند.
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
