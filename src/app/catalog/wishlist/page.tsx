import WishlistGrid from "@/components/WishlistGrid";
import WishlistNotifyPrompt from "@/components/WishlistNotifyPrompt";

export const metadata = { title: "علاقه‌مندی‌های من — فروشگاهِ ترکیه" };

// صفحهٔ علاقه‌مندی‌ها — لیست سمتِ کلاینت (localStorage) خوانده و دادهٔ زندهٔ قیمت از API گرفته می‌شود.
export default function WishlistPage() {
  return (
    <div>
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
            ❤ علاقه‌مندی‌ها
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">پسندیده‌های من</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            محصولاتی که ذخیره کرده‌ای — قیمت‌ها همیشه با نرخِ روز به‌روزند. اگر وارد شده باشی به
            حسابت وصل می‌شوند و در پروفایلت هم می‌آیند؛ وگرنه روی همین مرورگر ذخیره می‌مانند.
          </p>
        </div>
      </div>

      <div className="container-luna py-10">
        <WishlistNotifyPrompt />
        <WishlistGrid />
      </div>
    </div>
  );
}
