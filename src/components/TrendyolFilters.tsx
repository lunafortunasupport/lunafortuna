"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CatalogFacets } from "@/lib/trendyolCatalog";

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
  const [open, setOpen] = useState(false);
  const [brandQuery, setBrandQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cat = params.get("cat") || "";
  const brand = params.get("brand") || "";
  const size = params.get("size") || "";
  const price = params.get("price") || "";
  const sort = params.get("sort") || "popular";
  const onSale = params.get("sale") === "1";

  const activeCount =
    [cat, brand, size, price].filter(Boolean).length + (sort !== "popular" ? 1 : 0) + (onSale ? 1 : 0);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // فیلترِ جدید → صفحهٔ ۱
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  // سرچِ تازه باید در کلِ کاتالوگ (یا کلِ همان برند/ستون) بگردد، نه داخلِ فیلترهای اصلاحیِ قبلی.
  // وگرنه اگر مثلاً دستهٔ «سوتین» فعال مانده باشد، سرچِ «mango» می‌شود «سوتینِ مانگو» = ۰ نتیجه.
  // پس دسته/برند/سایز/قیمت/تخفیف پاک می‌شوند؛ فقط اسکوپ (source/fbrand) و مرتب‌سازی حفظ می‌شود.
  function setSearch(value: string) {
    const next = new URLSearchParams();
    for (const k of ["source", "fbrand", "sort"]) {
      const v = params.get(k);
      if (v) next.set(k, v);
    }
    if (value) next.set("q", value);
    router.push(next.toString() ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  }

  function clearAll() {
    const next = new URLSearchParams();
    // فقط ستون/برندِ منتخب و سرچ حفظ می‌شوند؛ بقیهٔ فیلترها پاک.
    const keep = ["source", "fbrand", "q"];
    keep.forEach((k) => {
      const v = params.get(k);
      if (v) next.set(k, v);
    });
    router.push(next.toString() ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  }

  // سرچِ دیبانس‌شده
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (q !== (params.get("q") || "")) setSearch(q);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // بستنِ درِ کشو با Esc + قفلِ اسکرولِ پس‌زمینه
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const brandLabel = brand || "";
  const catLabel = facets.categories.find((c) => c.key === cat)?.labelFa || cat;
  const priceLabel = PRICE_BUCKETS.find((p) => p.key === price)?.label || "";
  const sortLabel = SORTS.find((s) => s.key === sort)?.label || "";

  const filteredBrands = useMemo(() => {
    const ql = brandQuery.trim().toLocaleLowerCase();
    const list = ql ? facets.brands.filter((b) => b.key.toLocaleLowerCase().includes(ql)) : facets.brands;
    return list;
  }, [facets.brands, brandQuery]);

  const chips: { label: string; onRemove: () => void }[] = [];
  if (cat) chips.push({ label: `دسته: ${catLabel}`, onRemove: () => setParam("cat", "") });
  if (brand) chips.push({ label: `برند: ${brandLabel}`, onRemove: () => setParam("brand", "") });
  if (size) chips.push({ label: `سایز: ${size}`, onRemove: () => setParam("size", "") });
  if (price) chips.push({ label: priceLabel, onRemove: () => setParam("price", "") });
  if (onSale) chips.push({ label: "فقط تخفیف‌دار", onRemove: () => setParam("sale", "") });
  if (sort !== "popular") chips.push({ label: `مرتب‌سازی: ${sortLabel}`, onRemove: () => setParam("sort", "") });

  return (
    <div className="sticky top-[64px] z-30 border-b border-navy/8 bg-cream/90 backdrop-blur-lg lg:top-[74px]">
      <div className="container-luna py-3.5">
        {/* سرچ + دکمهٔ فیلتر + تخفیف */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجو (نام، برند یا دسته…)"
              className="w-full rounded-xl border border-navy/12 bg-white py-2.5 pr-9 pl-3 text-[13px] outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(154,122,67,0.12)]"
            />
          </div>

          <button
            onClick={() => updateSaleQuick()}
            className={`hidden shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2.5 text-[12.5px] font-medium transition-colors sm:inline-flex ${
              onSale ? "border-[#b8442f] bg-[#b8442f] text-white" : "border-[#b8442f]/40 bg-[#b8442f]/5 text-[#b8442f] hover:bg-[#b8442f]/10"
            }`}
          >
            🏷️ تخفیف‌دارها
          </button>

          <button
            onClick={() => setOpen(true)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-[12.5px] font-medium transition-colors ${
              activeCount > 0 ? "border-gold bg-gold/10 text-gold" : "border-navy/12 bg-white text-navy/70 hover:border-gold/40"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            فیلتر و مرتب‌سازی
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                {activeCount.toLocaleString("fa-IR")}
              </span>
            )}
          </button>
        </div>

        {/* چیپ‌های فیلترِ فعال */}
        {chips.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {chips.map((c, i) => (
              <button
                key={i}
                onClick={c.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full border border-navy/12 bg-white px-3 py-1 text-[11.5px] text-navy/70 transition-colors hover:border-red-300 hover:text-red-500"
              >
                {c.label}
                <span className="text-[13px] leading-none">×</span>
              </button>
            ))}
            <button onClick={clearAll} className="text-[11.5px] text-navy/40 underline-offset-2 hover:text-gold hover:underline">
              پاک‌کردنِ همه
            </button>
          </div>
        )}

        <div className="mt-2.5 text-[11.5px] text-navy/40">{total.toLocaleString("fa-IR")} محصول</div>
      </div>

      {/* ── پنلِ کشویی فیلتر ── (با Portal مستقیم به body تا از containing-block ناشی از
          backdrop-blurِ نوار فرار کند؛ وگرنه fixed نسبت به نوار محاسبه می‌شد و کشو کوتاه/خراب می‌شد) */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-navy-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[88%] max-w-[380px] flex-col bg-cream shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
              <span className="font-display text-[15px] font-bold text-navy">فیلتر و مرتب‌سازی</span>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-navy/50 hover:bg-navy/5 hover:text-navy" aria-label="بستن">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* مرتب‌سازی */}
              <Section title="مرتب‌سازی">
                <div className="grid grid-cols-2 gap-1.5">
                  {SORTS.map((s) => (
                    <Choice key={s.key} active={sort === s.key} onClick={() => setParam("sort", s.key === "popular" ? "" : s.key)}>
                      {s.label}
                    </Choice>
                  ))}
                </div>
              </Section>

              {/* تخفیف */}
              <Section title="تخفیف">
                <Choice active={onSale} onClick={() => setParam("sale", onSale ? "" : "1")} full>
                  🏷️ فقط محصولاتِ تخفیف‌دار
                </Choice>
              </Section>

              {/* دسته */}
              {facets.categories.length > 0 && (
                <Section title="دسته">
                  <div className="max-h-60 space-y-0.5 overflow-y-auto pl-1">
                    <RowChoice active={!cat} onClick={() => setParam("cat", "")} label="همهٔ دسته‌ها" />
                    {facets.categories.map((c) => (
                      <RowChoice key={c.key} active={cat === c.key} onClick={() => setParam("cat", cat === c.key ? "" : c.key)} label={c.labelFa} count={c.count} />
                    ))}
                  </div>
                </Section>
              )}

              {/* برند (قابلِ جستجو) */}
              {facets.brands.length > 1 && (
                <Section title="برند">
                  <input
                    value={brandQuery}
                    onChange={(e) => setBrandQuery(e.target.value)}
                    placeholder="جست‌وجوی برند…"
                    className="mb-2 w-full rounded-lg border border-navy/12 bg-white px-3 py-2 text-[12.5px] outline-none focus:border-gold"
                  />
                  <div className="max-h-64 space-y-0.5 overflow-y-auto pl-1">
                    <RowChoice active={!brand} onClick={() => setParam("brand", "")} label="همهٔ برندها" />
                    {filteredBrands.map((b) => (
                      <RowChoice key={b.key} active={brand === b.key} onClick={() => setParam("brand", brand === b.key ? "" : b.key)} label={b.key} count={b.count} />
                    ))}
                    {filteredBrands.length === 0 && <div className="px-2 py-3 text-[12px] text-navy/40">برندی پیدا نشد.</div>}
                  </div>
                </Section>
              )}

              {/* سایز */}
              {facets.sizes.length > 0 && (
                <Section title="سایز">
                  <div className="flex flex-wrap gap-1.5">
                    {facets.sizes.map((s) => (
                      <Choice key={s} active={size === s} onClick={() => setParam("size", size === s ? "" : s)} small>
                        {s}
                      </Choice>
                    ))}
                  </div>
                </Section>
              )}

              {/* قیمت */}
              <Section title="بازهٔ قیمت (تومان)">
                <div className="grid grid-cols-2 gap-1.5">
                  {PRICE_BUCKETS.map((p) => (
                    <Choice key={p.key} active={price === p.key} onClick={() => setParam("price", price === p.key ? "" : p.key)}>
                      {p.label}
                    </Choice>
                  ))}
                </div>
              </Section>
            </div>

            <div className="flex items-center gap-3 border-t border-navy/10 px-5 py-4">
              <button onClick={clearAll} className="flex-1 rounded-full border border-navy/15 py-2.5 text-[13px] font-medium text-navy/60 hover:border-navy/30">
                پاک‌کردن
              </button>
              <button onClick={() => setOpen(false)} className="flex-1 rounded-full bg-navy py-2.5 text-[13px] font-bold text-cream hover:bg-navy-ink">
                نمایشِ {total.toLocaleString("fa-IR")} محصول
              </button>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </div>
  );

  function updateSaleQuick() {
    setParam("sale", onSale ? "" : "1");
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy/45">{title}</div>
      {children}
    </div>
  );
}

function Choice({ children, active, onClick, small, full }: { children: React.ReactNode; active: boolean; onClick: () => void; small?: boolean; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border text-center font-medium transition-colors ${small ? "px-2.5 py-1 text-[11.5px]" : "px-3 py-2 text-[12.5px]"} ${full ? "w-full" : ""} ${
        active ? "border-navy bg-navy text-cream" : "border-navy/12 bg-white text-navy/70 hover:border-gold/40 hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}

function RowChoice({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-[12.5px] transition-colors ${
        active ? "bg-gold/12 font-semibold text-gold" : "text-navy/70 hover:bg-navy/5"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        <span className={`inline-block h-3.5 w-3.5 shrink-0 rounded-[4px] border ${active ? "border-gold bg-gold" : "border-navy/25"}`}>
          {active && <span className="block text-[9px] leading-[13px] text-white">✓</span>}
        </span>
        <span className="truncate">{label}</span>
      </span>
      {count !== undefined && <span className="shrink-0 text-[10.5px] text-navy/35">{count.toLocaleString("fa-IR")}</span>}
    </button>
  );
}
