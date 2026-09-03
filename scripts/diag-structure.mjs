// تشخیصِ ساختارِ کاملِ سایز/رنگ/قیمت یک محصولِ ترندیول — تا بفهمیم قیمتِ متفاوت بر اساسِ سایز و
// رنگ کجای دادهٔ خام است، برای پیاده‌سازیِ درستِ نمایشِ قیمتِ هر سایز/رنگ در سایت.
// هیچ‌چیزی در دیتابیس نمی‌نویسد.
//
// اجرا:  npx tsx scripts/diag-structure.mjs "<URLِ محصولی که قیمتش بر اساس سایز یا رنگ فرق می‌کند>"
import { chromium } from "playwright";

const url = process.argv[2];
if (!url) {
  console.log("لطفاً یک URLِ محصول بده. مثال:");
  console.log('  npx tsx scripts/diag-structure.mjs "https://www.trendyol.com/..."');
  process.exit(1);
}

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

(async () => {
  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
  const ctx = await browser.newContext({ locale: "tr-TR", viewport: { width: 1366, height: 768 }, userAgent: UA });
  const page = await ctx.newPage();
  console.log("گرفتنِ کوکی …");
  await page.goto("https://www.trendyol.com", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("HTTP:", resp?.status());
  if (resp?.status() === 403) { console.log("بلاک شد — کمی بعد دوباره امتحان کن"); await browser.close(); return; }
  const html = await page.content();
  const p = extractWindowJson(html, "__envoy__SHARED_PROPS")?.product;
  if (!p) { console.log("product JSON پیدا نشد. اندازهٔ HTML:", html.length); await browser.close(); return; }

  console.log("\n=== نام:", p.name, "| برند:", p.brand?.name, "===");

  console.log("\n### ۱) کلیدهای سطحِ اولِ product (برای کشفِ ساختار) ###");
  console.log(Object.keys(p).join(", "));

  console.log("\n### ۲) سایزها و قیمتِ هرکدام (p.variants) ###");
  for (const v of p.variants || []) {
    console.log(`  سایز=${v.value} | قیمت=${v.price?.value} | موجود=${v.inStock} | itemNumber=${v.itemNumber}`);
  }

  console.log("\n### ۳) winnerVariant (قیمتِ نمایشیِ ترندیول برای سایزِ انتخاب‌شده) ###");
  const w = p.merchantListing?.winnerVariant;
  console.log("  سایزِ انتخاب‌شده:", w?.variantAttributes?.map((a) => `${a.attributeName}=${a.attributeValue}`).join(", "));
  console.log("  قیمت (discounted/selling/original):", w?.price?.discountedPrice?.value, "/", w?.price?.sellingPrice?.value, "/", w?.price?.originalPrice?.value);

  console.log("\n### ۴) merchantListing.variants — قیمتِ هر سایز از فروشندهٔ برنده (کلید!) ###");
  const mlv = p.merchantListing?.variants;
  if (Array.isArray(mlv)) {
    for (const item of mlv) {
      const size = item.attributeValue || item.value || item.variantAttributes?.map((a) => a.attributeValue).join("/") || "?";
      const pr = item.price || {};
      console.log(`  سایز=${size} | discounted=${pr.discountedPrice?.value} selling=${pr.sellingPrice?.value} original=${pr.originalPrice?.value} | inStock=${item.inStock}`);
    }
    console.log("\n  --- یک آیتمِ خامِ کامل (برای دیدنِ همهٔ فیلدها) ---");
    console.log(JSON.stringify(mlv[0], null, 2));
  } else {
    console.log("  (آرایه نبود:", typeof mlv, ")");
  }

  console.log("\n### ۵) رنگ‌ها: slicingAttributes + productGroupId ###");
  console.log("  productGroupId:", p.productGroupId);
  console.log("  slicingAttributes (خام):");
  console.log(JSON.stringify(p.slicingAttributes, null, 2));

  await browser.close();
})();
