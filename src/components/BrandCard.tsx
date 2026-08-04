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
    <Link href={`/brands/${brand.slug}`} className="brand-tile group">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-cream">
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-9 w-9 object-contain"
            loading="lazy"
          />
        ) : (
          <span className="font-display text-lg text-gold">{brand.name.charAt(0)}</span>
        )}
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-navy">{brand.name}</div>
        {brand.domain && <div className="mt-0.5 text-[10px] text-navy/40" dir="ltr">{brand.domain}</div>}
      </div>
      <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-transparent transition-colors group-hover:bg-gold" />
    </Link>
  );
}
