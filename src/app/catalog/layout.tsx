import { CartProvider } from "@/lib/trendyolCart";
import TrendyolCartButton from "@/components/TrendyolCartButton";
import TrendyolPreviewNav from "@/components/TrendyolPreviewNav";

// سبد فقط دور همین زیرشاخه (کاتالوگِ ترکیه) پیچیده می‌شود، نه کلِ سایت —
// چون کاتالوگ سیستمِ سبد/سفارشِ جدا از سفارشِ لینکیِ اصلی دارد.
export default function TrendyolPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <TrendyolPreviewNav />
      {children}
      <TrendyolCartButton />
    </CartProvider>
  );
}
