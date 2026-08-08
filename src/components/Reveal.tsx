"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** انیمیشن ظاهرشدن عناصر دارای کلاس .reveal هنگام ورود به دید */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in), .img-wipe:not(.in), .rise-up:not(.in)");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);
  return null;
}
