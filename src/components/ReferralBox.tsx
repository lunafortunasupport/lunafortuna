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
    <div className="mt-6 rounded-2xl bg-navy p-6 text-cream">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm font-semibold text-champagne">کد معرف تو</div>
          <p className="mt-1 max-w-md text-[13px] leading-6 text-cream/70">
            کدت را به دوستانت بده؛ هم آن‌ها در خرید اول تخفیف می‌گیرند، هم تو در خرید بعدی.
          </p>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-3 rounded-xl bg-cream/10 px-5 py-3 transition hover:bg-cream/20"
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
