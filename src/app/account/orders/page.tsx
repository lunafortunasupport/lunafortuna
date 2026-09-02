import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman, formatLir } from "@/lib/format";
import { statusLabels } from "@/lib/guideData";
import ReceiptUpload from "@/components/ReceiptUpload";

export const dynamic = "force-dynamic";

export default async function MyOrders() {
  const user = (await getCurrentUser())!;
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="reveal">
        <div className="rise-up sec-label">پیگیری</div>
        <h1 className="rise-up mt-3 font-display text-3xl font-semibold text-navy" style={{ transitionDelay: "50ms" }}>
          سفارش‌های من
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="reveal relative mt-6 overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center text-cream">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.16),transparent_62%)]" />
          </div>
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-white/5 text-3xl">
            🛍
          </div>
          <p className="relative text-cream/70">هنوز سفارشی ثبت نکرده‌ای.</p>
          <Link href="/order" className="btn-gold relative mt-6">
            ثبت اولین سفارش
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o, i) => (
            <div
              key={o.id}
              className="reveal group card-soft p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/25 hover:shadow-card"
              style={{ transitionDelay: `${Math.min(i, 6) * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-navy tabular-nums">#{o.shortId}</span>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-[12px] font-medium text-gold">
                  {statusLabels[o.status] || o.status}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-[13px] text-navy/65">
                {o.description && <div>📝 {o.description}</div>}
                {o.link && (
                  <div className="truncate" dir="ltr">
                    🔗{" "}
                    <a href={o.link} target="_blank" rel="noopener" className="text-gold hover:underline">
                      {o.link}
                    </a>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 pt-1 tabular-nums">
                  {o.lirPrice ? (
                    <span>
                      {formatLir(o.lirPrice)}
                      {o.cargoLirPrice ? <span className="text-navy/45"> + کارگو {formatLir(o.cargoLirPrice)}</span> : null}
                    </span>
                  ) : null}
                  {o.priceToman ? <span className="font-semibold text-navy">{formatToman(o.priceToman)}</span> : null}
                </div>
                <div className="text-[11px] text-navy/40">{new Date(o.createdAt).toLocaleString("fa-IR")}</div>
              </div>
              {o.status === "pending" && !o.receiptUrl && (
                <div className="mt-3 border-t border-navy/8 pt-3">
                  <ReceiptUpload orderId={o.id} compact />
                </div>
              )}
              {o.receiptUrl && o.status === "pending" && (
                <div className="mt-3 flex items-center gap-1.5 border-t border-navy/8 pt-3 text-[12px] text-navy/50">
                  <span>📎</span> رسید ارسال شد — در انتظارِ بررسی
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
