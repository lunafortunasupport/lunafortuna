import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatToman } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [s, orders, pending, products, brands] = await Promise.all([
    getSettings(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.product.count(),
    prisma.brand.count({ where: { isActive: true } }),
  ]);
  const perLir = Math.round(s.exchangeRate * (1 + s.feeNormal));

  const cards = [
    { label: "کل سفارش‌ها", value: orders.toLocaleString("fa-IR"), href: "/admin/orders" },
    { label: "در انتظار بررسی", value: pending.toLocaleString("fa-IR"), href: "/admin/orders", accent: true },
    { label: "محصولات موجودی", value: products.toLocaleString("fa-IR"), href: "/admin/products" },
    { label: "برندهای فعال", value: brands.toLocaleString("fa-IR"), href: "/admin/brands" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">داشبورد</h1>
      <p className="mt-1 text-sm text-navy/50">خوش آمدی 🌙 مدیریت LunaFortuna</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`card-soft p-5 ${c.accent ? "border-gold/40 bg-gold/5" : ""}`}
          >
            <div className="text-[13px] text-navy/50">{c.label}</div>
            <div className="mt-2 font-display text-3xl font-bold text-navy">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 card-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-navy">نرخ لیر فعلی</div>
            <div className="mt-1 text-[12px] text-navy/50">
              منبع: {s.rateSource === "telegram" ? "کانال تلگرام (خودکار)" : "دستی"} · آخرین به‌روزرسانی:{" "}
              {new Date(s.rateUpdatedAt).toLocaleString("fa-IR")}
            </div>
          </div>
          <div className="text-left">
            <div className="text-[12px] text-navy/50">نرخ صرافی</div>
            <div className="font-display text-xl font-bold text-navy">{formatToman(s.exchangeRate)}</div>
            <div className="mt-1 text-[11px] text-gold">هر لیر با کارمزد: {formatToman(perLir)}</div>
          </div>
        </div>
        <Link href="/admin/settings" className="btn-outline mt-4 !py-2 text-[13px]">
          ویرایش نرخ و کارمزد
        </Link>
      </div>
    </div>
  );
}
