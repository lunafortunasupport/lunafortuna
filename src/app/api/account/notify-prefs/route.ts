import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

// ترجیحِ نوتیفیکیشنِ علاقه‌مندی: خبردادن وقتی محصولِ لیستِ آرزو حراج/موجود شد.
// GET  → { authed, notify, asked, hasEmail }
// POST → { action: "set", notify: bool } یا { action: "dismiss" } (یعنی پرسیدیم، جواب «نه»)

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ authed: false, notify: false, asked: true, hasEmail: false });
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { wishlistNotify: true, wishlistNotifyAsked: true, email: true },
  });
  if (!u) return NextResponse.json({ authed: false, notify: false, asked: true, hasEmail: false });
  return NextResponse.json({
    authed: true,
    notify: u.wishlistNotify,
    asked: u.wishlistNotifyAsked,
    hasEmail: Boolean(u.email),
  });
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ authed: false }, { status: 401 });

  let body: { action?: string; notify?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (body.action === "set") {
    // انتخابِ صریحِ کاربر (تیک/حذفِ تیک) — همان هم به‌عنوان «پرسیده شد» ثبت می‌شود.
    await prisma.user.update({
      where: { id: userId },
      data: { wishlistNotify: Boolean(body.notify), wishlistNotifyAsked: true },
    });
  } else if (body.action === "dismiss") {
    // کاربر پرامپت را بست بدونِ روشن‌کردن — دیگر نپرس.
    await prisma.user.update({ where: { id: userId }, data: { wishlistNotifyAsked: true } });
  }

  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { wishlistNotify: true, wishlistNotifyAsked: true },
  });
  return NextResponse.json({ authed: true, notify: u?.wishlistNotify ?? false, asked: u?.wishlistNotifyAsked ?? true });
}
