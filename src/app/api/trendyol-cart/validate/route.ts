import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// بازبینیِ سبد پیش از تسویه: چون کاتالوگ هر ۱۲ ساعت سینک می‌شود، آیتمِ توی سبدِ فریزشدهٔ
// localStorage ممکن است دیگر فعال/موجود نباشد — این را چک می‌کند. علاوه بر آن، **قیمتِ تازه‌ترِ
// دیتابیس** را هم برمی‌گرداند تا کلاینت، قیمتِ کهنهٔ ذخیره‌شده در localStorage (که ممکن است از
// چند سینکِ قبل باشد) را با آخرین قیمتِ واقعی جایگزین کند — وگرنه سفارش با قیمتِ قدیمی ثبت می‌شد.
// این روت فقط می‌خواند، چیزی نمی‌نویسد.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: { productId: string; size: string }[] = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) return NextResponse.json({ results: [] });

    const ids = [...new Set(items.map((i) => i.productId))].slice(0, 100);
    const products = await prisma.mirrorProduct.findMany({
      where: { id: { in: ids } },
      include: { variants: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    const results = items.map(({ productId, size }) => {
      const p = byId.get(productId);
      const variant = p?.variants.find((v) => v.size === size);
      const valid = !!p && p.isActive && !!variant && variant.inStock;
      return {
        productId,
        size,
        valid,
        // فقط وقتی معتبر است قیمتِ تازه را می‌فرستیم — برای آیتمِ نامعتبر نیازی نیست.
        priceTL: valid ? variant!.priceTL : null,
        freeCargo: valid ? variant!.freeCargo : null,
      };
    });

    return NextResponse.json({ results });
  } catch (e) {
    console.error("[api/trendyol-cart/validate] error", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
