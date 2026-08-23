import Link from "next/link";
import type { EditorialStat } from "@/lib/trendyolCatalog";

// نوارِ «منتخبِ سردبیر» — هر لوک به صفحهٔ لوک‌بوکِ خودش لینک می‌شود. الگو از CollectionStrip.
export default function EditorialStrip({ editorials }: { editorials: EditorialStat[] }) {
  const shown = editorials.filter((e) => e.count > 0);
  if (shown.length === 0) return null;

  return (
    <div className="border-b border-navy/8 bg-cream/40">
      <div className="container-luna py-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            📖 منتخبِ سردبیر
          </span>
          <Link href="/catalog/lookbook" className="text-[12px] text-gold hover:text-navy">
            همهٔ لوک‌ها ←
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {shown.map((e) => (
            <Link
              key={e.slug}
              href={`/catalog/lookbook/${e.slug}`}
              className="group relative flex w-52 shrink-0 flex-col overflow-hidden rounded-xl border border-navy/8 transition-all hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                {e.sampleImages.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.sampleImages[0]}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-navy/5 text-2xl">{e.heroEmoji}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/85 via-navy-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="font-display text-[14px] font-black text-cream">
                    {e.heroEmoji} {e.title}
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-[10.5px] text-cream/70">{e.dek}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
