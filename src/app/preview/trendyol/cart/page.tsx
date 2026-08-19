import { getSettings, feesFromSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import TrendyolCartView from "@/components/TrendyolCartView";

export const dynamic = "force-dynamic";
export const metadata = { title: "سبدِ خرید — کاتالوگِ ترندیول" };

export default async function TrendyolCartPage() {
  const [s, user] = await Promise.all([getSettings(), getCurrentUser()]);
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  return (
    <div className="container-luna py-10">
      <div className="mb-8">
        <div className="sec-label">تسویه</div>
        <h1 className="mt-2 font-display text-2xl font-semibold text-navy">سبدِ خرید</h1>
      </div>
      <TrendyolCartView
        perLirToman={perLirToman}
        defaultName={user?.name || ""}
        card={{ number: s.cardNumber, owner: s.cardOwner, bank: s.cardBank }}
        telegramSupport={s.telegramSupport}
      />
    </div>
  );
}
