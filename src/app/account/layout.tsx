import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="container-luna py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside>
          <div className="card-soft p-5">
            <div className="text-sm font-semibold text-navy">{user.name || "کاربر لونا"}</div>
            <div className="mt-0.5 text-[12px] text-navy/50" dir="ltr">
              {user.email}
            </div>
          </div>
          <nav className="mt-4 space-y-1">
            <Link href="/account" className="block rounded-lg px-4 py-2.5 text-sm text-navy/70 hover:bg-navy/5 hover:text-navy">
              🏠 حساب من
            </Link>
            <Link href="/account/orders" className="block rounded-lg px-4 py-2.5 text-sm text-navy/70 hover:bg-navy/5 hover:text-navy">
              📦 سفارش‌های من
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button className="block w-full rounded-lg px-4 py-2.5 text-right text-sm text-navy/40 hover:bg-navy/5 hover:text-navy">
                🚪 خروج
              </button>
            </form>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
