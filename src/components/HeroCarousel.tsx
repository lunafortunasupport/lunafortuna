"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Counter from "@/components/Counter";

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  ctaText: string;
}

const AUTOPLAY_MS = 6000;

// هیروی مزونی — اسلایدرِ تمام‌عرض، خودچرخان، RTL. حسِ گالری/مزون: عکسِ بزرگِ روی‌مدل، تیترِ
// سینمایی، چرخشِ ملایمِ خودکار که با hover/فوکوس مکث می‌کند و با drag/فلش/نقطه قابلِ کنترل است.
export default function HeroCarousel({
  slides,
  brandCount,
  perLir,
}: {
  slides: HeroSlide[];
  brandCount: number;
  perLir: number;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ direction: "rtl", loop: true });
  const [selected, setSelected] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi]);

  // چرخشِ خودکار — بدونِ کتابخانهٔ اضافه؛ با hover/فوکوس مکث می‌کند؛ با reduced-motion اصلاً اجرا نمی‌شود.
  useEffect(() => {
    if (!emblaApi || reduceMotion || slides.length < 2) return;
    const id = window.setInterval(() => {
      if (!hoverRef.current) emblaApi.scrollNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, reduceMotion, slides.length]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative min-h-[92vh] w-full overflow-hidden bg-navy-ink text-cream"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      onFocus={() => (hoverRef.current = true)}
      onBlur={() => (hoverRef.current = false)}
    >
      <div className="h-full min-h-[92vh] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full min-h-[92vh]">
          {slides.map((s, i) => (
            <div key={s.id} className="relative min-h-[92vh] w-full shrink-0 grow-0 basis-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover object-top ${
                  !reduceMotion && i === selected ? "kenburns" : ""
                }`}
              />
              {/* یک گرادیانِ عمودیِ ملایم، فقط برای خواناییِ زیرنویس — نه پوششِ کلِ عکس با آبیِ تیره
                  (اشکالِ نسخهٔ قبل: دو لایه‌ی همزمان کلِ عکس رو کدر می‌کرد). بالای فریم تقریباً تمیز می‌ماند. */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/90 via-navy-ink/20 to-transparent" />

              <div className="container-luna relative flex h-full min-h-[92vh] flex-col justify-end pb-40 pt-28 md:pb-44">
                <div className={`max-w-lg transition-all duration-700 ${i === selected ? "opacity-100" : "opacity-0"}`}>
                  <div className="flex items-center gap-3 text-[11px] tracking-[0.32em] text-champagne">
                    <span className="h-px w-8 bg-champagne/60" />
                    {s.eyebrow}
                  </div>
                  <h1 className="mt-5 font-display text-[clamp(34px,5.5vw,64px)] font-black leading-[1.08]">
                    {s.title}
                  </h1>
                  {s.subtitle && (
                    <p className="mt-4 max-w-md text-[14px] leading-8 text-cream/80">{s.subtitle}</p>
                  )}
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Link href={s.href} className="btn bg-champagne px-7 py-3 text-navy-ink hover:bg-cream">
                      {s.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* فلش‌های ناوبری */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="اسلایدِ قبلی"
            className="absolute right-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 text-cream/80 backdrop-blur-sm transition hover:border-champagne hover:text-champagne sm:flex"
          >
            →
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="اسلایدِ بعدی"
            className="absolute left-5 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 text-cream/80 backdrop-blur-sm transition hover:border-champagne hover:text-champagne sm:flex"
          >
            ←
          </button>
        </>
      )}

      {/* نقطه‌های ایندیکاتور */}
      {slides.length > 1 && (
        <div className="absolute bottom-[74px] left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollTo(i)}
              aria-label={`رفتن به اسلایدِ ${i + 1}`}
              aria-current={i === selected}
              className={`h-1.5 rounded-full transition-all ${
                i === selected ? "w-7 bg-champagne" : "w-1.5 bg-cream/35 hover:bg-cream/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* نوارِ پایینِ اعتماد */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-cream/10 bg-navy-ink/40 backdrop-blur-sm">
        <div className="container-luna flex flex-wrap items-center justify-between gap-4 py-4 text-[12.5px] text-cream/60">
          <span>
            <Counter to={brandCount} className="font-display font-bold text-champagne" /> برندِ معتبر ترکیه
          </span>
          <span className="hidden sm:inline">بررسی کیفیت و سایز پیش از ارسال</span>
          <span className="hidden md:inline">قیمت شفاف با نرخ لیرِ روز</span>
          <span>هر لیر ≈ {perLir.toLocaleString("fa-IR")} تومان</span>
        </div>
      </div>
    </section>
  );
}
