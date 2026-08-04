import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { calcToman } from "@/lib/pricing";
import { resolveUserFee } from "@/lib/userPricing";
import { getCurrentUser } from "@/lib/auth";
import { sendAdminMessage } from "@/lib/telegram";
import { shortId } from "@/lib/util";
import { formatToman, formatLir } from "@/lib/format";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type === "warehouse" ? "warehouse" : "link";
    const customerName = String(body.customerName || "").slice(0, 120);
    const contact = String(body.contact || "").slice(0, 120);
    const description = String(body.description || "").slice(0, 1000);

    if (!contact.trim()) {
      return NextResponse.json({ error: "راه ارتباطی لازم است" }, { status: 400 });
    }

    const s = await getSettings();
    const sid = shortId();
    const user = await getCurrentUser();

    // کارمزد شخصی‌سازی‌شده برای کاربر واردشده (وگرنه عادی)
    let fee = s.feeNormal;
    let feeType = "normal";
    let referralKind: "new" | "reward" | null = null;
    if (user) {
      const r = await resolveUserFee(user, feesFromSettings(s));
      fee = r.fee;
      feeType = r.feeType;
      referralKind = r.referralKind;
    }

    let priceToman: number | null = null;
    let lirPrice: number | null = null;
    let link: string | null = null;

    if (type === "warehouse") {
      const product = await prisma.product.findUnique({ where: { id: String(body.productId || "") } });
      if (!product) return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
      priceToman = product.priceToman; // قیمت معتبر از سرور (تومانی، مستقل از کارمزد)
    } else {
      link = String(body.link || "").slice(0, 500);
      lirPrice = Number(body.lirPrice) || null;
      if (!link.startsWith("http")) {
        return NextResponse.json({ error: "لینک معتبر لازم است" }, { status: 400 });
      }
      if (lirPrice) {
        priceToman = calcToman(lirPrice, s.exchangeRate, fee); // کارمزد پنهان در نرخ تومان
      }
    }

    const order = await prisma.order.create({
      data: {
        shortId: sid,
        type,
        userId: user?.id || null,
        customerName: customerName || user?.name || null,
        contact,
        link,
        description: description || null,
        lirPrice,
        priceToman,
        productId: type === "warehouse" ? String(body.productId) : null,
        feeType,
        referralKind,
        status: "pending",
      },
    });

    // مصرف یک‌بارهٔ تخفیف معرف
    if (user && feeType === "referral") {
      if (referralKind === "new") {
        await prisma.user.update({ where: { id: user.id }, data: { referralUsed: true } });
      } else if (referralKind === "reward") {
        await prisma.user.update({ where: { id: user.id }, data: { referralRewardPending: false } });
      }
    }

    // اطلاع به ادمین در تلگرام
    const lines = [
      `🆕 <b>سفارش جدید از سایت</b>`,
      `🆔 #${sid}`,
      `📦 نوع: ${type === "warehouse" ? "موجودی انبار" : "خرید واسطه‌ای"}`,
      customerName ? `👤 ${escapeHtml(customerName)}` : "",
      `📱 ${escapeHtml(contact)}`,
      link ? `🔗 ${escapeHtml(link)}` : "",
      description ? `📝 ${escapeHtml(description)}` : "",
      lirPrice ? `💱 ${formatLir(lirPrice)}` : "",
      priceToman ? `💰 ${formatToman(priceToman)}` : "",
    ].filter(Boolean);
    await sendAdminMessage(lines.join("\n"));

    return NextResponse.json({ ok: true, shortId: sid, id: order.id });
  } catch (e) {
    console.error("[api/orders] error", e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
