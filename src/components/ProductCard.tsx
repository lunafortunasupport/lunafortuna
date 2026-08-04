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
    <Link href={`/shop/product/${product.id}`} className="group card-soft overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy/20">🌙</div>
        )}
        {product.brandName && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-navy">
            {product.brandName}
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-navy/80 py-1.5 text-center text-xs text-cream">
            ناموجود
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-medium text-navy">{product.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-gold">{formatToman(product.priceToman)}</span>
          {!soldOut && <span className="text-[11px] text-navy/40">موجود</span>}
        </div>
      </div>
    </Link>
  );
}
