"use client";

import { useEffect, useRef, useState } from "react";

const fa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

// شمارندهٔ رو به بالا که هنگام ورود به دید فعال می‌شود (با easing). RTL و ارقام فارسی.
export default function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setVal(Math.round(eased * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    // اگر همان ابتدا داخلِ دید است، فوری شروع کن (IntersectionObserver گاهی در تبِ پس‌زمینه
    // یا صفحهٔ کامپوزیت‌نشده fire نمی‌کند و عدد روی ۰ گیر می‌کرد).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) run();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    // ایمنی: هیچ‌وقت روی ۰ گیر نکند — بعد از پایانِ انیمیشن مقدارِ نهایی را قطعی ست کن (اگر rAF
    // در تبِ مخفی متوقف مانده باشد، این آن را جبران می‌کند؛ وگرنه no-op است چون همان‌جاست).
    const fallback = window.setTimeout(() => setVal(to), duration + 300);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {fa(val)}
      {suffix}
    </span>
  );
}
