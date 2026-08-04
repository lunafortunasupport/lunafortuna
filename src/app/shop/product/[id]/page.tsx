import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { parseJson } from "@/lib/util";
import WarehouseOrder from "@/components/WarehouseOrder";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({ where: { id: params.id } });
  return { title: p?.title || "محصول" };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [product, s] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { category: true } }),
    getSettings(),
  ]);
  if (!product || !product.isActive) notFound();

  const images = parseJson<string[]>(product.images, []);
  const sizes = parseJson<string[]>(product.sizes, []);

  return (
    <div className="container-luna py-10">
      <nav className="mb-6 text-[13px] text-navy/50">
        <Link href="/shop" className="hover:text-gold">
          موجودی
        </Link>
        <span className="mx-2">/</span>
        {product.category && (
          <>
            <Link href={`/shop?cat=${product.category.slug}`} className="hover:text-gold">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-navy">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* گالری */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white">
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-navy/15">🌙</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt="" className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* اطلاعات */}
        <div>
          {product.brandName && (
            <span className="text-[12px] tracking-widest text-gold">{product.brandName}</span>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy">{product.title}</h1>

          {product.stock > 0 ? (
            <span className="mt-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
              موجود در انبار تهران
            </span>
          ) : (
            <span className="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">ناموجود</span>
          )}

          {product.description && (
            <p className="mt-5 text-[14px] leading-8 text-navy/65">{product.description}</p>
          )}

          <div className="mt-6">
            {product.stock > 0 ? (
              <WarehouseOrder
                productId={product.id}
                title={product.title}
                priceToman={product.priceToman}
                sizes={sizes}
                telegramSupport={s.telegramSupport}
              />
            ) : (
              <div className="card-soft p-6 text-center text-navy/60">
                این محصول فعلاً ناموجود است. می‌توانی مشابهش را از برندهای ترکیه سفارش دهی.
                <Link href="/brands" className="btn-outline mt-4">
                  مشاهدهٔ برندها
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
