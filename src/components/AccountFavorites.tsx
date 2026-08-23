import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings, feesFromSettings } from "@/lib/settings";
import TrendyolDemoCard from "@/components/TrendyolDemoCard";
import type { MirrorProductWithVariants } from "@/lib/trendyolCatalog";

// بخشِ علاقه‌مندی‌ها در پروفایل — سمتِ سرور، مستقیم از دیتابیس (چون کاربر واردشده است).
// پیش‌نمایشِ چند محصولِ اخیر + لینک به صفحهٔ کاملِ علاقه‌مندی‌ها.
const PREVIEW = 8;

export default async function AccountFavorites({ userId }: { userId: string }) {
  const favs = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  const ids = favs.map((f) => f.productId);
  if (ids.length === 0) {
    return (
      <div className="reveal card-soft mt-6 p-6">
        <h2 className="mb-2 flex items-center gap-2.5 font-display text-lg font-semibold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0526b]/12 text-[#e0526b]">♡</span>
          علاقه‌مندی‌ها
        </h2>
        <p className="text-[13px] text-navy/50">
          هنوز محصولی نپسندیده‌ای. در{" "}
          <Link href="/preview/trendyol" className="text-gold hover:underline">
            کاتالوگِ ترکیه
          </Link>{" "}
          روی قلبِ هر محصول بزن تا اینجا ذخیره شود.
        </p>
      </div>
    );
  }

  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  const rows = (await prisma.mirrorProduct.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { variants: true },
  })) as MirrorProductWithVariants[];
  const byId = new Map(rows.filter((p) => !p.category.startsWith("Tesettür")).map((p) => [p.id, p]));
  const products = ids.map((id) => byId.get(id)).filter((p): p is MirrorProductWithVariants => !!p);
  const preview = products.slice(0, PREVIEW);

  return (
    <div className="reveal mt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0526b]/12 text-[#e0526b]">❤</span>
          علاقه‌مندی‌ها
          <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[12px] font-medium text-navy/50 tabular-nums">
            {products.length.toLocaleString("fa-IR")}
          </span>
        </h2>
        <Link href="/preview/trendyol/wishlist" className="text-[13px] text-gold hover:text-navy">
          مشاهدهٔ همه ←
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {preview.map((p) => (
          <TrendyolDemoCard
            key={p.id}
            product={p}
            perLirToman={perLirToman}
            cargoFeeEstimateTL={s.cargoFeeEstimateTL}
          />
        ))}
      </div>
    </div>
  );
}
