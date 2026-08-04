import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { fetchRateFromTelegram } from "@/lib/rate";

export const dynamic = "force-dynamic";

/**
 * به‌روزرسانی خودکار نرخ لیر از کانال تلگرام.
 * روی Vercel با Cron فراخوانی می‌شود (vercel.json). می‌توان دستی هم فراخوانی کرد.
 */
export async function GET(req: NextRequest) {
  // محافظت اختیاری با CRON_SECRET
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const channel = process.env.RATE_TG_CHANNEL || "";
  if (!channel) {
    return NextResponse.json({ ok: false, reason: "RATE_TG_CHANNEL تنظیم نشده" });
  }

  const rate = await fetchRateFromTelegram(channel);
  if (!rate) {
    return NextResponse.json({ ok: false, reason: "نرخ از کانال استخراج نشد" });
  }

  await getSettings(); // اطمینان از وجود ردیف تنظیمات
  await prisma.settings.update({
    where: { id: "singleton" },
    data: { exchangeRate: rate, rateSource: "telegram", rateUpdatedAt: new Date() },
  });

  return NextResponse.json({ ok: true, exchangeRate: rate });
}
