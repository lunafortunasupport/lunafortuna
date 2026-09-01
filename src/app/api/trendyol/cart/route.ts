import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

// سبدِ کاربرِ واردشده (سمتِ سرور، همگام بین دستگاه‌ها). مهمان‌ها از localStorage استفاده می‌کنند
// (پاسخِ authed:false). شکلِ آیتم دقیقاً همان TrendyolCartItem سمتِ کلاینت است.

interface CartItemInput {
  productId: string;
  size: string;
  name: string;
  nameFa?: string | null;
  brand: string;
  image?: string | null;
  sourceUrl: string;
  priceTL: number;
  freeCargo?: boolean;
}

const str = (s: unknown, max = 300) => (typeof s === "string" && s.length > 0 && s.length <= max ? s : null);

function clean(raw: unknown): CartItemInput | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const productId = str(o.productId, 60);
  const size = str(o.size, 40);
  const name = str(o.name, 300);
  const brand = str(o.brand, 120) || "";
  const sourceUrl = str(o.sourceUrl, 1000) || "";
  const priceTL = typeof o.priceTL === "number" && isFinite(o.priceTL) ? o.priceTL : null;
  if (!productId || !size || !name || priceTL == null) return null;
  return {
    productId,
    size,
    name,
    nameFa: str(o.nameFa, 300),
    brand,
    image: str(o.image, 1000),
    sourceUrl,
    priceTL,
    freeCargo: Boolean(o.freeCargo),
  };
}

function serialize(rows: Awaited<ReturnType<typeof loadItems>>) {
  return rows.map((r) => ({
    productId: r.productId,
    size: r.size,
    name: r.name,
    nameFa: r.nameFa ?? undefined,
    brand: r.brand,
    image: r.image,
    sourceUrl: r.sourceUrl,
    priceTL: r.priceTL,
    freeCargo: r.freeCargo,
  }));
}

function loadItems(userId: string) {
  return prisma.cartItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
}

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ authed: false, items: [] });
  return NextResponse.json({ authed: true, items: serialize(await loadItems(userId)) });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ authed: false, items: [] }, { status: 401 });

  let body: { action?: string; item?: unknown; items?: unknown[]; productId?: string; size?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (body.action === "add") {
    const it = clean(body.item);
    if (it) {
      await prisma.cartItem.upsert({
        where: { userId_productId_size: { userId, productId: it.productId, size: it.size } },
        create: { userId, ...it, nameFa: it.nameFa ?? null, image: it.image ?? null, freeCargo: it.freeCargo ?? false },
        update: { priceTL: it.priceTL, freeCargo: it.freeCargo ?? false },
      });
    }
  } else if (body.action === "remove") {
    const productId = str(body.productId, 60);
    const size = str(body.size, 40);
    if (productId && size) {
      await prisma.cartItem.deleteMany({ where: { userId, productId, size } });
    }
  } else if (body.action === "clear") {
    await prisma.cartItem.deleteMany({ where: { userId } });
  } else if (body.action === "merge") {
    // ادغامِ سبدِ مهمان (localStorage) هنگام ورود — آیتمِ موجود دست‌نخورده می‌ماند.
    const items = Array.isArray(body.items) ? body.items.map(clean).filter((x): x is CartItemInput => !!x).slice(0, 100) : [];
    for (const it of items) {
      await prisma.cartItem.upsert({
        where: { userId_productId_size: { userId, productId: it.productId, size: it.size } },
        create: { userId, ...it, nameFa: it.nameFa ?? null, image: it.image ?? null, freeCargo: it.freeCargo ?? false },
        update: {},
      });
    }
  }

  return NextResponse.json({ authed: true, items: serialize(await loadItems(userId)) });
}
