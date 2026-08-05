import type { Metadata } from "next";
import { Vazirmatn, Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { GROUP_LABELS } from "@/lib/util";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vazir",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
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
  const [cats, groupRows] = await Promise.all([
    prisma.category.findMany({
      where: { scope: "warehouse" },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true, icon: true },
    }),
    prisma.brand.groupBy({ by: ["group"], where: { isActive: true }, _count: true }),
  ]);
  const brandGroups = groupRows
    .filter((g) => GROUP_LABELS[g.group])
    .map((g) => ({ key: g.group, label: GROUP_LABELS[g.group], count: g._count }));

  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Reveal />
        <Nav categories={cats} brandGroups={brandGroups} />
        <main>{children}</main>
        <Footer />
        <MobileTabBar />
        {/* فاصلهٔ پایین برای نوار موبایل تا محتوا زیرش پنهان نشود */}
        <div className="h-20 lg:hidden" aria-hidden />
      </body>
    </html>
  );
}
