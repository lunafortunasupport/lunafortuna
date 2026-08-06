import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveBrand } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditBrand({ params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({ where: { id: params.id } });
  if (!brand) notFound();

  return (
    <div className="max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/brands" className="text-sm text-navy/50 hover:text-gold">
          ← بازگشت
        </Link>
        <h1 className="font-display text-2xl font-semibold text-navy">ویرایش برند</h1>
      </div>

      <form action={saveBrand} className="card-soft space-y-4 p-6">
        <input type="hidden" name="id" value={brand.id} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-navy/70">نام برند</span>
          <input name="name" defaultValue={brand.name} className="inp" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-navy/70">لینک سایت اصلی</span>
          <input name="siteUrl" defaultValue={brand.siteUrl} className="inp" dir="ltr" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-navy/70">لینک لوگو</span>
          <input name="logoUrl" defaultValue={brand.logoUrl || ""} className="inp" dir="ltr" />
        </label>
        {/* ── حراج ── */}
        <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-navy">🔥 حراج برند</span>
            <label className="flex items-center gap-2 text-xs text-navy/70">
              <input type="checkbox" name="saleActive" defaultChecked={brand.saleActive} className="h-4 w-4" />
              حراج فعال است (روی صفحهٔ اصلی نمایش بده)
            </label>
          </div>
          <label className="mb-3 block">
            <span className="mb-1.5 block text-[11px] font-medium text-navy/60">لینک صفحهٔ حراج</span>
            <input
              name="saleUrl"
              defaultValue={brand.saleUrl || ""}
              placeholder="https://www.brand.com/indirim"
              className="inp"
              dir="ltr"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-navy/60">برچسب بنر</span>
            <input name="saleLabel" defaultValue={brand.saleLabel || ""} placeholder="مثلاً حراج زمستانه" className="inp" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-navy/70">
            لینک‌های دسته‌بندی (JSON) — برای اصلاح آدرس هر دسته
          </span>
          <textarea
            name="categoryLinks"
            defaultValue={JSON.stringify(JSON.parse(brand.categoryLinks || "{}"), null, 2)}
            rows={10}
            className="inp font-mono text-[11px]"
            dir="ltr"
          />
          <span className="mt-1 block text-[11px] text-navy/40">
            ساختار: {`{"w":{"jeans":"https://..."},"m":{...}}`} — اگر JSON نامعتبر باشد ذخیره نمی‌شود.
          </span>
        </label>
        <div className="flex gap-3 pt-2">
          <button className="btn-gold">ذخیره</button>
          <Link href="/admin/brands" className="btn-outline">
            انصراف
          </Link>
        </div>
        <style>{`.inp{width:100%;border-radius:.75rem;border:1px solid rgba(21,35,73,.15);background:#fff;padding:.65rem .9rem;font-size:.875rem;outline:none}.inp:focus{border-color:#9a7a43}`}</style>
      </form>
    </div>
  );
}
