import Link from "next/link";
import { formatToman } from "@/lib/format";
import { parseJson } from "@/lib/util";

export interface ProductLite {
  id: string;
  title: string;
  brandName: string | null;
  images: string;
  priceToman: number;
  stock: number;
}

export default function ProductCard({ product }: { product: ProductLite }) {
  const images = parseJson<string[]>(product.images, []);
  const cover = images[0];
  const soldOut = product.stock <= 0;

  return (
    <Link
      href={`/shop/product/${product.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-navy/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/35 hover:shadow-card"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy/15">
            <span className="font-display text-3xl">🌙</span>
          </div>
        )}
        {/* گرادیانِ ظریف پایینِ تصویر برای خواناییِ برچسب‌ها */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-navy/85 py-1.5 text-center text-[11px] tracking-wide text-cream backdrop-blur-sm">
            ناموجود
          </span>
        )}
        {/* درخششِ طلاییِ گوشه هنگام hover */}
        <span className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.22),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        {product.brandName && (
          <span className="mb-1.5 block truncate text-[10px] font-medium tracking-wide text-navy/50">
            {product.brandName}
          </span>
        )}
        <h3 className="line-clamp-1 font-display text-[13.5px] font-semibold text-navy transition-colors group-hover:text-gold">
          {product.title}
        </h3>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-display text-[15px] font-bold text-gold tabular-nums">{formatToman(product.priceToman)}</span>
          {!soldOut && (
            <span className="inline-flex items-center gap-1 text-[10.5px] text-navy/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              موجود
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
