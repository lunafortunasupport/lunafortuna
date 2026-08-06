// بررسی آدرس‌های کاندیدِ صفحهٔ حراج (indirim) برندهای برتر با مرورگر واقعی.
// آن‌هایی که واقعاً باز می‌شوند (نه ۴۰۴/ریدایرکت به خانه) را چاپ می‌کند تا در
// SALE_URLS داخل prisma/seed.ts گذاشته شوند.
//   npx tsx scripts/verify-sale-urls.mjs
import { chromium } from "playwright";

// کاندیدها: آدرس‌های رایجِ صفحهٔ حراج برندهای ترکیه (بهترین حدس؛ این‌جا تأیید می‌شوند).
const CANDIDATES = {
  koton: "https://www.koton.com/indirim",
  mavi: "https://www.mavi.com/indirim",
  defacto: "https://www.defacto.com.tr/indirim",
  lcwaikiki: "https://www.lcw.com/indirim",
  hm: "https://www2.hm.com/tr_tr/sale.html",
  adidas: "https://www.adidas.com.tr/indirim",
  puma: "https://tr.puma.com/tr/tr/indirim",
  colins: "https://www.colins.com.tr/indirim",
  penti: "https://www.penti.com/indirim",
  boyner: "https://www.boyner.com.tr/indirim",
  flo: "https://www.flo.com.tr/indirim",
  kigili: "https://www.kigili.com/indirim",
  avva: "https://www.avva.com.tr/indirim",
  ipekyol: "https://www.ipekyol.com.tr/indirim",
  trendyol: "https://www.trendyol.com/indirim",
  karaca: "https://www.karaca.com/indirim",
  sephora: "https://www.sephora.com.tr/indirim",
  englishhome: "https://www.englishhome.com/indirim",
  madamecoco: "https://www.madamecoco.com.tr/indirim",
  superstep: "https://www.superstep.com.tr/indirim",
};

const NOT_FOUND = ["sayfa bulunamad", "bulunamadı", "mevcut değil", "page not found", "not found", "404"];
const pathDepth = (u) => {
  try {
    const p = new URL(u).pathname.replace(/\/+$/, "");
    return p === "" ? 0 : p.split("/").filter(Boolean).length;
  } catch {
    return 0;
  }
};

const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const ctx = await browser.newContext({
  locale: "tr-TR",
  viewport: { width: 1366, height: 768 },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
});
await ctx.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => undefined }));
await ctx.route("**/*", (r) => (["image", "media", "font"].includes(r.request().resourceType()) ? r.abort() : r.continue()));

const ok = {};
for (const [slug, url] of Object.entries(CANDIDATES)) {
  const page = await ctx.newPage();
  let verdict = "ok";
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500);
    const finalUrl = page.url();
    const status = resp ? resp.status() : 0;
    let text = "";
    try {
      text = ((await page.title()) + " " + (await page.locator("body").innerText({ timeout: 3000 })).slice(0, 400)).toLowerCase();
    } catch {}
    if (status === 403 || status === 429) verdict = "blocked(احتمالاً درست)";
    else if (status === 404 || status === 410) verdict = "404";
    else if (NOT_FOUND.some((s) => text.includes(s))) verdict = "soft-404";
    else if (pathDepth(url) >= 1 && pathDepth(finalUrl) === 0) verdict = "redirect-home";
    if (verdict === "ok" || verdict.startsWith("blocked")) ok[slug] = url;
    console.log(`${slug.padEnd(12)} ${verdict.padEnd(22)} ${status}  ${finalUrl}`);
  } catch (e) {
    console.log(`${slug.padEnd(12)} error(${String(e.name)})`);
  }
  await page.close();
}
await browser.close();

console.log("\n=== SALE_URLS (این را در prisma/seed.ts بگذار) ===");
console.log(JSON.stringify(ok, null, 2));
