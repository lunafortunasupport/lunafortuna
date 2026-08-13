// بنرِ سرصفحه — نسخهٔ گرافیکیِ غنی: بافتِ نقطه‌ای + شمسهٔ بزرگِ محو + برچسبِ نشان‌دار + زیرخطِ طلایی.
// در ۶ صفحه استفاده می‌شود (برندها، موجودی، سفارش، راهنما، کیفیت، درباره) — پس هر بهبودی اینجا سراسری اثر می‌کند.
export default function PageHeader({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* بافتِ نقطه‌ایِ ظریف */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(21,35,73,0.09) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />
      {/* شمسهٔ بزرگِ محو — گوشهٔ بالا */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spinSlow pointer-events-none absolute -left-16 -top-24 h-[340px] w-[340px] text-gold/[0.09] sm:-left-10 sm:-top-28 sm:h-[420px] sm:w-[420px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      >
        <circle cx="100" cy="100" r="70" />
        <circle cx="100" cy="100" r="46" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x1 = 100 + 46 * Math.cos(a), y1 = 100 + 46 * Math.sin(a);
          const x2 = 100 + 70 * Math.cos(a), y2 = 100 + 70 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        <circle cx="100" cy="100" r="4" fill="currentColor" stroke="none" />
      </svg>
      {/* درخششِ طلاییِ نرم */}
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_65%)]" />

      <div className="container-luna relative pt-16 pb-10 md:pt-20 md:pb-14">
        <div className="reveal">
          <div className="rise-up inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/[0.06] py-1.5 pr-1.5 pl-4 text-[12px] tracking-[0.2em] text-gold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-[11px]">✦</span>
            {label}
          </div>
          <h1
            className="rise-up mt-6 font-display text-[clamp(30px,5.2vw,58px)] font-black leading-[1.12] text-navy"
            style={{ transitionDelay: "70ms" }}
          >
            {title}
          </h1>
          <span className="rise-up mt-5 block h-[3px] w-16 rounded-full bg-gradient-to-l from-gold to-champagne" style={{ transitionDelay: "110ms" }} />
          {desc && (
            <p
              className="rise-up mt-5 max-w-2xl text-[14.5px] leading-9 text-navy/55"
              style={{ transitionDelay: "150ms" }}
            >
              {desc}
            </p>
          )}
        </div>
        <div className="mt-9 h-px w-full bg-navy/10" />
      </div>
    </section>
  );
}
