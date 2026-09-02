import { prisma } from "@/lib/prisma";
import { formatToman, formatLir } from "@/lib/format";
import { statusLabels } from "@/lib/guideData";
import { updateOrderStatus } from "../../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "paid", "received", "shipped", "delivered", "cancelled"];

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">سفارش‌ها</h1>
      <p className="mt-1 text-sm text-navy/50">{orders.length.toLocaleString("fa-IR")} سفارش اخیر</p>

      {orders.length === 0 ? (
        <div className="card-soft mt-8 p-12 text-center text-navy/50">هنوز سفارشی ثبت نشده است.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-navy">#{o.shortId}</span>
                    <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-[11px] text-navy/60">
                      {o.type === "warehouse" ? "موجودی انبار" : "خرید واسطه‌ای"}
                    </span>
                    <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] text-gold">
                      {statusLabels[o.status] || o.status}
                    </span>
                    {o.receiptUrl && o.status === "pending" && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                        📎 فیش رسید — بررسی نشده
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-0.5 text-[13px] text-navy/70">
                    {o.customerName && <div>👤 {o.customerName}</div>}
                    <div dir="ltr" className="text-right">
                      📱 {o.contact}
                    </div>
                    {o.link && (
                      <div className="truncate" dir="ltr">
                        🔗{" "}
                        <a href={o.link} target="_blank" rel="noopener" className="text-gold hover:underline">
                          {o.link}
                        </a>
                      </div>
                    )}
                    {o.description && <div>📝 {o.description}</div>}
                    <div className="flex flex-wrap gap-4 pt-1">
                      {o.lirPrice ? (
                        <span>
                          💱 قیمتِ کالا: {formatLir(o.lirPrice)}
                          {o.cargoLirPrice ? <span className="text-navy/50"> + کارگو: {formatLir(o.cargoLirPrice)}</span> : null}
                        </span>
                      ) : null}
                      {o.priceToman ? <span className="font-semibold text-navy">💰 مجموع: {formatToman(o.priceToman)}</span> : null}
                    </div>
                    <div className="text-[11px] text-navy/40">
                      {new Date(o.createdAt).toLocaleString("fa-IR")}
                    </div>
                  </div>
                  {o.receiptUrl && (
                    <a
                      href={`/api/admin/receipt/${o.id}`}
                      target="_blank"
                      rel="noopener"
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-navy/10 p-1.5 hover:border-gold/40"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/api/admin/receipt/${o.id}`} alt="رسید" className="h-16 w-16 rounded-lg object-cover" />
                      <span className="pl-2 text-[12px] text-gold">مشاهدهٔ رسید در اندازهٔ کامل ↗</span>
                    </a>
                  )}
                </div>

                <form action={updateOrderStatus} className="flex shrink-0 items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {statusLabels[st]}
                      </option>
                    ))}
                  </select>
                  <button className="btn-navy !px-4 !py-2 text-[13px]">ثبت</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
