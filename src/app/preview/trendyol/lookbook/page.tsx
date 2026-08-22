import Link from "next/link";
import { getEditorialStats } from "@/lib/trendyolCatalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوک‌بوک — منتخبِ سردبیر" };

// فهرستِ لوک‌بوک: کاورهای مجله‌ایِ هر «داستانِ» استایل. فقط لوک‌های دارای محصول.
export default async function LookbookIndexPage() {
  const all = await getEditorialStats();
  const stories = all.filter((e) => e.count > 0);

  return (
    <div>
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
          <div className="absolute -right-10 top-8 h-40 w-40 animate-spinSlow rounded-full border border-champagne/10" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
            📖 منتخبِ سردبیر
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">لوک‌بوک</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            داستان‌های استایلِ دست‌چین — تکه‌هایی که برای هر حال‌وهوا کنارِ هم انتخاب کرده‌ایم. از
            برندهای ترکیه، همه به فارسی و تومان.
          </p>
        </div>
      </div>

      <div className="container-luna py-10">
        {stories.length === 0 ? (
          <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">📖</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">هنوز لوکی آماده نیست</h3>
            <p className="mt-1.5 text-[13px] text-navy/50">رباتِ سینک اجرا شود تا لوک‌ها پر شوند.</p>
            <Link href="/preview/trendyol" className="btn-outline mt-5 inline-flex">
              مشاهدهٔ کاتالوگ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((e) => (
              <Link
                key={e.slug}
                href={`/preview/trendyol/lookbook/${e.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-navy/8 bg-navy-ink transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {e.sampleImages.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.sampleImages[0]}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-cream/15">
                      <span className="font-display text-6xl">{e.heroEmoji}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/92 via-navy-ink/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[11px] tracking-[0.28em] text-champagne">منتخبِ سردبیر</span>
                    <h3 className="mt-2 font-display text-2xl font-black leading-8 text-cream">
                      {e.heroEmoji} {e.title}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-6 text-cream/70">{e.dek}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-cream transition-transform group-hover:-translate-x-1">
                      مشاهدهٔ لوک <span>←</span>
                    </span>
                  </div>
                  <span className="absolute right-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-wide text-navy shadow-sm">
                    {e.count.toLocaleString("fa-IR")} محصول
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
