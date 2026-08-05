// حسابرسی لینک‌های عمیق برندها:
// هر URL را با User-Agent مرورگر می‌زند، ریدایرکت‌ها را دنبال می‌کند،
// و موارد مشکوک را گزارش می‌دهد:
//   - status >= 400
//   - ریدایرکت به صفحهٔ اصلی (مسیر نهایی «/» یا خیلی کوتاه‌تر از مسیر اولیه)
//   - خطای شبکه/timeout
//
// اجرا:  node scripts/audit-brand-links.mjs [--only=slug1,slug2]
import { writeFileSync } from "node:fs";
import { BRANDS } from "../src/lib/brandData.ts";

const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").replace("--only=", "");
const onlySet = ONLY ? new Set(ONLY.split(",")) : null;
const EMIT = process.argv.includes("--emit"); // نوشتن scripts/link-audit.json

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const HEADERS = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
};

// جمع‌آوری همهٔ URLها به‌صورت {slug, key, url}
function collectUrls() {
  const out = [];
  for (const [group, list] of Object.entries(BRANDS)) {
    for (const b of list) {
      if (onlySet && !onlySet.has(b.id)) continue;
      const { id, name, url, domain, ...rest } = b;
      const walk = (obj, prefix) => {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === "string" && v.startsWith("http")) {
            out.push({ slug: id, group, key: `${prefix}${k}`, url: v });
          } else if (v && typeof v === "object") {
            walk(v, `${prefix}${k}.`);
          }
        }
      };
      if (url && url.startsWith("http")) out.push({ slug: id, group, key: "url", url });
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

async function check(item) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(item.url, {
      method: "GET",
      headers: HEADERS,
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(t);
    const finalUrl = res.url || item.url;
    const startDepth = pathDepth(item.url);
    const endDepth = pathDepth(finalUrl);
    let verdict = "ok";
    let note = "";
    if (res.status >= 400) {
      verdict = res.status === 403 || res.status === 429 ? "blocked" : "bad";
      note = `HTTP ${res.status}`;
    } else if (startDepth >= 1 && endDepth === 0) {
      verdict = "redirect-home";
      note = `→ ${finalUrl}`;
    } else if (startDepth - endDepth >= 2) {
      verdict = "redirect-shallow";
      note = `→ ${finalUrl}`;
    }
    return { ...item, status: res.status, finalUrl, verdict, note };
  } catch (e) {
    clearTimeout(t);
    return { ...item, status: 0, finalUrl: "", verdict: "error", note: String(e.name || e.message) };
  }
}

// اجرای موازی با محدودیت همزمانی
async function pool(items, concurrency, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

// نگاشت برند → دامنه (برای حل صفحهٔ اصلی)
function collectBrands() {
  const out = [];
  for (const [group, list] of Object.entries(BRANDS)) {
    for (const b of list) {
      if (onlySet && !onlySet.has(b.id)) continue;
      out.push({ slug: b.id, domain: b.domain, url: b.url });
    }
  }
  return out;
}

// برخی برندها دامنهٔ سراسری دارند و ریشه به سایت غیرترکیه (US/GB/انتخاب کشور)
// ریدایرکت می‌شود؛ این‌ها را دستی به فروشگاه ترکیه می‌بندیم (همه تأییدشده: 200).
const HOMEPAGE_OVERRIDE = {
  mango: "https://shop.mango.com/tr/tr",
  converse: "https://www.converse.com.tr/",
  vans: "https://www.vans.com.tr/",
  thenorthface: "https://www.thenorthface.com.tr/",
};

// حل یک صفحهٔ اصلیِ کارآمد برای هر برند
async function resolveHomepage(brand) {
  if (HOMEPAGE_OVERRIDE[brand.slug]) return HOMEPAGE_OVERRIDE[brand.slug];
  const candidates = [];
  if (brand.url) candidates.push(brand.url.replace(/\/+$/, "") + "/");
  if (brand.domain) {
    candidates.push(`https://www.${brand.domain}/`);
    candidates.push(`https://${brand.domain}/`);
  }
  for (const c of candidates) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(c, { headers: HEADERS, redirect: "follow", signal: controller.signal });
      clearTimeout(t);
      if (res.status < 400) return res.url || c; // آدرس نهایی پس از ریدایرکت
      if (res.status === 403 || res.status === 429) return c; // بلاک شده ولی در مرورگر کار می‌کند
    } catch {
      clearTimeout(t);
    }
  }
  // فfallback: اولین کاندید (معمولاً www.domain)
  return candidates[0] || "";
}

const items = collectUrls();
console.error(`در حال بررسی ${items.length} لینک...`);
const results = await pool(items, 12, check);

const problems = results.filter((r) => r.verdict !== "ok" && r.verdict !== "blocked");
const blocked = results.filter((r) => r.verdict === "blocked");

// خلاصه به‌ازای هر برند
const byBrand = {};
for (const r of results) {
  byBrand[r.slug] ||= { ok: 0, blocked: 0, problem: 0 };
  if (r.verdict === "ok") byBrand[r.slug].ok++;
  else if (r.verdict === "blocked") byBrand[r.slug].blocked++;
  else byBrand[r.slug].problem++;
}

console.log("\n=== مشکل‌دارها (نیازمند اصلاح) ===");
for (const r of problems) {
  console.log(`[${r.slug}] ${r.key}  ${r.verdict} ${r.note}`);
  console.log(`    ${r.url}`);
}

console.log(`\n=== خلاصهٔ برندها (problem>0 یا همه‌بلاک) ===`);
for (const [slug, s] of Object.entries(byBrand)) {
  if (s.problem > 0 || (s.ok === 0 && s.blocked > 0)) {
    console.log(`${slug}: ok=${s.ok} blocked=${s.blocked} problem=${s.problem}`);
  }
}

console.log(
  `\nمجموع: ${results.length} | مشکل‌دار: ${problems.length} | بلاک‌شده(403/429): ${blocked.length}`
);

if (EMIT) {
  // فقط لینک‌های «قطعاً مرده» را برای حذف علامت می‌زنیم:
  //   bad (404/410/...) و redirect-home و redirect-shallow
  //   (blocked=403/429 و error=شبکه را نگه می‌داریم چون نامطمئن‌اند و در مرورگر ممکن است کار کنند)
  const DEAD = new Set(["bad", "redirect-home", "redirect-shallow"]);
  const deadUrls = results.filter((r) => DEAD.has(r.verdict)).map((r) => r.url);

  console.error(`\nدر حال حل صفحهٔ اصلی ${collectBrands().length} برند...`);
  const brands = collectBrands();
  const homepage = {};
  await pool(brands, 8, async (b) => {
    homepage[b.slug] = await resolveHomepage(b);
  });

  const audit = {
    generatedAt: new Date().toISOString(),
    stats: { total: results.length, dead: deadUrls.length, blocked: blocked.length },
    deadUrls,
    homepage,
  };
  writeFileSync("scripts/link-audit.json", JSON.stringify(audit, null, 2), "utf8");
  console.error(`\n✓ scripts/link-audit.json نوشته شد (dead=${deadUrls.length}, brands=${brands.length})`);
}
