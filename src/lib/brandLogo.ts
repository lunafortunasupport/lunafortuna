// ارتقای لوگوی برند به تصویرِ تمیزتر و بزرگ‌تر از سرویسِ unavatar.io.
// لوگوهای دایرکتوریِ برند در دیتابیس به‌صورتِ فاویکونِ گوگل seed شده‌اند
// (https://www.google.com/s2/favicons?domain=<d>&sz=128). این تابع دامنه را از آن
// بیرون می‌کشد و به unavatar می‌سازد؛ unavatar از چند منبع (سرویس‌های لوگو + فاویکونِ
// خودِ سایت) بهترین تصویر را می‌دهد و خودش fallback دارد. اگر ادمین لوگوی سفارشی گذاشته
// باشد (URLِ غیرِ فاویکونِ گوگل)، همان بی‌تغییر برگردانده می‌شود.

/** URLِ فاویکونِ ذخیره‌شده را به لوگوی تمیزترِ unavatar تبدیل می‌کند. */
export function upgradeBrandLogo(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/[?&]domain=([^&]+)/);
  if (m) return `https://unavatar.io/${decodeURIComponent(m[1])}`;
  return url;
}

/** ساختِ لوگو مستقیم از دامنهٔ برند (وقتی domain در دسترس است). */
export function domainLogo(domain: string | null | undefined): string | null {
  return domain ? `https://unavatar.io/${domain}` : null;
}
