import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";

// پراکسیِ عکسِ رسید برای پنلِ ادمین — چون فایل روی Blobِ private ذخیره شده، فقط با
// نشستِ ادمین قابلِ دیدن است؛ آدرسِ خامِ Blob هیچ‌جا به مرورگر داده نمی‌شود.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });

  const order = await prisma.order.findUnique({ where: { id: params.id }, select: { receiptUrl: true } });
  if (!order?.receiptUrl) return NextResponse.json({ error: "رسیدی برای این سفارش ثبت نشده" }, { status: 404 });

  const result = await get(order.receiptUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "بازیابیِ فایل ناموفق بود" }, { status: 502 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "image/jpeg",
      "Cache-Control": "private, max-age=300",
    },
  });
}
