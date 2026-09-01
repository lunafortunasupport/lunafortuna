"use client";

import { useEffect, useState } from "react";

// پرامپتِ یک‌بارهٔ opt-in برای نوتیفیکیشنِ علاقه‌مندی — فقط برای کاربرِ واردشده‌ای که هنوز
// ازش نپرسیده‌ایم. اگر «بله» بزند wishlistNotify روشن می‌شود؛ هر حالت، دیگر پرسیده نمی‌شود.
// خاموش/روشن‌کردنِ بعدی از پروفایل (WishlistNotifyToggle) انجام می‌شود.
export default function WishlistNotifyPrompt() {
  const [show, setShow] = useState(false);
  const [hasEmail, setHasEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | "on" | "off">(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/account/notify-prefs", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d?.authed && !d.asked) {
          setShow(true);
          setHasEmail(Boolean(d.hasEmail));
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function choose(notify: boolean) {
    setBusy(true);
    try {
      await fetch("/api/account/notify-prefs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "set", notify }),
      });
      setDone(notify ? "on" : "off");
    } catch {
      /* بی‌صدا */
    } finally {
      setBusy(false);
      setTimeout(() => setShow(false), notify ? 2200 : 400);
    }
  }

  if (!show) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/8 to-champagne/5">
      <div className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">🔔</span>
          <div>
            <div className="font-display text-[15px] font-bold text-navy">
              {done === "on" ? "باشه! خبرت می‌کنیم 🎉" : "وقتی حراج شد، خبرت کنیم؟"}
            </div>
            <p className="mt-1 text-[12.5px] leading-6 text-navy/60">
              {done === "on"
                ? "هر وقت محصولی از لیستِ آرزوت حراج بخورد یا دوباره موجود شود، برایت ایمیل می‌فرستیم. هر وقت خواستی از پروفایل خاموشش کن."
                : hasEmail
                ? "به‌محضِ حراج‌خوردن یا موجودشدنِ دوبارهٔ محصولاتِ پسندیده‌ات، یک ایمیل می‌فرستیم. همیشه از پروفایل قابلِ خاموش‌کردن است."
                : "برای دریافتِ خبر باید ایمیلی روی حسابت باشد. فعلاً روشن کن؛ بعداً ایمیلت را در پروفایل اضافه کن."}
            </p>
          </div>
        </div>
        {done === null && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => choose(true)}
              disabled={busy}
              className="btn-gold px-5 py-2.5 text-[13px] disabled:opacity-60"
            >
              بله، خبرم کن
            </button>
            <button
              onClick={() => choose(false)}
              disabled={busy}
              className="rounded-full border border-navy/15 px-4 py-2.5 text-[13px] text-navy/60 transition hover:border-navy/30 hover:text-navy disabled:opacity-60"
            >
              نه، ممنون
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
