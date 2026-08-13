import Link from "next/link";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { resolveUserFee } from "@/lib/userPricing";
import PageHeader from "@/components/PageHeader";
import OrderForm from "@/components/OrderForm";
import Divider from "@/components/Divider";

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
        image="/images/window-warm.jpg"
      />

      {user && referralActive ? (
        <div className="border-b border-gold/30 bg-gold/10">
          <div className="container-luna flex items-center justify-center gap-2 py-3 text-center text-[13px] font-medium text-gold">
            <span>🎉</span> تخفیف معرف برای شما فعال شد — این خرید با کارمزد کمتر محاسبه می‌شود.
          </div>
        </div>
      ) : user ? (
        <div className="border-b border-navy/10 bg-gold/5">
          <div className="container-luna flex items-center justify-center gap-2 py-3 text-center text-[13px] text-navy/70">
            <span>🌙</span> قیمت‌های تو با سطح <span className="font-semibold text-gold">{levelName}</span> محاسبه می‌شود.
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
          <div className="reveal">
            <div className="rise-up sec-label">دو راه برای سفارش</div>
            <h2 className="rise-up mt-3 font-display text-2xl font-semibold text-navy" style={{ transitionDelay: "50ms" }}>
              هرجور راحت‌تری، سفارش بده
            </h2>
            <p className="rise-up mt-3 max-w-lg text-[14px] leading-8 text-navy/60" style={{ transitionDelay: "90ms" }}>
              می‌توانی همین‌جا در سایت فرم را پر کنی، یا اگر راحت‌تری، مستقیم در تلگرام سفارش بدهی. هر
              کدام را انتخاب کنی، قیمت شفاف است و در تمام مسیر کنارت هستیم.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {[
              { href: `https://t.me/${s.telegramBot}`, icon: "✈️", title: "ربات تلگرام", sub: `@${s.telegramBot} · سریع‌ترین روش` },
              { href: `https://t.me/${s.telegramSupport}`, icon: "💬", title: "پشتیبانی تلگرام", sub: `@${s.telegramSupport}` },
              { href: `tel:${s.phone}`, icon: "📞", title: "تماس مستقیم", sub: `${s.phone} · استانبول، ترکیه` },
            ].map((c, i) => (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("tel:") ? undefined : "_blank"}
                rel={c.href.startsWith("tel:") ? undefined : "noopener"}
                className="reveal group flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xl transition-colors group-hover:bg-gold/15">
                  {c.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-navy">{c.title}</div>
                  <div className="text-xs text-navy/50" dir="ltr">
                    {c.sub}
                  </div>
                </div>
                <span className="mr-auto text-navy/25 transition-transform group-hover:-translate-x-1">←</span>
              </a>
            ))}
          </div>

          <div className="reveal relative mt-8 overflow-hidden rounded-2xl bg-navy p-6 text-cream">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.16),transparent_65%)]" />
            <div className="relative flex items-center gap-2.5 text-sm font-semibold text-champagne">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">٪</span>
              راهنمای قیمت
            </div>
            <p className="relative mt-3 text-[13px] leading-7 text-cream/70">
              قیمت تومان نهایی بر اساس نرخ لیر روز محاسبه می‌شود. کافی است قیمت لیرِ محصول را وارد کنی
              تا مبلغ نهایی را ببینی — بدون هیچ هزینهٔ پنهان.
            </p>
          </div>
        </div>

        {/* فرم سفارش */}
        <div className="reveal md:sticky md:top-24 md:self-start">
          <OrderForm
            perLirToman={perLir}
            card={{ number: s.cardNumber, owner: s.cardOwner, bank: s.cardBank }}
            telegramSupport={s.telegramSupport}
          />
        </div>
      </div>

      <Divider className="py-14" />
    </>
  );
}
