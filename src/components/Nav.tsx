"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

interface Cat {
  name: string;
  slug: string;
  icon: string | null;
}
interface Group {
  key: string;
  label: string;
  count: number;
}

export default function Nav({ categories, brandGroups }: { categories: Cat[]; brandGroups: Group[] }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkCls = (href: string) =>
    `rounded-lg px-3.5 py-2 text-[13px] transition-colors ${
      isActive(href) ? "text-gold font-medium" : "text-navy/70 hover:text-navy hover:bg-navy/5"
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          solid ? "bg-cream/90 backdrop-blur-lg border-b border-navy/10" : "bg-transparent"
        }`}
      >
        <nav className="container-luna flex h-[68px] items-center justify-between gap-4">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            <Link href="/" className={linkCls("/")}>
              خانه
            </Link>

            {/* موجودی — کشویی کتگوری‌ها */}
            <Dropdown label="موجودی" href="/shop" active={isActive("/shop")}>
              <div className="grid w-56 gap-0.5 p-2">
                <DropItem href="/shop" label="همهٔ موجودی" icon="🛍" />
                {categories.map((c) => (
                  <DropItem key={c.slug} href={`/shop?cat=${c.slug}`} label={c.name} icon={c.icon || "•"} />
                ))}
              </div>
            </Dropdown>

            {/* برندها — کشویی گروه‌ها */}
            <Dropdown label="برندها" href="/brands" active={isActive("/brands")}>
              <div className="grid w-56 gap-0.5 p-2">
                <DropItem href="/brands" label="همهٔ برندها" icon="✦" />
                {brandGroups.map((g) => (
                  <DropItem key={g.key} href={`/brands?group=${g.key}`} label={g.label} badge={g.count} />
                ))}
              </div>
            </Dropdown>

            <Link href="/order" className={linkCls("/order")}>
              ثبت سفارش
            </Link>
            <Link href="/quality" className={linkCls("/quality")}>
              بررسی کیفیت
            </Link>
            <Link href="/guide" className={linkCls("/guide")}>
              راهنمای خرید
            </Link>
            <Link href="/about" className={linkCls("/about")}>
              دربارهٔ ما
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition hover:border-gold hover:text-gold sm:flex"
              aria-label="حساب من"
              title="حساب من"
            >
              👤
            </Link>
            <Link href="/order" className="btn-gold hidden sm:inline-flex !px-5 !py-2.5 text-[13px]">
              سفارش سریع
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-navy lg:hidden"
              aria-label="منو"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block h-0.5 w-5 bg-navy transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-navy transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-navy transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* منوی موبایل */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-cream/98 py-16 backdrop-blur-xl transition-all lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {[
          ["/", "خانه"],
          ["/shop", "موجودی"],
          ["/brands", "برندها"],
          ["/order", "ثبت سفارش"],
          ["/quality", "بررسی کیفیت"],
          ["/guide", "راهنمای خرید"],
          ["/about", "دربارهٔ ما"],
          ["/account", "حساب من"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`font-display text-2xl tracking-widest ${isActive(href) ? "text-gold" : "text-navy/70"}`}
          >
            {label}
          </Link>
        ))}
        <Link href="/order" className="btn-gold mt-2">
          سفارش سریع
        </Link>
      </div>
    </>
  );
}

function Dropdown({
  label,
  href,
  active,
  children,
}: {
  label: string;
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-[13px] transition-colors ${
          active ? "text-gold font-medium" : "text-navy/70 hover:text-navy hover:bg-navy/5"
        }`}
      >
        {label}
        <span className="text-[9px] opacity-60 transition-transform group-hover:rotate-180">▾</span>
      </Link>
      <div className="invisible absolute right-0 top-full z-50 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mt-1 rounded-2xl border border-navy/10 bg-white shadow-card">{children}</div>
      </div>
    </div>
  );
}

function DropItem({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon?: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] text-navy/75 transition hover:bg-cream hover:text-gold"
    >
      <span className="flex items-center gap-2">
        {icon && <span className="text-sm opacity-80">{icon}</span>}
        {label}
      </span>
      {badge !== undefined && <span className="text-[11px] text-navy/40">{badge.toLocaleString("fa-IR")}</span>}
    </Link>
  );
}
