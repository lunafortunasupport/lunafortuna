"use client";

import { useEffect, useState } from "react";

// سوییچِ روشن/خاموشِ نوتیفیکیشنِ علاقه‌مندی در پروفایل — همیشه در دسترس (چه قبلاً opt-in
// کرده باشد چه نه). وضعیت از /api/account/notify-prefs خوانده و با هر تغییر ذخیره می‌شود.
export default function WishlistNotifyToggle() {
  const [notify, setNotify] = useState(false);
  const [hasEmail, setHasEmail] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/account/notify-prefs", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d?.authed) return;
        setNotify(Boolean(d.notify));
        setHasEmail(Boolean(d.hasEmail));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  async function toggle() {
    const next = !notify;
    setNotify(next); // خوش‌بینانه
    setBusy(true);
    try {
      await fetch("/api/account/notify-prefs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "set", notify: next }),
      });
    } catch {
      setNotify(!next); // برگردان اگر خطا
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="reveal card-soft mt-6 p-6">
      <h2 className="mb-4 flex items-center gap-2.5 font-display text-lg font-semibold text-navy">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/12 text-gold">🔔</span>
        خبرِ حراجِ علاقه‌مندی‌ها
      </h2>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[13.5px] text-navy/75">
            وقتی محصولی از لیستِ آرزویت حراج بخورد یا دوباره موجود شود، برایت ایمیل بفرستیم.
          </div>
          {!hasEmail && (
            <div className="mt-1 text-[11.5px] text-gold">
              برای دریافتِ ایمیل، یک ایمیل روی حسابت ثبت کن.
            </div>
          )}
        </div>
        <button
          role="switch"
          aria-checked={notify}
          aria-label="خبرِ حراجِ علاقه‌مندی‌ها"
          onClick={toggle}
          disabled={busy || !loaded}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${
            notify ? "bg-gold" : "bg-navy/20"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
              notify ? "left-1" : "left-6"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
