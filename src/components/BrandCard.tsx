import Link from "next/link";

export interface BrandLite {
  slug: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  group: string;
}

export default function BrandCard({ brand }: { brand: BrandLite }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="brand-tile group relative flex flex-col items-center gap-3.5 overflow-hidden rounded-2xl border border-navy/8 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card"
    >
      {/* درخششِ ظریفِ hover */}
      <span className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-cream ring-1 ring-navy/5 transition group-hover:ring-gold/30">
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logoUrl} alt={brand.name} className="h-9 w-9 object-contain" loading="lazy" />
        ) : (
          <span className="font-display text-2xl font-bold text-gold">{brand.name.charAt(0)}</span>
        )}
      </div>
      <div className="relative">
        <div className="font-display text-[15px] font-bold text-navy transition-colors group-hover:text-gold">
          {brand.name}
        </div>
        {brand.domain && (
          <div className="mt-1 text-[10px] tracking-wide text-navy/35" dir="ltr">
            {brand.domain}
          </div>
        )}
      </div>
    </Link>
  );
}
