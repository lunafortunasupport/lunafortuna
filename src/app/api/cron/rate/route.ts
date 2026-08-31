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

  const settings = await getSettings(); // اطمینان از وجود ردیف تنظیمات

  // گاردِ ایمنی: اگر نرخِ استخراج‌شده نسبت به نرخِ فعلی جهشِ نامعقول داشت (>۵۰٪)،
  // احتمالاً parseِ اشتباه است (عددِ نامربوطِ کنارِ کلیدواژه). ثبت نکن، فقط log کن.
  const current = settings.exchangeRate;
  if (current && current > 0) {
    const jump = Math.abs(rate - current) / current;
    if (jump > 0.5) {
      console.warn(`[rate] مقدارِ مشکوک نادیده گرفته شد: ${rate} (فعلی ${current}، جهش ${(jump * 100).toFixed(0)}٪)`);
      return NextResponse.json({
        ok: false,
        reason: "جهشِ نامعقولِ نرخ — نادیده گرفته شد",
        candidate: rate,
        current,
      });
    }
  }

  await prisma.settings.update({
    where: { id: "singleton" },
    data: { exchangeRate: rate, rateSource: "telegram", rateUpdatedAt: new Date() },
  });

  return NextResponse.json({ ok: true, exchangeRate: rate });
}
