// سینکِ کاتالوگِ برندِ «آمبار» (Ambar Giyim) — مستقیم از سایتِ رسمیِ خودشان (ambargiyim.com.tr)،
// نه از ترندیول (بررسیِ زنده نشان داد کاتالوگِ آمبار در جست‌وجوی ترندیول عملاً پیدا نمی‌شود — کوئریِ
// «ambar» فقط نویزِ برندهای نامرتبط برمی‌گرداند). خروجی روی همان MirrorProduct/MirrorVariant با
// featuredBrand="ambar" می‌نشیند، دقیقاً کنارِ محصولاتِ ترندیول.
//
//   npx tsx scripts/sync-ambar.mjs
//   LIMIT_PER_CATEGORY=10 npx tsx scripts/sync-ambar.mjs   ← حالتِ تستِ سریع
//
// ── چرا اینجا برخلافِ sync-trendyol.mjs نیازی به Playwright نیست ──
// ambargiyim.com.tr روی Ticimax (ASP.NET) سوار است و پشتِ محافظتِ سطحِ TLS/JA-fingerprint مثلِ
// ترندیول نیست: صفحاتِ لیستینگ و جزئیات با fetchِ سادهٔ Node مستقیم ۲۰۰ برمی‌گردانند (تستِ زنده،
// آگوست ۲۰۲۶). صفحاتِ لیستینگ لینکِ محصولات را در همان HTMLِ اولیه دارند (نه AJAX)، و صفحاتِ جزئیات
// هم یک بلوکِ JSON-LDِ استاندارد (schema.org/Product) و هم یک متغیرِ `productDetailModel` (سایز/موجودی)
// را مستقیم توی <script> می‌گذارند — نیازی به اجرای جاوااسکریپت نیست.
import { PrismaClient } from "@prisma/client";
import { trLower, categoryLabelFa, CATEGORY_LABELS_FA } from "./trendyol-fa-dict.mjs";

const prisma = new PrismaClient();

const BASE = "https://www.ambargiyim.com.tr";
const LIMIT_PER_CATEGORY = Number(process.env.LIMIT_PER_CATEGORY) || 100;
const DETAIL_CONCURRENCY = Number(process.env.DETAIL_CONCURRENCY) || 5;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ۶ بخشِ اصلیِ سایت (منوی بالا). هر کدام یک fallback فارسی دارد، برای وقتی نامِ محصول با هیچ‌کدام
// از کلیدهای CATEGORY_LABELS_FA مطابقت نداشت (مثلاً محصولاتِ اکسسوری که اسمِ نوعِ لباس ندارند).
const SECTIONS = [
  { slug: "ust-giyim", fallbackFa: "پوشاکِ بالاتنه" },
  { slug: "alt-giyim", fallbackFa: "پوشاکِ پایین‌تنه" },
  { slug: "dis-giyim", fallbackFa: "پوشاکِ رویی" },
  { slug: "elbise", fallbackFa: "لباس" },
  { slug: "cantacuzdan", fallbackFa: "کیف و کیفِ پول" },
  { slug: "aksesuar", fallbackFa: "اکسسوری" },
];

// کلیدهای CATEGORY_LABELS_FA را از بلندترین به کوتاه‌ترین مرتب می‌کنیم تا مثلاً «Kot Pantolon»
// قبل از «Pantolon» چک شود (مطابقتِ خاص‌تر اولویت دارد).
const SORTED_KEYS = Object.keys(CATEGORY_LABELS_FA).sort((a, b) => b.length - a.length);
function detectCategoryTr(nameTr, fallback) {
  const lc = trLower(nameTr);
  for (const key of SORTED_KEYS) {
    if (lc.includes(trLower(key))) return key;
  }
  return fallback;
}

async function fetchText(url, retries = 2) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
      if (!res.ok) throw new Error(`http ${res.status}`);
      return await res.text();
    } catch (e) {
      if (attempt >= retries) throw e;
      await sleep(300 * (attempt + 1)); // اتصالِ اولِ سرد گاهی شکست می‌خورد؛ چند تلاشِ کوتاه کافی است.
    }
  }
}

/** لینک‌های محصولِ یک بخش را از HTMLِ خامِ صفحهٔ لیستینگ استخراج می‌کند (بدونِ نیاز به AJAX/جاوااسکریپت). */
function extractListingLinks(html) {
  const re = /class="detailLink detailUrl" data-id="(\d+)" title="([^"]*)" href='([^']*)'/g;
  const out = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(html))) {
    const id = Number(m[1]);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ productId: id, titleTr: decodeHtmlEntities(m[2]), href: m[3] });
  }
  return out;
}

function decodeHtmlEntities(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** استخراجِ بلوکِ JSONِ بعد از یک مارکرِ متنی با شمارشِ متعادلِ آکولاد — همان تکنیکِ sync-trendyol.mjs. */
function extractJsonAfter(html, marker) {
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

/** جزئیاتِ یک محصول: هم JSON-LDِ استاندارد (عکس/قیمت/برند) و هم productDetailModel (سایز/موجودی). */
async function fetchDetail(href) {
  const url = href.startsWith("http") ? href : `${BASE}${href}`;
  const html = await fetchText(url);

  const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let ld = null;
  try {
    ld = ldMatch ? JSON.parse(ldMatch[1]) : null;
  } catch {
    ld = null;
  }
  if (!ld || ld["@type"] !== "Product") return { error: "no-ld-json" };

  const model = extractJsonAfter(html, "var productDetailModel = ");
  const sizeVariants = Array.isArray(model?.productVariantData)
    ? model.productVariantData.filter((v) => v.ekSecenekTipiTanim === "Beden" && v.tanim)
    : [];

  const priceTL = ld.offers?.price != null ? Number(ld.offers.price) : null;
  const inStockDefault = ld.offers?.availability ? /InStock/i.test(ld.offers.availability) : true;

  const variants = sizeVariants.length
    ? sizeVariants.map((v) => ({ size: v.tanim, inStock: !!v.aktif, priceTL, freeCargo: false }))
    : [{ size: "استاندارد", inStock: inStockDefault, priceTL, freeCargo: false }];

  return {
    productId: model?.productId ?? null,
    nameTr: ld.name || "",
    image: Array.isArray(ld.image) ? ld.image[0] || null : ld.image || null,
    images: Array.isArray(ld.image) ? ld.image.slice(0, 6) : ld.image ? [ld.image] : [],
    sourceUrl: url,
    variants,
    minPriceTL: priceTL,
  };
}

async function upsertProduct(cand, detail, sectionFallbackFa, now) {
  const categoryTr = detectCategoryTr(detail.nameTr, sectionFallbackFa);
  const isKnownCategory = Object.prototype.hasOwnProperty.call(CATEGORY_LABELS_FA, categoryTr);
  const categoryFa = isKnownCategory ? categoryLabelFa(categoryTr) : categoryTr; // fallback خودش از قبل فارسی است
  const searchText = trLower([detail.nameTr, "Ambar"].filter(Boolean).join(" "));

  const data = {
    sourceUrl: detail.sourceUrl,
    brand: "Ambar",
    category: categoryTr,
    categoryFa,
    nameTr: detail.nameTr,
    nameFa: null,
    descriptionFa: null,
    image: detail.image,
    images: JSON.stringify(detail.images || []),
    attributes: JSON.stringify([]), // این سایت جدولِ ویژگیِ ساخت‌یافته نمی‌دهد — چیزِ نامطمئن جعل نمی‌کنیم.
    searchText,
    minPriceTL: detail.minPriceTL,
    ratingScore: null,
    favoriteCount: null,
    onSale: false, // منبعِ قابل‌اعتمادی برای قیمتِ قبلی روی این سایت پیدا نشد — تخفیفِ ساختگی نشان نده.
    originalPriceTL: null,
    discountPct: null,
    promoLabel: null,
    featuredBrand: "ambar",
    isActive: true,
    lastSyncedAt: now,
  };

  const product = await prisma.mirrorProduct.upsert({
    where: { sourceSite_sourceId: { sourceSite: "ambar", sourceId: cand.productId } },
    create: { sourceSite: "ambar", sourceId: cand.productId, ...data },
    update: data,
  });

  await prisma.$transaction([
    prisma.mirrorVariant.deleteMany({ where: { productId: product.id } }),
    prisma.mirrorVariant.createMany({
      data: (detail.variants || []).map((v) => ({
        productId: product.id,
        size: v.size,
        inStock: v.inStock,
        priceTL: v.priceTL,
        freeCargo: v.freeCargo,
      })),
    }),
  ]);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`سینکِ کاتالوگِ آمبار — ${SECTIONS.length} بخش، سقفِ هر بخش ${LIMIT_PER_CATEGORY}`);

  // ── مرحلهٔ ۱: لیستینگ (fetchِ سادهٔ HTML، بدونِ نیاز به مرورگر) ──
  const seen = new Map(); // productId → { productId, href, sectionFallbackFa }
  for (const section of SECTIONS) {
    try {
      const html = await fetchText(`${BASE}/${section.slug}`);
      const links = extractListingLinks(html).slice(0, LIMIT_PER_CATEGORY);
      let added = 0;
      for (const l of links) {
        if (!seen.has(l.productId)) {
          seen.set(l.productId, { productId: l.productId, href: l.href, sectionFallbackFa: section.fallbackFa });
          added++;
        }
      }
      console.log(`  لیستینگ ${section.slug}: ${links.length} محصول (${added} جدید)`);
    } catch (e) {
      console.log(`  لیستینگ ${section.slug}: خطا — ${String(e).slice(0, 80)}`);
    }
    await sleep(150);
  }
  const candidates = [...seen.values()];
  console.log(`مجموعِ کاندیدهای یکتا: ${candidates.length}`);

  // ── مرحلهٔ ۲: جزئیات (همزمانیِ محدود + تأخیرِ محترمانه بینِ درخواست‌ها) ──
  const now = new Date();
  let idx = 0,
    ok = 0,
    failed = 0;
  await Promise.all(
    Array.from({ length: DETAIL_CONCURRENCY }, async () => {
      while (idx < candidates.length) {
        const c = candidates[idx++];
        await sleep(120 + Math.random() * 200);
        try {
          const detail = await fetchDetail(c.href);
          if (detail.error || !detail.productId) {
            failed++;
            continue;
          }
          await upsertProduct(c, detail, c.sectionFallbackFa, now);
          ok++;
          if (ok % 50 === 0) console.log(`  پیشرفت: ${ok}/${candidates.length}`);
        } catch (e) {
          failed++;
          console.log(`  خطا در ${c.href}: ${String(e).slice(0, 80)}`);
        }
      }
    })
  );

  // محصولاتِ آمبارِ این بار دیده‌نشده → غیرفعال. حتماً scope‌شده به sourceSite:"ambar" — وگرنه
  // محصولاتِ ترندیول (که این اسکریپت دست نمی‌زند) هم اشتباهی غیرفعال می‌شوند.
  const stale = await prisma.mirrorProduct.updateMany({
    where: { sourceSite: "ambar", isActive: true, lastSyncedAt: { lt: now } },
    data: { isActive: false },
  });

  console.log(`\n✓ تمام شد. موفق: ${ok}، ناموفق: ${failed}، غیرفعال‌شده (دیگر دیده نشد): ${stale.count}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
