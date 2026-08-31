// خواندن خودکار نرخ لیر از فید عمومی یک کانال تلگرام (t.me/s/<channel>)
// نمونهٔ پیام واقعی کانال: «قیمت حواله لیر : ۴۰۷۰ تومان» (گاهی «۴٬۰۷۰» با جداکنندهٔ هزارگان).

/**
 * تلاش برای استخراج نرخ لیر (تومان) از HTML فید عمومی کانال.
 * فقط عددی پذیرفته می‌شود که کنارِ کلیدواژهٔ «لیر/حواله/TRY/TL» باشد؛
 * در نبودِ چنین عددی null برمی‌گردد (عمداً حدسِ عددِ نامربوط نمی‌زنیم).
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

// جداکننده‌های هزارگان/رقمی که باید بینِ ارقام حذف شوند:
// ٬ (U+066C عربی)، ٫ (U+066B)، ، (U+060C)، کاما، فاصله‌ها و نیم‌فاصله (ZWNJ).
const DIGIT_SEP = "[\\u066C\\u066B\\u060C,\\s\\u200C]";

/** استخراج نرخ از یک متن؛ فقط عددِ نزدیک به کلیدواژهٔ لیر/حواله/TRY. */
export function extractRate(text: string): number | null {
  // ۱) ارقام فارسی و عربیِ‌هندی → لاتین
  let normalized = faToEn(text);
  // ۲) جداکنندهٔ هزارگان بینِ دو رقم را حذف کن تا عددِ کامل بماند («۴٬۰۷۰» → «4070»)
  const sepRe = new RegExp(`(\\d)${DIGIT_SEP}(?=\\d)`, "g");
  // چند بار اجرا می‌کنیم چون جایگزینیِ هم‌پوشان (۱٬۲۳۴٬۵۶۷) در یک پاس کامل نمی‌شود
  let prev: string;
  do {
    prev = normalized;
    normalized = normalized.replace(sepRe, "$1");
  } while (normalized !== prev);

  // کلیدواژه‌ها: عدد فقط وقتی نرخ است که یکی از این‌ها در همسایگی‌اش باشد.
  const KW_RE = /لیر|لير|حواله|try|tl/i;
  const WINDOW = 15; // شعاعِ جست‌وجوی کلیدواژه در دو طرفِ عدد (کاراکتر)
  // همهٔ اعدادِ ۴ تا ۷ رقمی را جدا پیدا می‌کنیم و اولین عددِ درونِ بازه که کلیدواژه
  // در همسایگی‌اش هست را برمی‌گردانیم. این رویکرد (به‌جای یک regexِ ترکیبی) مشکلِ
  // «مصرف‌شدنِ کلیدواژه توسطِ عددِ نامربوطِ کناری» را ندارد و خواناتر است.
  for (const m of normalized.matchAll(/\d{4,7}/g)) {
    const n = Number(m[0]);
    if (n < 1000 || n > 2_000_000) continue;
    const start = m.index ?? 0;
    const before = normalized.slice(Math.max(0, start - WINDOW), start);
    const after = normalized.slice(start + m[0].length, start + m[0].length + WINDOW);
    if (KW_RE.test(before) || KW_RE.test(after)) return n;
  }
  return null;
}

function faToEn(s: string): string {
  return s
    // فارسی ۰-۹
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    // عربیِ‌هندی ٠-٩
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}
