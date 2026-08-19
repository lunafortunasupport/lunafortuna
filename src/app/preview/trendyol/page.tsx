import { getSettings, feesFromSettings } from "@/lib/settings";
import { SNAPSHOT_PRODUCTS, CATEGORY_LABELS_FA } from "@/lib/trendyolDemo";
import TrendyolDemoCard from "@/components/TrendyolDemoCard";
import Divider from "@/components/Divider";

export const dynamic = "force-dynamic";
export const metadata = { title: "پیش‌نمایشِ فنی — کاتالوگِ ترندیول" };

// این صفحه از منو لینک نشده — فقط یک نمونهٔ فنی برای بررسیِ داخلی است.
// ساختار طبق درخواستِ کاربر: هدر/معرفی → برندها → محصولات (دسته‌بندی‌شده).
export default async function TrendyolPreviewPage() {
  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  const products = SNAPSHOT_PRODUCTS;
  const brands = [...new Set(products.map((p) => p.brand))];

  // گروه‌بندی بر اساسِ دسته‌بندیِ واقعیِ ترندیول
  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const key = p.category || "سایر";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(p);
  }

  return (
    <div>
      {/* هدر/معرفی */}
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
          <div className="absolute -right-4 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_62%)]" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
            🧪 پیش‌نمایشِ فنی
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">کاتالوگِ ترندیول، به فارسی و تومان</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            این صفحه برای بررسیِ داخلی است (از منو لینک نشده). {products.length} محصول یک{" "}
            <b className="text-champagne">عکسِ‌لحظه‌ایِ واقعی</b> از ترندیول‌اند (نه ساختگی) — قیمت با نرخِ روز به
            تومان، سایز و موجودی دقیقاً همان چیزی‌ست که در ترندیول است. نام‌ها هنوز ترکی‌اند (ترجمه در نسخهٔ نهایی
            اضافه می‌شود)، «افزودن به سبد» وصل نیست، و این‌جا لحظه‌ای به‌روز نمی‌شود.
          </p>
        </div>
      </div>

      <div className="container-luna py-10">
        {/* برندها */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-navy/50">
            <span className="h-px w-5 bg-gold/50" />
            برندهای این کاتالوگ
          </div>
          <div className="flex flex-wrap gap-2.5">
            {brands.map((b) => (
              <span
                key={b}
                className="rounded-full border border-navy/12 bg-white px-4 py-2 text-[12.5px] font-medium text-navy/75"
              >
                {b}
              </span>
            ))}
          </div>
        </section>

        <Divider className="mb-10" />

        {/* محصولات — دسته‌بندی‌شده */}
        {[...byCategory.entries()].map(([cat, items]) => (
          <section key={cat} className="mb-12 last:mb-0">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold text-navy">{CATEGORY_LABELS_FA[cat] || cat}</h2>
              <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] text-gold">
                {items.length.toLocaleString("fa-IR")} کالا
              </span>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <TrendyolDemoCard key={p.id} product={p} perLirToman={perLirToman} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
