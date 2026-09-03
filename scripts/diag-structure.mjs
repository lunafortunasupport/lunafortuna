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

  console.log("\n### ۴) کلیدهای merchantListing (شاید لیستِ per-size برنده اینجا باشد) ###");
  console.log("  ", p.merchantListing ? Object.keys(p.merchantListing).join(", ") : "(نبود)");
  // اگر merchantListing آرایه‌ای از واریانت‌ها دارد، همه را چاپ کن
  for (const k of Object.keys(p.merchantListing || {})) {
    const val = p.merchantListing[k];
    if (Array.isArray(val) && val.length && val[0]?.price) {
      console.log(`  merchantListing.${k} (آرایهٔ ${val.length}تایی با قیمت):`);
      for (const item of val.slice(0, 20)) {
        const size = item.variantAttributes?.map((a) => a.attributeValue).join("/") || item.value || "?";
        console.log(`     سایز=${size} | قیمت=${item.price?.discountedPrice?.value ?? item.price?.value}`);
      }
    }
  }

  console.log("\n### ۵) گزینه‌های رنگ (هر رنگ معمولاً productId/URLِ جدا دارد) ###");
  const colorFields = ["colorSwatchList", "otherColorOptions", "colorOptions", "colors", "allVariants", "variantModel"];
  for (const f of colorFields) {
    if (p[f]) {
      console.log(`  p.${f}:`, Array.isArray(p[f]) ? `آرایهٔ ${p[f].length}تایی` : typeof p[f]);
      if (Array.isArray(p[f])) for (const c of p[f].slice(0, 15)) {
        console.log("     ", JSON.stringify({ name: c.name ?? c.color ?? c.text, price: c.price?.discountedPrice?.value ?? c.price?.value, url: c.url, id: c.id ?? c.productId }));
      }
    }
  }
  const otherKeys = Object.keys(p).filter((k) => /color|renk|variant/i.test(k));
  console.log("  همهٔ کلیدهای مرتبط با رنگ/واریانت:", otherKeys.join(", ") || "(هیچ)");

  await browser.close();
})();
