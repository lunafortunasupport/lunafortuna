import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseJson, GROUP_LABELS } from "@/lib/util";
import { GENDER_LABELS, subLabel } from "@/lib/linkLabels";

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

  return (
    <>
      {/* هدر برند */}
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        {/* المان‌های تزئینی */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
          <div className="absolute -right-4 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_62%)]" />
          <div className="absolute left-1/4 top-6 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.08),transparent_65%)]" />
        </div>
        <div className="container-luna relative flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-cream shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt={brand.name} className="h-14 w-14 object-contain" />
            ) : (
              <span className="font-display text-4xl text-gold">{brand.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
              {GROUP_LABELS[brand.group] || brand.group}
            </span>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{brand.name}</h1>
            {brand.domain && (
              <span className="mt-1 block text-sm text-cream/50" dir="ltr">
                {brand.domain}
              </span>
            )}
          </div>
          <a href={brand.siteUrl} target="_blank" rel="noopener" className="btn-gold shrink-0">
            ورود به سایت {brand.name} ↗
          </a>
        </div>
      </div>

      <div className="container-luna py-12">
        <div className="mb-8 rounded-2xl border border-gold/20 bg-gold/5 p-5 text-[13px] leading-7 text-navy/70">
          👇 دسته‌ای که می‌خواهی را انتخاب کن تا مستقیم وارد همان بخش در سایت {brand.name} شوی. محصول
          موردنظرت را که پیدا کردی، لینکش را در{" "}
          <Link href="/order" className="font-medium text-gold underline">
            صفحهٔ سفارش
          </Link>{" "}
          برای ما بفرست تا با قیمت شفاف برایت بخریم.
        </div>

        {groups.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-navy/60">برای این برند، از دکمهٔ بالا وارد سایت اصلی شو.</p>
            <a href={brand.siteUrl} target="_blank" rel="noopener" className="btn-navy mt-5">
              ورود به سایت {brand.name} ↗
            </a>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {groups.map((g) => (
              <div key={g.key} className="card-soft p-6">
                <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold text-navy">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/12 text-gold">
                    {GENDER_ICON[g.key] || "✦"}
                  </span>
                  {g.label}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <a
                      key={it.key}
                      href={it.url}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full border border-navy/12 bg-cream/50 px-3.5 py-1.5 text-[12.5px] text-navy/75 transition hover:border-gold hover:bg-gold/5 hover:text-gold"
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
    </>
  );
}
