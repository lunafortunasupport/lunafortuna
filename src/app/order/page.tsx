import Link from "next/link";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { resolveUserFee } from "@/lib/userPricing";
import PageHeader from "@/components/PageHeader";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "ثبت سفارش" };

export default async function OrderPage() {
  const s = await getSettings();
  const user = await getCurrentUser();

  let fee = s.feeNormal;
  let levelName = "";
  let referralActive = false;
  if (user) {
    const r = await resolveUserFee(user, feesFromSettings(s));
    fee = r.fee;
    levelName = r.levelName;
    referralActive = r.referralKind !== null;
  }
  const perLir = Math.round(s.exchangeRate * (1 + fee));

  return (
    <>
      <PageHeader
        label="سفارش"
        title="ثبت سفارش"
        desc="لینک محصول را بفرست، قیمت تومان نهایی را ببین و پرداخت کن — ما بقیهٔ کار را انجام می‌دهیم."
      />

      {user && referralActive ? (
        <div className="border-b border-gold/30 bg-gold/10">
          <div className="container-luna py-3 text-center text-[13px] font-medium text-gold">
            🎉 تخفیف معرف برای شما فعال شد — این خرید با کارمزد کمتر محاسبه می‌شود.
          </div>
        </div>
      ) : user ? (
        <div className="border-b border-navy/10 bg-gold/5">
          <div className="container-luna py-3 text-center text-[13px] text-navy/70">
            🌙 قیمت‌های تو با سطح <span className="font-semibold text-gold">{levelName}</span> محاسبه می‌شود.
          </div>
        </div>
      ) : (
        <div className="border-b border-navy/10 bg-navy/5">
          <div className="container-luna py-3 text-center text-[13px] text-navy/70">
            برای بهره‌مندی از تخفیف سطح وفاداری،{" "}
            <Link href="/login" className="font-semibold text-gold hover:underline">
              وارد شو یا حساب بساز
            </Link>
            .
          </div>
        </div>
      )}

      <div className="container-luna grid gap-10 py-12 md:grid-cols-[1fr_420px]">
        {/* توضیحات و کانال‌های ارتباط */}
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy">دو راه برای سفارش</h2>
          <p className="mt-3 max-w-lg text-[14px] leading-8 text-navy/60">
            می‌توانی همین‌جا در سایت فرم را پر کنی، یا اگر راحت‌تری، مستقیم در تلگرام سفارش بدهی. هر
            کدام را انتخاب کنی، قیمت شفاف است و در تمام مسیر کنارت هستیم.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={`https://t.me/${s.telegramBot}`}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-gold"
            >
              <span className="text-2xl">✈️</span>
              <div>
                <div className="text-sm font-semibold text-navy">ربات تلگرام</div>
                <div className="text-xs text-navy/50" dir="ltr">
                  @{s.telegramBot} · سریع‌ترین روش
                </div>
              </div>
            </a>
            <a
              href={`https://t.me/${s.telegramSupport}`}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-gold"
            >
              <span className="text-2xl">💬</span>
              <div>
                <div className="text-sm font-semibold text-navy">پشتیبانی تلگرام</div>
                <div className="text-xs text-navy/50" dir="ltr">
                  @{s.telegramSupport}
                </div>
              </div>
            </a>
            <a
              href={`tel:${s.phone}`}
              className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-gold"
            >
              <span className="text-2xl">📞</span>
              <div>
                <div className="text-sm font-semibold text-navy">تماس مستقیم</div>
                <div className="text-xs text-navy/50" dir="ltr">
                  {s.phone} · استانبول، ترکیه
                </div>
              </div>
            </a>
          </div>

          <div className="mt-8 rounded-2xl bg-navy p-6 text-cream">
            <div className="text-sm font-semibold text-champagne">راهنمای قیمت</div>
            <p className="mt-2 text-[13px] leading-7 text-cream/70">
              قیمت تومان نهایی بر اساس نرخ لیر روز محاسبه می‌شود. کافی است قیمت لیرِ محصول را وارد کنی
              تا مبلغ نهایی را ببینی — بدون هیچ هزینهٔ پنهان.
            </p>
          </div>
        </div>

        {/* فرم سفارش */}
        <div className="md:sticky md:top-24 md:self-start">
          <OrderForm
            perLirToman={perLir}
            card={{ number: s.cardNumber, owner: s.cardOwner, bank: s.cardBank }}
            telegramSupport={s.telegramSupport}
          />
        </div>
      </div>
    </>
  );
}
