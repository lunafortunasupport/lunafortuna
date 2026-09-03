// تشخیصِ باگِ قیمت روی محصولاتِ خراب — دقیقاً همان مسیرِ fetchDetail سینک، ولی این‌بار همهٔ
// ساختارهای قیمت را چاپ می‌کند و عددِ «واقعیِ» ترندیول را در دلِ JSON جست‌وجو می‌کند تا بفهمیم
// کدام فیلد را باید بخوانیم. هیچ‌چیزی در دیتابیس نمی‌نویسد.
//
// اجرا:  npx tsx scripts/diag-price.mjs > diag-output.txt 2>&1
import { chromium } from "playwright";

// محصولاتِ خرابِ گزارش‌شده + قیمتِ واقعی‌ای که کاربر روی خودِ ترندیول دید:
const cases = [
  { url: "https://www.trendyol.com/tudors/erkek-slim-fit-dar-kesim-pamuklu-yumusak-doku-kumas-kivrilmaz-yaka-siyah-polo-yaka-tisort-p-808468662?boutiqueId=61&merchantId=139435", stored: 799.97, real: 324.12 },
  { url: "https://www.trendyol.com/ata-home/banyor-yapiskanli-banyo-rafi-2-li-banyo-duzenleyici-dus-rafi-organizer-sampuanlik-plastik-p-759990716?boutiqueId=61&merchantId=231141", stored: 199.39, real: 164.39 },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function extractWindowJson(html, key) {
  const marker = `window["${key}"]=`;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  let i = idx + marker.length;
  if (html[i] !== "{") return null;
  const start = i;
  let depth = 0, inStr = false, strCh = "", esc = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { i++; break; } }
  }
  try { return JSON.parse(html.slice(start, i)); } catch { return null; }
}

// جست‌وجوی بازگشتی: هر مسیری که مقدارِ عددی‌اش «نزدیکِ» targetه را پیدا کن (برای یافتنِ فیلدِ درست).
function findValueNear(obj, target, path = "", out = [], depth = 0) {
  if (depth > 9 || obj == null) return out;
  if (typeof obj === "number" && Math.abs(obj - target) < 0.5) out.push([path, obj]);
  if (typeof obj === "object") for (const [k, v] of Object.entries(obj)) findValueNear(v, target, path ? `${path}.${k}` : k, out, depth + 1);
  return out;
}

(async () => {
  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
  const ctx = await browser.newContext({ locale: "tr-TR", viewport: { width: 1366, height: 768 }, userAgent: UA });
  const page = await ctx.newPage();
  console.log("گرفتنِ کوکی …");
  await page.goto("https://www.trendyol.com", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  for (const { url, stored, real } of cases) {
    console.log("\n============================================================");
    console.log("URL:", url);
    console.log("قیمتِ ذخیره‌شدهٔ ما (اشتباه):", stored, " | قیمتِ واقعیِ ترندیول:", real);
    try {
      const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      console.log("HTTP:", resp?.status());
      if (resp?.status() === 403) { console.log("بلاک شد — کمی بعد دوباره امتحان کن"); continue; }
      const html = await page.content();
      const p = extractWindowJson(html, "__envoy__SHARED_PROPS")?.product;
      if (!p) { console.log("product JSON پیدا نشد. اندازهٔ HTML:", html.length); continue; }
      console.log("نام:", p.name, "| برند:", p.brand?.name);

      console.log("\n--- قیمتِ هر واریانتِ p.variants (همان چیزی که سینک الان می‌خواند) ---");
      for (const v of p.variants || []) console.log(`  ${v.value} → v.price.value = ${v.price?.value}`);

      console.log("\n--- merchantListing.winnerVariant.price (قیمتِ فروشندهٔ برنده = چیزی که ترندیول نشان می‌دهد) ---");
      const wp = p.merchantListing?.winnerVariant?.price;
      console.log("  discountedPrice:", wp?.discountedPrice?.value);
      console.log("  sellingPrice:", wp?.sellingPrice?.value);
      console.log("  originalPrice:", wp?.originalPrice?.value);

      console.log(`\n--- کجای JSON عددِ واقعی (${real}) پیدا می‌شود؟ ---`);
      const hits = findValueNear(p, real);
      if (hits.length === 0) console.log("  ⚠️ عددِ واقعی هیچ‌جای دادهٔ محصول نبود! (یعنی این merchant قیمتِ دیگری دارد)");
      else for (const [path, val] of hits.slice(0, 30)) console.log(`  ${path} = ${val}`);

      console.log(`\n--- کجای JSON عددِ اشتباهِ ما (${stored}) پیدا می‌شود؟ ---`);
      for (const [path, val] of findValueNear(p, stored).slice(0, 30)) console.log(`  ${path} = ${val}`);

      // آیا چند فروشنده (merchant) دارد؟
      console.log("\n--- otherMerchants / سایر فروشنده‌ها ---");
      const om = p.otherMerchants || p.merchantListing?.otherMerchants || p.merchants;
      console.log("  تعداد:", Array.isArray(om) ? om.length : "(فیلد پیدا نشد)");
      if (Array.isArray(om)) for (const m of om.slice(0, 5)) console.log("   -", m.merchant?.name || m.name, "→", JSON.stringify(m.price?.discountedPrice?.value ?? m.price?.value ?? m.price));
    } catch (e) {
      console.log("خطا:", String(e).slice(0, 200));
    }
  }
  await browser.close();
})();
