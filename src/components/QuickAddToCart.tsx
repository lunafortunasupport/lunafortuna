"use client";

import { useState } from "react";
import { useCart } from "@/lib/trendyolCart";
import type { MirrorProductWithVariants } from "@/lib/trendyolCatalog";

// افزودنِ سریع به سبد از روی کارت — بدونِ بازکردنِ صفحهٔ محصول. آیکونِ سبد یک پاپ‌آورِ سایز باز
// می‌کند؛ انتخابِ سایز همان واریانت را به سبد اضافه می‌کند (به‌همراهِ sourceUrl تا پرسنل لینکِ اصل
// را ببینند). چون کارت داخلِ <Link> است، همهٔ کلیک‌ها preventDefault/stopPropagation می‌شوند تا
// به صفحهٔ محصول نرود.
export default function QuickAddToCart({ product }: { product: MirrorProductWithVariants }) {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);

  const inStock = product.variants.filter((v) => v.inStock);
  if (inStock.length === 0) return null;

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  function pick(v: MirrorProductWithVariants["variants"][number]) {
    add({
      productId: product.id,
      name: product.nameTr,
      nameFa: product.nameFa || undefined,
      brand: product.brand,
      image: product.image,
      sourceUrl: product.sourceUrl,
      size: v.size,
      priceTL: v.priceTL || 0,
      freeCargo: v.freeCargo,
    });
    setAdded(v.size);
    window.setTimeout(() => {
      setAdded(null);
      setOpen(false);
    }, 1300);
  }

  return (
    <div className="absolute bottom-3 right-3 z-20" onClick={stop}>
      {open && (
        <div className="absolute bottom-11 right-0 w-max max-w-[190px] rounded-xl border border-navy/10 bg-white/98 p-2 shadow-lg backdrop-blur">
          <div className="mb-1.5 px-1 text-right text-[10px] font-medium text-navy/45">سایز را انتخاب کن</div>
          <div className="flex flex-wrap justify-end gap-1">
            {inStock.map((v) => (
              <button
                key={v.size}
                onClick={(e) => {
                  stop(e);
                  pick(v);
                }}
                className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                  added === v.size
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-navy/15 text-navy/70 hover:border-gold hover:text-gold"
                }`}
              >
                {added === v.size ? "✓ افزوده شد" : v.size}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={(e) => {
          stop(e);
          setOpen((o) => !o);
        }}
        aria-label="افزودن به سبد"
        aria-expanded={open}
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition ${
          open ? "bg-gold text-white" : "bg-navy/90 text-cream hover:bg-gold"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
          <path d="M2.5 3h2l2.2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6" />
        </svg>
      </button>
    </div>
  );
}
