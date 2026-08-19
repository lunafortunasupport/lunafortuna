"use client";

import { useMemo, useState } from "react";
import { formatToman } from "@/lib/format";
import { useCart } from "@/lib/trendyolCart";
import type { TrendyolProduct } from "@/lib/trendyolDemo";

export default function TrendyolDetail({
  product,
  perLirToman,
  categoryLabel,
}: {
  product: TrendyolProduct;
  perLirToman: number;
  categoryLabel: string;
}) {
  const { add, has } = useCart();
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const [activeImg, setActiveImg] = useState(0);
  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;
  const [size, setSize] = useState<string | null>(singleVariant ? singleVariant.size : null);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.size === size) || null,
    [product.variants, size]
  );
  const priceToman = selectedVariant?.priceTL != null ? Math.round(selectedVariant.priceTL * perLirToman) : null;
  const alreadyInCart = size ? has(product.id, size) : false;

  function handleAdd() {
    if (!selectedVariant || !selectedVariant.inStock) return;
    add({
      productId: product.id,
      name: product.name,
      nameFa: product.nameFa,
      brand: product.brand,
      image: product.image,
      sourceUrl: product.sourceUrl,
      size: selectedVariant.size,
      priceTL: selectedVariant.priceTL || 0,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* گالری */}
      <div className="reveal">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-cream ring-1 ring-navy/8">
          {images.length ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[activeImg]} alt={product.nameFa || product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-navy/15">
              <span className="font-display text-4xl">🌙</span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {images.map((img, i) => (
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
          <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold">{categoryLabel}</span>
          <span className="rounded-full bg-navy/85 px-3 py-1 text-[10.5px] font-medium text-cream">دادهٔ زنده</span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-semibold leading-9 text-navy">
          {product.nameFa || product.name}
        </h1>
        {product.nameFa && (
          <p className="mt-1 text-[12px] text-navy/40" dir="ltr">
            {product.name}
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

        {/* قیمت + افزودن به سبد */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4">
          <div>
            <div className="text-[11px] text-navy/45">قیمتِ سایزِ انتخابی</div>
            <div className="font-display text-xl font-bold text-gold tabular-nums">
              {priceToman != null ? formatToman(priceToman) : "سایز را انتخاب کن"}
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!selectedVariant || !selectedVariant.inStock}
            className="btn-gold shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
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
          مشاهدهٔ اصلِ محصول در ترندیول ↗
        </a>

        {/* ویژگی‌ها */}
        {product.attributes?.length ? (
          <div className="mt-8 border-t border-navy/8 pt-6">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-navy/45">ویژگی‌های محصول</div>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {product.attributes.map((a) => (
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
