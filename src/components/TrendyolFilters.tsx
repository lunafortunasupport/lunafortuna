"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CatalogFacets } from "@/lib/trendyolCatalog";

const OWN_BRAND = "TRENDYOLMİLLA";

const PRICE_BUCKETS: { key: string; label: string }[] = [
  { key: "under1", label: "زیرِ ۱ میلیون" },
  { key: "1to3", label: "۱ تا ۳ میلیون" },
  { key: "3to6", label: "۳ تا ۶ میلیون" },
  { key: "over6", label: "بالای ۶ میلیون" },
];

const SORTS: { key: string; label: string }[] = [
  { key: "popular", label: "پرطرفدارترین" },
  { key: "price_asc", label: "ارزان‌ترین" },
  { key: "price_desc", label: "گران‌ترین" },
  { key: "new", label: "تازه‌ترین" },
];

export default function TrendyolFilters({ facets, total }: { facets: CatalogFacets; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [panelOpen, setPanelOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cat = params.get("cat") || "";
  const brand = params.get("brand") || "";
  const size = params.get("size") || "";
  const price = params.get("price") || "";
  const sort = params.get("sort") || "popular";

  const activeExtraFilters = [size, price].filter(Boolean).length + (sort !== "popular" ? 1 : 0);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // فیلترِ جدید → برگرد به صفحهٔ ۱
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (q !== (params.get("q") || "")) updateParam("q", q);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="sticky top-[64px] z-30 -mx-5 border-b border-navy/8 bg-cream/90 px-5 py-4 backdrop-blur-lg sm:-mx-8 sm:px-8 lg:top-[74px]">
      <div className="container-luna !px-0">
        {/* سرچ + برندها + دکمهٔ فیلترها */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[180px]">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجو در کاتالوگ…"
              className="w-full rounded-xl border border-navy/12 bg-white py-2.5 pr-9 pl-3 text-[13px] outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(154,122,67,0.12)]"
            />
          </div>

          <button
            onClick={() => setPanelOpen((v) => !v)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-medium transition-colors ${
              panelOpen || activeExtraFilters > 0
                ? "border-gold bg-gold/10 text-gold"
                : "border-navy/12 bg-white text-navy/70 hover:border-gold/40"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            فیلترها
            {activeExtraFilters > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                {activeExtraFilters.toLocaleString("fa-IR")}
              </span>
            )}
          </button>
        </div>

        {/* برندها */}
        {facets.brands.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill active={!brand} onClick={() => updateParam("brand", "")}>
              همهٔ برندها
            </Pill>
            {facets.brands.map((b) => (
              <Pill
                key={b.key}
                active={brand === b.key}
                gold={b.key === OWN_BRAND}
                onClick={() => updateParam("brand", brand === b.key ? "" : b.key)}
              >
                {b.key === OWN_BRAND && "✦ "}
                {b.key}
                <span className="mr-1 text-[10px] opacity-60">({b.count.toLocaleString("fa-IR")})</span>
              </Pill>
            ))}
          </div>
        )}

        {/* دسته‌ها */}
        {facets.categories.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Pill active={!cat} onClick={() => updateParam("cat", "")} subtle>
              همهٔ دسته‌ها
            </Pill>
            {facets.categories.map((c) => (
              <Pill key={c.key} active={cat === c.key} subtle onClick={() => updateParam("cat", cat === c.key ? "" : c.key)}>
                {c.labelFa}
                <span className="mr-1 text-[10px] opacity-60">({c.count.toLocaleString("fa-IR")})</span>
              </Pill>
            ))}
          </div>
        )}

        {/* پنلِ فیلترهای اضافه (سایز/قیمت/مرتب‌سازی) */}
        {panelOpen && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-navy/8 bg-white p-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <div className="mb-2 text-[11px] font-semibold text-navy/50">سایز</div>
              <div className="flex flex-wrap gap-1.5">
                {facets.sizes.map((s) => (
                  <Pill key={s} small active={size === s} onClick={() => updateParam("size", size === s ? "" : s)}>
                    {s}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold text-navy/50">بازهٔ قیمت (تومان)</div>
              <div className="flex flex-wrap gap-1.5">
                {PRICE_BUCKETS.map((p) => (
                  <Pill key={p.key} small active={price === p.key} onClick={() => updateParam("price", price === p.key ? "" : p.key)}>
                    {p.label}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold text-navy/50">مرتب‌سازی</div>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value === "popular" ? "" : e.target.value)}
                className="w-full rounded-lg border border-navy/12 bg-white px-3 py-2 text-[12.5px] outline-none focus:border-gold"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="mt-3 text-[11.5px] text-navy/40">{total.toLocaleString("fa-IR")} محصول</div>
      </div>
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
  gold,
  subtle,
  small,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  gold?: boolean;
  subtle?: boolean;
  small?: boolean;
}) {
  const base = small ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-[12px]";
  if (active) {
    return (
      <button
        onClick={onClick}
        className={`${base} rounded-full border font-semibold ${
          gold ? "border-gold bg-gold text-white" : "border-navy bg-navy text-cream"
        }`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} rounded-full border font-medium transition-colors ${
        subtle
          ? "border-navy/10 bg-cream/60 text-navy/60 hover:border-gold/40 hover:text-gold"
          : gold
          ? "border-gold/40 bg-gold/10 text-gold hover:bg-gold/15"
          : "border-navy/12 bg-white text-navy/70 hover:border-gold/40 hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}
