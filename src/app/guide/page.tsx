import PageHeader from "@/components/PageHeader";
import Divider from "@/components/Divider";
import { turkishGuide, sizeGuide, filters } from "@/lib/guideData";

export const metadata = { title: "راهنمای خرید از ترکیه" };

function SectionLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="reveal mb-6 flex items-center gap-3">
      <span className="rise-up flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-lg text-gold">
        {icon}
      </span>
      <h2 className="rise-up font-display text-2xl font-semibold text-navy" style={{ transitionDelay: "40ms" }}>
        {children}
      </h2>
    </div>
  );
}

export default function GuidePage() {
  return (
    <>
      <PageHeader
        label="راهنما"
        title="راهنمای خرید از ترکیه"
        desc="کلمات پرکاربرد ترکی، راهنمای سایز و فیلترهای مهم سایت‌های ترکیه — تا راحت‌تر محصولت را پیدا کنی."
        image="/images/menswear.jpg"
        imagePosition="center 20%"
      />

      <div className="container-luna py-12">
        {/* کلمات ترکی */}
        <SectionLabel icon="📖">کلمات پرکاربرد ترکی</SectionLabel>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(turkishGuide).map(([key, g], i) => (
            <div key={key} className="reveal card-soft p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/25 hover:shadow-card" style={{ transitionDelay: `${(i % 6) * 50}ms` }}>
              <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-navy">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {g.label}
              </h3>
              <ul className="space-y-1.5">
                {g.items.map(([fa, tr]) => (
                  <li key={fa} className="flex items-center justify-between border-b border-navy/[0.04] py-1 text-[13px] last:border-0">
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

        <Divider className="my-14" />

        {/* راهنمای سایز */}
        <SectionLabel icon="📏">راهنمای سایز</SectionLabel>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="reveal card-soft p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-navy">پوشاک (Beden)</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {sizeGuide.clothing.map(([sz, val]) => (
                <div key={sz} className="rounded-xl bg-cream p-3 text-center transition-colors hover:bg-gold/10">
                  <div className="font-display text-lg font-bold text-navy">{sz}</div>
                  <div className="mt-1 text-[11px] text-navy/50">{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal card-soft p-6" style={{ transitionDelay: "70ms" }}>
            <h3 className="mb-4 text-[15px] font-semibold text-navy">کفش (Numara)</h3>
            <div className="flex flex-wrap gap-2">
              {sizeGuide.shoes.map((sz) => (
                <span key={sz} className="rounded-lg bg-cream px-3 py-2 font-medium text-navy transition-colors hover:bg-gold/10">
                  {sz}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Divider className="my-14" />

        {/* فیلترها */}
        <SectionLabel icon="🔍">فیلترهای مهم سایت‌ها</SectionLabel>
        <div className="reveal card-soft p-6">
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
