import Link from "next/link";
import PageHeader from "@/components/PageHeader";
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
          <div>
            <p className="text-[15px] leading-9 text-navy/70">
              {about.intro ||
                "لونافورتونا یک سرویس خرید واسطه‌ای است که مردم ایران را به محصولاتی وصل می‌کند که به دلیل تحریم یا نبودِ برند در ایران دسترسی به آن‌ها را ندارند — از پوشاک و کیف و کفش تا لوازم خانه و آشپزخانه."}
            </p>
            <p className="mt-5 text-[15px] leading-9 text-navy/70">
              {about.story ||
                "ما فراتر از خرید و ارسال عمل می‌کنیم؛ مثل یک دوست باسلیقه و مطمئن در ترکیه: بهترین گزینه را در بودجهٔ هر مشتری پیدا می‌کنیم، کیفیت و سایز را پیش از ارسال بررسی می‌کنیم و در تمام مسیر شفاف در جریانش می‌گذاریم."}
            </p>
            <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-5">
              <div className="text-sm font-semibold text-gold">معنای نام</div>
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
            ].map(([ico, t, d]) => (
              <div key={t} className="card-soft p-5">
                <span className="text-2xl">{ico}</span>
                <div className="mt-3 text-sm font-semibold text-navy">{t}</div>
                <p className="mt-1 text-[12px] leading-6 text-navy/55">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* تیم */}
        <div className="mt-16">
          <h2 className="mb-6 text-center font-display text-2xl font-semibold text-navy">تیم لونافورتونا</h2>
          {team.length === 0 ? (
            <p className="text-center text-sm text-navy/45">
              به‌زودی عکس و معرفی اعضای تیم اینجا قرار می‌گیرد.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {team.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-white">
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

        <div className="mt-16 rounded-3xl bg-navy p-10 text-center text-cream">
          <p className="font-display text-2xl">آماده‌ای شروع کنیم؟</p>
          <p className="mt-2 text-sm text-cream/60">تو فقط بگو چه می‌خواهی، بقیه‌اش با ما.</p>
          <Link href="/order" className="btn-gold mt-6">
            ثبت سفارش
          </Link>
        </div>
      </div>
    </>
  );
}
