"use client";

// سبدِ خریدِ سبک برای پیش‌نمایشِ کاتالوگِ ترندیول — فقط سمتِ کلاینت (localStorage)، بدونِ نیاز
// به تغییرِ دیتابیس. موقعِ «ثبتِ سفارش» هر آیتم به همان API موجودِ سفارش (`/api/orders`) فرستاده
// می‌شود و لینکِ اصلِ محصول برای پرسنل ثبت می‌شود؛ خودِ این سبد فقط حافظهٔ موقتِ مرورگرِ مشتری است.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "luna_trendyol_cart_v1";

export interface TrendyolCartItem {
  productId: number;
  name: string;
  nameFa?: string;
  brand: string;
  image: string | null;
  sourceUrl: string;
  size: string;
  priceTL: number;
}

interface CartCtx {
  items: TrendyolCartItem[];
  add: (item: TrendyolCartItem) => void;
  remove: (productId: number, size: string) => void;
  clear: () => void;
  has: (productId: number, size: string) => boolean;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TrendyolCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // خواندنِ سبدِ ذخیره‌شده فقط در مرورگر (بعد از mount) تا با رندرِ سرور ناهماهنگ نشود.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage در دسترس نبود (حالتِ خصوصی و…) — سبد فقط در حافظه می‌ماند
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // نادیده گرفتنِ خطای ذخیره‌سازی
    }
  }, [items, hydrated]);

  const add = useCallback((item: TrendyolCartItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.productId === item.productId && p.size === item.size)) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((productId: number, size: string) => {
    setItems((prev) => prev.filter((p) => !(p.productId === productId && p.size === size)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (productId: number, size: string) => items.some((p) => p.productId === productId && p.size === size),
    [items]
  );

  return <Ctx.Provider value={{ items, add, remove, clear, has, count: items.length }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود");
  return ctx;
}
