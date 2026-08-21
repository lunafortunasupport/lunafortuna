import type { Metadata } from "next";
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
import { getPillarStats, getCollectionStats } from "@/lib/trendyolCatalog";

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

export const metadata: Metadata = {
  title: {
    default: "LunaFortuna — خیالت راحت، بقیه‌اش با ما",
    template: "%s | LunaFortuna",
  },
  description:
    "واسطهٔ مطمئن خرید از ترکیه برای ایران؛ از پوشاک و کیف و کفش تا لوازم خانه. قیمت شفاف، بررسی کیفیت و سایز پیش از ارسال.",
  keywords: ["خرید از ترکیه", "لونافورتونا", "برندهای ترکیه", "خرید واسطه‌ای"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cats, groupRows, featuredStats, collectionStats] = await Promise.all([
    prisma.category.findMany({
      where: { scope: "warehouse" },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true, icon: true },
    }),
    prisma.brand.groupBy({ by: ["group"], where: { isActive: true }, _count: true }),
    getPillarStats(),
    getCollectionStats(),
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

  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${estedad.variable}`}>
      <body className="font-sans">
        <Reveal />
        <SmoothScroll />
        <CustomCursor />
        <Nav categories={cats} brandGroups={brandGroups} catalogBrands={catalogBrands} catalogCollections={catalogCollections} />
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
