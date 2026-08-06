// حسابرسی لینک‌های برند با «مرورگر واقعی» (Playwright/Chromium).
// چرا؟ بررسی HTTP فقط status می‌بیند؛ خیلی از سایت‌ها با JavaScript کاربر را به
// صفحهٔ اصلی/انتخاب‌کشور می‌فرستند یا «۴۰۴ نرم» نشان می‌دهند که فقط در مرورگر دیده می‌شود.
//
// این اسکریپت فقط لینک‌هایی را چک می‌کند که هنوز «زنده» فرض شده‌اند
// (در deadUrlsِ scripts/link-audit.json نیستند) و هرکدام واقعاً به صفحه اصلی/۴۰۴
// می‌رود را به deadUrls اضافه می‌کند. فرمت فایل دست‌نخورده می‌ماند تا seed مصرفش کند.
//
// اجرا (از ماشین ترکیه، تا مثل تجربهٔ مشتری بخواند):
//   npx tsx scripts/audit-brand-links-browser.mjs [--only=slug1,slug2] [--limit=N] [--headed]
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { BRANDS } from "../src/lib/brandData.ts";

const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=")[1] || "";
const ONLY = arg("only") ? new Set(arg("only").split(",")) : null;
const LIMIT = arg("limit") ? parseInt(arg("limit")) : 0;
const HEADED = process.argv.includes("--headed");
const CONCURRENCY = 5;

const auditPath = "scripts/link-audit.json";
const audit = JSON.parse(readFileSync(auditPath, "utf8"));
const deadSet = new Set(audit.deadUrls || []);

// نشانه‌های صفحهٔ «پیدا نشد» (ترکی/انگلیسی)
const NOT_FOUND = [
  "sayfa bulunamad",
  "bulunamadı",
  "mevcut değil",
  "aradığınız sayfa",
  "böyle bir sayfa",
  "page not found",
  "404 error",
  "not found",
];

function collectUrls() {
  const out = [];
  for (const [group, list] of Object.entries(BRANDS)) {
    for (const b of list) {
      if (ONLY && !ONLY.has(b.id)) continue;
      const { id, name, url, domain, ...rest } = b;
      const walk = (obj, prefix) => {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === "string" && v.startsWith("http")) out.push({ slug: id, key: `${prefix}${k}`, url: v });
          else if (v && typeof v === "object") walk(v, `${prefix}${k}.`);
        }
      };
      if (url && url.startsWith("http")) out.push({ slug: id, key: "url", url });
      walk(rest, "");
    }
  }
  return out;
}

function pathDepth(u) {
  try {
    const p = new URL(u).pathname.replace(/\/+$/, "");
    return p === "" ? 0 : p.split("/").filter(Boolean).length;
  } catch {
    return 0;
  }
}
function sameHost(a, b) {
  try {
    return new URL(a).host.replace(/^www\./, "") === new URL(b).host.replace(/^www\./, "");
  } catch {
    return false;
  }
}

async function checkPage(page, item) {
  try {
    const resp = await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    // فرصت برای ریدایرکت‌های JS
    await page.waitForTimeout(2500);
    try {
      await page.waitForLoadState("networkidle", { timeout: 6000 });
    } catch {}
    const finalUrl = page.url();
    const status = resp ? resp.status() : 0;
    let text = "";
    try {
      text = ((await page.title()) + " " + (await page.locator("body").innerText({ timeout: 3000 })).slice(0, 500)).toLowerCase();
    } catch {}
    const is404 = NOT_FOUND.some((s) => text.includes(s));
    const sd = pathDepth(item.url);
    const ed = pathDepth(finalUrl);

    let verdict = "ok";
    let note = "";
    if (status === 403 || status === 429 || status === 503) {
      // بلاک‌شدنِ ربات ≠ لینک خراب؛ نامطمئن، نگه می‌داریم.
      verdict = "blocked";
      note = `HTTP ${status} (بلاک ربات)`;
    } else if (status === 404 || status === 410) {
      verdict = "bad-status";
      note = `HTTP ${status}`;
    } else if (is404) {
      verdict = "soft-404";
      note = "متن «پیدا نشد»";
    } else if (!sameHost(item.url, finalUrl) && ed === 0) {
      // فقط اگر به صفحهٔ اصلیِ دامنهٔ دیگر رفت بد است؛ اگر به همان دستهٔ دامنهٔ
      // جدید رفت (مثل madamecoco.com.tr → madamecoco.com/havlu) درست است.
      verdict = "redirect-offsite";
      note = `→ ${finalUrl}`;
    } else if (sd >= 1 && ed === 0) {
      verdict = "redirect-home";
      note = `→ ${finalUrl}`;
    } else if (sd - ed >= 2) {
      verdict = "redirect-shallow";
      note = `→ ${finalUrl}`;
    }
    return { ...item, finalUrl, status, verdict, note };
  } catch (e) {
    return { ...item, finalUrl: "", status: 0, verdict: "error", note: String(e.name || e.message).slice(0, 40) };
  }
}

async function main() {
  let items = collectUrls().filter((it) => !deadSet.has(it.url));
  if (LIMIT) items = items.slice(0, LIMIT);
  console.error(`بررسی ${items.length} لینکِ «زنده» با مرورگر واقعی (concurrency=${CONCURRENCY})...`);

  const browser = await chromium.launch({
    headless: !HEADED,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    locale: "tr-TR",
    viewport: { width: 1366, height: 768 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  });
  // مخفی‌کردن نشانهٔ اتوماسیون (کاهش بلاک‌شدن)
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });
  // برای سرعت: تصویر/فونت/مدیا را نگیر (روی ریدایرکت اثری ندارد)
  await context.route("**/*", (route) => {
    const t = route.request().resourceType();
    if (t === "image" || t === "media" || t === "font") route.abort();
    else route.continue();
  });

  const results = [];
  let idx = 0;
  let done = 0;
  const pages = await Promise.all(Array.from({ length: CONCURRENCY }, () => context.newPage()));
  await Promise.all(
    pages.map(async (page) => {
      while (idx < items.length) {
        const i = idx++;
        results[i] = await checkPage(page, items[i]);
        done++;
        if (done % 25 === 0) console.error(`  ${done}/${items.length}`);
      }
    })
  );
  await browser.close();

  const BAD = new Set(["bad-status", "soft-404", "redirect-home", "redirect-shallow", "redirect-offsite"]);
  const newlyBad = results.filter((r) => BAD.has(r.verdict));

  console.log("\n=== لینک‌های تازه‌کشف‌شده که به صفحه اصلی/۴۰۴ می‌روند ===");
  const byBrand = {};
  for (const r of newlyBad) {
    (byBrand[r.slug] ||= []).push(r);
  }
  for (const [slug, list] of Object.entries(byBrand)) {
    console.log(`\n[${slug}] ${list.length} لینک بد:`);
    for (const r of list) console.log(`  ${r.key.padEnd(16)} ${r.verdict} ${r.note}`);
  }

  const errors = results.filter((r) => r.verdict === "error");
  console.log(`\nخلاصه: ${results.length} بررسی | بدِ جدید: ${newlyBad.length} | خطا(نگه‌داشته): ${errors.length}`);

  // ادغام در deadUrls و نوشتن فایل
  for (const r of newlyBad) deadSet.add(r.url);
  audit.deadUrls = [...deadSet];
  audit.stats = { ...(audit.stats || {}), browserAuditAt: new Date().toISOString(), newlyDead: newlyBad.length };
  writeFileSync(auditPath, JSON.stringify(audit, null, 2), "utf8");
  console.log(`\n✓ ${auditPath} به‌روزرسانی شد — مجموع deadUrls: ${audit.deadUrls.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
