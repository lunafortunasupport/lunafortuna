"use client";

import { useState } from "react";
import { formatToman } from "@/lib/format";

export default function WarehouseOrder({
  productId,
  title,
  priceToman,
  sizes,
  telegramSupport,
}: {
  productId: string;
  title: string;
  priceToman: number;
  sizes: string[];
  telegramSupport: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [size, setSize] = useState(sizes[0] || "");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [shortId, setShortId] = useState("");

  async function submit() {
    if (!name.trim() || !contact.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "warehouse",
          productId,
          description: `${title}${size ? ` — سایز ${size}` : ""}`,
          priceToman,
          customerName: name,
          contact,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortId(data.shortId);
        setStatus("done");
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card-soft border-gold/30 bg-gold/5 p-6 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="mt-3 font-semibold text-navy">سفارشت ثبت شد!</h3>
        <p className="mt-2 text-sm text-navy/60">
          شمارهٔ پیگیری: <span className="font-bold text-gold">#{shortId}</span>
        </p>
        <p className="mt-2 text-[13px] leading-6 text-navy/55">
          برای هماهنگی پرداخت و ارسال، همکاران ما با تو تماس می‌گیرند. می‌توانی از تلگرام هم پیگیری کنی.
        </p>
        <a href={`https://t.me/${telegramSupport}`} target="_blank" rel="noopener" className="btn-navy mt-4">
          پیگیری در تلگرام
        </a>
      </div>
    );
  }

  return (
    <div className="card-soft p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-navy/60">قیمت</span>
        <span className="font-display text-xl font-bold text-gold">{formatToman(priceToman)}</span>
      </div>

      {sizes.length > 0 && (
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-navy/70">سایز</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSize(sz)}
                className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm transition ${
                  size === sz ? "border-gold bg-gold/10 text-gold" : "border-navy/15 text-navy/70"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام و نام خانوادگی"
          className="w-full rounded-xl border border-navy/15 bg-cream/50 px-4 py-3 text-sm outline-none focus:border-gold"
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="موبایل یا آیدی تلگرام"
          className="w-full rounded-xl border border-navy/15 bg-cream/50 px-4 py-3 text-sm outline-none focus:border-gold"
          dir="ltr"
        />
      </div>

      <button
        onClick={submit}
        disabled={status === "sending" || !name.trim() || !contact.trim()}
        className="btn-gold mt-4 w-full disabled:opacity-50"
      >
        {status === "sending" ? "در حال ثبت…" : "ثبت سفارش این محصول"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-500">خطا در ثبت. دوباره تلاش کن یا از تلگرام سفارش بده.</p>
      )}

      <a
        href={`https://t.me/${telegramSupport}`}
        target="_blank"
        rel="noopener"
        className="mt-3 block text-center text-[13px] text-navy/50 hover:text-gold"
      >
        یا سفارش از طریق تلگرام
      </a>
    </div>
  );
}
