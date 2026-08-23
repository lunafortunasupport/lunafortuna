"use client";

// لیستِ علاقه‌مندی‌ها — استورِ اشتراکیِ سمتِ کلاینت.
// • مهمان (بدونِ ورود): در localStorage.
// • کاربرِ واردشده: در دیتابیس (گره به حساب، در پروفایل و بین دستگاه‌ها می‌ماند). هنگامِ اولین
//   بارگذاری، علاقه‌مندی‌های مهمان با حساب ادغام و localStorage پاک می‌شود.
// فقط شناسهٔ محصول نگه داشته می‌شود (نه قیمت) تا قیمتِ روز همیشه زنده گرفته شود.
import { useEffect, useState, useCallback } from "react";

const KEY = "luna_wishlist";
const API = "/api/trendyol/favorites";

type Listener = () => void;

let ids: string[] = [];
let authed = false;
let loaded = false;
let loadingPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeLocal(next: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* سهمیه پر است — بی‌صدا رد شو */
  }
}

async function ensureLoaded() {
  if (loaded) return;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const local = readLocal();
    ids = local; // نمایشِ فوریِ خوش‌بینانه تا وقتی پاسخِ سرور بیاید
    emit();
    try {
      const res = await fetch(API, { cache: "no-store" });
      const data = await res.json();
      if (data?.authed) {
        authed = true;
        // ادغامِ علاقه‌مندی‌های مهمان با حساب (اگر چیزی در localStorage بود)
        if (local.length) {
          const merged = await fetch(API, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "merge", ids: local }),
          }).then((r) => r.json());
          ids = Array.isArray(merged?.ids) ? merged.ids : data.ids || [];
          writeLocal([]); // دیگر منبعِ حقیقت سرور است
        } else {
          ids = Array.isArray(data.ids) ? data.ids : [];
        }
      } else {
        authed = false;
        ids = local;
      }
    } catch {
      authed = false;
      ids = readLocal();
    } finally {
      loaded = true;
      emit();
    }
  })();
  return loadingPromise;
}

async function toggle(id: string): Promise<boolean> {
  const has = ids.includes(id);
  // به‌روزرسانیِ خوش‌بینانهٔ فوری
  ids = has ? ids.filter((x) => x !== id) : [id, ...ids];
  emit();

  if (authed) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: has ? "remove" : "add", productId: id }),
      });
      const data = await res.json();
      if (Array.isArray(data?.ids)) {
        ids = data.ids;
        emit();
      }
    } catch {
      /* شبکه قطع بود — حالتِ خوش‌بینانه می‌ماند */
    }
  } else {
    writeLocal(ids);
  }
  return !has;
}

/** هوکِ اشتراکیِ لیست — با هر تغییر (این تب، تبِ دیگر، یا سرور) به‌روز می‌شود. */
export function useWishlist() {
  const [snapshot, setSnapshot] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSnapshot([...ids]);
    listeners.add(sync);
    ensureLoaded().then(sync);
    sync();
    const onStorage = () => {
      if (!authed) {
        ids = readLocal();
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const has = useCallback((id: string) => snapshot.includes(id), [snapshot]);

  return { ids: snapshot, count: snapshot.length, toggle, has };
}
