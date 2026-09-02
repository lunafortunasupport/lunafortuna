// اسکریپتِ تشخیصیِ یک‌باره — دقیقاً همان الگویِ اثبات‌شدهٔ fetchDetail در sync-trendyol.mjs (که
// امروز روی هزاران محصول کار کرد)، فقط به‌جایِ ذخیره در دیتابیس، همهٔ فیلدهای مربوط به قیمت را
// خام چاپ می‌کند. هیچ‌چیزی در دیتابیس نمی‌نویسد.
//
// اجرا:  npx tsx scripts/diag-price.mjs
import { chromium } from "playwright";

const urls = [
  // مانگو — کاربر گفت این برند درست به‌نظر می‌رسید، برای مقایسه
  "https://www.trendyol.com/mango/lyocell-anvelop-tulum-p-1167828887?boutiqueId=61&merchantId=104723",
  // محصولِ خانه/عمومی — کاربر گفت این دسته ایراد داشت
  "https://www.trendyol.com/unichrome/el-aynasi-masa-aynasi-makyaj-aynasi-egim-ayarlanabilir-kare-makeup-mirror-18cm-menteseli-p-835793159?boutiqueId=61&merchantId=1232470",
];
// قیمتی که همین الان در دیتابیسِ ما ذخیره است — برای مقایسهٔ مستقیم با چیزی که همین اسکریپت
// همین لحظه از خودِ ترندیول می‌گیرد.
const storedPrices = { 0: 2999.99, 1: 199.9 };

// عیناً کپی از fetchDetail در sync-trendyol.mjs — نسخهٔ اولیهٔ من (رجکسِ ساده) اشتباه بود؛
// این نسخهٔ درست، پرانتزهای { } را دقیق می‌شمارد تا مرزِ واقعیِ JSON را پیدا کند.
function extractWindowJson(html, key) {
  const marker = `window["${key}"]=`;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  let i = idx + marker.length;
  if (html[i] !== "{") return null;
  const start = i;
  let depth = 0,
    inStr = false,
    strCh = "",
    esc = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  try {
    return JSON.parse(html.slice(start, i));
  } catch {
    return null;
  }
}

function findPriceFields(obj, path = "", out = [], depth = 0) {
  if (depth > 6 || obj == null || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (/price|fiyat|indirim|discount/i.test(k)) {
      if (typeof v === "number" || typeof v === "string") out.push([p, v]);
      else if (v && typeof v === "object" && "value" in v) out.push([p + ".value", v.value]);
    }
    if (v && typeof v === "object" && !Array.isArray(v)) findPriceFields(v, p, out, depth + 1);
  }
  return out;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

(async () => {
  // دقیقاً همان تنظیماتِ استتارِ سینکِ اصلی — اسکریپتِ تشخیصیِ قبلی این را نداشت و برای همین
  // ۴۰۳ می‌خورد حتی روی لینکِ کاملاً تازه (تشخیصِ ربات با fingerprintِ پیش‌فرضِ Playwright).
  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
  const ctx = await browser.newContext({ locale: "tr-TR", viewport: { width: 1366, height: 768 }, userAgent: UA });
  const page = await ctx.newPage();
  // دقیقاً مثلِ collectCandidates در سینکِ اصلی: قبل از رفتن به صفحهٔ محصول، یک‌بار خودِ سایت را
  // باز می‌کنیم تا کوکی/کانتکستِ لازم گرفته شود — بدونِ این، درخواستِ مستقیم به صفحهٔ عمیق ۴۰۳
  // می‌خورَد.
  console.log("گرفتنِ کوکی از trendyol.com …");
  await page.goto("https://www.trendyol.com", { waitUntil: "domcontentloaded", timeout: 30000 }).catch((e) => {
    console.log("  (هشدار در بازدیدِ اول:", String(e).slice(0, 100), ")");
  });
  for (const [i, url] of urls.entries()) {
    console.log("\n==============================");
    console.log("URL:", url);
    console.log("قیمتِ ذخیره‌شده در دیتابیسِ ما:", storedPrices[i], "لیر");
    try {
      // دقیقاً همان الگوی fetchDetail: domcontentloaded، ۳۰ ثانیه، چک‌کردنِ status.
      const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      const status = resp ? resp.status() : 0;
      console.log("  HTTP status:", status);
      if (status === 403 || status === 429 || status === 503) {
        console.log("  ❌ بلاک شد (status " + status + ")");
        continue;
      }
      const html = await page.content();
      console.log("  اندازهٔ HTML:", html.length, "کاراکتر");
      const shared = extractWindowJson(html, "__envoy__SHARED_PROPS");
      const p = shared?.product;
      if (!p) {
        console.log("  ❌ product JSON پیدا نشد.");
        const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,300})/);
        console.log("  ۳۰۰ کاراکترِ اولِ body:", bodyMatch ? bodyMatch[1].replace(/\s+/g, " ") : "(نبود)");
        continue;
      }
      console.log("  ✅ نام:", p.name);
      console.log("  brand:", p.brand?.name);
      console.log("\n  --- همهٔ فیلدهای شبیهِ قیمت ---");
      for (const [path, val] of findPriceFields(p)) console.log(`  ${path} = ${val}`);
      console.log("\n  --- variants[0] خام ---");
      console.log(JSON.stringify(p.variants?.[0] || null, null, 2));
      console.log("\n  --- merchantListing.winnerVariant خام ---");
      console.log(JSON.stringify(p.merchantListing?.winnerVariant || null, null, 2));
    } catch (e) {
      console.log("  ❌ خطا:", String(e).slice(0, 200));
    }
  }
  await browser.close();
})();
