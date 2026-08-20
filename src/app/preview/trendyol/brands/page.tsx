import Link from "next/link";
import { getFeaturedBrandStats } from "@/lib/trendyolCatalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "برندهای منتخب — پیش‌نمایشِ ترندیول" };

// ویترینِ برندهای منتخب (زیرمجموعه‌های خودِ ترندیول + برندهای ترکِ جداگانه در آینده).
// فقط برندهایی که همین حالا محصولِ فعال دارند نشان داده می‌شوند — تا وقتی سینک/اسکریپرِ
// یک برند تمام نشده (مثلِ آمبار)، این صفحه خودش آن را پنهان نگه می‌دارد.
export default async function TrendyolBrandsPage() {
  const allStats = await getFeaturedBrandStats();
  const stats = allStats.filter((b) => b.count > 0);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
            🧪 پیش‌نمایشِ فنی
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">برندهای منتخب</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            زیرمجموعه‌ها و برندهای ویژه‌ای که جدا از کاتالوگِ عمومی معرفی می‌شوند.
          </p>
        </div>
      </div>

      <div className="container-luna py-10">
        {stats.length === 0 ? (
          <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">🏷️</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">هنوز محصولی سینک نشده</h3>
            <p className="mt-1.5 text-[13px] text-navy/50">
              رباتِ سینکِ ۱۲ساعته اجرا شود تا برندهای منتخب اینجا ظاهر شوند.
            </p>
            <Link href="/preview/trendyol" className="btn-outline mt-5 inline-flex">
              مشاهدهٔ کاتالوگِ عمومی
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((b) => (
              <Link
                key={b.slug}
                href={`/preview/trendyol?fbrand=${b.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-cream">
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
                      <span className="font-display text-3xl">🌙</span>
                    </div>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-wide text-navy shadow-sm">
                    {b.count.toLocaleString("fa-IR")} محصول
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-display text-[15px] font-semibold text-navy">{b.nameFa}</h3>
                  <span className="mt-0.5 block text-[11px] tracking-wide text-navy/35">{b.nameEn}</span>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-6 text-navy/55">{b.blurbFa}</p>
                  <span className="mt-3 block text-[11px] text-gold transition-colors group-hover:underline">
                    مشاهدهٔ محصولات ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
