import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: "📊" },
  { href: "/admin/orders", label: "سفارش‌ها", icon: "📦" },
  { href: "/admin/products", label: "موجودی انبار", icon: "🛍" },
  { href: "/admin/banners", label: "بنرها", icon: "🖼" },
  { href: "/admin/brands", label: "برندها", icon: "🏷" },
  { href: "/admin/settings", label: "تنظیمات", icon: "⚙️" },
];

export default function DashLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <div className="grid md:grid-cols-[240px_1fr]">
        {/* سایدبار */}
        <aside className="border-l border-navy/10 bg-navy text-cream md:min-h-screen">
          <div className="p-6">
            <div className="font-display text-xl font-bold tracking-widest">LUNA</div>
            <div className="text-[10px] tracking-widest text-champagne">پنل مدیریت</div>
          </div>
          <nav className="space-y-1 px-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/75 transition hover:bg-cream/10 hover:text-cream"
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 px-3">
            <form action="/api/admin/logout" method="POST">
              <button className="w-full rounded-lg px-3 py-2.5 text-right text-sm text-cream/50 transition hover:bg-cream/10 hover:text-cream">
                🚪 خروج
              </button>
            </form>
          </div>
          <div className="mt-6 px-6">
            <Link href="/" className="text-[12px] text-champagne hover:underline">
              ← بازگشت به سایت
            </Link>
          </div>
        </aside>

        {/* محتوا */}
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
