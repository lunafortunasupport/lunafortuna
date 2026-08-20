"use client";

import { useMemo, useState } from "react";
import { formatToman } from "@/lib/format";
import { useCart } from "@/lib/trendyolCart";
import { priceBreakdown, saleView, type MirrorProductWithVariants } from "@/lib/trendyolCatalog";

export default function TrendyolDetail({
  product,
  images,
  attributes,
  perLirToman,
  cargoFeeEstimateTL,
}: {
  product: MirrorProductWithVariants;
  images: string[];
  attributes: { labelFa: string; valueFa: string }[];
  perLirToman: number;
  cargoFeeEstimateTL: number;
}) {
  const { add, has } = useCart();
  const gallery = images.length ? images : product.image ? [product.image] : [];
  const [activeImg, setActiveImg] = useState(0);
  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;
  const [size, setSize] = useState<string | null>(singleVariant ? singleVariant.size : null);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.size === size) || null,
    [product.variants, size]
  );
  const breakdown = priceBreakdown(selectedVariant, perLirToman, cargoFeeEstimateTL);
  const sale = saleView(product, perLirToman);
  const alreadyInCart = size ? has(product.id, size) : false;
  // نامِ سایتِ منبع را از خودِ لینک دربیاور — محصولات همیشه از ترندیول نیستند (مثلاً آمبار از
  // سایتِ رسمیِ خودش می‌آید)، پس این برچسب نباید هاردکد باشد.
  const sourceHost = useMemo(() => {
    try {
      return new URL(product.sourceUrl).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  }, [product.sourceUrl]);

  function handleAdd() {
    if (!selectedVariant || !selectedVariant.inStock) return;
    add({
      productId: product.id,
      name: product.nameTr,
      nameFa: product.nameFa || undefined,
      brand: product.brand,
      image: product.image,
      sourceUrl: product.sourceUrl,
      size: selectedVariant.size,
      priceTL: selectedVariant.priceTL || 0,
      freeCargo: selectedVariant.freeCargo,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* گالری */}
      <div className="reveal">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-cream ring-1 ring-navy/8">
          {gallery.length ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gallery[activeImg]}
              alt={product.nameFa || product.nameTr}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-navy/15">
              <span className="font-display text-4xl">🌙</span>
            </div>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {gallery.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImg(i)}
                aria-label={`عکسِ ${(i + 1).toLocaleString("fa-IR")}`}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                  i === activeImg ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="reveal">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-navy/70 ring-1 ring-navy/10">
            {product.brand}
          </span>
          <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold">
            {product.categoryFa}
          </span>
          <span className="rounded-full bg-navy/85 px-3 py-1 text-[10.5px] font-medium text-cream">دادهٔ زنده</span>
          {sale.onSale && sale.discountPct ? (
            <span className="rounded-full bg-[#b8442f] px-3 py-1 text-[10.5px] font-bold text-white tabular-nums">
              {sale.discountPct.toLocaleString("fa-IR")}٪ تخفیف
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 font-display text-2xl font-semibold leading-9 text-navy">
          {product.nameFa || product.nameTr}
        </h1>
        {product.nameFa && (
          <p className="mt-1 text-[12px] text-navy/40" dir="ltr">
            {product.nameTr}
          </p>
        )}

        {product.descriptionFa && (
          <p className="mt-4 max-w-lg text-[14px] leading-8 text-navy/65">{product.descriptionFa}</p>
        )}

        {/* انتخابِ سایز */}
        <div className="mt-6">
          <div className="mb-2.5 text-[12px] font-semibold text-navy/60">
            سایز {size && <span className="text-gold">— {size}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.size}
                disabled={!v.inStock}
                onClick={() => setSize(v.size)}
                className={`rounded-lg border px-3.5 py-2 text-[13px] transition-all ${
                  !v.inStock
                    ? "cursor-not-allowed border-navy/8 text-navy/25 line-through"
                    : v.size === size
                    ? "border-gold bg-gold/10 font-semibold text-gold"
                    : "border-navy/15 text-navy/70 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>

        {/* شکافِ شفافِ قیمت (کالا + کارگو) */}
        <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4">
          {breakdown.itemToman != null ? (
            <>
              {sale.onSale && sale.originalToman != null && (
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="text-navy/60">قیمتِ قبل از تخفیف</span>
                  <span className="tabular-nums text-navy/35 line-through">{formatToman(sale.originalToman)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[13px] text-navy/60">
                <span>قیمتِ کالا{sale.onSale ? " (با تخفیف)" : ""}</span>
                <span className="tabular-nums text-navy/75">{formatToman(breakdown.itemToman)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[13px]">
                <span className="text-navy/60">هزینهٔ کارگوی داخلِ ترکیه</span>
                {breakdown.freeCargo ? (
                  <span className="font-medium text-emerald-600">رایگان</span>
                ) : (
                  <span className="tabular-nums text-navy/75">برآوردی · {formatToman(breakdown.cargoToman)}</span>
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-gold/25 pt-2.5">
                <span className="text-[13px] font-medium text-navy/70">جمعِ نهایی</span>
                <span className="font-display text-xl font-bold text-gold tabular-nums">
                  {formatToman(breakdown.totalToman!)}
                </span>
              </div>
              {!breakdown.freeCargo && (
                <p className="mt-2 text-[11px] leading-5 text-navy/40">
                  هزینهٔ کارگو تقریبی است؛ رقمِ دقیق موقعِ خرید توسطِ ما نهایی می‌شود.
                </p>
              )}
            </>
          ) : (
            <div className="text-center text-[13px] text-navy/50">سایز را انتخاب کن تا قیمتِ نهایی دیده شود</div>
          )}
          <button
            onClick={handleAdd}
            disabled={!selectedVariant || !selectedVariant.inStock}
            className="btn-gold mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {justAdded ? "افزوده شد ✓" : alreadyInCart ? "دوباره افزودن" : "افزودن به سبد"}
          </button>
        </div>

        {selectedVariant && !selectedVariant.inStock && (
          <p className="mt-2.5 text-[12.5px] text-red-500">این سایز فعلاً ناموجود است.</p>
        )}

        <a
          href={product.sourceUrl}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-navy/40 underline-offset-2 hover:text-gold hover:underline"
        >
          مشاهدهٔ اصلِ محصول{sourceHost ? ` در ${sourceHost}` : ""} ↗
        </a>

        {/* ویژگی‌ها */}
        {attributes.length ? (
          <div className="mt-8 border-t border-navy/8 pt-6">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-navy/45">ویژگی‌های محصول</div>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {attributes.map((a) => (
                <div key={a.labelFa} className="flex items-baseline justify-between gap-3 border-b border-navy/6 pb-1.5">
                  <dt className="shrink-0 text-[12.5px] text-navy/45">{a.labelFa}</dt>
                  <dd className="text-left text-[12.5px] font-medium text-navy/80">{a.valueFa}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}
