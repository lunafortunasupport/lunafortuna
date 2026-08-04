import Link from "next/link";

export interface BannerLite {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  ctaText: string;
  theme: string;
}

const THEMES: Record<string, { bg: string; title: string; sub: string; cta: string }> = {
  navy: {
    bg: "bg-gradient-to-br from-navy to-navy-ink",
    title: "text-cream",
    sub: "text-cream/70",
    cta: "bg-gold text-white",
  },
  gold: {
    bg: "bg-gradient-to-br from-gold to-champagne",
    title: "text-white",
    sub: "text-white/85",
    cta: "bg-navy text-cream",
  },
  cream: {
    bg: "bg-gradient-to-br from-cream to-white border border-navy/10",
    title: "text-navy",
    sub: "text-navy/60",
    cta: "bg-gold text-white",
  },
};

export default function BannerStrip({ banners }: { banners: BannerLite[] }) {
  if (!banners.length) return null;
  return (
    <section className="container-luna py-8 reveal">
      <div className="grid gap-5 md:grid-cols-3">
        {banners.map((b) => {
          const t = THEMES[b.theme] || THEMES.navy;
          const hasImg = Boolean(b.imageUrl);
          return (
            <Link
              key={b.id}
              href={b.link || "#"}
              className={`group relative flex min-h-[190px] flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-card transition-transform hover:-translate-y-1 ${
                hasImg ? "" : t.bg
              }`}
            >
              {hasImg && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />
                </>
              )}
              <div className="relative z-10">
                <h3 className={`font-display text-xl font-semibold ${hasImg ? "text-cream" : t.title}`}>{b.title}</h3>
                {b.subtitle && (
                  <p className={`mt-1.5 text-[13px] leading-6 ${hasImg ? "text-cream/80" : t.sub}`}>{b.subtitle}</p>
                )}
                {b.ctaText && (
                  <span
                    className={`mt-4 inline-flex items-center gap-1 rounded-full px-4 py-2 text-[12px] font-medium ${
                      hasImg ? "bg-gold text-white" : t.cta
                    }`}
                  >
                    {b.ctaText} ←
                  </span>
                )}
              </div>
              {/* المان تزئینی */}
              {!hasImg && (
                <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full border border-current opacity-10" />
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
