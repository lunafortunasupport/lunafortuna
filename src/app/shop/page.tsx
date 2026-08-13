import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = { title: "موجودی انبار تهران" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const activeCat = searchParams.cat || "all";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { scope: "warehouse" }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(activeCat !== "all"
          ? { category: { slug: activeCat } }
          : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <>
      <PageHeader
        label="بخش موجودی"
        title="موجودی انبار تهران"
        desc="کالاهایی که همین حالا در انبار تهران موجودند و آمادهٔ ارسال فوری‌اند. قیمت‌ها نهایی و به تومان است."
      />

      <div className="container-luna py-10">
        {/* بنرِ اعتمادِ باریک */}
        <div className="reveal mb-8 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4 text-[12.5px] text-navy/70">
          <span className="flex items-center gap-2 font-medium text-navy">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">⚡</span>
            ارسال همان روز از تهران
          </span>
          <span className="h-4 w-px bg-navy/15" />
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">💳</span>
            قیمت نهایی، بدون هزینهٔ پنهان
          </span>
          <span className="h-4 w-px bg-navy/15" />
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">↺</span>
            امکان مرجوعی طبق قوانین فروشگاه
          </span>
        </div>

        {/* تب‌های کتگوری */}
        <div className="reveal mb-9 flex flex-wrap gap-2.5">
          <CatTab slug="all" label="همه" active={activeCat === "all"} />
          {categories.map((c) => (
            <CatTab key={c.id} slug={c.slug} label={`${c.icon || ""} ${c.name}`.trim()} active={activeCat === c.slug} />
          ))}
        </div>

        {products.length === 0 ? (
          <div className="reveal relative overflow-hidden rounded-3xl bg-navy px-6 py-16 text-center text-cream">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.18),transparent_62%)]" />
            </div>
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/25 bg-white/5">
              <span className="font-display text-3xl">🌙</span>
            </div>
            <h3 className="relative font-display text-2xl font-semibold">فعلاً موجودی‌ای در این دسته نیست</h3>
            <p className="relative mx-auto mt-2 max-w-md text-[13px] leading-7 text-cream/70">
              می‌توانی مستقیم از سایتِ برندهای ترکیه سفارش بدهی؛ لینک محصول را برای ما بفرست تا با قیمت
              شفاف برایت بخریم.
            </p>
            <Link href="/order" className="btn-gold relative mt-6">
              سفارش از برندهای ترکیه
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p, i) => (
              <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 8) * 45}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CatTab({ slug, label, active }: { slug: string; label: string; active: boolean }) {
  return (
    <Link
      href={slug === "all" ? "/shop" : `/shop?cat=${slug}`}
      className={`rounded-full px-4 py-2 text-[13px] transition-all duration-200 ${
        active
          ? "bg-navy text-cream shadow-sm"
          : "border border-navy/12 text-navy/65 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </Link>
  );
}
