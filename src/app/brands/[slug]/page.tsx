import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseJson, GROUP_LABELS } from "@/lib/util";
import { GENDER_LABELS, subLabel } from "@/lib/linkLabels";
import Divider from "@/components/Divider";
import BrandCard from "@/components/BrandCard";

export const dynamic = "force-dynamic";

type Links = Record<string, string | Record<string, string>>;

const GENDER_ICON: Record<string, string> = {
  w: "👩",
  m: "👨",
  k: "👶",
  home: "🏠",
  cats: "🛍",
  _direct: "✦",
};

const ORDINAL = ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵", "۰۶", "۰۷", "۰۸"];

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const brand = await prisma.brand.findUnique({ where: { slug: params.slug } });
  return { title: brand ? `${brand.name} — خرید از ترکیه` : "برند" };
}

export default async function BrandPage({ params }: { params: { slug: string } }) {
  const brand = await prisma.brand.findUnique({ where: { slug: params.slug } });
  if (!brand || !brand.isActive) notFound();

  const links = parseJson<Links>(brand.categoryLinks, {});

  // گروه‌بندی: کلیدهای سطح اول (w/m/k/home/cats) → زیردسته‌ها
  const groups: { key: string; label: string; items: { key: string; label: string; url: string }[] }[] = [];
  for (const [gk, gv] of Object.entries(links)) {
    if (typeof gv === "string") {
      // لینک تخت (مثل multi یا فیلدهای مستقیم)
      let g = groups.find((x) => x.key === "_direct");
      if (!g) {
        g = { key: "_direct", label: "دسته‌بندی‌ها", items: [] };
        groups.push(g);
      }
      g.items.push({ key: gk, label: subLabel(gk), url: gv });
    } else if (gv && typeof gv === "object") {
      const items = Object.entries(gv)
        .filter(([, u]) => typeof u === "string" && (u as string).startsWith("http"))
        .map(([k, u]) => ({ key: k, label: subLabel(k), url: u as string }));
      if (items.length) groups.push({ key: gk, label: GENDER_LABELS[gk] || gk, items });
    }
  }

  const related = await prisma.brand.findMany({
    where: { isActive: true, group: brand.group, slug: { not: brand.slug } },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    take: 6,
    select: { slug: true, name: true, domain: true, logoUrl: true, group: true },
  });

  return (
    <>
      {/* هدرِ برند */}
      <div className="reveal relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        {/* المان‌های تزئینی */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
          <div className="absolute -right-4 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_62%)]" />
          <div className="absolute left-1/4 top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.08),transparent_65%)]" />
        </div>

        {brand.saleActive && brand.saleUrl && (
          <a
            href={brand.saleUrl}
            target="_blank"
            rel="noopener"
            className="rise-up relative flex items-center justify-center gap-2.5 border-b border-gold/25 bg-gradient-to-l from-gold/15 via-gold/5 to-transparent px-5 py-2.5 text-[12.5px] text-champagne transition-colors hover:bg-gold/10"
          >
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">SALE</span>
            {brand.saleLabel || "این برند الان حراج دارد"} — مشاهدهٔ حراج ←
          </a>
        )}

        <div className="container-luna relative flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center">
          <div className="rise-up flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt={brand.name} className="h-14 w-14 object-contain" />
            ) : (
              <span className="font-display text-4xl text-gold">{brand.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <span className="rise-up inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
              {GROUP_LABELS[brand.group] || brand.group}
            </span>
            <h1 className="rise-up mt-3 font-display text-4xl font-semibold md:text-5xl" style={{ transitionDelay: "60ms" }}>
              {brand.name}
            </h1>
            {brand.domain && (
              <span className="rise-up mt-1 block text-sm text-cream/50" dir="ltr" style={{ transitionDelay: "110ms" }}>
                {brand.domain}
              </span>
            )}
          </div>
          <a href={brand.siteUrl} target="_blank" rel="noopener" className="rise-up btn-gold shrink-0" style={{ transitionDelay: "150ms" }}>
            ورود به سایت {brand.name} ↗
          </a>
        </div>
      </div>

      <div className="container-luna py-12">
        <div className="reveal mb-8 flex items-start gap-4 rounded-2xl border border-gold/20 bg-gold/5 p-5 text-[13px] leading-7 text-navy/70">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">✦</span>
          <p>
            دسته‌ای که می‌خواهی را انتخاب کن تا مستقیم وارد همان بخش در سایت {brand.name} شوی. محصول
            موردنظرت را که پیدا کردی، لینکش را در{" "}
            <Link href="/order" className="font-medium text-gold underline underline-offset-4">
              صفحهٔ سفارش
            </Link>{" "}
            برای ما بفرست تا با قیمت شفاف برایت بخریم.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="reveal relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center text-cream">
            {/* المان‌های گرافیکی متحرک */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.18),transparent_62%)]" />
            </div>
            <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-0 animate-spinSlow rounded-full border border-gold/30">
                <span className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_14px_rgba(154,122,67,0.8)]" />
              </div>
              <div className="absolute inset-5 animate-spinRev rounded-full border border-gold/15" />
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                {brand.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logoUrl} alt={brand.name} className="h-12 w-12 object-contain" />
                ) : (
                  <span className="font-display text-3xl text-gold">{brand.name.charAt(0)}</span>
                )}
              </div>
            </div>
            <h3 className="relative font-display text-2xl font-semibold">{brand.name} در ترکیه</h3>
            <p className="relative mx-auto mt-2 max-w-md text-[13px] leading-7 text-cream/70">
              وارد سایت اصلی {brand.name} شو، محصول موردنظرت را انتخاب کن و لینکش را برای ما بفرست تا با
              قیمت شفاف برایت بخریم.
            </p>
            <a href={brand.siteUrl} target="_blank" rel="noopener" className="btn-gold relative mt-6">
              ورود به سایت {brand.name} ↗
            </a>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {groups.map((g, gi) => (
              <div key={g.key} className="reveal card-soft group relative overflow-hidden p-6" style={{ transitionDelay: `${gi * 60}ms` }}>
                <span className="pointer-events-none absolute -left-3 -top-5 select-none font-display text-6xl font-black text-navy/[0.04]">
                  {ORDINAL[gi % ORDINAL.length]}
                </span>
                <h2 className="relative mb-4 flex items-center gap-3 font-display text-lg font-semibold text-navy">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/12 text-gold">
                    {GENDER_ICON[g.key] || "✦"}
                  </span>
                  {g.label}
                </h2>
                <div className="relative flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <a
                      key={it.key}
                      href={it.url}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full border border-navy/12 bg-cream/50 px-3.5 py-1.5 text-[12.5px] text-navy/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/5 hover:text-gold hover:shadow-sm"
                    >
                      {it.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length >= 3 && (
        <section className="container-luna pb-16">
          <Divider className="mb-12" />
          <div className="reveal mb-7 flex items-center justify-between">
            <h2 className="rise-up font-display text-xl font-semibold text-navy">
              دیگر برندهای {GROUP_LABELS[brand.group] || brand.group}
            </h2>
            <Link href={`/brands?group=${brand.group}`} className="rise-up text-[12.5px] font-medium text-gold hover:underline" style={{ transitionDelay: "60ms" }}>
              مشاهدهٔ همه ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((b, i) => (
              <div key={b.slug} className="reveal" style={{ transitionDelay: `${i * 45}ms` }}>
                <BrandCard brand={b} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
