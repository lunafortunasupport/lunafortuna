import Link from "next/link";
import type { FeaturedBrandStat } from "@/lib/trendyolCatalog";

// نوارِ «برندهای محبوب» روی صفحهٔ کاتالوگ — هر برند به /catalog?fbrand=slug لینک می‌شود.
// عکسِ کارت از محصولاتِ خودِ برند می‌آید (پس همیشه مرتبط و فشن است، نه عکسِ بی‌ربط).
// برندهایی که خودشان ستونِ اصلی‌اند (ترندیول‌میلا/آمبار) این‌جا تکرار نمی‌شوند.
const PILLAR_FEATURED = new Set(["trendyol-milla", "ambar"]);

export default function BrandStrip({ brands }: { brands: FeaturedBrandStat[] }) {
  const shown = brands.filter((b) => b.count > 0 && !PILLAR_FEATURED.has(b.slug));
  if (shown.length === 0) return null;

  return (
    <div className="border-b border-navy/8 bg-cream">
      <div className="container-luna py-7">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">برندهای محبوب</div>
            <p className="mt-1 text-[12.5px] text-navy/50">برندهای پرطرفدارِ ترکیه — هرکدام ویترینِ جدا.</p>
          </div>
          <Link href="/catalog/brands" className="shrink-0 text-[12px] font-medium text-gold hover:underline">
            همهٔ برندها ←
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {shown.map((b) => (
            <Link
              key={b.slug}
              href={`/catalog?fbrand=${b.slug}`}
              className="group relative flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-navy/8 bg-white transition-all hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                {b.sampleImages.length > 0 ? (
                  <div className="grid h-full grid-cols-3 gap-px">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="relative overflow-hidden bg-navy/5">
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
                  <div className="flex h-full items-center justify-center text-navy/15">
                    <span className="font-display text-2xl">🌙</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink/15 to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  {b.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.logo} alt="" className="h-5 w-5 shrink-0 rounded object-contain ring-1 ring-navy/10" loading="lazy" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-display text-[13.5px] font-semibold text-navy">{b.nameFa}</div>
                    <div className="truncate text-[10px] tracking-wide text-navy/35">{b.nameEn}</div>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] text-navy/35">{b.count.toLocaleString("fa-IR")} محصول</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
