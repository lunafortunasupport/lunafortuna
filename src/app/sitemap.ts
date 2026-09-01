import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getFeaturedBrandStats, getCollectionStats } from "@/lib/trendyolCatalog";

const SITE_URL = "https://lunafortuna.store";
const HIDDEN_CATEGORY_PREFIX = "Tesettür"; // محصولاتِ پوشیدهٔ حجاب از کاتالوگ حذف‌اند → از sitemap هم بیرون.

export const revalidate = 86400; // روزی یک‌بار بازتولید

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/catalog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/catalog/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/catalog/sale`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/catalog/lookbook`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/order`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/quality`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const [brands, products, featured, collections] = await Promise.all([
      prisma.brand.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.mirrorProduct.findMany({
        where: { isActive: true, NOT: { category: { startsWith: HIDDEN_CATEGORY_PREFIX } } },
        select: { id: true, updatedAt: true },
      }),
      getFeaturedBrandStats(),
      getCollectionStats(),
    ]);

    const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${SITE_URL}/brands/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_URL}/catalog/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const featuredRoutes: MetadataRoute.Sitemap = featured
      .filter((f) => f.count > 0)
      .map((f) => ({
        url: `${SITE_URL}/catalog?fbrand=${f.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
      }));

    const collectionRoutes: MetadataRoute.Sitemap = collections
      .filter((c) => c.count > 0)
      .map((c) => ({
        url: `${SITE_URL}/catalog?collection=${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      }));

    return [...staticRoutes, ...featuredRoutes, ...collectionRoutes, ...brandRoutes, ...productRoutes];
  } catch {
    // اگر دیتابیس در دسترس نبود، دستِ‌کم مسیرهای ثابت را بده.
    return staticRoutes;
  }
}
