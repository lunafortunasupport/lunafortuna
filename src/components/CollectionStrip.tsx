import Link from "next/link";
import type { CollectionStat } from "@/lib/trendyolCatalog";

// نوارِ کالکشن‌های دست‌چین — هر کدام به همان صفحهٔ کاتالوگ با فیلترِ ازپیش‌تنظیم‌شده لینک می‌شود
// (?collection=slug که در page.tsx به categoryIn/categoryContains/onSale ترجمه می‌شود).
export default function CollectionStrip({ collections }: { collections: CollectionStat[] }) {
  const shown = collections.filter((c) => c.count > 0);
  if (shown.length === 0) return null;

  return (
    <div className="border-b border-navy/8 bg-white">
      <div className="container-luna py-6">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">کالکشن‌های دست‌چین</div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {shown.map((c) => (
            <Link
              key={c.slug}
              href={`/preview/trendyol?collection=${c.slug}`}
              className="group relative flex w-40 shrink-0 flex-col overflow-hidden rounded-xl border border-navy/8 transition-all hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                {c.sampleImages.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.sampleImages[0]}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-navy/5 text-2xl">{c.emoji}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/75 via-transparent to-transparent" />
                <span className="absolute right-2.5 bottom-2 text-[11px] font-bold text-cream">
                  {c.emoji} {c.nameFa}
                </span>
              </div>
              <div className="bg-cream px-2.5 py-1.5 text-[10.5px] text-navy/45">
                {c.count.toLocaleString("fa-IR")} محصول
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
