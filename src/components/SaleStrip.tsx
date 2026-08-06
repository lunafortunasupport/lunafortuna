export interface SaleLite {
  slug: string;
  name: string;
  logoUrl: string | null;
  saleUrl: string;
  saleLabel: string | null;
}

// نوار «حراج‌های امروز» — بنرهای برندیِ خودمان (لوگو + برچسب حراج + دکمه) که
// مستقیم به صفحهٔ حراجِ همان برند لینک می‌شوند. تصویرِ اسکرپ‌شده نیست؛ طراحیِ ماست.
export default function SaleStrip({ sales }: { sales: SaleLite[] }) {
  if (!sales.length) return null;
  return (
    <section className="container-luna py-8 reveal">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-navy">
          <span>🔥</span> حراج‌های امروز
        </h2>
        <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-medium text-red-600">
          {sales.length.toLocaleString("fa-IR")} برند در حراج
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sales.map((s) => (
          <a
            key={s.slug}
            href={s.saleUrl}
            target="_blank"
            rel="noopener"
            className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-navy to-navy-ink p-5 text-center shadow-card transition-transform hover:-translate-y-1"
          >
            {/* برچسب حراج گوشه */}
            <span className="absolute right-0 top-0 rounded-bl-xl bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
              SALE
            </span>
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-cream">
              {s.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.logoUrl} alt={s.name} className="h-10 w-10 object-contain" />
              ) : (
                <span className="font-display text-2xl text-gold">{s.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="font-display text-base font-semibold text-cream">{s.name}</div>
              <div className="mt-0.5 text-[12px] text-gold">{s.saleLabel || "حراج ویژه"}</div>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold px-4 py-1.5 text-[12px] font-medium text-white transition-colors group-hover:bg-champagne">
              مشاهدهٔ حراج ←
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
