"use client";

import { useState } from "react";

// ویجتِ آپلودِ فیشِ واریز — در فرمِ سفارش (بلافاصله بعدِ ثبت)، سبدِ کاتالوگ (چون هر آیتم یک
// سفارشِ جدا می‌سازد، orderId می‌تواند آرایه باشد و همان یک فیش به همهٔ آن‌ها ضمیمه می‌شود)، و
// صفحهٔ «سفارش‌های من» (برای سفارش‌های قدیمی‌تری که هنوز فیش نفرستاده‌اند) استفاده می‌شود.
export default function ReceiptUpload({
  orderId,
  compact = false,
  onDone,
}: {
  orderId: string | string[];
  compact?: boolean;
  onDone?: () => void;
}) {
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function upload(file: File) {
    setState("uploading");
    setErrorMsg("");
    const ids = Array.isArray(orderId) ? orderId : [orderId];
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const fd = new FormData();
          fd.set("file", file);
          const res = await fetch(`/api/orders/${id}/receipt`, { method: "POST", body: fd });
          return res.ok;
        })
      );
      if (results.every(Boolean)) {
        setState("done");
        onDone?.();
      } else {
        setState("error");
        setErrorMsg("آپلود برای برخی سفارش‌ها ناموفق بود");
      }
    } catch {
      setState("error");
      setErrorMsg("خطای اتصال — دوباره تلاش کن یا از تلگرام بفرست.");
    }
  }

  if (state === "done") {
    return (
      <div className={`flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 ${compact ? "px-3 py-2 text-[12px]" : "p-4 text-[13px]"}`}>
        <span>✅</span>
        رسید دریافت شد و در صفِ بررسی است.
      </div>
    );
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-all ${
          compact
            ? "border border-gold/40 px-4 py-2 text-[12.5px] text-gold hover:bg-gold/10"
            : "btn-gold w-full"
        }`}
      >
        {state === "uploading" ? (
          "در حال آپلود…"
        ) : (
          <>
            <span>📎</span> آپلودِ رسید
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          className="hidden"
          disabled={state === "uploading"}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </label>
      {state === "error" && <p className="mt-2 text-center text-[12px] text-red-500">{errorMsg}</p>}
    </div>
  );
}
