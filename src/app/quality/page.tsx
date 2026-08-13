import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Divider from "@/components/Divider";

export const metadata = { title: "بررسی کیفیت" };

const ORDINAL = ["۰۱", "۰۲", "۰۳", "۰۴"];

const STEPS = [
  ["📦", "تحویل از فروشنده", "کارگو در استانبول محصول را به ما تحویل می‌دهد و ما بازش می‌کنیم."],
  ["🔍", "بررسی اصالت و کیفیت", "اصل بودن، دوخت و کیفیت محصول را با دقت چک می‌کنیم."],
  ["📏", "کنترل سایز", "سایز واقعی را اندازه می‌گیریم تا مطمئن شویم همان چیزی است که خواسته‌ای."],
  ["📸", "عکس واقعی برایت", "عکس واقعی محصول را می‌فرستیم و با تأیید تو ارسالش می‌کنیم."],
];

export default function QualityPage() {
  return (
    <>
      <PageHeader
        label="تضمین کیفیت"
        title="از اصالت تا سایز — هیچ چیز از چشم ما پنهان نمی‌ماند"
        desc="تمایز واقعی لونا «دسترسی» نیست؛ اعتماد و آرامش خیال است. قبل از ارسال، سایز و کیفیت هر محصول را برایت چک می‌کنیم و عکس واقعی‌اش را می‌فرستیم."
        image="/images/quiet-luxury.jpg"
      />

      <div className="container-luna py-12">
        <div className="reveal rise-up sec-label mb-6">مسیر بررسیِ هر سفارش</div>
        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map(([ico, t, d], i) => (
            <div key={t} className="reveal group card-soft relative overflow-hidden p-6" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="pointer-events-none absolute -left-2 -top-4 select-none font-display text-6xl font-black text-navy/[0.04]">
                {ORDINAL[i]}
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-xl transition-transform duration-300 group-hover:scale-110">
                {ico}
              </span>
              <h3 className="relative mt-4 text-[15px] font-semibold text-navy">{t}</h3>
              <p className="relative mt-2 text-[13px] leading-6 text-navy/55">{d}</p>
            </div>
          ))}
        </div>

        <Divider className="my-14" />

        <div className="reveal relative overflow-hidden rounded-3xl bg-navy p-8 text-cream md:p-12">
          <span className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_65%)]" />
          <span className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.08),transparent_65%)]" />
          <div className="relative grid gap-8 md:grid-cols-3">
            {[
              ["صداقت و شفافیت", "قیمت واقعی را بدون هیچ چیز پنهان اعلام می‌کنیم؛ حتی اگر خرید محصولی ریسک داشته باشد، بهت می‌گوییم."],
              ["آرامش خیال", "کیفیت و مناسب بودن هر محصول را پیش از ارسال بررسی می‌کنیم تا هیچ‌وقت نگران «نکند اشتباه برسد» نباشی."],
              ["همراهی تا تحویل", "از لحظهٔ سفارش تا رسیدن محصول به دستت، شفاف در جریانت می‌گذاریم. تنها و بی‌خبر نمی‌مانی."],
            ].map(([t, d], i) => (
              <div key={t} className="rise-up" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-champagne">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {t}
                </div>
                <p className="text-[13px] leading-7 text-cream/70">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal mt-14 text-center">
          <p className="rise-up font-display text-2xl text-navy">تو فقط بگو چه می‌خواهی — خیالت راحت، بقیه‌اش با ما 🌙</p>
          <Link href="/order" className="rise-up btn-gold mt-6" style={{ transitionDelay: "60ms" }}>
            همین حالا سفارش بده
          </Link>
        </div>
      </div>
    </>
  );
}
