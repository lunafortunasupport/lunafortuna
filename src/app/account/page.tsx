import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserLevel } from "@/lib/pricing";
import { updateProfile } from "./actions";
import ReferralBox from "@/components/ReferralBox";

export const dynamic = "force-dynamic";

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
      <h1 className="font-display text-3xl font-semibold text-navy">حساب من</h1>
      <p className="mt-1 text-sm text-navy/50">خوش آمدی 🌙</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card-soft p-5">
          <div className="text-[12px] text-navy/50">سطح وفاداری</div>
          <div className="mt-2 font-display text-2xl font-bold text-navy">{level.name}</div>
          <div className="mt-1 text-[11px] text-gold">{nextHint}</div>
        </div>
        <div className="card-soft p-5">
          <div className="text-[12px] text-navy/50">خریدهای تکمیل‌شده</div>
          <div className="mt-2 font-display text-2xl font-bold text-navy">{delivered.toLocaleString("fa-IR")}</div>
        </div>
        <div className="card-soft p-5">
          <div className="text-[12px] text-navy/50">تاریخ تولد</div>
          <div className="mt-2 font-display text-2xl font-bold text-navy">{user.birthday || "—"}</div>
          <div className="mt-1 text-[11px] text-navy/40">روز تولدت تخفیف ویژه داری</div>
        </div>
      </div>

      {/* کد معرف */}
      <ReferralBox code={user.referralCode} />

      {/* ویرایش پروفایل */}
      <div className="mt-6 card-soft p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-navy">اطلاعات من</h2>
        <form action={updateProfile} className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-navy/70">نام</span>
            <input name="name" defaultValue={user.name || ""} className="inp" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-navy/70">تاریخ تولد (روز/ماه)</span>
            <input name="birthday" defaultValue={user.birthday || ""} placeholder="۱۵/۳" dir="ltr" className="inp" />
          </label>
          <div className="sm:col-span-2">
            <button className="btn-gold">ذخیره</button>
          </div>
        </form>
        <style>{`.inp{width:100%;border-radius:.75rem;border:1px solid rgba(21,35,73,.15);background:#fff;padding:.65rem .9rem;font-size:.875rem;outline:none}.inp:focus{border-color:#9a7a43}`}</style>
      </div>
    </div>
  );
}
