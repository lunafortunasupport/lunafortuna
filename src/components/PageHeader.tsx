// بنرِ سرصفحه — تمام‌عرض با عکسِ واقعیِ ادیتوریال (مثلِ هیرویِ صفحهٔ اصلی)، نه فقط متن روی زمینهٔ خالی.
// در ۶ صفحه استفاده می‌شود (برندها، موجودی، سفارش، راهنما، کیفیت، درباره) — هر بهبودی اینجا سراسری اثر می‌کند.
export default function PageHeader({
  label,
  title,
  desc,
  image,
  imagePosition = "center",
}: {
  label: string;
  title: string;
  desc?: string;
  image: string;
  imagePosition?: string;
}) {
  return (
    <section className="relative flex min-h-[300px] items-end overflow-hidden bg-navy sm:min-h-[400px] md:min-h-[460px]">
      {/* عکسِ پس‌زمینه با حرکتِ ظریفِ کن‌برنز */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="kenburns absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
      />
      {/* گرادیانِ نیویِ تیره برای خواناییِ متن */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/25" />
      <div className="pointer-events-none absolute -left-10 -top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.16),transparent_65%)]" />

      {/* شمسهٔ ظریفِ طلایی — همان زبانِ گرافیکیِ برند */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spinSlow pointer-events-none absolute -left-14 -top-14 h-64 w-64 text-gold/[0.16] sm:h-80 sm:w-80"
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

      <div className="container-luna relative w-full pb-10 pt-24 sm:pb-12 md:pb-14">
        <div className="reveal">
          <div className="rise-up inline-flex items-center gap-2.5 rounded-full border border-gold/35 bg-navy/30 py-1.5 pr-1.5 pl-4 text-[12px] tracking-[0.2em] text-champagne backdrop-blur-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-[11px]">✦</span>
            {label}
          </div>
          <h1
            className="rise-up mt-5 font-display text-[clamp(28px,5vw,52px)] font-black leading-[1.14] text-cream"
            style={{ transitionDelay: "70ms" }}
          >
            {title}
          </h1>
          <span className="rise-up mt-5 block h-[3px] w-16 rounded-full bg-gradient-to-l from-gold to-champagne" style={{ transitionDelay: "110ms" }} />
          {desc && (
            <p
              className="rise-up mt-5 max-w-2xl text-[14.5px] leading-9 text-cream/70"
              style={{ transitionDelay: "150ms" }}
            >
              {desc}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
