import { notFound } from "next/navigation";

// صفحهٔ محصولِ انبارِ تهران موقتاً غیرفعال است — همراهِ بخشِ «موجودی» (/shop). تصمیمِ کاربر.
export const dynamic = "force-dynamic";

export default function WarehouseProductPage() {
  notFound();
}
