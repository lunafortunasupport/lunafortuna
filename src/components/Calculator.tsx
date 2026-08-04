"use client";

import { useMemo, useState } from "react";

export default function Calculator({
  perLirToman,
  compact = false,
}: {
  perLirToman: number; // نرخ هر لیر به تومان (شامل کارمزد، پنهان)
  compact?: boolean;
}) {
  const [lir, setLir] = useState("");

  const { finalToman, valid } = useMemo(() => {
    const n = parseFloat(lir.replace(/[^0-9.]/g, ""));
    if (!n || n <= 0) return { finalToman: 0, valid: false };
    return { finalToman: Math.round(n * perLirToman), valid: true };
  }, [lir, perLirToman]);

  return (
    <div className={`card-soft ${compact ? "p-5" : "p-6"}`}>
      <div className="mb-1 font-display text-lg font-semibold text-navy">محاسبهٔ قیمت</div>
      <p className="mb-4 text-xs text-navy/50">قیمت لیر محصول را وارد کن تا قیمت تومان نهایی را ببینی</p>

      <label className="mb-1.5 block text-xs font-medium text-navy/70">قیمت محصول (لیر)</label>
      <input
        type="number"
        inputMode="decimal"
        value={lir}
        onChange={(e) => setLir(e.target.value)}
        placeholder="مثلاً: ۲۰۰"
        dir="ltr"
        className="w-full rounded-xl border border-navy/15 bg-cream/50 px-4 py-3 text-right text-navy outline-none transition focus:border-gold"
      />

      <div className="mt-4 space-y-2.5 rounded-xl bg-navy/5 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-navy/60">قیمت لیر</span>
          <span className="font-medium text-navy" dir="ltr">
            {valid ? `${parseFloat(lir).toLocaleString("fa-IR")} ₺` : "—"}
          </span>
        </div>
        <div className="h-px bg-navy/10" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-navy">قیمت تومان نهایی</span>
          <span className="font-display text-lg font-bold text-gold">
            {valid ? `${finalToman.toLocaleString("fa-IR")} تومان` : "—"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-navy/40">
        قیمت با بهترین نرخ لیر روز محاسبه می‌شود. هزینهٔ ارسال جداگانه اعلام می‌شود.
      </p>
    </div>
  );
}
