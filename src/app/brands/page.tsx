import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import BrandsBrowser from "@/components/BrandsBrowser";

export const dynamic = "force-dynamic";

export const metadata = { title: "برندهای ترکیه" };

export default async function BrandsPage({ searchParams }: { searchParams: { group?: string } }) {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    select: { slug: true, name: true, domain: true, logoUrl: true, group: true },
  });

  return (
    <>
      <PageHeader
        label="کتگوری بر اساس برند"
        title="برندهای معتبر ترکیه"
        desc="همهٔ برندهای دارای نمایندگی در ترکیه. روی هر برند بزن تا محصولاتش را در همان سایت اصلی ببینی؛ بعد لینک محصول را برای ما بفرست تا برایت بخریم."
      />
      <div className="container-luna py-10">
        <BrandsBrowser brands={brands} initialGroup={searchParams.group || "all"} />
      </div>
    </>
  );
}
