import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserLevel } from "@/lib/pricing";
import { updateProfile } from "./actions";
import ReferralBox from "@/components/ReferralBox";
import BirthdayPicker from "@/components/BirthdayPicker";
import AccountFavorites from "@/components/AccountFavorites";
import WishlistNotifyToggle from "@/components/WishlistNotifyToggle";

export const dynamic = "force-dynamic";

const STAT_ICON = {
  level: "✦",
  orders: "📦",
  birthday: "🎂",
};

export default async function AccountPage() {
  const user = (await getCurrentUser())!;
  const delivered = await prisma.order.count({ where: { userId: user.id, status: "delivered" } });
  const level = getUserLevel(delivered);

  let nextHint = "";
  if (delivered < 5) nextHint = `تا سطح نقره ${(5 - delivered).toLocaleString("fa-IR")} خرید دیگر`;
  else if (delivered < 10) nextHint = `تا سطح طلایی ${(10 - delivered).toLocaleString("fa-IR")} خرید دیگر`;
  else nextHint = "در بالاترین سطح هستی!";

  return (
    <div>
      <div className="reveal">
        <div className="rise-up sec-label">پروفایل</div>
        <h1 className="rise-up mt-3 font-display text-3xl font-semibold text-navy" style={{ transitionDelay: "50ms" }}>
          حساب من
        </h1>
        <p className="rise-up mt-1 text-sm text-navy/50" style={{ transitionDelay: "90ms" }}>
          خوش آمدی 🌙
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: STAT_ICON.level, label: "سطح وفاداری", value: level.name, hint: nextHint },
          { icon: STAT_ICON.orders, label: "خریدهای تکمیل‌شده", value: delivered.toLocaleString("fa-IR"), hint: "" },
          { icon: STAT_ICON.birthday, label: "تاریخ تولد", value: user.birthday || "—", hint: "روز تولدت تخفیف ویژه داری" },
        ].map((c, i) => (
          <div
            key={c.label}
            className="reveal group card-soft relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/25 hover:shadow-card"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.12),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold">{c.icon}</span>
            <div className="mt-3 text-[12px] text-navy/50">{c.label}</div>
            <div className="mt-1 font-display text-2xl font-bold text-navy tabular-nums">{c.value}</div>
            {c.hint && <div className="mt-1 text-[11px] text-gold">{c.hint}</div>}
          </div>
        ))}
      </div>

      {/* علاقه‌مندی‌ها */}
      <AccountFavorites userId={user.id} />

      {/* خبرِ حراجِ علاقه‌مندی‌ها (روشن/خاموش) */}
      <WishlistNotifyToggle />

      {/* کد معرف */}
      <ReferralBox code={user.referralCode} />

      {/* ویرایش پروفایل */}
      <div className="reveal card-soft mt-6 p-6">
        <h2 className="mb-4 flex items-center gap-2.5 font-display text-lg font-semibold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/12 text-gold">✎</span>
          اطلاعات من
        </h2>
        <form action={updateProfile} className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-navy/70">نام</span>
            <input name="name" defaultValue={user.name || ""} className="inp" />
          </label>
          <div className="block">
            <BirthdayPicker defaultValue={user.birthday} />
          </div>
          <div className="sm:col-span-2">
            <button className="btn-gold">ذخیره</button>
          </div>
        </form>
        <style>{`.inp{width:100%;border-radius:.75rem;border:1px solid rgba(21,35,73,.15);background:#fff;padding:.65rem .9rem;font-size:.875rem;outline:none;transition:border-color .2s,box-shadow .2s}.inp:focus{border-color:#9a7a43;box-shadow:0 0 0 3px rgba(154,122,67,.12)}`}</style>
      </div>
    </div>
  );
}
