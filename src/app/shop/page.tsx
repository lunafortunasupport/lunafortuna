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
        {/* تب‌های کتگوری */}
        <div className="mb-8 flex flex-wrap gap-2">
          <CatTab slug="all" label="همه" active={activeCat === "all"} />
          {categories.map((c) => (
            <CatTab key={c.id} slug={c.slug} label={`${c.icon || ""} ${c.name}`.trim()} active={activeCat === c.slug} />
          ))}
        </div>

        {products.length === 0 ? (
          <div className="card-soft p-12 text-center">
            <div className="text-4xl">🌙</div>
            <p className="mt-4 text-navy/60">فعلاً محصولی در این دسته موجود نیست.</p>
            <Link href="/order" className="btn-gold mt-6">
              سفارش از برندهای ترکیه
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
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
      className={`rounded-full px-4 py-2 text-[13px] transition ${
        active ? "bg-navy text-cream" : "border border-navy/15 text-navy/70 hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </Link>
  );
}
