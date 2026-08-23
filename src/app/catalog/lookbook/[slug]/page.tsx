import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { getEditorial, queryMirrorProducts } from "@/lib/trendyolCatalog";
import TrendyolDemoCard from "@/components/TrendyolDemoCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEditorial(slug);
  return { title: e ? `${e.title} — لوک‌بوک` : "لوک‌بوک" };
}

// حالِ رنگیِ هیرو بر اساسِ theme.
const HERO_THEME: Record<string, string> = {
  navy: "bg-navy text-cream",
  gold: "bg-gold text-navy-ink",
  cream: "bg-cream text-navy border-b border-navy/10",
};
const RING_THEME: Record<string, string> = {
  navy: "border-gold/15",
  gold: "border-navy/15",
  cream: "border-gold/20",
};

export default async function LookbookStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const editorial = getEditorial(slug);
  if (!editorial) notFound();

  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  const { items, total } = await queryMirrorProducts(
    { ...editorial.filter, sort: editorial.sort ?? "popular", page: 1 },
    perLirToman
  );

  const isCream = editorial.theme === "cream";
  const subText = isCream ? "text-navy/70" : editorial.theme === "gold" ? "text-navy-ink/75" : "text-cream/75";
  const chipCls = isCream
    ? "border-gold/30 bg-gold/10 text-gold"
    : editorial.theme === "gold"
    ? "border-navy/20 bg-navy/10 text-navy-ink"
    : "border-gold/30 bg-gold/10 text-champagne";

  return (
    <div>
      <div className={`relative overflow-hidden ${HERO_THEME[editorial.theme]}`}>
        <div className="pointer-events-none absolute inset-0">
          <div className={`absolute -left-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border ${RING_THEME[editorial.theme]}`} />
          <div className={`absolute -right-10 top-8 h-40 w-40 animate-spinSlow rounded-full border ${RING_THEME[editorial.theme]}`} />
        </div>
        <div className="container-luna relative py-16">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] tracking-widest ${chipCls}`}>
            📖 منتخبِ سردبیر
          </span>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight md:text-5xl">
            {editorial.heroEmoji} {editorial.title}
          </h1>
          <p className={`mt-3 font-display text-lg ${subText}`}>{editorial.dek}</p>
          <p className={`mt-4 max-w-2xl text-[13.5px] leading-7 ${subText}`}>{editorial.intro}</p>
        </div>
      </div>

      <div className="container-luna py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-[12px] text-navy/45">
            {total.toLocaleString("fa-IR")} محصول در این لوک
          </span>
          <Link href="/catalog/lookbook" className="text-[13px] text-gold hover:text-navy">
            ← همهٔ لوک‌ها
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">
              {editorial.heroEmoji}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">فعلاً محصولی در این لوک نیست</h3>
            <p className="mt-1.5 text-[13px] text-navy/50">به‌زودی با سینکِ بعدی پر می‌شود.</p>
            <Link href="/catalog" className="btn-outline mt-5 inline-flex">
              مشاهدهٔ کاتالوگ
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <TrendyolDemoCard
                  key={p.id}
                  product={p}
                  perLirToman={perLirToman}
                  cargoFeeEstimateTL={s.cargoFeeEstimateTL}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/catalog" className="btn-outline inline-flex">
                کاوش در کاتالوگِ کامل ←
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
