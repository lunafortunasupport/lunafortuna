"use client";

// سبدِ خریدِ سبک برای پیش‌نمایشِ کاتالوگِ ترندیول — فقط سمتِ کلاینت (localStorage)، بدونِ نیاز
// به تغییرِ دیتابیس. موقعِ «ثبتِ سفارش» هر آیتم به همان API موجودِ سفارش (`/api/orders`) فرستاده
// می‌شود و لینکِ اصلِ محصول برای پرسنل ثبت می‌شود؛ خودِ این سبد فقط حافظهٔ موقتِ مرورگرِ مشتری است.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// v2: بعدِ اتصالِ کاتالوگ به دیتابیسِ واقعی، productId از عددِ دستیِ دموی قدیم به cuidِ
// MirrorProduct تغییر کرد — کلیدِ ذخیره عوض شد تا سبدهای قدیمی به‌جای resolveِ اشتباه، پاک شروع شوند.
const STORAGE_KEY = "luna_trendyol_cart_v2";

export interface TrendyolCartItem {
  productId: string;
  name: string;
  nameFa?: string;
  brand: string;
  image: string | null;
  sourceUrl: string;
  size: string;
  priceTL: number;
  freeCargo: boolean;
}

interface CartCtx {
  items: TrendyolCartItem[];
  add: (item: TrendyolCartItem) => void;
  remove: (productId: string, size: string) => void;
  clear: () => void;
  has: (productId: string, size: string) => boolean;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);

const API = "/api/trendyol/cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TrendyolCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // برای کاربرِ واردشده منبعِ حقیقت، دیتابیس است؛ localStorage فقط برای مهمان نوشته می‌شود.
  const authedRef = useRef(false);

  function readLocal(): TrendyolCartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function writeLocal(next: TrendyolCartItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* سهمیه/حالتِ خصوصی — بی‌صدا */
    }
  }

  // بارگذاریِ اولیه: نمایشِ فوریِ localStorage، بعد بررسیِ ورود. اگر واردشده باشد سبدِ مهمان با
  // حسابش ادغام و از دیتابیس بارگذاری می‌شود (بین دستگاه‌ها همگام)؛ localStorage پاک می‌شود.
  useEffect(() => {
    const local = readLocal();
    setItems(local);
    (async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        const data = await res.json();
        if (data?.authed) {
          authedRef.current = true;
          if (local.length) {
            const merged = await fetch(API, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ action: "merge", items: local }),
            }).then((r) => r.json());
            setItems(Array.isArray(merged?.items) ? merged.items : data.items || []);
            writeLocal([]); // منبعِ حقیقت حالا سرور است
          } else {
            setItems(Array.isArray(data.items) ? data.items : []);
          }
        }
      } catch {
        /* آفلاین — همان localStorage می‌ماند */
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // فقط برای مهمان، هر تغییر در localStorage آینه شود (کاربرِ واردشده در دیتابیس ذخیره می‌شود).
  useEffect(() => {
    if (!hydrated || authedRef.current) return;
    writeLocal(items);
  }, [items, hydrated]);

  const add = useCallback((item: TrendyolCartItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.productId === item.productId && p.size === item.size)) return prev;
      return [...prev, item];
    });
    if (authedRef.current) {
      fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "add", item }),
      }).catch(() => {});
    }
  }, []);

  const remove = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((p) => !(p.productId === productId && p.size === size)));
    if (authedRef.current) {
      fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "remove", productId, size }),
      }).catch(() => {});
    }
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    if (authedRef.current) {
      fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      }).catch(() => {});
    }
  }, []);

  const has = useCallback(
    (productId: string, size: string) => items.some((p) => p.productId === productId && p.size === size),
    [items]
  );

  return <Ctx.Provider value={{ items, add, remove, clear, has, count: items.length }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود");
  return ctx;
}
