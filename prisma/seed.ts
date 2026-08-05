import { PrismaClient } from "@prisma/client";
// @ts-ignore — ماژول دادهٔ بدون تایپ
import { BRANDS, BRAND_NAMES, BRAND_DOMAINS } from "../src/lib/brandData";

const prisma = new PrismaClient();

const NAMES = BRAND_NAMES as Record<string, string>;
const DOMAINS = BRAND_DOMAINS as Record<string, string>;

const FEATURED = new Set([
  "zara", "mango", "hm", "mavi", "adidas", "koton", "lcwaikiki",
  "defacto", "lefties", "sephora", "karaca", "trendyol", "puma", "bershka",
]);

function favicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

/** استخراج siteUrl و categoryLinks از آبجکت خام برند */
function normalizeBrand(group: string, b: any) {
  const id: string = b.id;
  const name: string = NAMES[id] || b.name || id;
  const domain: string = b.domain || DOMAINS[id] || "";

  // categoryLinks = همهٔ فیلدها به‌جز متادیتا
  const { id: _i, name: _n, url: _u, domain: _d, ...links } = b;

  // یافتن اولین URL برای siteUrl
  let siteUrl: string = b.url || "";
  if (!siteUrl) {
    const firstUrl = findFirstUrl(links);
    siteUrl = firstUrl || (domain ? `https://www.${domain}` : "");
  }

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

  // برندهای Inditex: آدرس دسته‌هایشان ناپایدار است و به صفحهٔ اصلی ریدایرکت می‌شود؛
  // فقط دکمهٔ «ورود به سایت» با صفحهٔ اصلی تمیز نمایش داده می‌شود.
  const INDITEX_HOME: Record<string, string> = {
    zara: "https://www.zara.com/tr/",
    bershka: "https://www.bershka.com/tr/",
    pullandbear: "https://www.pullandbear.com/tr/",
    stradivarius: "https://www.stradivarius.com/tr/",
    massimodutti: "https://www.massimodutti.com/tr/",
    oysho: "https://www.oysho.com/tr/",
    lefties: "https://www.lefties.com/tr/en/",
  };

  // ── برندها ──
  let count = 0;
  let order = 0;
  for (const [group, list] of Object.entries(BRANDS)) {
    for (const b of list as any[]) {
      const data = normalizeBrand(group, b);
      if (INDITEX_HOME[data.slug]) {
        data.siteUrl = INDITEX_HOME[data.slug];
        data.categoryLinks = "{}";
      }
      await prisma.brand.upsert({
        where: { slug: data.slug },
        update: { ...data, sortOrder: order },
        create: { ...data, sortOrder: order },
      });
      count++;
      order++;
    }
  }
  console.log(`✓ ${count} برند`);

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
