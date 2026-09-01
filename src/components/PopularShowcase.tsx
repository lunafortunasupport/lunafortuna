"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { formatToman } from "@/lib/format";

// دادهٔ ساده و سریالایزبل — قیمت‌ها و تخفیف سمتِ سرور (page.tsx) حساب می‌شوند تا این
// کامپوننتِ کلاینت به prisma/trendyolCatalog وابسته نشود.
export interface PopularItem {
  id: string;
  title: string;
  brand: string;
  image: string | null;
  categoryFa: string | null;
  favoriteCount: number | null;
  itemToman: number | null;
  originalToman: number | null;
  discountPct: number | null;
  freeCargo: boolean;
}

export interface ShowcaseBrand {
  slug: string;
  nameFa: string;
  nameEn: string;
  count: number;
  image: string | null;
}

export default function PopularShowcase({
  lead,
  rail,
  brands,
}: {
  lead: PopularItem | null;
  rail: PopularItem[];
  brands: ShowcaseBrand[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // پارالاکسِ ملایمِ عکسِ لید — بدونِ کتابخانه، فقط ترنسفورمِ CSS بسته به اسکرول.
  const leadImgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = leadImgRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const wrap = el.parentElement;
      if (wrap) {
        const rect = wrap.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `scale(1.08) translateY(${(-progress * 22).toFixed(1)}px)`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!lead) return null;

  return (
    <div>
      {/* ── چیدمانِ مجله‌ای: لیدِ بزرگ + ریلِ کشیدنی ── */}
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr] lg:gap-8">
        {/* کارتِ لید */}
        <Link
          href={`/catalog/${lead.id}`}
          className="group relative block overflow-hidden rounded-2xl bg-navy-ink"
        >
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-full">
            {lead.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={leadImgRef}
                src={lead.image}
                alt={lead.title}
                className="h-full w-full object-cover will-change-transform"
                style={{ transform: "scale(1.08)" }}
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center text-cream/15">
                <span className="font-display text-6xl">🌙</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/92 via-navy-ink/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
              <div className="flex items-center gap-3">
                <span className="text-[11px] tracking-[0.28em] text-champagne">{lead.brand}</span>
                {typeof lead.favoriteCount === "number" && lead.favoriteCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cream/70">
                    <span className="text-[#e0526b]">❤</span>
                    {lead.favoriteCount.toLocaleString("fa-IR")} پسند
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-xl font-black leading-8 text-cream md:text-2xl">
                {lead.title}
              </h3>
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="font-display text-2xl font-black text-champagne tabular-nums">
                  {lead.itemToman != null ? formatToman(lead.itemToman) : "—"}
                </span>
                {lead.originalToman != null && (
                  <span className="text-[13px] text-cream/40 line-through tabular-nums">
                    {formatToman(lead.originalToman)}
                  </span>
                )}
                {lead.discountPct ? (
                  <span className="text-[12px] font-bold text-[#e8836f] tabular-nums">
                    {lead.discountPct.toLocaleString("fa-IR")}٪−
                  </span>
                ) : null}
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-cream transition-transform group-hover:-translate-x-1">
                مشاهدهٔ محصول <span>←</span>
              </span>
            </div>
          </div>
        </Link>

        {/* ریلِ کشیدنیِ Embla */}
        <div className="relative min-w-0">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {rail.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalog/${p.id}`}
                  className="group w-[46%] shrink-0 sm:w-[38%] lg:w-[45%] xl:w-[38%]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream ring-1 ring-navy/8">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        loading="lazy"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-navy/15">
                        <span className="font-display text-3xl">🌙</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] tracking-wide text-gold">{p.brand}</span>
                      {typeof p.favoriteCount === "number" && p.favoriteCount > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-navy/45">
                          <span className="text-[#e0526b]">❤</span>
                          {p.favoriteCount.toLocaleString("fa-IR")}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-0.5 line-clamp-1 font-display text-[13px] font-bold text-navy">{p.title}</h4>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-display text-[14px] font-bold text-navy tabular-nums">
                        {p.itemToman != null ? formatToman(p.itemToman) : "—"}
                      </span>
                      {p.originalToman != null && (
                        <span className="text-[10.5px] text-navy/30 line-through tabular-nums">
                          {formatToman(p.originalToman)}
                        </span>
                      )}
                      {p.discountPct ? (
                        <span className="text-[10px] font-bold text-[#b8442f] tabular-nums">
                          {p.discountPct.toLocaleString("fa-IR")}٪−
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* دکمه‌های ناوبریِ ریل */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-[12px] text-navy/40">برای دیدنِ بیشتر بکشید ←</span>
            <div className="flex gap-2">
              <RailBtn dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
              <RailBtn dir="next" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} />
            </div>
          </div>
        </div>
      </div>

      {/* ── نوارِ برندهای منتخب ── */}
      {brands.length > 0 && (
        <div className="mt-14 border-t border-navy/10 pt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="font-display text-lg font-black text-navy md:text-xl">سه دنیای خریدِ ترکیه</h3>
            <Link href="/catalog/brands" className="text-[13px] text-gold hover:text-navy">
              همهٔ برندها ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/catalog?source=${b.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-navy/8 bg-white transition-all hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                  {b.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.image}
                      alt=""
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-navy/15">
                      <span className="font-display text-2xl">🌙</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-display text-[13px] font-bold text-navy">{b.nameFa}</div>
                  <div className="mt-0.5 text-[10.5px] text-navy/40">
                    {b.count.toLocaleString("fa-IR")} محصول
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RailBtn({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "قبلی" : "بعدی"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition ${
        disabled
          ? "cursor-not-allowed border-navy/8 text-navy/20"
          : "border-navy/15 text-navy/60 hover:border-gold hover:text-gold"
      }`}
    >
      {dir === "prev" ? "→" : "←"}
    </button>
  );
}
