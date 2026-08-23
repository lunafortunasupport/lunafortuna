import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

// علاقه‌مندی‌های کاربرِ واردشده (سمتِ سرور، گره‌خورده به حساب). مهمان‌ها اینجا کاری ندارند و از
// localStorage استفاده می‌کنند (پاسخِ authed:false).

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ authed: false, ids: [] });
  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  return NextResponse.json({ authed: true, ids: rows.map((r) => r.productId) });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ authed: false, ids: [] }, { status: 401 });

  let body: { action?: string; productId?: string; ids?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const clean = (s: unknown) => (typeof s === "string" && s.length > 0 && s.length < 60 ? s : null);

  if (body.action === "add") {
    const pid = clean(body.productId);
    if (pid) {
      await prisma.favorite.upsert({
        where: { userId_productId: { userId, productId: pid } },
        create: { userId, productId: pid },
        update: {},
      });
    }
  } else if (body.action === "remove") {
    const pid = clean(body.productId);
    if (pid) {
      await prisma.favorite.deleteMany({ where: { userId, productId: pid } });
    }
  } else if (body.action === "merge") {
    // ادغامِ علاقه‌مندی‌های مهمان (از localStorage) هنگام ورود — تکراری‌ها نادیده گرفته می‌شوند.
    const ids = Array.isArray(body.ids) ? body.ids.map(clean).filter((x): x is string => !!x).slice(0, 200) : [];
    if (ids.length) {
      // فقط آن‌هایی که هنوز نیستند را بساز (skipDuplicates روی SQLite پشتیبانی نمی‌شود).
      const existing = await prisma.favorite.findMany({
        where: { userId, productId: { in: ids } },
        select: { productId: true },
      });
      const have = new Set(existing.map((e) => e.productId));
      const toAdd = ids.filter((id) => !have.has(id));
      if (toAdd.length) {
        await prisma.favorite.createMany({ data: toAdd.map((productId) => ({ userId, productId })) });
      }
    }
  }

  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  return NextResponse.json({ authed: true, ids: rows.map((r) => r.productId) });
}
