import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Divider from "@/components/Divider";
import { getSettings } from "@/lib/settings";
import { parseJson } from "@/lib/util";

export const dynamic = "force-dynamic";
export const metadata = { title: "دربارهٔ ما" };

interface About {
  intro?: string;
  story?: string;
  team?: { name: string; role: string; photoUrl?: string }[];
}

export default async function AboutPage() {
  const s = await getSettings();
  const about = parseJson<About>(s.aboutContent, {});
  const team = about.team || [];

  return (
    <>
      <PageHeader
        label="دربارهٔ ما"
        title="لونافورتونا"
        desc="نورِ خوشبختی — دقیقاً همان حسی که به تو می‌دهیم."
        image="/images/portrait.jpg"
        imagePosition="center 22%"
      />

      <div className="container-luna py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="reveal">
            <p className="rise-up text-[15px] leading-9 text-navy/70">
              {about.intro ||
                "لونافورتونا یک سرویس خرید واسطه‌ای است که مردم ایران را به محصولاتی وصل می‌کند که به دلیل تحریم یا نبودِ برند در ایران دسترسی به آن‌ها را ندارند — از پوشاک و کیف و کفش تا لوازم خانه و آشپزخانه."}
            </p>
            <p className="rise-up mt-5 text-[15px] leading-9 text-navy/70" style={{ transitionDelay: "60ms" }}>
              {about.story ||
                "ما فراتر از خرید و ارسال عمل می‌کنیم؛ مثل یک دوست باسلیقه و مطمئن در ترکیه: بهترین گزینه را در بودجهٔ هر مشتری پیدا می‌کنیم، کیفیت و سایز را پیش از ارسال بررسی می‌کنیم و در تمام مسیر شفاف در جریانش می‌گذاریم."}
            </p>
            <div className="rise-up relative mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-gold/5 p-5" style={{ transitionDelay: "110ms" }}>
              <div className="flex items-center gap-2 text-sm font-semibold text-gold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-[12px]">✦</span>
                معنای نام
              </div>
              <p className="mt-2 text-[13px] leading-7 text-navy/65">
                «Luna» یعنی ماه (آرامش و نور) و «Fortuna» الههٔ بخت و خوش‌اقبالی است. نام برند تقریباً
                می‌شود «نورِ خوشبختی».
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["🎯", "چشم‌انداز", "معتبرترین مقصد خرید بین‌المللی برای ایرانی‌ها."],
              ["🤝", "مأموریت", "مثل یک دوست مورد اعتماد در ترکیه، کنارت هستیم."],
              ["💎", "ارزش‌ها", "صداقت، شفافیت و آرامش خیال."],
              ["✨", "تمایز ما", "اعتماد است، نه صرفاً دسترسی."],
            ].map(([ico, t, d], i) => (
              <div
                key={t}
                className="reveal group card-soft p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/25 hover:shadow-card"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-xl transition-transform duration-300 group-hover:scale-110">
                  {ico}
                </span>
                <div className="mt-3 text-sm font-semibold text-navy">{t}</div>
                <p className="mt-1 text-[12px] leading-6 text-navy/55">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <Divider className="my-14" />

        {/* تیم */}
        <div>
          <div className="reveal mb-8 text-center">
            <div className="rise-up sec-label justify-center">تیمِ ما</div>
            <h2 className="rise-up mt-3 font-display text-2xl font-semibold text-navy" style={{ transitionDelay: "50ms" }}>
              تیم لونافورتونا
            </h2>
          </div>
          {team.length === 0 ? (
            <div className="reveal mx-auto max-w-md rounded-2xl border border-dashed border-navy/15 bg-white/50 py-10 text-center">
              <span className="text-2xl">👥</span>
              <p className="mt-3 text-sm text-navy/45">به‌زودی عکس و معرفی اعضای تیم اینجا قرار می‌گیرد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {team.map((m, i) => (
                <div key={i} className="reveal text-center" style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className="mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-white ring-1 ring-navy/5">
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl text-navy/15">👤</div>
                    )}
                  </div>
                  <div className="mt-3 text-sm font-semibold text-navy">{m.name}</div>
                  <div className="text-[12px] text-navy/50">{m.role}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="reveal relative mt-16 overflow-hidden rounded-3xl bg-navy p-10 text-center text-cream">
          <span className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_65%)]" />
          <p className="rise-up relative font-display text-2xl">آماده‌ای شروع کنیم؟</p>
          <p className="rise-up relative mt-2 text-sm text-cream/60" style={{ transitionDelay: "50ms" }}>
            تو فقط بگو چه می‌خواهی، بقیه‌اش با ما.
          </p>
          <Link href="/order" className="rise-up btn-gold relative mt-6" style={{ transitionDelay: "100ms" }}>
            ثبت سفارش
          </Link>
        </div>
      </div>
    </>
  );
}
