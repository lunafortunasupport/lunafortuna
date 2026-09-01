import type { MetadataRoute } from "next";

const SITE_URL = "https://lunafortuna.store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // مسیرهای خصوصی/کاربردی که نباید ایندکس شوند.
      disallow: ["/admin", "/api/", "/account", "/login", "/catalog/cart", "/catalog/wishlist"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
