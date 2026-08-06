import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
// @ts-ignore — ماژول دادهٔ بدون تایپ
import { BRANDS, BRAND_NAMES, BRAND_DOMAINS } from "../src/lib/brandData";

const prisma = new PrismaClient();

const NAMES = BRAND_NAMES as Record<string, string>;
const DOMAINS = BRAND_DOMAINS as Record<string, string>;

// نتیجهٔ حسابرسی لینک‌ها (اجرای scripts/audit-brand-links.mjs --emit).
// deadUrls = لینک‌های قطعاً مرده (۴۰۴/۴۱۰/ریدایرکت به صفحهٔ اصلی) که حذف می‌شوند؛
// homepage = صفحهٔ اصلیِ تأییدشدهٔ هر برند برای دکمهٔ «ورود به سایت».
// اگر فایل نبود، seed بدون هرس اجرا می‌شود (رفتار قدیمی).
let DEAD_URLS = new Set<string>();
let HOMEPAGE: Record<string, string> = {};
try {
  const audit = JSON.parse(readFileSync(join(__dirname, "..", "scripts", "link-audit.json"), "utf8"));
  DEAD_URLS = new Set<string>(audit.deadUrls || []);
  HOMEPAGE = audit.homepage || {};
  console.log(`✓ حسابرسی لینک بارگذاری شد: ${DEAD_URLS.size} لینک مرده حذف می‌شود`);
} catch {
  console.warn("⚠ scripts/link-audit.json یافت نشد — هرس لینک انجام نمی‌شود.");
}

/** لینک‌های مرده را از ساختار تودرتوی categoryLinks حذف می‌کند. */
function pruneDeadLinks(links: any): any {
  const out: any = {};
  for (const [k, v] of Object.entries(links)) {
    if (typeof v === "string") {
      if (!v.startsWith("http") || !DEAD_URLS.has(v)) out[k] = v;
    } else if (v && typeof v === "object") {
      const cleaned = pruneDeadLinks(v);
      if (Object.keys(cleaned).length > 0) out[k] = cleaned; // گروه‌های خالی حذف شوند
    } else {
      out[k] = v;
    }
  }
  return out;
}

const FEATURED = new Set([
  "zara", "mango", "hm", "mavi", "adidas", "koton", "lcwaikiki",
  "defacto", "lefties", "sephora", "karaca", "trendyol", "puma", "bershka",
]);

// صفحهٔ حراج/indirim برندهای برتر — با scripts/verify-sale-urls.mjs (مرورگر واقعی) تأیید شده‌اند.
// فقط مقدار اولیهٔ create/فعال‌سازیِ نخست است؛ بعد از آن ادمین/ربات کنترل می‌کنند.
const SALE_URLS: Record<string, string> = {
  hm: "https://www2.hm.com/tr_tr/sale.html",
  adidas: "https://www.adidas.com.tr/indirim",
  boyner: "https://www.boyner.com.tr/indirim",
  flo: "https://www.flo.com.tr/indirim",
  ipekyol: "https://www.ipekyol.com.tr/indirim-70",
  karaca: "https://www.karaca.com/indirimli-urunler",
  englishhome: "https://www.englishhome.com/c-indirim",
  superstep: "https://www.superstep.com.tr/indirim/",
};

function favicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

/** استخراج siteUrl و categoryLinks از آبجکت خام برند */
function normalizeBrand(group: string, b: any) {
  const id: string = b.id;
  const name: string = NAMES[id] || b.name || id;
  const domain: string = b.domain || DOMAINS[id] || "";

  // categoryLinks = همهٔ فیلدها به‌جز متادیتا، پس از حذف لینک‌های مرده
  const { id: _i, name: _n, url: _u, domain: _d, ...rawLinks } = b;
  const links = pruneDeadLinks(rawLinks);

  // siteUrl = صفحهٔ اصلیِ تأییدشدهٔ حسابرسی (ترجیح اول)، سپس b.url،
  // سپس اولین لینکِ سالمِ باقی‌مانده، در نهایت www.domain.
  let siteUrl: string =
    HOMEPAGE[id] || b.url || findFirstUrl(links) || (domain ? `https://www.${domain}/` : "");

  return {
    name,
    slug: id,
    domain,
    siteUrl,
    group,
    logoUrl: domain ? favicon(domain) : null,
    categoryLinks: JSON.stringify(links),
    tags: JSON.stringify([group]),
    isFeatured: FEATURED.has(id),
    isActive: true,
    saleUrl: SALE_URLS[id] || null,
    saleActive: !!SALE_URLS[id],
    saleLabel: SALE_URLS[id] ? "حراج ویژه" : null,
  };
}

function findFirstUrl(obj: any): string | null {
  for (const v of Object.values(obj)) {
    if (typeof v === "string" && v.startsWith("http")) return v;
    if (v && typeof v === "object") {
      const nested = findFirstUrl(v);
      if (nested) return nested;
    }
  }
  return null;
}

const WAREHOUSE_CATEGORIES = [
  { name: "پوشاک زنانه", slug: "women-clothing", icon: "👗" },
  { name: "پوشاک مردانه", slug: "men-clothing", icon: "👔" },
  { name: "کفش", slug: "shoes", icon: "👟" },
  { name: "کیف و اکسسوری", slug: "bags-accessories", icon: "👜" },
  { name: "آرایشی و بهداشتی", slug: "beauty", icon: "💄" },
  { name: "خانه و آشپزخانه", slug: "home-kitchen", icon: "🏠" },
  { name: "کودک و نوزاد", slug: "kids", icon: "👶" },
];

async function main() {
  console.log("🌙 Seeding LunaFortuna...");

  // ── تنظیمات ──
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      exchangeRate: Number(process.env.DEFAULT_EXCHANGE_RATE) || 4800,
      cardNumber: "5894-6311-5805-9998",
      cardOwner: "عسل ملکی‌راد",
      cardBank: "بانک رفاه",
      telegramBot: "LunaFortunaSupport_bot",
      telegramSupport: "LunaFortunaSupport",
      instagram: "lunafortuna.shop",
      phone: "00905318662989",
      aboutContent: JSON.stringify({
        intro:
          "لونافورتونا یک سرویس خرید واسطه‌ای است که مردم ایران را به محصولاتی وصل می‌کند که به دلیل تحریم یا نبودِ برند در ایران دسترسی به آن‌ها را ندارند.",
        team: [],
      }),
    },
  });
  console.log("✓ تنظیمات");

  // ── کتگوری‌های موجودی ──
  for (let i = 0; i < WAREHOUSE_CATEGORIES.length; i++) {
    const c = WAREHOUSE_CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug_scope: { slug: c.slug, scope: "warehouse" } },
      update: { name: c.name, icon: c.icon, sortOrder: i },
      create: { name: c.name, slug: c.slug, scope: "warehouse", icon: c.icon, sortOrder: i },
    });
  }
  console.log(`✓ ${WAREHOUSE_CATEGORIES.length} کتگوری موجودی`);

  // ── برندها ──
  // مهم: ویرایش‌های ادمین (نام، لوگو، لینک‌ها، siteUrl) نباید با هر deploy پاک شوند.
  //  - برند جدید (create): با دادهٔ کامل و هرس‌شدهٔ حسابرسی ساخته می‌شود.
  //  - برند موجود (update): فقط لینک‌های مرده از دادهٔ *فعلیِ دیتابیس* هرس می‌شوند
  //    و siteUrl صرفاً وقتی خالی یا مرده است اصلاح می‌شود؛ بقیهٔ فیلدها دست‌نخورده می‌مانند.
  let count = 0;
  let order = 0;
  for (const [group, list] of Object.entries(BRANDS)) {
    for (const b of list as any[]) {
      const data = normalizeBrand(group, b);
      const existing = await prisma.brand.findUnique({ where: { slug: data.slug } });
      if (!existing) {
        await prisma.brand.create({ data: { ...data, sortOrder: order } });
      } else {
        // هرس لینک‌های مرده از مقدار فعلیِ دیتابیس (نه از brandData) تا ویرایش ادمین حفظ شود
        const currentLinks = (() => {
          try {
            return JSON.parse(existing.categoryLinks || "{}");
          } catch {
            return {};
          }
        })();
        const prunedLinks = JSON.stringify(pruneDeadLinks(currentLinks));
        // siteUrl را فقط اگر خالی یا خودش مرده است اصلاح کن
        const siteUrlDead = !existing.siteUrl || DEAD_URLS.has(existing.siteUrl);
        await prisma.brand.update({
          where: { id: existing.id },
          data: {
            categoryLinks: prunedLinks,
            ...(siteUrlDead && data.siteUrl ? { siteUrl: data.siteUrl } : {}),
            // saleUrl را فقط اگر هنوز ست نشده مقداردهی و فعال کن (بعد از آن ادمین/ربات کنترل می‌کنند)
            ...(!existing.saleUrl && data.saleUrl
              ? { saleUrl: data.saleUrl, saleActive: true, saleLabel: "حراج ویژه" }
              : {}),
          },
        });
      }
      count++;
      order++;
    }
  }
  console.log(`✓ ${count} برند (ویرایش‌های ادمین حفظ شد؛ فقط لینک‌های مرده هرس شدند)`);

  // ── چند محصول نمونهٔ موجودی ──
  const women = await prisma.category.findFirst({ where: { slug: "women-clothing", scope: "warehouse" } });
  const shoes = await prisma.category.findFirst({ where: { slug: "shoes", scope: "warehouse" } });
  const home = await prisma.category.findFirst({ where: { slug: "home-kitchen", scope: "warehouse" } });

  const sampleProducts = [
    {
      title: "مانتو کتان زنانه Koton",
      description: "مانتو کتان سبک مینیمال، رنگ کرم. موجود در انبار تهران، ارسال فوری.",
      categoryId: women?.id,
      brandName: "Koton",
      images: JSON.stringify(["https://picsum.photos/seed/luna-coat/600/800"]),
      sizes: JSON.stringify(["S", "M", "L"]),
      priceToman: 2650000,
      stock: 4,
      isFeatured: true,
    },
    {
      title: "کتونی زنانه Mavi",
      description: "کتونی سفید راحتی، مناسب استفادهٔ روزمره. آمادهٔ تحویل.",
      categoryId: shoes?.id,
      brandName: "Mavi",
      images: JSON.stringify(["https://picsum.photos/seed/luna-sneaker/600/800"]),
      sizes: JSON.stringify(["۳۷", "۳۸", "۳۹", "۴۰"]),
      priceToman: 3120000,
      stock: 6,
      isFeatured: true,
    },
    {
      title: "ست ۶ تکه فنجان Karaca",
      description: "ست فنجان و نعلبکی طرح طلایی برند Karaca. موجود در انبار تهران.",
      categoryId: home?.id,
      brandName: "Karaca",
      images: JSON.stringify(["https://picsum.photos/seed/luna-mug/600/800"]),
      sizes: JSON.stringify([]),
      priceToman: 1850000,
      stock: 3,
      isFeatured: true,
    },
  ];

  // برای جلوگیری از تکرار، اگر محصولی نبود اضافه کن
  const existing = await prisma.product.count();
  if (existing === 0) {
    for (const p of sampleProducts) {
      await prisma.product.create({ data: p });
    }
    console.log(`✓ ${sampleProducts.length} محصول نمونه`);
  } else {
    console.log("• محصولات از قبل وجود دارند — رد شد");
  }

  // ── بنرهای پیش‌فرض (idempotent) ──
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.createMany({
      data: [
        { title: "برندهای معتبر ترکیه", subtitle: "از Zara و Mango تا Mavi و Koton — همه یکجا", ctaText: "مشاهدهٔ برندها", link: "/brands", placement: "promo", theme: "navy", sortOrder: 0 },
        { title: "موجودی انبار تهران", subtitle: "کالاهای آمادهٔ ارسال فوری، بدون انتظار", ctaText: "دیدن موجودی", link: "/shop", placement: "promo", theme: "gold", sortOrder: 1 },
        { title: "دوستت را دعوت کن", subtitle: "با کد معرف، هم تو هم دوستت تخفیف می‌گیرید", ctaText: "حساب من", link: "/account", placement: "promo", theme: "cream", sortOrder: 2 },
      ],
    });
    console.log("✓ ۳ بنر پیش‌فرض");
  } else {
    console.log("• بنرها از قبل وجود دارند — رد شد");
  }

  console.log("✅ Seed کامل شد.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
