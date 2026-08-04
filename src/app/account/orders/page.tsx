import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatToman, formatLir } from "@/lib/format";
import { statusLabels } from "@/lib/guideData";

export const dynamic = "force-dynamic";

export default async function MyOrders() {
  const user = (await getCurrentUser())!;
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <div className="card-soft mt-6 p-12 text-center">
          <div className="text-4xl">🛍</div>
          <p className="mt-4 text-navy/60">هنوز سفارشی ثبت نکرده‌ای.</p>
          <Link href="/order" className="btn-gold mt-6">
            ثبت اولین سفارش
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card-soft p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-navy">#{o.shortId}</span>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-[12px] text-gold">
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
                <div className="flex gap-4 pt-1">
                  {o.lirPrice ? <span>{formatLir(o.lirPrice)}</span> : null}
                  {o.priceToman ? <span className="font-semibold text-navy">{formatToman(o.priceToman)}</span> : null}
                </div>
                <div className="text-[11px] text-navy/40">{new Date(o.createdAt).toLocaleString("fa-IR")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
