import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CustomCursor from "@/components/CustomCursor";
import ChatWidget from "@/components/ChatWidget";
import SmoothScroll from "@/components/SmoothScroll";
import { prisma } from "@/lib/prisma";
import { GROUP_LABELS } from "@/lib/util";
import { getPillarStats, getCollectionStats, getFeaturedBrandStats } from "@/lib/trendyolCatalog";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vazir",
  display: "swap",
});

// فونتِ نمایشیِ فارسیِ اختصاصی (Estedad) — جایگزینِ Playfair که فارسی را رندر نمی‌کرد.
const estedad = localFont({
  src: [
    { path: "../../public/fonts/Estedad-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/Estedad-Bold.woff2", weight: "700" },
    { path: "../../public/fonts/Estedad-Black.woff2", weight: "900" },
  ],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = "https://lunafortuna.store";
const SITE_DESC =
  "واسطهٔ مطمئن خرید از ترکیه برای ایران؛ از پوشاک و کیف و کفش تا لوازم خانه. قیمت شفاف، بررسی کیفیت و سایز پیش از ارسال.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LunaFortuna — خیالت راحت، بقیه‌اش با ما",
    template: "%s | LunaFortuna",
  },
  description: SITE_DESC,
  keywords: ["خرید از ترکیه", "لونافورتونا", "برندهای ترکیه", "خرید واسطه‌ای", "مانگو", "کوتون", "دیفکتو"],
  applicationName: "LunaFortuna",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "LunaFortuna",
    locale: "fa_IR",
    url: SITE_URL,
    title: "LunaFortuna — خیالت راحت، بقیه‌اش با ما",
    description: SITE_DESC,
    images: [{ url: "/images/hero-shopping.jpg", width: 1400, alt: "LunaFortuna — خرید از ترکیه" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LunaFortuna — خیالت راحت، بقیه‌اش با ما",
    description: SITE_DESC,
    images: ["/images/hero-shopping.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// جدا از metadata در Next 14 — رنگِ نوارِ مرورگر روی موبایل و تنظیمِ viewport.
export const viewport: Viewport = {
  themeColor: "#152349", // navy — نوارِ بالای مرورگرِ موبایل و PWA
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cats, groupRows, featuredStats, collectionStats, brandStats] = await Promise.all([
    prisma.category.findMany({
      where: { scope: "warehouse" },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true, icon: true },
    }),
    prisma.brand.groupBy({ by: ["group"], where: { isActive: true }, _count: true }),
    getPillarStats(),
    getCollectionStats(),
    getFeaturedBrandStats(),
  ]);
  const brandGroups = groupRows
    .filter((g) => GROUP_LABELS[g.group])
    .map((g) => ({ key: g.group, label: GROUP_LABELS[g.group], count: g._count }));
  // سه ستونِ کاتالوگِ ترکیه برای mega-menu (فقط آن‌هایی که محصولِ فعال دارند).
  const catalogBrands = featuredStats
    .filter((b) => b.count > 0)
    .map((b) => ({ slug: b.slug, nameFa: b.nameFa, count: b.count }));
  // "sale" از قبل زیرِ «میان‌بُرها» → «تخفیف‌ها» هست، برای عدمِ تکرار در فهرستِ کالکشن‌ها نمی‌آید.
  const catalogCollections = collectionStats
    .filter((c) => c.count > 0 && c.slug !== "sale")
    .map((c) => ({ slug: c.slug, nameFa: c.nameFa, emoji: c.emoji }));
  // برندهای محبوبِ منتخب برای mega-menu (بجز آن‌هایی که خودشان ستونِ اصلی‌اند).
  const PILLAR_FEATURED = new Set(["trendyol-milla", "ambar"]);
  const catalogFeatured = brandStats
    .filter((b) => b.count > 0 && !PILLAR_FEATURED.has(b.slug))
    .map((b) => ({ slug: b.slug, nameFa: b.nameFa, count: b.count }))
    // بر اساسِ تعدادِ محصول (بیشترین اول) — وگرنه برندهای جدید که آخرِ رجیستری‌اند در منو دیده نمی‌شدند.
    .sort((a, b) => b.count - a.count);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "LunaFortuna",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        description: SITE_DESC,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "LunaFortuna",
        inLanguage: "fa-IR",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/catalog?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${estedad.variable}`}>
      <body className="font-sans">
        {/* اگر جاوااسکریپت خاموش بود، انیمیشن‌های reveal محتوا را پنهان نگه می‌دارند —
            این fallback همه را بی‌درنگ نمایان می‌کند تا محتوا و SEO آسیب نبیند. */}
        <noscript>
          <style>{`.reveal,.rise-up,.img-wipe{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Reveal />
        <SmoothScroll />
        <CustomCursor />
        <Nav categories={cats} brandGroups={brandGroups} catalogBrands={catalogBrands} catalogCollections={catalogCollections} catalogFeatured={catalogFeatured} />
        <main>{children}</main>
        <Footer />
        <MobileTabBar />
        <ChatWidget />
        {/* فاصلهٔ پایین برای نوار موبایل تا محتوا زیرش پنهان نشود */}
        <div className="h-20 lg:hidden" aria-hidden />
      </body>
    </html>
  );
}
