"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// نوارِ ناوبریِ داخلیِ پیش‌نمایشِ ترندیول (هنوز از منوی اصلیِ سایت لینک نمی‌شود).
const LINKS = [
  { href: "/preview/trendyol", label: "همهٔ محصولات", exact: true },
  { href: "/preview/trendyol/brands", label: "برندها" },
  { href: "/preview/trendyol/sale", label: "تخفیف‌ها" },
  { href: "/preview/trendyol/cart", label: "سبدِ خرید" },
];

export default function TrendyolPreviewNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-navy/8 bg-white/70 backdrop-blur-sm">
      <div className="container-luna flex items-center gap-1 overflow-x-auto py-2.5">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors ${
                active ? "bg-navy text-cream" : "text-navy/60 hover:bg-navy/5 hover:text-navy"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
