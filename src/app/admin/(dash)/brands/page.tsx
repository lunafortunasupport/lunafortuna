import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GROUP_LABELS } from "@/lib/util";
import { toggleBrand } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminBrands() {
  const brands = await prisma.brand.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">برندها</h1>
      <p className="mt-1 text-sm text-navy/50">
        {brands.length.toLocaleString("fa-IR")} برند — فعال/غیرفعال و منتخب را مدیریت کن.
      </p>

      <div className="mt-6 overflow-hidden card-soft">
        <table className="w-full text-sm">
          <thead className="bg-navy/5 text-[12px] text-navy/50">
            <tr>
              <th className="p-3 text-right">برند</th>
              <th className="p-3 text-right">گروه</th>
              <th className="p-3 text-center">فعال</th>
              <th className="p-3 text-center">منتخب</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-t border-navy/5">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {b.logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.logoUrl} alt="" className="h-6 w-6 rounded object-contain" />
                    )}
                    <span className="font-medium text-navy">{b.name}</span>
                  </div>
                </td>
                <td className="p-3 text-navy/50">{GROUP_LABELS[b.group] || b.group}</td>
                <td className="p-3 text-center">
                  <ToggleBtn id={b.id} field="isActive" on={b.isActive} />
                </td>
                <td className="p-3 text-center">
                  <ToggleBtn id={b.id} field="isFeatured" on={b.isFeatured} />
                </td>
                <td className="p-3 text-center">
                  <Link href={`/admin/brands/${b.id}`} className="text-[12px] text-gold hover:underline">
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToggleBtn({ id, field, on }: { id: string; field: string; on: boolean }) {
  return (
    <form action={toggleBrand} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <button
        className={`rounded-full px-3 py-1 text-[11px] transition ${
          on ? "bg-green-100 text-green-700" : "bg-navy/10 text-navy/40"
        }`}
      >
        {on ? "بله" : "خیر"}
      </button>
    </form>
  );
}
