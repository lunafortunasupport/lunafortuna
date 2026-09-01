import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { priceBreakdown, saleView, type MirrorProductWithVariants } from "@/lib/trendyolCatalog";

// دادهٔ زندهٔ محصولاتِ علاقه‌مندی — با شناسه‌هایی که کلاینت از localStorage می‌فرستد. قیمت‌ها همیشه
// با نرخِ روز محاسبه می‌شوند (نه ذخیرهٔ کهنه). محصولاتِ غیرفعال/حذف‌شده (حجاب) در نتیجه نمی‌آیند.
export async function POST(req: Request) {
  let ids: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.ids)) ids = body.ids.filter((x: unknown) => typeof x === "string").slice(0, 200);
  } catch {
    return NextResponse.json({ items: [] });
  }
  if (ids.length === 0) return NextResponse.json({ items: [] });

  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  const rows = (await prisma.mirrorProduct.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { variants: true },
  })) as MirrorProductWithVariants[];

  // حذفِ محصولاتِ پوشیدهٔ حجاب (هم‌راستا با NOT_HIDDEN در بقیهٔ کوئری‌ها).
  const visible = rows.filter((p) => !p.category.startsWith("Tesettür"));

  const byId = new Map(visible.map((p) => [p.id, p]));

  // ترتیبِ خواسته‌شده حفظ شود (جدیدترین ذخیره‌ها اول) و شناسه‌های نامعتبر/حذف‌شده کنار بروند.
  const items = ids
    .map((id) => byId.get(id))
    .filter((p): p is MirrorProductWithVariants => !!p)
    .map((p) => {
      const cheapest = p.variants.reduce<MirrorProductWithVariants["variants"][number] | null>((best, v) => {
        if (v.priceTL == null) return best;
        if (!best || (best.priceTL ?? Infinity) > v.priceTL) return v;
        return best;
      }, null);
      const breakdown = priceBreakdown(cheapest, perLirToman, s.cargoFeeEstimateTL, p.sourceSite, s.cargoFeeEstimateMillaTL);
      const sale = saleView(p, perLirToman);
      return {
        id: p.id,
        title: p.nameFa || p.nameTr,
        brand: p.brand,
        image: p.image,
        categoryFa: p.categoryFa,
        ratingScore: p.ratingScore,
        favoriteCount: p.favoriteCount,
        itemToman: breakdown.itemToman,
        originalToman: sale.onSale ? sale.originalToman : null,
        discountPct: sale.onSale ? sale.discountPct : null,
        freeCargo: breakdown.freeCargo,
        sizes: p.variants.map((v) => ({ size: v.size, inStock: v.inStock })),
        inStock: p.variants.some((v) => v.inStock),
      };
    });

  return NextResponse.json({ items });
}
