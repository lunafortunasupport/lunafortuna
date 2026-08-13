import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "بررسی کیفیت" };

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
        <div className="grid gap-6 md:grid-cols-4">
          {STEPS.map(([ico, t, d]) => (
            <div key={t} className="card-soft p-6 reveal">
              <span className="text-3xl">{ico}</span>
              <h3 className="mt-4 text-[15px] font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-[13px] leading-6 text-navy/55">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl bg-navy p-8 text-cream md:grid-cols-3 md:p-12">
          {[
            ["صداقت و شفافیت", "قیمت واقعی را بدون هیچ چیز پنهان اعلام می‌کنیم؛ حتی اگر خرید محصولی ریسک داشته باشد، بهت می‌گوییم."],
            ["آرامش خیال", "کیفیت و مناسب بودن هر محصول را پیش از ارسال بررسی می‌کنیم تا هیچ‌وقت نگران «نکند اشتباه برسد» نباشی."],
            ["همراهی تا تحویل", "از لحظهٔ سفارش تا رسیدن محصول به دستت، شفاف در جریانت می‌گذاریم. تنها و بی‌خبر نمی‌مانی."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="mb-3 font-display text-lg font-semibold text-champagne">{t}</div>
              <p className="text-[13px] leading-7 text-cream/70">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-display text-2xl text-navy">تو فقط بگو چه می‌خواهی — خیالت راحت، بقیه‌اش با ما 🌙</p>
          <Link href="/order" className="btn-gold mt-6">
            همین حالا سفارش بده
          </Link>
        </div>
      </div>
    </>
  );
}
