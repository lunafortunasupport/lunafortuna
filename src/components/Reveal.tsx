"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** انیمیشن ظاهرشدن عناصر دارای کلاس .reveal هنگام ورود به دید */
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const sel = ".reveal:not(.in), .img-wipe:not(.in), .rise-up:not(.in)";
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      // آستانهٔ ۰ + حاشیهٔ پایین ۱۴٪ → عناصر کمی «پیش از» ورود به دید آشکار می‌شوند،
      // پس هیچ بخشی هنگام اسکرول خالی دیده نمی‌شود.
      { threshold: 0, rootMargin: "0px 0px 14% 0px" }
    );

    // پاسِ ایمنی: هرچه در دید یا بالای دید است بلافاصله آشکار شود (بدونِ صبر برای اسکرول).
    const revealVisible = () => {
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.1) {
          el.classList.add("in");
          obs.unobserve(el);
        }
      });
    };

    document.querySelectorAll(sel).forEach((el) => obs.observe(el));
    revealVisible();
    window.addEventListener("resize", revealVisible, { passive: true });
    // یک پاسِ تأخیری برای عناصری که دیر به DOM اضافه می‌شوند.
    const t = setTimeout(revealVisible, 400);

    return () => {
      obs.disconnect();
      window.removeEventListener("resize", revealVisible);
      clearTimeout(t);
    };
  }, [pathname]);
  return null;
}
