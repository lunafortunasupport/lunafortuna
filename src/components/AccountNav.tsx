"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/account",
    label: "حساب من",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
      </svg>
    ),
  },
  {
    href: "/account/orders",
    label: "سفارش‌های من",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 space-y-1">
      {ITEMS.map((it) => {
        const active = it.href === "/account" ? pathname === "/account" : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
              active ? "bg-navy text-cream shadow-sm" : "text-navy/65 hover:bg-navy/5 hover:text-navy"
            }`}
          >
            <span className={`h-[18px] w-[18px] ${active ? "text-gold" : "text-navy/40"}`}>{it.icon}</span>
            {it.label}
          </Link>
        );
      })}
      <form action="/api/auth/logout" method="POST">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-right text-sm text-navy/40 transition-colors hover:bg-red-50 hover:text-red-500">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
            <path d="M10 17l5-5-5-5M15 12H3" />
          </svg>
          خروج
        </button>
      </form>
    </nav>
  );
}
