// نمایشِ امتیازِ محصول (میانگینِ نظرِ خریدارانِ ترندیول) — بدونِ وابستگی، قابلِ استفاده در کارت و صفحهٔ محصول.
// score: میانگین از ۵ (ratingScore) · count: تعدادِ نظر (favoriteCount).

function StarRow({ score, size = 12 }: { score: number; size?: number }) {
  // پنج ستاره با پرشدنِ کسری بر اساسِ امتیاز.
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <span className="relative inline-block leading-none" style={{ fontSize: size }} aria-hidden>
      <span className="text-navy/20">★★★★★</span>
      <span className="absolute inset-0 overflow-hidden text-gold" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

/** خطِ فشرده برای کارت‌ها: ★ ۴٫۴ (۱٬۰۱۹) */
export function RatingInline({ score, count }: { score: number | null; count: number | null }) {
  if (score == null || score <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-navy/55">
      <span className="text-gold">★</span>
      <span className="font-semibold text-navy/70 tabular-nums">{score.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}</span>
      {count != null && count > 0 && <span className="text-navy/35 tabular-nums">({count.toLocaleString("fa-IR")})</span>}
    </span>
  );
}

/** خطِ کاملِ صفحهٔ محصول: ★★★★☆ ۴٫۴ از ۵ · ۱٬۰۱۹ نظر */
export function RatingFull({ score, count }: { score: number | null; count: number | null }) {
  if (score == null || score <= 0) return null;
  return (
    <div className="flex items-center gap-2.5">
      <StarRow score={score} size={15} />
      <span className="text-[13px] font-semibold text-navy tabular-nums">
        {score.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} <span className="font-normal text-navy/40">از ۵</span>
      </span>
      {count != null && count > 0 && (
        <span className="text-[12px] text-navy/45 tabular-nums">· {count.toLocaleString("fa-IR")} نظر</span>
      )}
    </div>
  );
}
