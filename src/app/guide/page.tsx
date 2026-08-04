import PageHeader from "@/components/PageHeader";
import { turkishGuide, sizeGuide, filters } from "@/lib/guideData";

export const metadata = { title: "راهنمای خرید از ترکیه" };

export default function GuidePage() {
  return (
    <>
      <PageHeader
        label="راهنما"
        title="راهنمای خرید از ترکیه"
        desc="کلمات پرکاربرد ترکی، راهنمای سایز و فیلترهای مهم سایت‌های ترکیه — تا راحت‌تر محصولت را پیدا کنی."
      />

      <div className="container-luna py-12">
        {/* کلمات ترکی */}
        <h2 className="mb-6 font-display text-2xl font-semibold text-navy">📖 کلمات پرکاربرد ترکی</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(turkishGuide).map(([key, g]) => (
            <div key={key} className="card-soft p-5 reveal">
              <h3 className="mb-3 text-[15px] font-semibold text-navy">{g.label}</h3>
              <ul className="space-y-1.5">
                {g.items.map(([fa, tr]) => (
                  <li key={fa} className="flex items-center justify-between text-[13px]">
                    <span className="text-navy/70">{fa}</span>
                    <span className="font-medium text-gold" dir="ltr">
                      {tr}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* راهنمای سایز */}
        <h2 className="mb-6 mt-14 font-display text-2xl font-semibold text-navy">📏 راهنمای سایز</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-soft p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-navy">پوشاک (Beden)</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {sizeGuide.clothing.map(([sz, val]) => (
                <div key={sz} className="rounded-xl bg-cream p-3 text-center">
                  <div className="font-display text-lg font-bold text-navy">{sz}</div>
                  <div className="mt-1 text-[11px] text-navy/50">{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-soft p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-navy">کفش (Numara)</h3>
            <div className="flex flex-wrap gap-2">
              {sizeGuide.shoes.map((sz) => (
                <span key={sz} className="rounded-lg bg-cream px-3 py-2 font-medium text-navy">
                  {sz}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* فیلترها */}
        <h2 className="mb-6 mt-14 font-display text-2xl font-semibold text-navy">🔍 فیلترهای مهم سایت‌ها</h2>
        <div className="card-soft p-6">
          <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {filters.map(([tr, fa]) => (
              <div key={tr} className="flex items-center justify-between border-b border-navy/5 pb-2 text-[13px]">
                <span className="font-medium text-gold" dir="ltr">
                  {tr}
                </span>
                <span className="text-navy/70">{fa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
