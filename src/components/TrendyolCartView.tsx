"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatToman } from "@/lib/format";
import { useCart } from "@/lib/trendyolCart";

interface Props {
  perLirToman: number;
  cargoFeeEstimateTL: number;
  defaultName: string;
  card: { number: string; owner: string; bank: string };
  telegramSupport: string;
}

export default function TrendyolCartView({ perLirToman, cargoFeeEstimateTL, defaultName, card, telegramSupport }: Props) {
  const { items, remove, clear } = useCart();
  const [name, setName] = useState(defaultName);
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());

  // بازبینیِ سبک: چون کاتالوگ هر ۱۲ ساعت عوض می‌شود، آیتم‌های سبدِ فریزشده را با وضعیتِ فعلی چک کن.
  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    fetch("/api/trendyol-cart/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((it) => ({ productId: it.productId, size: it.size })) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const bad = new Set<string>(
          (data.results || []).filter((r: { valid: boolean }) => !r.valid).map((r: { productId: string; size: string }) => `${r.productId}:${r.size}`)
        );
        setInvalid(bad);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  function itemCargoToman(freeCargo: boolean) {
    return freeCargo ? 0 : Math.round(cargoFeeEstimateTL * perLirToman);
  }

  const validItems = useMemo(() => items.filter((it) => !invalid.has(`${it.productId}:${it.size}`)), [items, invalid]);
  const totalToman = useMemo(
    () => validItems.reduce((sum, it) => sum + Math.round(it.priceTL * perLirToman) + itemCargoToman(it.freeCargo), 0),
    [validItems, perLirToman, cargoFeeEstimateTL]
  );
  const canSubmit = contact.trim().length > 2 && validItems.length > 0;

  async function submit() {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      for (const it of validItems) {
        const cargoTL = it.freeCargo ? 0 : cargoFeeEstimateTL;
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "link",
            link: it.sourceUrl,
            lirPrice: it.priceTL + cargoTL,
            customerName: name,
            contact,
            description: `کاتالوگِ ترندیول (پیش‌نمایش) — ${it.nameFa || it.name} — سایز: ${it.size} — کالا: ${it.priceTL} لیر${
              cargoTL ? ` + برآوردِ کارگو: ${cargoTL} لیر` : " — کارگو: رایگان"
            }`,
          }),
        });
        if (!res.ok) throw new Error("order failed");
      }
      clear();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function copyCard() {
    navigator.clipboard?.writeText(card.number.replace(/\D/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "done") {
    return (
      <div className="card-soft mx-auto max-w-lg animate-fadeIn p-6 shadow-card">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">✅</div>
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">سفارش‌هایت ثبت شد!</h3>
          <p className="mt-1 text-sm text-navy/60">به‌زودی از طریق تماس/تلگرام هماهنگ می‌کنیم.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/5 p-5">
          <div className="mb-3 text-sm font-semibold text-navy">💳 اطلاعات واریز</div>
          {card.number ? (
            <>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                <span className="font-mono text-lg tracking-wider text-navy" dir="ltr">
                  {card.number}
                </span>
                <button onClick={copyCard} className="shrink-0 text-xs text-gold hover:underline">
                  {copied ? "کپی شد ✓" : "کپی"}
                </button>
              </div>
              <div className="mt-2 flex justify-between text-[13px] text-navy/70">
                <span>{card.owner}</span>
                <span>{card.bank}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-navy/60">اطلاعات کارت به‌زودی از طریق پشتیبانی اعلام می‌شود.</p>
          )}
        </div>

        <p className="mt-4 text-[13px] leading-6 text-navy/60">
          پس از واریز، تصویر رسید را در تلگرام برای ما بفرست تا سفارش‌ها را تأیید کنیم.
        </p>
        <a href={`https://t.me/${telegramSupport}`} target="_blank" rel="noopener" className="btn-gold mt-4 w-full">
          ارسال رسید در تلگرام
        </a>
        <Link href="/preview/trendyol" className="mt-3 block text-center text-[13px] text-navy/50 hover:text-gold">
          بازگشت به کاتالوگ
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-soft mx-auto max-w-md p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">🛒</div>
        <h3 className="mt-4 font-display text-lg font-semibold text-navy">سبدت خالی است</h3>
        <p className="mt-1.5 text-[13px] text-navy/50">از کاتالوگ چند محصول انتخاب کن تا اینجا نمایش داده شوند.</p>
        <Link href="/preview/trendyol" className="btn-gold mt-5 inline-flex">
          رفتن به کاتالوگ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_380px]">
      {/* فهرستِ آیتم‌ها */}
      <div className="space-y-3">
        {items.map((it) => {
          const key = `${it.productId}:${it.size}`;
          const isInvalid = invalid.has(key);
          const cargoToman = itemCargoToman(it.freeCargo);
          return (
            <div
              key={key}
              className={`flex items-center gap-4 rounded-2xl border bg-white p-3.5 ${
                isInvalid ? "border-red-200 bg-red-50/40" : "border-navy/8"
              }`}
            >
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.nameFa || it.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-navy/45">{it.brand}</div>
                <div className="line-clamp-1 text-[13.5px] font-medium text-navy">{it.nameFa || it.name}</div>
                <div className="mt-1 text-[12px] text-navy/50">سایز: {it.size}</div>
                {isInvalid ? (
                  <div className="mt-1 text-[11.5px] font-medium text-red-500">این کالا دیگر موجود نیست</div>
                ) : !it.freeCargo ? (
                  <div className="mt-1 text-[11px] text-navy/40">+ کارگوی برآوردی: {formatToman(cargoToman)}</div>
                ) : null}
              </div>
              <div className="shrink-0 text-left">
                <div className="font-display text-[14px] font-bold text-gold tabular-nums">
                  {formatToman(Math.round(it.priceTL * perLirToman) + cargoToman)}
                </div>
                <button
                  onClick={() => remove(it.productId, it.size)}
                  className="mt-1 text-[11.5px] text-navy/35 hover:text-red-500"
                >
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* تسویه */}
      <div className="card-soft relative h-fit overflow-hidden p-6 shadow-card md:sticky md:top-24">
        <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.1),transparent_65%)]" />
        <div className="relative flex items-center justify-between border-b border-navy/8 pb-4">
          <span className="text-sm text-navy/60">جمعِ کل (شاملِ کارگوی برآوردی)</span>
          <span className="font-display text-lg font-bold text-gold tabular-nums">{formatToman(totalToman)}</span>
        </div>

        <div className="relative mt-4 space-y-3">
          <Field label="نام">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نامت" className="inp" />
          </Field>
          <Field label="موبایل / تلگرام *">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="۰۹…"
              dir="ltr"
              className="inp"
            />
          </Field>
        </div>

        <button onClick={submit} disabled={!canSubmit || status === "sending"} className="btn-gold relative mt-5 w-full disabled:opacity-50">
          {status === "sending" ? "در حال ثبت…" : "ثبتِ سفارش"}
        </button>
        {status === "error" && (
          <p className="relative mt-3 text-center text-[12.5px] text-red-500">
            خطا در ثبتِ برخی سفارش‌ها. دوباره تلاش کن یا از تلگرام سفارش بده.
          </p>
        )}
        {invalid.size > 0 && (
          <p className="relative mt-3 text-center text-[11.5px] text-red-500">
            {invalid.size.toLocaleString("fa-IR")} کالای ناموجود در سبد است و در سفارش لحاظ نمی‌شود.
          </p>
        )}
        <p className="relative mt-3 text-center text-[11px] leading-5 text-navy/35">
          به‌ازای هر کالا یک سفارش با لینکِ اصلِ محصول و هزینهٔ کارگو برای ما ثبت می‌شود تا موجودی/قیمت را تأیید کنیم.
        </p>

        <style jsx>{`
          :global(.inp) {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgba(21, 35, 73, 0.15);
            background: rgba(245, 241, 232, 0.4);
            padding: 0.7rem 1rem;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          :global(.inp:focus) {
            border-color: #9a7a43;
            box-shadow: 0 0 0 3px rgba(154, 122, 67, 0.12);
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-navy/70">{label}</span>
      {children}
    </label>
  );
}
