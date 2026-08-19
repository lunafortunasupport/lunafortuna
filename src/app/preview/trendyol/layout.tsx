import { CartProvider } from "@/lib/trendyolCart";
import TrendyolCartButton from "@/components/TrendyolCartButton";

// سبد فقط دور همین زیرشاخه (پیش‌نمایشِ فنیِ ترندیول) پیچیده می‌شود، نه کلِ سایت —
// چون این هنوز یک دموی جدا از سیستمِ سفارشِ اصلی است.
export default function TrendyolPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <TrendyolCartButton />
    </CartProvider>
  );
}
