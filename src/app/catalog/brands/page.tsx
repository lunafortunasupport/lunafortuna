import Link from "next/link";
import { getPillarStats, getFeaturedBrandStats } from "@/lib/trendyolCatalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "برندها — کاتالوگِ ترکیه" };

// برندهایی که ستونِ اصلی (پیلر) هستند و در گالریِ «برندهای محبوب» تکرار نشوند.
const PILLAR_FEATURED = new Set(["trendyol-milla", "ambar"]);

// سه ستونِ اصلیِ کاتالوگ: ترندیول (ملتی‌برند)، ترندیول‌میلا، آمبار.
export default async function TrendyolBrandsPage() {
  const [allStats, allFeatured] = await Promise.all([getPillarStats(), getFeaturedBrandStats()]);
  const stats = allStats.filter((b) => b.count > 0);
  const featured = allFeatured.filter((b) => b.count > 0 && !PILLAR_FEATURED.has(b.slug));

  return (
    <div>
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
            کاتالوگِ ترکیه
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">برندها</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            سه دنیای خرید از ترکیه — ترندیولِ ملتی‌برند با ده‌ها برند، برندِ اختصاصیِ ترندیول‌میلا، و آمبار.
          </p>
        </div>
      </div>

      <div className="container-luna py-10">
        {stats.length === 0 ? (
          <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">🏷️</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">هنوز محصولی سینک نشده</h3>
            <p className="mt-1.5 text-[13px] text-navy/50">
              رباتِ سینک اجرا شود تا محصولات اینجا ظاهر شوند.
            </p>
            <Link href="/catalog" className="btn-outline mt-5 inline-flex">
              مشاهدهٔ کاتالوگ
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">سه دنیای خرید</div>
              <h2 className="mt-2 font-display text-[26px] font-black leading-tight text-navy md:text-[34px]">
                از کجا شروع کنیم؟
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((b) => (
                <Link
                  key={b.slug}
                  href={`/catalog?source=${b.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-navy shadow-card ring-1 ring-navy/10 transition-all duration-300 hover:-translate-y-1 hover:ring-gold/40"
                >
                  {b.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.cover}
                      alt={b.nameFa}
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                  ) : b.sampleImages.length > 0 ? (
                    <div className="absolute inset-0 grid grid-cols-3 gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="relative overflow-hidden bg-white/5">
                          {b.sampleImages[i] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={b.sampleImages[i]} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-cream/15">
                      <span className="font-display text-3xl">🌙</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/92 via-navy-ink/30 to-transparent" />

                  <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-medium text-cream backdrop-blur-sm">
                    {b.count.toLocaleString("fa-IR")} محصول
                    {b.brandCount > 1 && (
                      <>
                        <span className="opacity-40">·</span>
                        {b.brandCount.toLocaleString("fa-IR")} برند
                      </>
                    )}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-[11px] tracking-[0.28em] text-champagne">{b.nameEn}</div>
                    <div className="mt-2 flex items-center gap-2.5">
                      {b.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.logo} alt="" className="h-7 w-7 shrink-0 rounded-md bg-white/95 p-0.5 object-contain" loading="lazy" />
                      )}
                      <h3 className="font-display text-[26px] font-black leading-8 text-cream">{b.nameFa}</h3>
                    </div>
                    <p className="mt-2.5 line-clamp-2 max-w-[17rem] text-[12.5px] leading-6 text-cream/70">{b.blurbFa}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-cream transition-transform group-hover:-translate-x-1">
                      مشاهدهٔ محصولات <span>←</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── برندهای محبوب (هرکدام ویترینِ جدا) ── */}
        {featured.length > 0 && (
          <div className="mt-16 border-t border-navy/10 pt-12">
            <div className="mb-2 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-navy md:text-3xl">برندهای محبوب</h2>
            </div>
            <p className="mb-7 max-w-2xl text-[13.5px] leading-7 text-navy/55">
              برندهای پرطرفدارِ ترکیه — هرکدام صفحهٔ جدا؛ فقط محصولاتِ همان برند را ببینید.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((b) => (
                <Link
                  key={b.slug}
                  href={`/catalog?fbrand=${b.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                    {b.sampleImages.length > 0 ? (
                      <div className="grid h-full grid-cols-3 gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="relative overflow-hidden bg-navy/5">
                            {b.sampleImages[i] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={b.sampleImages[i]}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
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
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        {b.logo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.logo} alt="" className="h-6 w-6 shrink-0 rounded-md object-contain ring-1 ring-navy/10" loading="lazy" />
                        )}
                        <h3 className="truncate font-display text-[14px] font-semibold text-navy">{b.nameFa}</h3>
                      </div>
                      <span className="shrink-0 text-[10px] text-navy/35">{b.count.toLocaleString("fa-IR")} محصول</span>
                    </div>
                    <span className="mt-0.5 block text-[10.5px] tracking-wide text-navy/35">{b.nameEn}</span>
                    <span className="mt-2.5 block text-[11px] text-gold transition-colors group-hover:underline">
                      مشاهدهٔ محصولات ←
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
