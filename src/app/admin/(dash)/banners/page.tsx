import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBanner } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminBanners() {
  const banners = await prisma.banner.findMany({ orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">بنرها</h1>
          <p className="mt-1 text-sm text-navy/50">بنرهای صفحهٔ اصلی — می‌توانی عکس دلخواه بگذاری یا از تم رنگی استفاده کنی.</p>
        </div>
        <Link href="/admin/banners/new" className="btn-gold">
          + بنر جدید
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="card-soft mt-8 p-12 text-center text-navy/50">هنوز بنری اضافه نشده است.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="card-soft flex items-center gap-4 p-3">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-navy/5">
                {b.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-navy/40">تم {b.theme}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-navy">{b.title || "بدون عنوان"}</div>
                <div className="mt-0.5 flex flex-wrap gap-2 text-[12px] text-navy/50">
                  <span>{b.subtitle}</span>
                  {!b.isActive && <span className="text-red-500">· غیرفعال</span>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/admin/banners/${b.id}`} className="btn-outline !px-3 !py-1.5 text-[12px]">
                  ویرایش
                </Link>
                <form action={deleteBanner}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="rounded-full border border-red-200 px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50">
                    حذف
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
