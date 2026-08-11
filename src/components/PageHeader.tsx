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
    <section className="bg-cream">
      <div className="container-luna pt-16 pb-10 md:pt-20 md:pb-14">
        <div className="reveal">
          <div className="rise-up flex items-center gap-3 text-[12px] tracking-[0.28em] text-gold">
            <span className="h-px w-8 bg-gold/50" />
            {label}
          </div>
          <h1
            className="rise-up mt-6 font-display text-[clamp(30px,5.2vw,58px)] font-black leading-[1.12] text-navy"
            style={{ transitionDelay: "70ms" }}
          >
            {title}
          </h1>
          {desc && (
            <p
              className="rise-up mt-5 max-w-2xl text-[14.5px] leading-9 text-navy/55"
              style={{ transitionDelay: "140ms" }}
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
