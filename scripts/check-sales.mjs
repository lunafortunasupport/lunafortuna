// ربات تشخیص حراج: برای هر برندِ دارای saleUrl، صفحهٔ حراج را با مرورگر واقعی باز
// می‌کند، تشخیص می‌دهد حراج فعال است یا نه، و saleActive/saleLabel/saleCheckedAt را
// در دیتابیس به‌روز می‌کند. روی GitHub Actions زمان‌بندی می‌شود (DATABASE_URL از secret).
//
//   npx tsx scripts/check-sales.mjs [--only=slug1,slug2]
//
// منطق محافظه‌کارانه: فقط وقتی «قطعاً حراج نیست» (۴۰۴ نرم یا هیچ نشانهٔ تخفیف) غیرفعال
// می‌کند؛ اگر ربات بلاک شد یا خطا داد، مقدار قبلی را دست‌نخورده می‌گذارد (فقط زمان چک را
// به‌روز می‌کند) تا فعال‌سازیِ دستی/seed از بین نرود.
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=")[1] || "";
const ONLY = arg("only") ? new Set(arg("only").split(",")) : null;
const CONCURRENCY = 4;

const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
const NOT_FOUND = ["sayfa bulunamad", "bulunamadı", "mevcut değil", "page not found", "not found", "404"];

async function detect(page, brand) {
  try {
    const resp = await page.goto(brand.saleUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500);
    const status = resp ? resp.status() : 0;
    if (status === 403 || status === 429 || status === 503) return { verdict: "blocked" };

    const info = await page.evaluate(() => {
      const txt = (document.body.innerText || "").toLowerCase();
      const strike = document.querySelectorAll(
        'del, s, [class*="old-price"], [class*="oldPrice"], [class*="discount"], [class*="indirim"], [class*="sale"], [class*="campaign"]'
      ).length;
      const pcts = (document.body.innerText.match(/%\s?(\d{1,2})/g) || []).map((x) => parseInt(x.replace(/\D/g, "")));
      const maxPct = pcts.length ? Math.max(...pcts.filter((n) => n >= 5 && n <= 90)) : 0;
      return { txt: txt.slice(0, 300), strike, pctCount: pcts.length, maxPct };
    });

    const is404 = NOT_FOUND.some((s) => info.txt.includes(s));
    if (is404) return { verdict: "no-sale" }; // فقط صفحهٔ حراجِ مرده خاموش می‌شود
    const looksLikeSalePage =
      info.strike >= 1 || info.pctCount >= 1 || info.txt.includes("indirim") || info.txt.includes("sepet");
    if (looksLikeSalePage) {
      const label = info.maxPct ? `تا ${fa(info.maxPct)}٪ تخفیف` : null;
      return { verdict: "sale", label };
    }
    // زنده ولی مبهم (مثل صفحهٔ JS-محور با دیوارِ کوکی): وضعیت را دست‌نخورده بگذار.
    return { verdict: "ambiguous" };
  } catch (e) {
    return { verdict: "error", note: String(e.name || e.message).slice(0, 40) };
  }
}

async function main() {
  let brands = await prisma.brand.findMany({
    where: { saleUrl: { not: null } },
    select: { id: true, slug: true, name: true, saleUrl: true, saleActive: true },
  });
  if (ONLY) brands = brands.filter((b) => ONLY.has(b.slug));
  console.log(`بررسی حراج ${brands.length} برند...`);

  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
  const ctx = await browser.newContext({
    locale: "tr-TR",
    viewport: { width: 1366, height: 768 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  });
  await ctx.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => undefined }));
  await ctx.route("**/*", (r) => (["image", "media", "font"].includes(r.request().resourceType()) ? r.abort() : r.continue()));

  let idx = 0;
  const now = new Date();
  const pages = await Promise.all(Array.from({ length: CONCURRENCY }, () => ctx.newPage()));
  await Promise.all(
    pages.map(async (page) => {
      while (idx < brands.length) {
        const b = brands[idx++];
        const r = await detect(page, b);
        // فقط sale/no-sale مقدار saleActive را تغییر می‌دهند؛ blocked/error دست‌نخورده.
        const data = { saleCheckedAt: now };
        if (r.verdict === "sale") {
          data.saleActive = true;
          if (r.label) data.saleLabel = r.label;
        } else if (r.verdict === "no-sale") {
          data.saleActive = false;
        }
        await prisma.brand.update({ where: { id: b.id }, data });
        console.log(`  ${b.slug.padEnd(12)} ${r.verdict}${r.label ? " · " + r.label : ""}`);
      }
    })
  );
  await browser.close();
  await prisma.$disconnect();
  const active = await prisma.brand.count({ where: { saleActive: true } }).catch(() => "?");
  console.log(`\n✓ تمام شد. برندهای حراجِ فعال اکنون: ${active}`);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
