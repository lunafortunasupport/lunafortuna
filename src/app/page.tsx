import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import SaleStrip from "@/components/SaleStrip";
import Counter from "@/components/Counter";
import Divider from "@/components/Divider";
import BrandMarquee from "@/components/BrandMarquee";
import PopularShowcase from "@/components/PopularShowcase";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import FeaturedBrandsBand from "@/components/FeaturedBrandsBand";
import { getPillarStats, getFeaturedBrandStats, priceBreakdown, saleView, type MirrorProductWithVariants } from "@/lib/trendyolCatalog";

// اسلایدهای پیش‌فرضِ هیرو — عکس‌های ادیتوریال/لایف‌استایلِ باکیفیتِ محلیِ خودِ سایت (همان‌هایی که
// در بخشِ «دسته‌ها»، «چرا لونافورتونا» و «لحظهٔ ادیتوریال» هم استفاده می‌شوند)، نه عکسِ محصولِ
// خامِ ترندیول. عکسِ محصول برای کاتالوگِ لیستینگ ساخته شده، نه برای هیرو — کیفیت و کادربندیِ
// یکدست ندارد (مثلاً crop عجیب یا حتی کالای بی‌ربطِ خانه با بیشترین پسند). دو تای اول
// (hero-shopping/boutique) در جای دیگری از صفحه استفاده نمی‌شوند؛ سه‌تای بعدی همان عکسِ کاشی‌های
// «دسته‌ها»ی زیرش‌اند — تکرارِ عمدی و کم‌ریسک (یک عکسِ رخت‌آویز/مدل، نه تصویرِ خاصِ به‌یادماندنی)
// تا کاروسل واقعاً چندتا اسلایدِ متفاوت داشته باشد.
const CURATED_HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-main",
    eyebrow: "آتلیهٔ خرید از ترکیه",
    title: "خیالت راحت، بقیه‌اش با ما",
    subtitle: "هر چه از ترکیه در ایران به‌دستت نمی‌رسد — با یک واسطهٔ مطمئن، دانه‌به‌دانه بررسی‌شده.",
    image: "/images/hero-shopping.jpg",
    href: "/order",
    ctaText: "ثبت سفارش",
  },
  {
    id: "hero-catalog",
    eyebrow: "کاتالوگِ ترکیه",
    title: "پرفروش‌ها، به فارسی و تومان",
    subtitle: "منتخب‌ها و حراج‌های ترندیول، بدونِ نیازِ گشتن تو سایتِ ترکی.",
    image: "/images/boutique.jpg",
    href: "/catalog",
    ctaText: "مشاهدهٔ کاتالوگ",
  },
  {
    id: "hero-women",
    eyebrow: "کالکشن",
    title: "پوشاکِ زنانه",
    subtitle: "از روزمره تا مجلسی، از ده‌ها برند.",
    image: "/images/rack.jpg",
    href: "/catalog?collection=women",
    ctaText: "مشاهدهٔ کالکشن",
  },
  {
    id: "hero-men",
    eyebrow: "کالکشن",
    title: "دنیای مردانه",
    subtitle: "پیراهن، تی‌شرت، شلوار و کاپشنِ مردانه.",
    image: "/images/menswear.jpg",
    href: "/catalog?collection=men",
    ctaText: "مشاهدهٔ کالکشن",
  },
  {
    id: "hero-bags",
    eyebrow: "لوک‌بوک",
    title: "کیف و کفشِ منتخب",
    subtitle: "جزئیاتی که استایل را کامل می‌کنند.",
    image: "/images/quiet-luxury.jpg",
    href: "/catalog/lookbook/bags-shoes",
    ctaText: "مشاهدهٔ لوک",
  },
];

export const dynamic = "force-dynamic";

// برچسبِ فهرست‌مانندِ ادیتوریال (۰۱ — دربارهٔ ما)
function Index({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] tracking-[0.28em] text-gold">
      <span className="font-display font-bold">{n}</span>
      <span className="h-px w-8 bg-gold/50" />
      <span className="text-navy/50">{label}</span>
    </div>
  );
}

export default async function HomePage() {
  const s = await getSettings();
  const perLir = Math.round(s.exchangeRate * (1 + s.feeNormal));

  const [brandCount, directory, sales, popular, featuredStats, brandBandStats, heroBanners] = await Promise.all([
      prisma.brand.count({ where: { isActive: true } }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
        take: 48,
        select: { name: true, slug: true, logoUrl: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true, saleActive: true, saleUrl: { not: null } },
        orderBy: { sortOrder: "asc" },
        take: 12,
        select: { slug: true, name: true, logoUrl: true, saleUrl: true, saleLabel: true },
      }),
      // محبوب‌ترین‌ها (ویترینِ صفحهٔ اصلی): مُدمحور — فقط پوشاک/کیف/کفشِ زنانهٔ عمومی
      // (audience=null)، تا لیدِ صفحه لوازمِ خانه/نظافت (که favoriteCountِ خیلی بالا دارند) نباشد.
      // فیلترِ gt:0 هم nullهای favoriteCount را حذف می‌کند تا مرتب‌سازی روی Postgres/SQLite یکسان بماند.
      prisma.mirrorProduct.findMany({
        where: { isActive: true, favoriteCount: { gt: 0 }, audience: null, category: { not: { startsWith: "Tesettür" } } },
        orderBy: [{ favoriteCount: "desc" }, { ratingScore: "desc" }],
        take: 13,
        include: { variants: true },
      }),
      getPillarStats(),
      getFeaturedBrandStats(),
      // بنرهای دستیِ هیرو — عسل هر وقت عکسِ کمپین/مدلِ خودِ برند داشت، از /admin/banners اضافه می‌کند.
      prisma.banner.findMany({
        where: { isActive: true, placement: "hero" },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  // محبوب‌ترین‌ها → دادهٔ سادهٔ سریالایزبل برای کامپوننتِ کلاینت (قیمت‌ها همین‌جا حساب می‌شوند).
  const toItem = (p: MirrorProductWithVariants) => {
    const cheapest = p.variants.reduce<MirrorProductWithVariants["variants"][number] | null>((best, v) => {
      if (v.priceTL == null) return best;
      if (!best || (best.priceTL ?? Infinity) > v.priceTL) return v;
      return best;
    }, null);
    const breakdown = priceBreakdown(cheapest, perLir, s.cargoFeeEstimateTL, p.sourceSite);
    const sale = saleView(p, perLir);
    return {
      id: p.id,
      title: p.nameFa || p.nameTr,
      brand: p.brand,
      image: p.image,
      categoryFa: p.categoryFa,
      favoriteCount: p.favoriteCount,
      itemToman: breakdown.itemToman,
      originalToman: sale.onSale ? sale.originalToman : null,
      discountPct: sale.onSale ? sale.discountPct : null,
      freeCargo: breakdown.freeCargo,
    };
  };
  const popularItems = (popular as MirrorProductWithVariants[]).map(toItem);
  const leadItem = popularItems[0] || null;
  const railItems = popularItems.slice(1);
  const showcaseBrands = featuredStats
    .filter((b) => b.count > 0)
    .map((b) => ({ slug: b.slug, nameFa: b.nameFa, nameEn: b.nameEn, count: b.count, image: b.sampleImages[0] || null }));
  // نکته: featuredStats حالا سه ستونِ منبع است (getPillarStats)، پس showcaseBrands = ترندیول/میلا/آمبار.

  // اسلایدهای هیرو: بنرهای دستیِ عسل (عکسِ کمپینِ واقعی) اولویتِ اول‌اند؛ وگرنه از مجموعهٔ ثابتِ
  // عکس‌های ادیتوریالِ باکیفیتِ خودِ سایت استفاده می‌شود — نه عکسِ کاتالوگِ ترندیول (تجربهٔ قبلی
  // نشان داد که آن عکس‌ها برای هیرو هیچ‌وقت به‌اندازهٔ کافی یکدست/لاکچری نیستند).
  const bannerSlides: HeroSlide[] = heroBanners
    .filter((b) => b.imageUrl)
    .map((b) => ({
      id: `banner-${b.id}`,
      eyebrow: "آتلیهٔ خرید از ترکیه",
      title: b.title || "خیالت راحت، بقیه‌اش با ما",
      subtitle: b.subtitle,
      image: b.imageUrl,
      href: b.link || "/catalog",
      ctaText: b.ctaText || "مشاهده",
    }));
  const heroSlides: HeroSlide[] = bannerSlides.length > 0 ? bannerSlides : CURATED_HERO_SLIDES;

  // کاشی‌های دسته → مستقیم به کاتالوگِ زندهٔ فارسی (نه فهرستِ لینک‌های برند). همان تمایزِ اصلیِ سایت.
  const tiles = [
    { img: "/images/rack.jpg", fa: "پوشاک زنانه", en: "Women", href: "/catalog?collection=women" },
    { img: "/images/menswear.jpg", fa: "پوشاک مردانه", en: "Men", href: "/catalog?collection=men" },
    { img: "/images/quiet-luxury.jpg", fa: "کیف و کفش", en: "Bags & Shoes", href: "/catalog/lookbook/bags-shoes" },
    { img: "/images/window-warm.jpg", fa: "خانه و لوازم", en: "Home", href: "/catalog?collection=home" },
  ];

  return (
    <>
      {/* ═══════════ HERO — اسلایدرِ مزونی ═══════════ */}
      <HeroCarousel slides={heroSlides} brandCount={brandCount} perLir={perLir} />

      {/* ═══════════ مارکیِ برندها (اثباتِ اجتماعی) ═══════════ */}
      <BrandMarquee brands={directory} />

      {/* ═══════════ دسته‌ها (تصویرمحور) — دروازهٔ ورود به کاتالوگ ═══════════ */}
      <section className="bg-cream">
        <div className="container-luna py-24 md:py-28">
          <div className="reveal mb-12 flex items-end justify-between gap-6 border-b border-navy/10 pb-8">
            <div>
              <div className="rise-up"><Index n="۰۱" label="دسته‌ها" /></div>
              <h2 className="rise-up mt-5 font-display text-[clamp(28px,4vw,46px)] font-black text-navy" style={{ transitionDelay: "60ms" }}>
                از کجا شروع کنیم؟
              </h2>
            </div>
            <Link href="/catalog" className="hidden shrink-0 text-sm text-gold hover:text-navy sm:inline">مشاهدهٔ کاتالوگ ←</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((t) => (
              <Link key={t.fa} href={t.href} className="img-wipe group relative block aspect-[3/4] overflow-hidden rounded-sm bg-navy">
                <Image src={t.img} alt={t.fa} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/85 via-navy-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[11px] tracking-[0.25em] text-champagne/80">{t.en}</div>
                  <div className="mt-1 font-display text-xl font-bold text-cream">{t.fa}</div>
                  <span className="mt-2.5 block h-px w-8 bg-champagne transition-all duration-300 group-hover:w-16" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ محبوب‌ترین‌های ترکیه (کاتالوگِ زنده) ═══════════ */}
      {leadItem && (
        <section className="bg-cream">
          <div className="container-luna pb-24 md:pb-28">
            <div className="reveal mb-12 flex items-end justify-between gap-6 border-b border-navy/10 pb-8">
              <div>
                <div className="rise-up"><Index n="۰۲" label="محبوب‌ترین‌های ترکیه" /></div>
                <h2 className="rise-up mt-5 font-display text-[clamp(28px,4vw,46px)] font-black text-navy" style={{ transitionDelay: "60ms" }}>
                  آنچه خریداران بیشتر پسندیده‌اند
                </h2>
              </div>
              <Link href="/catalog" className="hidden shrink-0 text-sm text-gold hover:text-navy sm:inline">
                دیدنِ همهٔ محبوب‌ها ←
              </Link>
            </div>
            <div className="reveal">
              <PopularShowcase lead={leadItem} rail={railItems} brands={showcaseBrands} />
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ برندهای محبوب (هوکِ ورود به ویترینِ برندها) ═══════════ */}
      <FeaturedBrandsBand brands={brandBandStats} />

      {/* ═══════════ مانیفست ═══════════ */}
      <section className="bg-cream">
        <div className="container-luna grid items-center gap-14 py-24 md:grid-cols-2 md:py-32">
          <div className="reveal order-2 md:order-1">
            <div className="rise-up"><Index n="۰۳" label="چرا لونافورتونا" /></div>
            <h2 className="rise-up mt-7 font-display text-[clamp(30px,4.4vw,52px)] font-black leading-[1.2] text-navy" style={{ transitionDelay: "80ms" }}>
              هر چیزی از ترکیه،
              <br />
              بی‌واسطهٔ دردسر.
            </h2>
            <p className="rise-up mt-7 max-w-md text-[15px] leading-9 text-navy/65" style={{ transitionDelay: "160ms" }}>
              نه حساب ارزی می‌خواهد، نه ریسکِ فروشندهٔ ناشناس. تو فقط لینکِ محصول را می‌فرستی؛ ما در
              استانبول می‌خریم، دانه‌به‌دانه بررسی می‌کنیم، عکس واقعی می‌فرستیم و تا دستت می‌رسانیم.
            </p>
            <div className="rise-up mt-9 flex gap-10 border-t border-navy/10 pt-7" style={{ transitionDelay: "220ms" }}>
              <div>
                <Counter to={100} suffix="٪" className="font-display text-3xl font-black text-navy" />
                <div className="mt-1 text-[11.5px] text-navy/45">بررسی پیش از ارسال</div>
              </div>
              <div>
                <span className="font-display text-3xl font-black text-navy">۲۴/۷</span>
                <div className="mt-1 text-[11.5px] text-navy/45">همراهی تا تحویل</div>
              </div>
              <div>
                <Counter to={brandCount} prefix="+" className="font-display text-3xl font-black text-navy" />
                <div className="mt-1 text-[11.5px] text-navy/45">برندِ معتبر</div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="img-wipe relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image src="/images/portrait.jpg" alt="سبکِ شخصی" fill sizes="(max-width:768px) 100vw, 44vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ لحظهٔ ادیتوریال (تمام‌عرض) ═══════════ */}
      {/* بعد از «چرا لونافورتونا» می‌آید تا ریتمِ بصریِ بالای صفحه (هیرو→مارکی→دسته‌ها→محبوب‌ترین‌ها→
          منیفستِ عکس‌دار→این عکسِ تمام‌عرض) بدونِ وقفه ادامه پیدا کند؛ بخشِ متن‌محورِ «روالِ سفارش»
          عمداً بعد از این آمده تا حسِ گالری‌گَشتن را وسطِ صفحه نشکند. */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-ink text-cream">
        <Image src="/images/editorial-duomo.jpg" alt="سبکِ خیابانی اروپا" fill sizes="100vw" className="object-cover object-top opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-l from-navy-ink/90 via-navy-ink/45 to-transparent" />
        <div className="container-luna relative py-24">
          <div className="reveal max-w-xl">
            <div className="rise-up"><span className="text-[12px] tracking-[0.32em] text-champagne">دست‌چینِ برندهای معتبر</span></div>
            <h2 className="rise-up mt-6 font-display text-[clamp(30px,5vw,60px)] font-black leading-[1.15]" style={{ transitionDelay: "80ms" }}>
              از ویترین‌های استانبول
              <br />
              تا خانهٔ تو
            </h2>
            <p className="rise-up mt-7 max-w-md text-[15px] leading-9 text-cream/70" style={{ transitionDelay: "160ms" }}>
              همان برندهایی که در پاساژها و سایت‌های ترکیه می‌بینی — حالا بدونِ دردسرِ خرید و ارسال،
              با یک واسطهٔ مطمئن.
            </p>
            <Link href="/order" className="rise-up mt-9 inline-flex btn border border-champagne/50 px-8 py-3.5 text-cream hover:bg-champagne hover:text-navy-ink" style={{ transitionDelay: "220ms" }}>
              همین حالا سفارش بده
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ روالِ سفارش ═══════════ */}
      <section className="bg-navy text-cream">
        <div className="container-luna py-24 md:py-28">
          <div className="reveal mx-auto max-w-2xl text-center">
            <div className="rise-up flex justify-center"><Index n="۰۴" label="روالِ سفارش" /></div>
            <h2 className="rise-up mt-6 font-display text-[clamp(28px,4vw,46px)] font-black" style={{ transitionDelay: "80ms" }}>
              از یک پیام تا دمِ در
            </h2>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["۱", "لینک را بفرست", "لینکِ محصول از هر سایت ترکیه‌ای را برایمان می‌فرستی."],
              ["۲", "قیمت شفاف", "با نرخ لیرِ روز و بی‌هزینهٔ پنهان، قیمت نهایی را می‌گوییم."],
              ["۳", "می‌خریم و می‌بینیم", "می‌خریم، سایز و کیفیت را چک و عکس واقعی می‌فرستیم."],
              ["۴", "به دستت می‌رسد", "تا لحظهٔ تحویل، در تمام مسیر کنارت هستیم."],
            ].map(([n, t, d], i) => (
              <div key={n} className="reveal group border-t border-champagne/25 pt-6">
                <div className="rise-up font-display text-6xl font-black text-champagne/85" style={{ transitionDelay: `${i * 60}ms` }}>{n}</div>
                <h3 className="rise-up mt-5 text-lg font-bold" style={{ transitionDelay: `${i * 60 + 40}ms` }}>{t}</h3>
                <p className="rise-up mt-3 text-[13px] leading-8 text-cream/55" style={{ transitionDelay: `${i * 60 + 80}ms` }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ حراج ═══════════ */}
      {sales.length > 0 && <SaleStrip sales={sales.map((b) => ({ ...b, saleUrl: b.saleUrl as string }))} />}

      {/* ═══════════ فهرستِ خانه‌ها ═══════════ */}
      <section className="bg-cream">
        <Divider className="pt-16" />
        <div className="container-luna py-20 md:py-24">
          <div className="reveal mb-10 flex items-end justify-between gap-6 border-b border-navy/10 pb-8">
            <div>
              <div className="rise-up"><Index n="۰۵" label="خانه‌های ترکیه" /></div>
              <h2 className="rise-up mt-5 font-display text-[clamp(28px,4vw,46px)] font-black text-navy" style={{ transitionDelay: "60ms" }}>
                {brandCount.toLocaleString("fa-IR")} برند، دست‌چین‌شده
              </h2>
            </div>
          </div>
          <div className="reveal columns-2 gap-x-8 sm:columns-3 lg:columns-4">
            {directory.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="block break-inside-avoid border-b border-navy/8 py-2.5 text-[14.5px] text-navy/70 transition-all hover:pr-2 hover:text-gold"
              >
                {b.name}
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/brands" className="btn border border-navy/20 px-8 py-3 text-navy hover:border-gold hover:text-gold">دیدنِ همهٔ برندها</Link>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA پایانی ═══════════ */}
      <section className="bg-navy text-cream">
        <div className="container-luna reveal py-24 text-center md:py-28">
          <h2 className="rise-up mx-auto max-w-2xl font-display text-[clamp(30px,5vw,58px)] font-black leading-[1.15]">
            آماده‌ای؟ لینکت را بفرست،
            <span className="block text-champagne">بقیه‌اش با ما.</span>
          </h2>
          <div className="rise-up mt-10" style={{ transitionDelay: "120ms" }}>
            <Link href="/order" className="btn bg-champagne px-10 py-4 text-navy-ink hover:bg-cream">ثبت سفارش</Link>
          </div>
        </div>
      </section>
    </>
  );
}
