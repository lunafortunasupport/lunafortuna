// لایهٔ دادهٔ کاتالوگِ آینه‌ایِ ترندیول — جایگزینِ trendyolDemo.ts. دادهٔ واقعی توسط
// scripts/sync-trendyol.mjs (زمان‌بندی‌شده، هر ۱۲ ساعت) در MirrorProduct/MirrorVariant پر می‌شود؛
// این فایل فقط کوئری می‌زند، سینک نمی‌کند.
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/util";
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
  if (filters.category) where.category = filters.category;
  if (filters.brand) where.brand = filters.brand;
  if (filters.size) where.variants = { some: { size: filters.size, inStock: true } };
  if (filters.q) where.searchText = { contains: trLower(filters.q) };
  if (filters.price) {
    const [minToman, maxToman] = PRICE_BUCKETS_TOMAN[filters.price];
    const minTL = minToman / perLirToman;
    const priceFilter: Record<string, number> = { gte: minTL };
    if (maxToman != null) priceFilter.lte = maxToman / perLirToman;
    where.minPriceTL = priceFilter;
  }

  let orderBy: Record<string, "asc" | "desc">[] = [{ favoriteCount: "desc" }, { ratingScore: "desc" }];
  if (filters.sort === "price_asc") orderBy = [{ minPriceTL: "asc" }];
  else if (filters.sort === "price_desc") orderBy = [{ minPriceTL: "desc" }];
  else if (filters.sort === "new") orderBy = [{ lastSyncedAt: "desc" }];

  const page = Math.max(1, filters.page || 1);
  const [items, total] = await Promise.all([
    prisma.mirrorProduct.findMany({
      where,
      orderBy,
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

/** فیلترهای قابل‌انتخاب، مشتق از محصولاتِ فعالِ فعلی (نه یک لیستِ ثابت). */
export async function getFacets(): Promise<CatalogFacets> {
  const [categoryRows, brandRows, sizeRows] = await Promise.all([
    prisma.mirrorProduct.groupBy({ by: ["category", "categoryFa"], where: { isActive: true }, _count: { _all: true } }),
    prisma.mirrorProduct.groupBy({ by: ["brand"], where: { isActive: true }, _count: { _all: true } }),
    prisma.mirrorVariant.findMany({
      where: { inStock: true, product: { isActive: true } },
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
  cargoFeeEstimateTL: number
): PriceBreakdown {
  if (!variant || variant.priceTL == null) {
    return { itemToman: null, cargoToman: 0, totalToman: null, freeCargo: true };
  }
  const itemToman = Math.round(variant.priceTL * perLirToman);
  const cargoToman = variant.freeCargo ? 0 : Math.round(cargoFeeEstimateTL * perLirToman);
  return { itemToman, cargoToman, totalToman: itemToman + cargoToman, freeCargo: variant.freeCargo };
}

export function parseImages(images: string): string[] {
  return parseJson<string[]>(images, []);
}
export function parseAttributes(attributes: string): { labelFa: string; valueFa: string }[] {
  return parseJson(attributes, []);
}
