import { formatToman } from "@/lib/format";
import type { TrendyolProduct } from "@/lib/trendyolDemo";

// کارتِ دموی «آینه‌ی ترندیول» — همان زبانِ بصریِ لوکسِ سایت (نه رنگ‌بندیِ ترندیول)،
// با دادهٔ واقعیِ زنده: قیمت، سایز و موجودی مستقیم از ترندیول گرفته شده.
export default function TrendyolDemoCard({ product, perLirToman }: { product: TrendyolProduct; perLirToman: number }) {
  const priceToman = product.minPriceTL != null ? Math.round(product.minPriceTL * perLirToman) : null;
  const inStockCount = product.variants.filter((v) => v.inStock).length;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy/15">
            <span className="font-display text-3xl">🌙</span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-wide text-navy shadow-sm">
          {product.brand}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[9.5px] font-medium tracking-wide text-cream backdrop-blur-sm">
          دادهٔ زنده
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[2.6em] font-display text-[13px] font-semibold leading-6 text-navy">
          {product.name}
        </h3>

        {product.variants.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.variants.slice(0, 6).map((v) => (
              <span
                key={v.size}
                className={`rounded-md border px-1.5 py-0.5 text-[10px] ${
                  v.inStock ? "border-navy/15 text-navy/70" : "border-navy/8 text-navy/25 line-through"
                }`}
              >
                {v.size}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-[15px] font-bold text-gold tabular-nums">
            {priceToman != null ? formatToman(priceToman) : "—"}
          </span>
          {inStockCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] text-navy/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              موجود
            </span>
          ) : (
            <span className="text-[10.5px] text-red-500">ناموجود</span>
          )}
        </div>

        <a
          href={product.sourceUrl}
          target="_blank"
          rel="noopener"
          className="mt-3 block text-center text-[11px] text-navy/35 underline-offset-2 hover:text-gold hover:underline"
        >
          مشاهدهٔ اصلِ محصول در ترندیول ↗
        </a>
      </div>
    </div>
  );
}
