import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { sendAdminMessage, sendAdminPhotoBuffer } from "@/lib/telegram";
import { formatToman } from "@/lib/format";

// آپلودِ فیشِ واریز روی سایت — جایگزینِ فرستادنِ دستیِ عکس در تلگرام. آدرسِ سفارش
// (idِ cuid، فقط به خودِ کاربر پس از ثبتِ سفارش نشان داده می‌شود) به‌جای احرازهویت عمل
// می‌کند — مثلِ همان shortIdِ پیگیری که از قبل روی سایت وجود داشت.
export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024; // ۸ مگابایت
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: "سفارش پیدا نشد" }, { status: 404 });
    if (order.status === "cancelled") {
      return NextResponse.json({ error: "این سفارش لغو شده — برای پیگیری با پشتیبانی تماس بگیر." }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایلی دریافت نشد" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "فقط تصویر (jpg، png یا webp) قابل قبول است" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "حجم فایل باید کمتر از ۸ مگابایت باشد" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split("/")[1] || "jpg";
    const blob = await put(`receipts/${order.shortId}-${Date.now()}.${ext}`, buf, {
      access: "private",
      contentType: file.type,
      addRandomSuffix: true,
    });

    await prisma.order.update({ where: { id: order.id }, data: { receiptUrl: blob.url } });

    const caption = [
      `🧾 <b>فیشِ واریز از سایت رسید</b>`,
      `🆔 #${order.shortId}`,
      order.customerName ? `👤 ${order.customerName}` : "",
      order.contact ? `📱 ${order.contact}` : "",
      order.priceToman ? `💰 ${formatToman(order.priceToman)}` : "",
      "👉 برای تأییدِ پرداخت، وضعیتِ سفارش را در پنلِ ادمین به «پرداخت‌شده» تغییر بده.",
    ]
      .filter(Boolean)
      .join("\n");

    const sent = await sendAdminPhotoBuffer(buf, `receipt.${ext}`, caption);
    if (!sent) await sendAdminMessage(caption + "\n⚠️ ارسالِ خودِ عکس ناموفق بود — از پنلِ ادمین رسید را ببین.");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/orders/receipt] error", e);
    return NextResponse.json({ error: "خطای سرور — دوباره تلاش کن یا از تلگرام بفرست." }, { status: 500 });
  }
}
