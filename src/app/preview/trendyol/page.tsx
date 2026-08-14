import { getSettings, feesFromSettings } from "@/lib/settings";
import { SNAPSHOT_PRODUCTS } from "@/lib/trendyolDemo";
import TrendyolDemoCard from "@/components/TrendyolDemoCard";
import Divider from "@/components/Divider";

export const dynamic = "force-dynamic";
export const metadata = { title: "پیش‌نمایشِ فنی — کاتالوگِ ترندیول" };

// این صفحه از منو لینک نشده — فقط یک نمونهٔ فنی برای بررسیِ داخلی است.
// دادهٔ زیر یک عکسِ‌لحظه‌ایِ واقعی است (نه ساختگی) — با بازکردنِ خودِ صفحاتِ محصول در ترندیول گرفته شد.
// یافتهٔ مهم: fetchِ سبکِ سمتِ سرور (بدونِ مرورگر) با ۴۰۳ مسدود شد چون Trendyol روی امضای
// TLS/HTTP2 (نه فقط User-Agent) تشخیص می‌دهد. یعنی برای نسخهٔ زنده باید از همان زیرساختِ
// Playwright که برای ربات‌های audit-brand-links / check-sales ساختیم استفاده کنیم، نه fetchِ ساده.
export default async function TrendyolPreviewPage() {
  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  const products = SNAPSHOT_PRODUCTS;

  return (
    <div className="container-luna py-10">
      <div className="mb-8 rounded-2xl border border-gold/25 bg-gold/5 p-5 text-[13px] leading-7 text-navy/70">
        <div className="mb-1 font-display text-base font-semibold text-navy">
          🧪 پیش‌نمایشِ فنی — نه بخشِ نهاییِ سایت
        </div>
        این صفحه فقط برای بررسیِ داخلی است (از منو لینک نشده). {products.length} محصولِ زیر یک{" "}
        <b>عکسِ‌لحظه‌ایِ واقعی</b> از ترندیول است (نه ساختگی) — قیمتش با نرخِ روز به تومان تبدیل شده و سایز/موجودی
        (برای محصولی که جزئیاتش را گرفتیم) دقیقاً همان چیزی‌ست که در ترندیول بود. نام‌ها هنوز ترکی‌اند (ترجمه در
        نسخهٔ نهایی اضافه می‌شود)، «افزودن به سبد» وصل نیست، و این‌جا لحظه‌ای/زنده به‌روز نمی‌شود — چون فهمیدیم
        برای همگام‌سازیِ واقعی به همان مرورگرِ Playwrightِ ربات‌های موجود نیاز داریم، نه یک fetchِ سبک.
      </div>

      <Divider className="mb-8" />

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <TrendyolDemoCard key={p.id} product={p} perLirToman={perLirToman} />
        ))}
      </div>
    </div>
  );
}
