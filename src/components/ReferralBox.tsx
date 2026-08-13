"use client";

import { useState } from "react";

export default function ReferralBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="reveal relative mt-6 overflow-hidden rounded-2xl bg-navy p-6 text-cream">
      <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.16),transparent_65%)]" />
      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-champagne">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">🎁</span>
            کد معرف تو
          </div>
          <p className="mt-2 max-w-md text-[13px] leading-6 text-cream/70">
            کدت را به دوستانت بده؛ هم آن‌ها در خرید اول تخفیف می‌گیرند، هم تو در خرید بعدی.
          </p>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-3 rounded-xl border border-gold/20 bg-cream/10 px-5 py-3 transition-all hover:-translate-y-0.5 hover:bg-cream/20"
        >
          <span className="font-mono text-lg tracking-widest text-champagne" dir="ltr">
            {code}
          </span>
          <span className="text-[12px] text-cream/60">{copied ? "کپی شد ✓" : "کپی"}</span>
        </button>
      </div>
    </div>
  );
}
