"use client";

import { useWishlist } from "@/lib/wishlist";

// دکمهٔ قلبِ علاقه‌مندی. دو حالتِ ظاهری: «card» (گوشهٔ کارت) و «detail» (کنارِ عنوانِ محصول).
export default function WishlistButton({
  id,
  variant = "card",
}: {
  id: string;
  variant?: "card" | "detail";
}) {
  const { has, toggle } = useWishlist();
  const saved = has(id);

  const onClick = (e: React.MouseEvent) => {
    // چون معمولاً داخلِ یک <Link> کارت است، از رفتنِ به صفحهٔ محصول جلوگیری کن.
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  if (variant === "detail") {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold transition ${
          saved
            ? "border-[#e0526b]/40 bg-[#e0526b]/10 text-[#e0526b]"
            : "border-navy/15 text-navy/60 hover:border-[#e0526b]/40 hover:text-[#e0526b]"
        }`}
      >
        <span className="text-base leading-none">{saved ? "❤" : "♡"}</span>
        {saved ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`absolute left-3 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-base shadow-sm backdrop-blur-sm transition ${
        saved
          ? "bg-white text-[#e0526b]"
          : "bg-white/85 text-navy/45 hover:bg-white hover:text-[#e0526b]"
      }`}
    >
      {saved ? "❤" : "♡"}
    </button>
  );
}
