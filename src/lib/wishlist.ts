"use client";

// لیستِ علاقه‌مندی‌ها — فقط سمتِ کلاینت، در localStorage. فقط شناسهٔ محصول ذخیره می‌شود (نه قیمت)،
// تا وقتِ نمایش قیمتِ روز از سرور گرفته شود و هیچ‌وقت قیمتِ کهنه نشان داده نشود. یک رویدادِ سفارشی
// پخش می‌شود تا همهٔ کامپوننت‌ها (دکمهٔ قلب، بجِ منو، صفحهٔ لیست) هم‌زمان به‌روز شوند.
import { useEffect, useState, useCallback } from "react";

const KEY = "luna_wishlist";
const EVENT = "luna:wishlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* سهمیهٔ localStorage پر است — بی‌صدا رد شو */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getWishlist(): string[] {
  return read();
}

/** افزودن/حذف یک محصول. مقدارِ برگشتی: وضعیتِ جدید (ذخیره‌شده؟). */
export function toggleWishlist(id: string): boolean {
  const ids = read();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    write([id, ...ids]);
    return true;
  }
  ids.splice(idx, 1);
  write(ids);
  return false;
}

/** هوکِ اشتراکیِ لیست — با هر تغییر (حتی از تبِ دیگر) به‌روز می‌شود. */
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(read());
    sync(); // پس از mount (برای جلوگیری از ناهماهنگیِ SSR/hydration)
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync); // همگام‌سازیِ بین‌تبی
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => toggleWishlist(id), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, count: ids.length, toggle, has };
}
