import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AccountNav from "@/components/AccountNav";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const initial = (user.name || user.email || "L").charAt(0).toUpperCase();

  return (
    <div className="container-luna py-10">
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside>
          <div className="card-soft relative overflow-hidden p-5">
            <span className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.12),transparent_65%)]" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-champagne font-display text-lg font-bold text-white shadow-[0_6px_16px_rgba(154,122,67,0.35)]">
                {initial}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-navy">{user.name || "کاربر لونا"}</div>
                <div className="truncate text-[12px] text-navy/50" dir="ltr">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
          <AccountNav />
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
