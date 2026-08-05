"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** آیکون‌های ساده و تمیز (stroke = currentColor) */
const Icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
  order: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  brands: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  account: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  ),
};

const TABS: { href: string; label: string; icon: keyof typeof Icons }[] = [
  { href: "/", label: "خانه", icon: "home" },
  { href: "/shop", label: "موجودی", icon: "shop" },
  { href: "/order", label: "سفارش", icon: "order" },
  { href: "/brands", label: "برندها", icon: "brands" },
  { href: "/account", label: "حساب", icon: "account" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      aria-label="منوی موبایل"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg items-end justify-around border-t border-navy/10 bg-cream/95 px-2 pt-1.5 pb-2 shadow-[0_-8px_30px_rgba(21,35,73,0.10)] backdrop-blur-xl">
        {TABS.map((t) => {
          const active = isActive(t.href);

          // دکمهٔ مرکزی «سفارش» — برجسته و طلایی، مثل اپ‌های موبایل
          if (t.icon === "order") {
            return (
              <Link
                key={t.href}
                href={t.href}
                className="flex flex-col items-center gap-1 -mt-6"
                aria-label="ثبت سفارش"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-champagne text-cream shadow-[0_10px_24px_rgba(154,122,67,0.5)] ring-4 ring-cream/95 transition-transform active:scale-95">
                  <span className="h-6 w-6">{Icons.order}</span>
                </span>
                <span className={`text-[10px] font-medium ${active ? "text-gold" : "text-navy/60"}`}>
                  {t.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors ${
                active ? "text-gold" : "text-navy/55"
              }`}
            >
              <span className="h-6 w-6">{Icons[t.icon]}</span>
              <span className={`text-[10px] ${active ? "font-semibold" : "font-normal"}`}>{t.label}</span>
              <span
                className={`h-1 w-1 rounded-full bg-gold transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
