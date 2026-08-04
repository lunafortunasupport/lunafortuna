import Link from "next/link";
import { saveBanner } from "../../actions";

interface B {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  ctaText: string;
  placement: string;
  theme: string;
  sortOrder: number;
  isActive: boolean;
}

export default function BannerForm({ banner }: { banner?: B }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/banners" className="text-sm text-navy/50 hover:text-gold">
          ← بازگشت
        </Link>
        <h1 className="font-display text-2xl font-semibold text-navy">{banner ? "ویرایش بنر" : "بنر جدید"}</h1>
      </div>

      <form action={saveBanner} className="card-soft space-y-4 p-6">
        {banner && <input type="hidden" name="id" value={banner.id} />}

        <Field label="عنوان">
          <input name="title" defaultValue={banner?.title} className="inp" />
        </Field>
        <Field label="زیرعنوان">
          <input name="subtitle" defaultValue={banner?.subtitle} className="inp" />
        </Field>
        <Field label="لینک عکس (اختیاری — اگر خالی باشد از تم رنگی استفاده می‌شود)">
          <input name="imageUrl" defaultValue={banner?.imageUrl} className="inp" dir="ltr" placeholder="https://…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="متن دکمه">
            <input name="ctaText" defaultValue={banner?.ctaText} className="inp" placeholder="مشاهده" />
          </Field>
          <Field label="لینک مقصد">
            <input name="link" defaultValue={banner?.link} className="inp" dir="ltr" placeholder="/brands" />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="محل نمایش">
            <select name="placement" defaultValue={banner?.placement || "promo"} className="inp">
              <option value="promo">صفحهٔ اصلی</option>
              <option value="hero">هیرو</option>
            </select>
          </Field>
          <Field label="تم رنگی">
            <select name="theme" defaultValue={banner?.theme || "navy"} className="inp">
              <option value="navy">سرمه‌ای</option>
              <option value="gold">طلایی</option>
              <option value="cream">کرم</option>
            </select>
          </Field>
          <Field label="ترتیب">
            <input name="sortOrder" type="number" defaultValue={banner?.sortOrder ?? 0} className="inp" dir="ltr" />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-navy/70">
          <input type="checkbox" name="isActive" defaultChecked={banner ? banner.isActive : true} />
          فعال (نمایش در سایت)
        </label>

        <div className="flex gap-3 pt-2">
          <button className="btn-gold">ذخیره</button>
          <Link href="/admin/banners" className="btn-outline">
            انصراف
          </Link>
        </div>
        <style>{`.inp{width:100%;border-radius:.75rem;border:1px solid rgba(21,35,73,.15);background:#fff;padding:.65rem .9rem;font-size:.875rem;outline:none}.inp:focus{border-color:#9a7a43}`}</style>
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
