"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useWishlist } from "@/lib/wishlist";

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
interface CatalogBrand {
  slug: string;
  nameFa: string;
  count: number;
}
interface CatalogCollection {
  slug: string;
  nameFa: string;
  emoji: string;
}

export default function Nav({
  categories,
  brandGroups,
  catalogBrands,
  catalogCollections,
  catalogFeatured,
}: {
  categories: Cat[];
  brandGroups: Group[];
  catalogBrands: CatalogBrand[];
  catalogCollections: CatalogCollection[];
  catalogFeatured: CatalogBrand[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count: wishCount } = useWishlist();

  const isHome = pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  // شفاف و متنِ روشن فقط بالای هیروِ صفحهٔ اصلی؛ در غیر این صورت پُر و متنِ تیره.
  const overHero = isHome && !scrolled;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkCls = (href: string) =>
    `px-3 py-2 text-[13px] tracking-wide transition-colors ${
      isActive(href)
        ? "text-gold"
        : overHero
        ? "text-cream/85 hover:text-cream"
        : "text-navy/65 hover:text-navy"
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          overHero
            ? "bg-gradient-to-b from-navy-ink/50 to-transparent"
            : "border-b border-navy/8 bg-cream/85 backdrop-blur-xl"
        }`}
      >
        <nav className="container-luna flex h-[74px] items-center justify-between gap-4">
          <Logo light={overHero} />

          <div className="hidden items-center gap-0.5 lg:flex">
            <Link href="/" className={linkCls("/")}>خانه</Link>
            {/* «موجودی» (/shop) موقتاً مخفی است تا انبار پر شود — تصمیمِ کاربر. */}
            <Dropdown label="برندها" href="/catalog/brands" active={isActive("/catalog/brands")} dark={overHero}>
              <div className="grid w-56 gap-0.5 p-2">
                <DropItem href="/catalog/brands" label="همهٔ برندها" icon="✦" />
                {catalogFeatured.slice(0, 8).map((b) => (
                  <DropItem key={b.slug} href={`/catalog?fbrand=${b.slug}`} label={b.nameFa} badge={b.count} />
                ))}
              </div>
            </Dropdown>
            {catalogBrands.length > 0 && (
              <Dropdown label="کاتالوگِ ترکیه" href="/catalog" active={isActive("/catalog")} dark={overHero}>
                <div className={`grid ${catalogFeatured.length > 0 ? "w-[720px] grid-cols-3" : "w-[520px] grid-cols-2"} max-w-[calc(100vw-2rem)] gap-3 p-4`}>
                  <div>
                    <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      سه دنیای خرید
                    </div>
                    {catalogBrands.map((b) => (
                      <DropItem key={b.slug} href={`/catalog?source=${b.slug}`} label={b.nameFa} badge={b.count} />
                    ))}
                  </div>
                  {catalogFeatured.length > 0 && (
                    <div className="border-s border-navy/10 ps-3">
                      <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                        برندهای محبوب
                      </div>
                      {catalogFeatured.slice(0, 8).map((b) => (
                        <DropItem key={b.slug} href={`/catalog?fbrand=${b.slug}`} label={b.nameFa} badge={b.count} />
                      ))}
                    </div>
                  )}
                  <div className="border-s border-navy/10 ps-3">
                    <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      کالکشن‌ها
                    </div>
                    {catalogCollections.slice(0, 4).map((c) => (
                      <DropItem key={c.slug} href={`/catalog?collection=${c.slug}`} label={c.nameFa} icon={c.emoji} />
                    ))}
                    <div className="mb-2 mt-3 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      میان‌بُرها
                    </div>
                    <DropItem href="/catalog" label="محبوب‌ترین‌ها" icon="❤" />
                    <DropItem href="/catalog/lookbook" label="لوک‌بوک" icon="📖" />
                    <DropItem href="/catalog/sale" label="تخفیف‌ها" icon="🏷" />
                    <DropItem href="/catalog/brands" label="همهٔ برندها" icon="✦" />
                  </div>
                </div>
              </Dropdown>
            )}
            <Link href="/order" className={linkCls("/order")}>ثبت سفارش</Link>
            <Link href="/quality" className={linkCls("/quality")}>بررسی کیفیت</Link>
            <Link href="/guide" className={linkCls("/guide")}>راهنمای خرید</Link>
            <Link href="/about" className={linkCls("/about")}>دربارهٔ ما</Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/catalog/wishlist"
              className={`relative hidden h-9 w-9 items-center justify-center rounded-full border text-sm transition sm:flex ${
                overHero
                  ? "border-cream/30 text-cream/85 hover:border-champagne hover:text-champagne"
                  : "border-navy/15 text-navy/60 hover:border-gold hover:text-gold"
              }`}
              aria-label="علاقه‌مندی‌ها"
              title="علاقه‌مندی‌ها"
            >
              {wishCount > 0 ? "❤" : "♡"}
              {wishCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e0526b] px-1 text-[9px] font-bold text-white">
                  {wishCount.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className={`hidden h-9 w-9 items-center justify-center rounded-full border text-sm transition sm:flex ${
                overHero
                  ? "border-cream/30 text-cream/85 hover:border-champagne hover:text-champagne"
                  : "border-navy/15 text-navy/60 hover:border-gold hover:text-gold"
              }`}
              aria-label="حساب من"
              title="حساب من"
            >
              👤
            </Link>
            <Link
              href="/order"
              className={`hidden shrink-0 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all sm:inline-flex ${
                overHero
                  ? "bg-champagne text-navy-ink hover:bg-cream"
                  : "bg-navy text-cream hover:bg-navy-ink"
              }`}
            >
              سفارش سریع
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex h-10 w-10 items-center justify-center lg:hidden ${overHero ? "text-cream" : "text-navy"}`}
              aria-label="منو"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* فاصله‌گذار برای صفحاتِ بدونِ هیروِ تمام‌صفحه (نه صفحهٔ اصلی) */}
      {!isHome && <div className="h-[74px]" aria-hidden />}

      {/* منوی موبایل — تیرهٔ لوکس */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-navy-ink py-20 transition-all lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {[
          ["/", "خانه"], ["/catalog", "فروشگاهِ ترکیه"], ["/catalog/brands", "برندها"],
          ["/catalog/lookbook", "لوک‌بوک"], ["/catalog/wishlist", "علاقه‌مندی‌ها"],
          ["/order", "ثبت سفارش"], ["/quality", "بررسی کیفیت"], ["/guide", "راهنمای خرید"], ["/about", "دربارهٔ ما"], ["/account", "حساب من"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`font-display text-3xl font-bold ${isActive(href) ? "text-champagne" : "text-cream/90"}`}
          >
            {label}
          </Link>
        ))}
        <Link href="/order" className="mt-3 rounded-full bg-champagne px-8 py-3 font-bold text-navy-ink">
          سفارش سریع
        </Link>
      </div>
    </>
  );
}

function Dropdown({
  label, href, active, dark, children,
}: {
  label: string;
  href: string;
  active: boolean;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex items-center gap-1 px-3 py-2 text-[13px] tracking-wide transition-colors ${
          active ? "text-gold" : dark ? "text-cream/85 hover:text-cream" : "text-navy/65 hover:text-navy"
        }`}
      >
        {label}
        <span className="text-[9px] opacity-60 transition-transform group-hover:rotate-180">▾</span>
      </Link>
      <div className="invisible absolute right-0 top-full z-50 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="mt-2 rounded-2xl border border-navy/10 bg-cream shadow-card">{children}</div>
      </div>
    </div>
  );
}

function DropItem({ href, label, icon, badge }: { href: string; label: string; icon?: string; badge?: number }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] text-navy/75 transition hover:bg-navy/5 hover:text-gold"
    >
      <span className="flex items-center gap-2">
        {icon && <span className="text-sm opacity-80">{icon}</span>}
        {label}
      </span>
      {badge !== undefined && <span className="text-[11px] text-navy/40">{badge.toLocaleString("fa-IR")}</span>}
    </Link>
  );
}
