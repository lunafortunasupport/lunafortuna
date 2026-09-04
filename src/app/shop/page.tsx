import { notFound } from "next/navigation";

// بخشِ «موجودیِ انبار تهران» موقتاً غیرفعال است — تصمیمِ کاربر.
// این صفحه ۳ محصولِ آزمایشی نشان می‌داد؛ تا وقتی انبارِ تهران واقعاً پر شود،
// دسترسی به آن بسته است (۴۰۴). برای بازگردانی، همان نسخهٔ قبلی از گیت بازیابی شود.
export const dynamic = "force-dynamic";

export default function ShopPage() {
  notFound();
}
