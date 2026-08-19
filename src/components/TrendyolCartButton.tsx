"use client";

import Link from "next/link";
import { useCart } from "@/lib/trendyolCart";

// آیکونِ شناورِ سبدِ خرید — سمتِ راست تا با دکمهٔ چت (سمتِ چپ) و نوارِ موبایل تداخل نداشته باشد.
export default function TrendyolCartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/preview/trendyol/cart"
      aria-label={`سبدِ خرید${count > 0 ? ` (${count.toLocaleString("fa-IR")} کالا)` : ""}`}
      className="fixed bottom-[92px] right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-navy text-cream shadow-[0_10px_28px_rgba(21,35,73,0.45)] transition-transform hover:scale-105 active:scale-95 lg:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white ring-2 ring-cream tabular-nums">
          {count.toLocaleString("fa-IR")}
        </span>
      )}
    </Link>
  );
}
