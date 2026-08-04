import Link from "next/link";
import { saveProduct } from "../../actions";
import { parseJson } from "@/lib/util";

interface Cat {
  id: string;
  name: string;
}
interface P {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
  brandName: string | null;
  images: string;
  sizes: string;
  priceToman: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function ProductForm({ product, categories }: { product?: P; categories: Cat[] }) {
  const images = product ? parseJson<string[]>(product.images, []).join("\n") : "";
  const sizes = product ? parseJson<string[]>(product.sizes, []).join(", ") : "";

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/products" className="text-sm text-navy/50 hover:text-gold">
          ← بازگشت
        </Link>
        <h1 className="font-display text-2xl font-semibold text-navy">
          {product ? "ویرایش محصول" : "محصول جدید"}
        </h1>
      </div>

      <form action={saveProduct} className="card-soft space-y-4 p-6">
        {product && <input type="hidden" name="id" value={product.id} />}

        <Field label="عنوان محصول *">
          <input name="title" defaultValue={product?.title} required className="inp" />
        </Field>

        <Field label="توضیحات">
          <textarea name="description" defaultValue={product?.description} rows={3} className="inp resize-none" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="کتگوری">
            <select name="categoryId" defaultValue={product?.categoryId || ""} className="inp">
              <option value="">بدون دسته</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="برند (اختیاری)">
            <input name="brandName" defaultValue={product?.brandName || ""} className="inp" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="قیمت (تومان) *">
            <input name="priceToman" type="number" defaultValue={product?.priceToman} required className="inp" dir="ltr" />
          </Field>
          <Field label="موجودی">
            <input name="stock" type="number" defaultValue={product?.stock ?? 1} className="inp" dir="ltr" />
          </Field>
        </div>

        <Field label="لینک عکس‌ها (هر خط یک لینک)">
          <textarea name="images" defaultValue={images} rows={2} className="inp resize-none" dir="ltr" placeholder="https://…" />
        </Field>

        <Field label="سایزها (با کاما جدا کن)">
          <input name="sizes" defaultValue={sizes} className="inp" placeholder="S, M, L" />
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-navy/70">
            <input type="checkbox" name="isActive" defaultChecked={product ? product.isActive : true} />
            فعال (نمایش در سایت)
          </label>
          <label className="flex items-center gap-2 text-sm text-navy/70">
            <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
            نمایش در صفحهٔ اصلی
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-gold">ذخیره</button>
          <Link href="/admin/products" className="btn-outline">
            انصراف
          </Link>
        </div>

        <style>{`
          .inp{width:100%;border-radius:.75rem;border:1px solid rgba(21,35,73,.15);background:#fff;padding:.65rem .9rem;font-size:.875rem;outline:none}
          .inp:focus{border-color:#9a7a43}
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-navy/70">{label}</span>
      {children}
    </label>
  );
}
