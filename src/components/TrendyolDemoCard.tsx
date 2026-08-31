import Link from "next/link";
import { formatToman } from "@/lib/format";
import { priceBreakdown, saleView, type MirrorProductWithVariants } from "@/lib/trendyolCatalog";
import { RatingInline } from "@/components/Stars";
import WishlistButton from "@/components/WishlistButton";

// کارتِ کاتالوگِ آینه‌ایِ ترندیول — همان زبانِ بصریِ لوکسِ سایت (نه رنگ‌بندیِ ترندیول)،
// با دادهٔ واقعیِ سینک‌شده: قیمت، سایز، موجودی و کارگو مستقیم از ترندیول گرفته شده.
// کلیک روی کارت به صفحهٔ جزئیاتِ داخلی می‌رود (نه مستقیم به ترندیول) — لینکِ اصلی آنجاست.
export default function TrendyolDemoCard({
  product,
  perLirToman,
  cargoFeeEstimateTL,
}: {
  product: MirrorProductWithVariants;
  perLirToman: number;
  cargoFeeEstimateTL: number;
}) {
  const cheapest = product.variants.reduce<MirrorProductWithVariants["variants"][number] | null>((best, v) => {
    if (v.priceTL == null) return best;
    if (!best || (best.priceTL ?? Infinity) > v.priceTL) return v;
    return best;
  }, null);
  const breakdown = priceBreakdown(cheapest, perLirToman, cargoFeeEstimateTL, product.sourceSite);
  const sale = saleView(product, perLirToman);
  const inStockCount = product.variants.filter((v) => v.inStock).length;

  return (
    <Link
      href={`/catalog/${product.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.nameFa || product.nameTr}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy/15">
            <span className="font-display text-3xl">🌙</span>
          </div>
        )}
        <WishlistButton id={product.id} />
      </div>

      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-medium tracking-wide text-navy/50">
            {product.brand}
          </span>
          {product.categoryFa && (
            <span className="shrink-0 text-[10px] font-medium tracking-wide text-gold">
              {product.categoryFa}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 min-h-[2.6em] font-display text-[13px] font-semibold leading-6 text-navy">
          {product.nameFa || product.nameTr}
        </h3>

        {product.ratingScore != null && product.ratingScore > 0 && (
          <div className="mt-1.5">
            <RatingInline score={product.ratingScore} count={product.favoriteCount} />
          </div>
        )}

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
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-[15px] font-bold text-gold tabular-nums">
              {breakdown.itemToman != null ? formatToman(breakdown.itemToman) : "—"}
            </span>
            {sale.onSale && sale.originalToman != null && (
              <span className="text-[11px] text-navy/30 line-through tabular-nums">
                {formatToman(sale.originalToman)}
              </span>
            )}
            {sale.onSale && sale.discountPct ? (
              <span className="text-[10px] font-bold text-[#b8442f] tabular-nums">
                {sale.discountPct.toLocaleString("fa-IR")}٪−
              </span>
            ) : null}
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

        {!breakdown.freeCargo && (
          <span className="mt-1.5 block text-[10px] text-navy/35">+ هزینهٔ کارگو</span>
        )}

        <span className="mt-3 block text-center text-[11px] text-navy/35 transition-colors group-hover:text-gold">
          مشاهدهٔ جزئیات و انتخابِ سایز
        </span>
      </div>
    </Link>
  );
}
