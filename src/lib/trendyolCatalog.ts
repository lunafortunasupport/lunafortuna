// لایهٔ دادهٔ کاتالوگِ آینه‌ایِ ترندیول — جایگزینِ trendyolDemo.ts. دادهٔ واقعی توسط
// scripts/sync-trendyol.mjs (زمان‌بندی‌شده، هر ۱۲ ساعت) در MirrorProduct/MirrorVariant پر می‌شود؛
// این فایل فقط کوئری می‌زند، سینک نمی‌کند.
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/util";
import { cargoFeeTL } from "@/lib/cargo";
import type { MirrorProduct, MirrorVariant } from "@prisma/client";

export const PAGE_SIZE = 24;

export type SortOption = "popular" | "price_asc" | "price_desc" | "new";
export type PriceBucket = "under1" | "1to3" | "3to6" | "over6";

export interface CatalogFilters {
  q?: string;
  category?: string;
  brand?: string;
  size?: string;
  price?: PriceBucket;
  sort?: SortOption;
  page?: number;
  featuredBrand?: string;
  onSale?: boolean;
  source?: string; // ستونِ اصلی: trendyol | trendyol-milla | ambar
  categoryIn?: string[]; // برای کالکشن‌ها: هر کدام از این دسته‌های فارسی (categoryFa)
  categoryContains?: string; // برای کالکشن‌ها: دسته‌ای که این رشته را در نامش دارد (مثلِ «مردانه»)
}

// سه ستونِ اصلیِ کاتالوگ (بر اساسِ sourceSite). ترندیول = ملتی‌برند (همهٔ برندها).
export interface Pillar {
  slug: string; // = sourceSite
  nameFa: string;
  nameEn: string;
  blurbFa: string;
}
export const PILLARS: Pillar[] = [
  { slug: "trendyol", nameFa: "ترندیول", nameEn: "Trendyol", blurbFa: "ملتی‌برندِ بزرگِ ترکیه — پرفروش‌ترین‌ها و تخفیف‌دارها از ده‌ها برند." },
  { slug: "trendyol-milla", nameFa: "ترندیول‌میلا", nameEn: "TRENDYOLMİLLA", blurbFa: "برندِ اختصاصیِ زنانهٔ ترندیول — پوشاکِ روزمره تا مجلسی." },
  { slug: "ambar", nameFa: "آمبار", nameEn: "Ambar", blurbFa: "برندِ ترکِ پوشاکِ زنانه (Ambar Giyim) — از سایتِ رسمیِ خودشان." },
];
export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

// ── کالکشن‌های دست‌چین ──
// روی دسته‌بندیِ واقعیِ محصولات (categoryFa) تعریف می‌شوند، نه فرضی. هر کالکشن یا یک لیستِ ثابت از
// دسته‌ها (categoryIn) دارد یا یک زیررشتهٔ مشترک (categoryContains — مثلِ «مردانه» که چند دستهٔ
// «پیراهنِ مردانه»/«تی‌شرتِ مردانه»/… را یک‌جا می‌گیرد).
export interface Collection {
  slug: string;
  nameFa: string;
  emoji: string;
  blurbFa: string;
  filter: { categoryIn?: string[]; categoryContains?: string; onSale?: boolean };
}
export const COLLECTIONS: Collection[] = [
  {
    slug: "modest",
    nameFa: "پوشیدهٔ شیک",
    emoji: "🧕",
    blurbFa: "لباس و دامنِ پوشیده — انتخابِ شیک برای سبکِ باحجاب.",
    filter: { categoryIn: ["لباسِ پوشیده (حجاب)", "دامنِ پوشیده (حجاب)"] },
  },
  {
    slug: "evening",
    nameFa: "استایلِ مجلسی",
    emoji: "✨",
    blurbFa: "برای مهمانی و مناسبت‌های خاص.",
    filter: { categoryIn: ["لباسِ مجلسی/فارغ‌التحصیلی", "بوستیه"] },
  },
  {
    slug: "basics",
    nameFa: "بیسیکِ روزمره",
    emoji: "👕",
    blurbFa: "بلوز، تی‌شرت و شلوارِ همیشه‌کاربردی.",
    filter: { categoryIn: ["بلوز", "تی‌شرت", "شلوار", "شلوار جین"] },
  },
  {
    slug: "men",
    nameFa: "دنیای مردانه",
    emoji: "🧔",
    blurbFa: "پیراهن، تی‌شرت، شلوار و کاپشنِ مردانه.",
    filter: { categoryContains: "مردانه" },
  },
  {
    slug: "kids",
    nameFa: "دنیای بچگانه",
    emoji: "🧸",
    blurbFa: "پوشاکِ بچگانه و نوزادی.",
    filter: { categoryContains: "بچگانه" },
  },
  {
    slug: "home",
    nameFa: "خانه و آشپزخانه",
    emoji: "🏠",
    blurbFa: "روتختی، حوله، دکوراسیون و لوازمِ آشپزخانه.",
    filter: { categoryIn: ["روتختی", "حوله", "دکوراسیونِ خانه", "آشپزخانه"] },
  },
  {
    slug: "sale",
    nameFa: "حراجِ ویژه",
    emoji: "🏷️",
    blurbFa: "همین حالا تخفیف خورده‌اند.",
    filter: { onSale: true },
  },
];
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export interface CollectionStat extends Collection {
  count: number;
  sampleImages: string[];
}

/** آمارِ کالکشن‌ها — فقط آن‌هایی که همین حالا محصول دارند نشان داده می‌شوند. */
export async function getCollectionStats(): Promise<CollectionStat[]> {
  const stats = await Promise.all(
    COLLECTIONS.map(async (c) => {
      const where: Record<string, unknown> = { isActive: true };
      if (c.filter.categoryIn) where.categoryFa = { in: c.filter.categoryIn };
      else if (c.filter.categoryContains) where.categoryFa = { contains: c.filter.categoryContains };
      if (c.filter.onSale) where.onSale = true;
      const [count, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where }),
        prisma.mirrorProduct.findMany({
          where: { ...where, image: { not: null } },
          orderBy: [{ favoriteCount: { sort: "desc", nulls: "last" } }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...c, count, sampleImages: samples.map((s) => s.image!).filter(Boolean) };
    })
  );
  return stats;
}

export interface FeaturedBrand {
  slug: string;
  nameFa: string;
  nameEn: string;
  blurbFa: string;
}

// منبعِ واحدِ برندهای منتخب — ترتیب همان ترتیبِ نمایش در صفحهٔ برندها.
export const FEATURED_BRANDS: FeaturedBrand[] = [
  { slug: "trendyol-milla", nameFa: "ترندیول‌میلا", nameEn: "TRENDYOLMİLLA", blurbFa: "برندِ اختصاصیِ زنانهٔ ترندیول — پوشاکِ روزمره تا مجلسی." },
  { slug: "happiness", nameFa: "هپینس استانبول", nameEn: "Happiness İstanbul", blurbFa: "استریت‌ویرِ محبوبِ استانبول — راحت، اسپرت، جوان‌پسند." },
  { slug: "trendyol-kids", nameFa: "ترندیول کیدز", nameEn: "TRENDYOLKIDS", blurbFa: "پوشاکِ بچگانهٔ برندِ خودِ ترندیول." },
  { slug: "trendyol-shoes", nameFa: "ترندیول شوز", nameEn: "TRENDYOL SHOES", blurbFa: "کفشِ زنانهٔ برندِ خودِ ترندیول." },
  { slug: "ambar", nameFa: "آمبار", nameEn: "Ambar", blurbFa: "برندِ ترکِ پوشاکِ زنانه (Ambar Giyim) — از سایتِ رسمیِ خودشان." },
];

export function getFeaturedBrand(slug: string): FeaturedBrand | undefined {
  return FEATURED_BRANDS.find((b) => b.slug === slug);
}

export interface MirrorProductWithVariants extends MirrorProduct {
  variants: MirrorVariant[];
}

/** lowercase امنِ ترکی — باید دقیقاً هم‌الگوی trLower در scripts/trendyol-fa-dict.mjs بماند. */
function trLower(s: string): string {
  return String(s || "")
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR");
}

const PRICE_BUCKETS_TOMAN: Record<PriceBucket, [number, number | null]> = {
  under1: [0, 1_000_000],
  "1to3": [1_000_000, 3_000_000],
  "3to6": [3_000_000, 6_000_000],
  over6: [6_000_000, null],
};

export async function queryMirrorProducts(filters: CatalogFilters, perLirToman: number) {
  const where: Record<string, unknown> = { isActive: true };
  if (filters.source) where.sourceSite = filters.source;
  if (filters.category) where.category = filters.category;
  if (filters.brand) where.brand = filters.brand;
  if (filters.featuredBrand) where.featuredBrand = filters.featuredBrand;
  if (filters.onSale) where.onSale = true;
  if (filters.categoryIn) where.categoryFa = { in: filters.categoryIn };
  else if (filters.categoryContains) where.categoryFa = { contains: filters.categoryContains };
  if (filters.size) where.variants = { some: { size: filters.size, inStock: true } };
  // جستجو: هم متنِ ترکیِ ذخیره‌شده (نام + برند) و هم دستهٔ فارسی (categoryFa) — تا سرچِ فارسیِ
  // نوعِ محصول («کیف»، «لباس»، «شلوار») هم نتیجه بدهد، نه فقط کلیدواژهٔ ترکی/برندِ لاتین.
  if (filters.q) {
    const ql = trLower(filters.q);
    where.OR = [{ searchText: { contains: ql } }, { categoryFa: { contains: filters.q } }];
  }
  if (filters.price) {
    const [minToman, maxToman] = PRICE_BUCKETS_TOMAN[filters.price];
    const minTL = minToman / perLirToman;
    const priceFilter: Record<string, number> = { gte: minTL };
    if (maxToman != null) priceFilter.lte = maxToman / perLirToman;
    where.minPriceTL = priceFilter;
  }

  // nulls:last → محصولاتِ بدونِ امتیاز/پسند آخر می‌آیند (وگرنه Postgres آن‌ها را «اول» می‌آورد و
  // پرطرفدارها/ستاره‌دارها ته لیست می‌افتند). روی PostgreSQLِ prod و SQLiteِ dev هر دو پشتیبانی می‌شود.
  let orderBy: unknown[] = [
    { favoriteCount: { sort: "desc", nulls: "last" } },
    { ratingScore: { sort: "desc", nulls: "last" } },
  ];
  if (filters.sort === "price_asc") orderBy = [{ minPriceTL: { sort: "asc", nulls: "last" } }];
  else if (filters.sort === "price_desc") orderBy = [{ minPriceTL: { sort: "desc", nulls: "last" } }];
  else if (filters.sort === "new") orderBy = [{ lastSyncedAt: "desc" }];
  else if (filters.onSale) orderBy = [{ discountPct: { sort: "desc", nulls: "last" } }];

  const page = Math.max(1, filters.page || 1);
  const [items, total] = await Promise.all([
    prisma.mirrorProduct.findMany({
      where,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: orderBy as any,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { variants: true },
    }),
    prisma.mirrorProduct.count({ where }),
  ]);

  return { items: items as MirrorProductWithVariants[], total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getMirrorProduct(id: string): Promise<MirrorProductWithVariants | null> {
  const p = await prisma.mirrorProduct.findUnique({ where: { id }, include: { variants: true } });
  return p as MirrorProductWithVariants | null;
}

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "استاندارد"];
function sizeSortKey(s: string): [number, number, string] {
  const n = Number(s);
  if (!isNaN(n)) return [0, n, s];
  const idx = SIZE_ORDER.indexOf(s);
  return [1, idx === -1 ? SIZE_ORDER.length : idx, s];
}

export interface CatalogFacets {
  categories: { key: string; labelFa: string; count: number }[];
  brands: { key: string; count: number }[];
  sizes: string[];
}

/** فیلترهای قابل‌انتخاب، مشتق از محصولاتِ فعالِ فعلی (نه یک لیستِ ثابت). به منبع (ستون) محدود
 * می‌شود تا مثلاً در ستونِ ترندیول فقط برند/دسته‌های ترندیول نشان داده شوند. */
export async function getFacets(source?: string): Promise<CatalogFacets> {
  const baseWhere = source ? { isActive: true, sourceSite: source } : { isActive: true };
  const [categoryRows, brandRows, sizeRows] = await Promise.all([
    prisma.mirrorProduct.groupBy({ by: ["category", "categoryFa"], where: baseWhere, _count: { _all: true } }),
    prisma.mirrorProduct.groupBy({ by: ["brand"], where: baseWhere, _count: { _all: true } }),
    prisma.mirrorVariant.findMany({
      where: { inStock: true, product: baseWhere },
      select: { size: true },
      distinct: ["size"],
    }),
  ]);

  return {
    categories: categoryRows
      .map((r) => ({ key: r.category, labelFa: r.categoryFa, count: r._count._all }))
      .sort((a, b) => b.count - a.count),
    brands: brandRows
      .map((r) => ({ key: r.brand, count: r._count._all }))
      .sort((a, b) => (a.key === "TRENDYOLMİLLA" ? -1 : b.key === "TRENDYOLMİLLA" ? 1 : b.count - a.count)),
    sizes: sizeRows.map((r) => r.size).sort((a, b) => {
      const [ta, na] = sizeSortKey(a);
      const [tb, nb] = sizeSortKey(b);
      return ta - tb || na - nb;
    }),
  };
}

export interface PriceBreakdown {
  itemToman: number | null;
  cargoToman: number;
  totalToman: number | null;
  freeCargo: boolean;
}

export function priceBreakdown(
  variant: { priceTL: number | null; freeCargo: boolean } | null | undefined,
  perLirToman: number,
  cargoFeeEstimateTL: number,
  sourceSite?: string
): PriceBreakdown {
  if (!variant || variant.priceTL == null) {
    return { itemToman: null, cargoToman: 0, totalToman: null, freeCargo: true };
  }
  const itemToman = Math.round(variant.priceTL * perLirToman);
  const feeTL = cargoFeeTL(sourceSite, variant.priceTL, variant.freeCargo, cargoFeeEstimateTL);
  const cargoToman = Math.round(feeTL * perLirToman);
  return { itemToman, cargoToman, totalToman: itemToman + cargoToman, freeCargo: feeTL === 0 };
}

export function parseImages(images: string): string[] {
  return parseJson<string[]>(images, []);
}
export function parseAttributes(attributes: string): { labelFa: string; valueFa: string }[] {
  return parseJson(attributes, []);
}

export interface SaleView {
  onSale: boolean;
  currentToman: number | null;
  originalToman: number | null;
  discountPct: number | null;
  promoLabel: string | null;
}

/**
 * نمای تخفیف بر اساسِ ارزان‌ترین قیمتِ محصول (minPriceTL) و قیمتِ قبلی (originalPriceTL).
 *
 * نکته: originalPriceTL از سطحِ لیستینگِ جستجو گرفته می‌شود، در حالی‌که minPriceTL از
 * ارزان‌ترینِ سایزهای واقعاً اسکرپ‌شده در صفحهٔ جزئیات می‌آید — این دو گاهی به یک سایز/واریانت
 * اشاره ندارند (مثلاً وقتی چند رنگ‌بندی زیرِ یک لیستینگ ادغام شده‌اند) و می‌تواند «قیمتِ قبلی»یی
 * کمتر از قیمتِ فعلی برگرداند که منطقاً یعنی تخفیف واقعی نیست. برای همین فقط وقتی originalToman
 * واقعاً از currentToman بیشتر باشد onSale=true می‌شود؛ در غیرِ این صورت برچسب پنهان می‌ماند.
 */
export function saleView(p: MirrorProduct, perLirToman: number): SaleView {
  const currentToman = p.minPriceTL != null ? Math.round(p.minPriceTL * perLirToman) : null;
  const rawOriginalToman = p.onSale && p.originalPriceTL != null ? Math.round(p.originalPriceTL * perLirToman) : null;
  const genuineDiscount = rawOriginalToman != null && currentToman != null && rawOriginalToman > currentToman;
  return {
    onSale: genuineDiscount,
    currentToman,
    originalToman: genuineDiscount ? rawOriginalToman : null,
    discountPct: genuineDiscount ? p.discountPct : null,
    promoLabel: genuineDiscount ? p.promoLabel : null,
  };
}

export interface FeaturedBrandStat extends FeaturedBrand {
  count: number;
  sampleImages: string[];
}

/** برای صفحهٔ ایندکسِ برندها: تعدادِ محصولِ فعال + چند عکسِ نمونه per برندِ منتخب. */
export async function getFeaturedBrandStats(): Promise<FeaturedBrandStat[]> {
  const stats = await Promise.all(
    FEATURED_BRANDS.map(async (b) => {
      const [count, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where: { isActive: true, featuredBrand: b.slug } }),
        prisma.mirrorProduct.findMany({
          where: { isActive: true, featuredBrand: b.slug, image: { not: null } },
          orderBy: [{ favoriteCount: "desc" }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...b, count, sampleImages: samples.map((s) => s.image!).filter(Boolean) };
    })
  );
  return stats;
}

export interface PillarStat extends Pillar {
  count: number;
  brandCount: number; // چند برندِ متمایز زیرِ این ستون هست (برای ترندیول یعنی «۱۰۰+ برند»)
  sampleImages: string[];
}

/** آمارِ سه ستونِ اصلی (بر اساسِ sourceSite) — برای صفحهٔ برندها، mega-menu و صفحهٔ اصلی. */
export async function getPillarStats(): Promise<PillarStat[]> {
  const stats = await Promise.all(
    PILLARS.map(async (p) => {
      const where = { isActive: true, sourceSite: p.slug };
      const [count, brands, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where }),
        prisma.mirrorProduct.findMany({ where, select: { brand: true }, distinct: ["brand"] }),
        prisma.mirrorProduct.findMany({
          where: { ...where, image: { not: null } },
          orderBy: [{ favoriteCount: "desc" }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...p, count, brandCount: brands.length, sampleImages: samples.map((s) => s.image!).filter(Boolean) };
    })
  );
  return stats;
}
