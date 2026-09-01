// قوانینِ کارگوی هر منبعِ ترکیه‌ای — متمرکز و بدونِ وابستگی به prisma تا هم سرور (trendyolCatalog)
// و هم کلاینت (سبد خرید) بتوانند از آن استفاده کنند و کارگو همه‌جا یکسان و دقیق باشد.
//
// افزودنِ ملتی‌برندِ جدید (بوینر، سوپراستپ، …) = فقط یک ورودی این‌جا + یک اسکریپرِ سینک.
// freeThresholdTL: بالای این قیمتِ کالا، کارگوی همان سایت رایگان می‌شود (null = نامشخص/بدونِ رایگان).
export const SOURCE_CARGO: Record<string, { feeTL: number; freeThresholdTL: number | null }> = {
  // آمبار: کارگوی «Kolay Gelsin» ۶۹٫۹۰ لیر (تأییدشده روی ambargiyim.com.tr)؛ بالای ۱۵۰۰ لیر رایگان.
  // چون در سبد هر کالا جداگانه سفارش می‌شود، این آستانه per-item درست است.
  ambar: { feeTL: 69.9, freeThresholdTL: 1500 },
};

/** از روی لینکِ اصلِ محصول، منبع را تشخیص می‌دهد (برای سبد که sourceSite ذخیره نمی‌کند). */
export function sourceFromUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    if (h.includes("ambargiyim")) return "ambar";
    if (h.includes("trendyol-milla")) return "trendyol-milla";
    if (h.includes("trendyol")) return "trendyol";
  } catch {
    /* ignore */
  }
  return undefined;
}

/** کارگوی یک کالا به لیر. منابعِ دارای قانونِ ثابت (آمبار) از SOURCE_CARGO؛ ترندیولِ ملتی‌برند و
 *  ترندیول‌میلا هرکدام برآوردِ خودشان را دارند (از تنظیماتِ ادمین) — چون سیاستِ کارگویشان جداست؛
 *  در هر دو، freeCargoِ واقعیِ خودِ محصول (وقتی فروشنده کارگوی رایگان گذاشته) اولویت دارد. */
export function cargoFeeTL(
  sourceSite: string | undefined,
  priceTL: number | null,
  freeCargo: boolean,
  cargoFeeEstimateTL: number,
  cargoFeeEstimateMillaTL?: number
): number {
  const rule = sourceSite ? SOURCE_CARGO[sourceSite] : undefined;
  if (rule) {
    if (rule.freeThresholdTL != null && (priceTL ?? 0) >= rule.freeThresholdTL) return 0;
    return rule.feeTL;
  }
  if (freeCargo) return 0;
  if (sourceSite === "trendyol-milla") return cargoFeeEstimateMillaTL ?? cargoFeeEstimateTL;
  return cargoFeeEstimateTL;
}
