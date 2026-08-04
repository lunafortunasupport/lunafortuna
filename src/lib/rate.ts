// خواندن خودکار نرخ لیر از فید عمومی یک کانال تلگرام (t.me/s/<channel>)
// نکته: فرمت parse باید با نمونهٔ پیام واقعی کانال تنظیم شود (بخش «ورودی‌های موردنیاز» در پلن).

/**
 * تلاش برای استخراج نرخ لیر (تومان) از HTML فید عمومی کانال.
 * الگوی پیش‌فرض: اولین عددِ ۴ تا ۶ رقمی که نزدیک کلمات «لیر/لير/TRY» باشد.
 * در صورت نیاز، regex را با فرمت دقیق کانال هماهنگ کنید.
 */
export async function fetchRateFromTelegram(channel: string): Promise<number | null> {
  if (!channel) return null;
  const url = `https://t.me/s/${channel.replace(/^@/, "")}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LunaFortunaBot/1.0)" },
      // فید عمومی؛ کش کوتاه
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // متن پیام‌ها را جدا می‌کنیم (آخرین پیام‌ها انتهای صفحه‌اند)
    const messages = [...html.matchAll(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g)]
      .map((m) => stripHtml(m[1]))
      .reverse(); // جدیدترین اول

    for (const msg of messages) {
      const rate = extractRate(msg);
      if (rate) return rate;
    }
    return null;
  } catch (e) {
    console.error("[rate] fetch error", e);
    return null;
  }
}

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

/** استخراج نرخ از یک متن؛ عدد نزدیک به «لیر/TRY» را برمی‌دارد. */
export function extractRate(text: string): number | null {
  const normalized = faToEn(text).replace(/[،,]/g, "");
  // الگو: عدد ۴ تا ۷ رقمی که کنارش «لیر» یا «TRY» یا «لير» باشد
  const near = normalized.match(/(?:لیر|لير|try|tl)\D{0,12}(\d{4,7})|(\d{4,7})\D{0,12}(?:لیر|لير|try|tl)/i);
  if (near) {
    const n = Number(near[1] || near[2]);
    if (n >= 1000 && n <= 2_000_000) return n;
  }
  // در نبود کلمهٔ کلیدی، اولین عدد ۴ تا ۶ رقمی
  const first = normalized.match(/\b(\d{4,6})\b/);
  if (first) {
    const n = Number(first[1]);
    if (n >= 1000 && n <= 2_000_000) return n;
  }
  return null;
}

function faToEn(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}
