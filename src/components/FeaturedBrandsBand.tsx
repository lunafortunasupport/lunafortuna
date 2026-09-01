import Link from "next/link";
import type { FeaturedBrandStat } from "@/lib/trendyolCatalog";

// بندِ «برندهای محبوب» در صفحهٔ اصلی — هوکِ چشمگیر که کاربر را به ویترینِ هر برند می‌برد.
// عکسِ هر کارت از محصولاتِ خودِ برند می‌آید (کولاژِ ۳تایی) پس همیشه فشن و مرتبط است.
const PILLAR_FEATURED = new Set(["trendyol-milla", "ambar"]);

export default function FeaturedBrandsBand({ brands }: { brands: FeaturedBrandStat[] }) {
  const shown = brands.filter((b) => b.count > 0 && !PILLAR_FEATURED.has(b.slug)).slice(0, 8);
  if (shown.length < 3) return null;

  return (
    <section className="bg-navy text-cream">
      <div className="container-luna py-24 md:py-28">
        <div className="reveal mb-12 flex items-end justify-between gap-6 border-b border-champagne/20 pb-8">
          <div>
            <div className="rise-up flex items-center gap-3 text-[12px] tracking-[0.28em] text-champagne">
              <span className="font-display font-bold">✦</span>
              <span className="h-px w-8 bg-champagne/50" />
              <span className="text-cream/60">برندهای محبوب</span>
            </div>
            <h2
              className="rise-up mt-5 font-display text-[clamp(28px,4vw,46px)] font-black"
              style={{ transitionDelay: "60ms" }}
            >
              برندهایی که می‌شناسی، به فارسی و تومان
            </h2>
            <p className="rise-up mt-4 max-w-xl text-[14px] leading-8 text-cream/60" style={{ transitionDelay: "120ms" }}>
              مانگو، کوتون، دیفکتو، ماوی و… — پرطرفدارترین برندهای ترکیه، هرکدام یک ویترینِ جدا؛ فقط
              محصولاتِ همان برند را ببین.
            </p>
          </div>
          <Link
            href="/catalog/brands"
            className="hidden shrink-0 text-sm text-champagne hover:text-cream sm:inline"
          >
            همهٔ برندها ←
          </Link>
        </div>

        <div className="reveal grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((b) => (
            <Link
              key={b.slug}
              href={`/catalog?fbrand=${b.slug}`}
              className="group relative block overflow-hidden rounded-sm border border-champagne/12 bg-navy-ink transition-all duration-300 hover:-translate-y-1 hover:border-champagne/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {b.sampleImages.length > 0 ? (
                  <div className="grid h-full grid-cols-3 gap-px">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="relative overflow-hidden bg-white/5">
                        {b.sampleImages[i] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={b.sampleImages[i]}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-cream/15">
                    <span className="font-display text-3xl">🌙</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink/85 via-navy-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    {b.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.logo} alt="" className="h-6 w-6 shrink-0 rounded-md bg-white/95 p-0.5 object-contain" loading="lazy" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-display text-[15px] font-bold text-cream">{b.nameFa}</div>
                      <div className="truncate text-[10px] tracking-[0.18em] text-champagne/70">{b.nameEn}</div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] text-cream/45">{b.count.toLocaleString("fa-IR")} محصول</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/catalog/brands"
            className="btn border border-champagne/50 px-8 py-3 text-cream hover:bg-champagne hover:text-navy-ink"
          >
            همهٔ برندها
          </Link>
        </div>
      </div>
    </section>
  );
}
