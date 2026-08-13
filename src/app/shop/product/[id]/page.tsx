import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { parseJson } from "@/lib/util";
import WarehouseOrder from "@/components/WarehouseOrder";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import Divider from "@/components/Divider";

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

  const related = product.categoryId
    ? await prisma.product.findMany({
        where: { isActive: true, categoryId: product.categoryId, id: { not: product.id } },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: 4,
      })
    : [];

  return (
    <div className="container-luna py-10">
      <nav className="reveal mb-6 text-[13px] text-navy/50">
        <Link href="/shop" className="transition-colors hover:text-gold">
          موجودی
        </Link>
        <span className="mx-2 text-navy/25">/</span>
        {product.category && (
          <>
            <Link href={`/shop?cat=${product.category.slug}`} className="transition-colors hover:text-gold">
              {product.category.name}
            </Link>
            <span className="mx-2 text-navy/25">/</span>
          </>
        )}
        <span className="text-navy">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* گالری */}
        <div className="reveal">
          <ProductGallery images={images} title={product.title} />
        </div>

        {/* اطلاعات */}
        <div className="reveal">
          {product.brandName && (
            <span className="rise-up inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-gold">
              {product.brandName}
            </span>
          )}
          <h1 className="rise-up mt-3 font-display text-3xl font-semibold text-navy" style={{ transitionDelay: "60ms" }}>
            {product.title}
          </h1>

          <div className="rise-up mt-4" style={{ transitionDelay: "100ms" }}>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                موجود در انبار تهران
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                ناموجود
              </span>
            )}
          </div>

          {product.description && (
            <p className="rise-up mt-5 text-[14px] leading-8 text-navy/65" style={{ transitionDelay: "140ms" }}>
              {product.description}
            </p>
          )}

          <div className="rise-up mt-6" style={{ transitionDelay: "180ms" }}>
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

          {/* نشان‌های اعتماد */}
          <div className="rise-up mt-6 grid grid-cols-3 gap-3 text-center text-[11px] text-navy/55" style={{ transitionDelay: "220ms" }}>
            <div className="rounded-xl border border-navy/8 bg-white/60 py-3">
              <div className="text-gold">✓</div>
              اصالت کالا
            </div>
            <div className="rounded-xl border border-navy/8 bg-white/60 py-3">
              <div className="text-gold">⚡</div>
              ارسال فوری
            </div>
            <div className="rounded-xl border border-navy/8 bg-white/60 py-3">
              <div className="text-gold">↺</div>
              امکان مرجوعی
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <Divider className="mb-12" />
          <h2 className="reveal rise-up mb-6 font-display text-xl font-semibold text-navy">محصولات مشابه</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p, i) => (
              <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
