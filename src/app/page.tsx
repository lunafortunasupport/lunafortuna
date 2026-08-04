import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import Calculator from "@/components/Calculator";
import BannerStrip from "@/components/BannerStrip";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const s = await getSettings();
  const perLir = Math.round(s.exchangeRate * (1 + s.feeNormal));

  const [featuredProducts, featuredBrands, brandCount, banners, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true, isFeatured: true },
      take: 12,
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.count({ where: { isActive: true } }),
    prisma.banner.findMany({
      where: { isActive: true, placement: "promo" },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
    prisma.category.findMany({ where: { scope: "warehouse" }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-navy text-cream">
        {/* پس‌زمینهٔ متحرک */}
        <div className="absolute inset-0">
          <div className="absolute left-[58%] top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 animate-pulseSoft rounded-full bg-[radial-gradient(circle,rgba(154,122,67,0.20),transparent_62%)]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 animate-pulseSoft rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.10),transparent_65%)]" />
        </div>
        <Stars />

        <div className="container-luna relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          {/* لوگوی متحرک — سمت چپ (در RTL: ستون دوم = order-2) */}
          <div className="order-2 hidden justify-center md:order-2 md:flex">
            <AnimatedLogo />
          </div>

          <div className="order-1 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] tracking-[0.2em] text-champagne">
              ✦ خرید مطمئن از ترکیه
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-6xl">
              خیالت راحت،
              <span className="mt-2 block text-champagne">بقیه‌اش با ما</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-8 text-cream/75">
              هر چیزی از ترکیه که در ایران گیرت نمی‌آید — از پوشاک و کیف و کفش تا لوازم خانه. صادقانه
              می‌خریم، سایز و کیفیتش را چک می‌کنیم و تا دستت می‌رسانیم.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/order" className="btn-gold">
                ثبت سفارش
              </Link>
              <Link href="/shop" className="btn-outline !border-cream/25 !text-cream hover:!bg-cream/10">
                مشاهدهٔ موجودی انبار
              </Link>
            </div>
            <div className="mt-12 flex gap-8">
              <Stat n={`+${brandCount.toLocaleString("fa-IR")}`} label="برند معتبر ترکیه" />
              <Stat n="۱۰۰٪" label="بررسی پیش از ارسال" />
              <Stat n="۲۴/۷" label="پشتیبانی و پیگیری" />
            </div>
          </div>
        </div>

        {/* موج پایین هیرو */}
        <div className="h-8 bg-gradient-to-b from-transparent to-cream/0" />
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-b border-navy/10 bg-white">
        <div className="container-luna grid grid-cols-2 gap-px md:grid-cols-4">
          {[
            ["🔍", "بررسی کیفیت و سایز", "پیش از ارسال چک می‌کنیم"],
            ["💎", "قیمت شفاف", "بدون هزینهٔ پنهان"],
            ["🤝", "همراهی تا تحویل", "در تمام مسیر کنارت هستیم"],
            ["📸", "عکس واقعی محصول", "قبل از ارسال می‌فرستیم"],
          ].map(([ico, t, d]) => (
            <div key={t} className="flex items-center gap-3 px-4 py-6">
              <span className="text-2xl">{ico}</span>
              <div>
                <div className="text-[13px] font-semibold text-navy">{t}</div>
                <div className="text-[11px] text-navy/50">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── بنرهای قابل‌مدیریت ── */}
      <BannerStrip banners={banners} />

      {/* ── کاشی‌های دسته‌بندی ── */}
      {categories.length > 0 && (
        <section className="container-luna py-10 reveal">
          <SectionHead label="دسته‌بندی‌ها" title="از کجا شروع کنیم؟" desc="" />
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?cat=${c.slug}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-navy/5 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-gold/30 hover:shadow-card"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">{c.icon}</span>
                <span className="text-[12px] font-medium text-navy/80">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── موجودی منتخب ── */}
      {featuredProducts.length > 0 && (
        <section className="container-luna py-14 reveal">
          <SectionHead
            label="موجودی انبار تهران"
            title="آمادهٔ ارسال فوری"
            desc="کالاهایی که همین حالا در انبار تهران موجودند و سریع به دستت می‌رسند."
            href="/shop"
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── برندهای شاخص ── */}
      <section className="bg-white py-16 reveal">
        <div className="container-luna">
          <SectionHead
            label="کتگوری بر اساس برند"
            title="برندهای معتبر ترکیه"
            desc="روی هر برند بزن تا وارد سایت اصلی آن در ترکیه شوی و محصول موردنظرت را پیدا کنی."
            href="/brands"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {featuredBrands.map((b) => (
              <BrandCard key={b.slug} brand={b} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/brands" className="btn-outline">
              مشاهدهٔ همهٔ {brandCount.toLocaleString("fa-IR")} برند
            </Link>
          </div>
        </div>
      </section>

      {/* ── چطور کار می‌کنیم ── */}
      <section className="container-luna py-16 reveal">
        <SectionHead label="فرایند خرید" title="در چهار قدم ساده" desc="" />
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ["۱", "محصول را پیدا کن", "از برندهای ترکیه یا موجودی انبار، محصولت را انتخاب کن."],
            ["۲", "لینک را برایمان بفرست", "لینک محصول را در فرم سفارش یا تلگرام بده."],
            ["۳", "قیمت شفاف بگیر", "قیمت تومان نهایی را می‌بینی و پرداخت می‌کنی."],
            ["۴", "با خیال راحت تحویل بگیر", "بررسی می‌کنیم، عکس می‌فرستیم و ارسال می‌کنیم."],
          ].map(([n, t, d]) => (
            <div key={n} className="card-soft p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 font-display text-lg font-bold text-gold">
                {n}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-[13px] leading-6 text-navy/55">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ماشین‌حساب ── */}
      <section className="bg-white py-16 reveal">
        <div className="container-luna grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHead label="ماشین‌حساب" title="همین حالا قیمتت را بدان" desc="" />
            <p className="max-w-md text-[14px] leading-8 text-navy/60">
              کافی است قیمت لیرِ محصول موردنظرت را وارد کنی تا قیمت تومان نهایی را ببینی — شفاف و بدون
              هزینهٔ پنهان. برای ثبت سفارش هم می‌توانی از فرم سایت یا ربات تلگرام استفاده کنی.
            </p>
            <Link href="/order" className="btn-navy mt-6">
              رفتن به صفحهٔ سفارش
            </Link>
          </div>
          <Calculator perLirToman={perLir} />
        </div>
      </section>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-champagne">{n}</div>
      <div className="mt-1 text-[11px] text-cream/50">{label}</div>
    </div>
  );
}

function SectionHead({ label, title, desc, href }: { label: string; title: string; desc: string; href?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <span className="sec-label">{label}</span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">{title}</h2>
        {desc && <p className="mt-3 max-w-xl text-[14px] leading-7 text-navy/55">{desc}</p>}
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 text-sm text-gold hover:text-champagne sm:block">
          مشاهدهٔ همه ←
        </Link>
      )}
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 46 }, (_, i) => ({
    top: `${(i * 37) % 100}%`,
    left: `${(i * 53) % 100}%`,
    size: `${(i % 3) + 1}px`,
    delay: `${(i % 6) * 0.5}s`,
  }));
  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cream/40"
          style={{
            top: st.top,
            left: st.left,
            width: st.size,
            height: st.size,
            animation: `fadeIn 2s ease-in-out ${st.delay} infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/** لوگوی متحرک: حلقه‌های چرخان + نقطهٔ مداری + لوگوی واقعی شناور */
function AnimatedLogo() {
  return (
    <div className="relative h-[360px] w-[360px] animate-float">
      {/* حلقه‌های چرخان */}
      <div className="absolute inset-0 animate-spinSlow rounded-full border border-gold/25">
        <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_16px_rgba(154,122,67,0.8)]" />
      </div>
      <div className="absolute inset-8 animate-spinRev rounded-full border border-gold/15" />
      <div className="absolute inset-16 rounded-full border border-gold/10" />
      {/* هالهٔ نور نرم */}
      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.22),transparent_62%)]" />
      {/* لوگو به‌صورت ماسک با گرادیان کرم→طلایی (بدون پس‌زمینه) */}
      <div
        className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2"
        style={{
          WebkitMaskImage: "url(/logo.png)",
          maskImage: "url(/logo.png)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          background: "linear-gradient(135deg, #F5F1E8 0%, #C9A96A 55%, #9A7A43 100%)",
          filter: "drop-shadow(0 0 22px rgba(201,169,106,0.5))",
        }}
        aria-label="LunaFortuna"
      />
    </div>
  );
}
