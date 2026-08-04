import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatToman } from "@/lib/format";
import { parseJson } from "@/lib/util";
import { deleteProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">موجودی انبار</h1>
          <p className="mt-1 text-sm text-navy/50">{products.length.toLocaleString("fa-IR")} محصول</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold">
          + محصول جدید
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card-soft mt-8 p-12 text-center text-navy/50">هنوز محصولی اضافه نشده است.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {products.map((p) => {
            const img = parseJson<string[]>(p.images, [])[0];
            return (
              <div key={p.id} className="card-soft flex items-center gap-4 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-navy/20">🌙</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-navy">{p.title}</div>
                  <div className="mt-0.5 flex flex-wrap gap-2 text-[12px] text-navy/50">
                    <span>{formatToman(p.priceToman)}</span>
                    <span>· موجودی: {p.stock}</span>
                    {p.category && <span>· {p.category.name}</span>}
                    {!p.isActive && <span className="text-red-500">· غیرفعال</span>}
                    {p.isFeatured && <span className="text-gold">· منتخب</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/admin/products/${p.id}`} className="btn-outline !px-3 !py-1.5 text-[12px]">
                    ویرایش
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-full border border-red-200 px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50">
                      حذف
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
