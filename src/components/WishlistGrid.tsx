"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatToman } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";
import WishlistButton from "@/components/WishlistButton";

interface WishItem {
  id: string;
  title: string;
  brand: string;
  image: string | null;
  categoryFa: string | null;
  ratingScore: number | null;
  favoriteCount: number | null;
  itemToman: number | null;
  originalToman: number | null;
  discountPct: number | null;
  freeCargo: boolean;
  sizes: { size: string; inStock: boolean }[];
  inStock: boolean;
}

export default function WishlistGrid() {
  const { ids, count } = useWishlist();
  const [items, setItems] = useState<WishItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // پس از هر تغییرِ لیست، دادهٔ زنده را دوباره بگیر (قیمت/موجودیِ روز).
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/trendyol/wishlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setItems(Array.isArray(d.items) ? d.items : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // فقط به طولِ لیست حساس باشیم تا هر toggle یک fetch نزند وقتی محتوا عوض نشده؛
    // ولی چون ids با هر تغییر عوض می‌شود، join کافیست.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  if (loading && items === null) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] rounded-2xl bg-navy/5" />
            <div className="mt-3 h-3 w-2/3 rounded bg-navy/5" />
            <div className="mt-2 h-3 w-1/3 rounded bg-navy/5" />
          </div>
        ))}
      </div>
    );
  }

  if (count === 0 || (items && items.length === 0)) {
    return (
      <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e0526b]/10 text-2xl text-[#e0526b]">
          ♡
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-navy">هنوز چیزی نپسندیده‌ای</h3>
        <p className="mt-1.5 text-[13px] text-navy/50">
          روی قلبِ هر محصول بزن تا اینجا ذخیره شود و بعداً راحت پیدایش کنی.
        </p>
        <Link href="/preview/trendyol" className="btn-outline mt-5 inline-flex">
          کاوش در کاتالوگ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items!.map((p) => (
        <div
          key={p.id}
          className="group relative block overflow-hidden rounded-2xl border border-navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
        >
          <Link href={`/preview/trendyol/${p.id}`}>
            <div className="relative aspect-[3/4] overflow-hidden bg-cream">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-navy/15">
                  <span className="font-display text-3xl">🌙</span>
                </div>
              )}
              <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-wide text-navy shadow-sm">
                {p.brand}
              </span>
              {p.discountPct ? (
                <span className="absolute left-3 top-3 rounded-full bg-[#b8442f] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm tabular-nums">
                  {p.discountPct.toLocaleString("fa-IR")}٪ تخفیف
                </span>
              ) : null}
              <WishlistButton id={p.id} />
            </div>
          </Link>

          <div className="p-4">
            {p.categoryFa && (
              <span className="mb-1.5 inline-block text-[10px] font-medium tracking-wide text-gold">
                {p.categoryFa}
              </span>
            )}
            <Link href={`/preview/trendyol/${p.id}`}>
              <h3 className="line-clamp-2 min-h-[2.6em] font-display text-[13px] font-semibold leading-6 text-navy">
                {p.title}
              </h3>
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-[15px] font-bold text-gold tabular-nums">
                  {p.itemToman != null ? formatToman(p.itemToman) : "—"}
                </span>
                {p.originalToman != null && (
                  <span className="text-[11px] text-navy/30 line-through tabular-nums">
                    {formatToman(p.originalToman)}
                  </span>
                )}
              </span>
              {p.inStock ? (
                <span className="inline-flex items-center gap-1 text-[10.5px] text-navy/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  موجود
                </span>
              ) : (
                <span className="text-[10.5px] text-red-500">ناموجود</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
