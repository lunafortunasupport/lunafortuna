"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatToman } from "@/lib/format";
import { useCart } from "@/lib/trendyolCart";
import { cargoFeeTL, sourceFromUrl } from "@/lib/cargo";
import ReceiptUpload from "@/components/ReceiptUpload";

interface Props {
  perLirToman: number;
  cargoFeeEstimateTL: number;
  cargoFeeEstimateMillaTL?: number;
  defaultName: string;
  card: { number: string; owner: string; bank: string };
  telegramSupport: string;
}

export default function TrendyolCartView({ perLirToman, cargoFeeEstimateTL, cargoFeeEstimateMillaTL, defaultName, card, telegramSupport }: Props) {
  const { items, remove, clear } = useCart();
  const [name, setName] = useState(defaultName);
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [receiptDone, setReceiptDone] = useState(false);
  // قیمتِ تازه از سرور برای هر آیتم — چون آیتمِ داخلِ سبد (localStorage) ممکن است از سینکِ قبلی
  // مانده باشد و قیمتش عوض شده باشد؛ اینجا override می‌شود تا نه نمایش نه ثبتِ سفارش با قیمتِ
  // کهنه انجام نشود. کلید: "productId:size".
  const [freshPrices, setFreshPrices] = useState<Map<string, { priceTL: number; freeCargo: boolean }>>(new Map());

  // بازبینیِ سبک: چون کاتالوگ هر ۱۲ ساعت عوض می‌شود، آیتم‌های سبدِ فریزشده را با وضعیتِ فعلی چک کن
  // و قیمتِ تازه‌ترِ هرکدام را هم بگیر (localStorage قیمتِ لحظهٔ افزودن را نگه می‌دارد، نه الان).
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
        const results: { productId: string; size: string; valid: boolean; priceTL: number | null; freeCargo: boolean | null }[] =
          data.results || [];
        const bad = new Set<string>(results.filter((r) => !r.valid).map((r) => `${r.productId}:${r.size}`));
        setInvalid(bad);
        const fresh = new Map<string, { priceTL: number; freeCargo: boolean }>();
        for (const r of results) {
          if (r.valid && r.priceTL != null) fresh.set(`${r.productId}:${r.size}`, { priceTL: r.priceTL, freeCargo: !!r.freeCargo });
        }
        setFreshPrices(fresh);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // قیمت/کارگوی هر آیتم را با نسخهٔ تازهٔ سرور (اگر موجود بود) جایگزین می‌کند.
  function resolveItem(it: (typeof items)[number]) {
    const f = freshPrices.get(`${it.productId}:${it.size}`);
    return f ? { ...it, priceTL: f.priceTL, freeCargo: f.freeCargo } : it;
  }

  function itemCargoToman(it: { sourceUrl: string; priceTL: number; freeCargo: boolean }) {
    const feeTL = cargoFeeTL(sourceFromUrl(it.sourceUrl), it.priceTL, it.freeCargo, cargoFeeEstimateTL, cargoFeeEstimateMillaTL);
    return Math.round(feeTL * perLirToman);
  }

  const validItems = useMemo(
    () => items.filter((it) => !invalid.has(`${it.productId}:${it.size}`)).map(resolveItem),
    [items, invalid, freshPrices]
  );
  const totalToman = useMemo(
    () => validItems.reduce((sum, it) => sum + Math.round(it.priceTL * perLirToman) + itemCargoToman(it), 0),
    [validItems, perLirToman, cargoFeeEstimateTL, cargoFeeEstimateMillaTL]
  );
  const canSubmit = contact.trim().length > 2 && validItems.length > 0;

  async function submit() {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const ids: string[] = [];
      for (const it of validItems) {
        const cargoTL = cargoFeeTL(sourceFromUrl(it.sourceUrl), it.priceTL, it.freeCargo, cargoFeeEstimateTL, cargoFeeEstimateMillaTL);
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "link",
            link: it.sourceUrl,
            // قیمتِ کالا و کارگو جدا فرستاده می‌شوند — قاطی‌کردنشان در یک عدد باعث می‌شد ادمین در
            // تلگرام قیمتی بالاتر از قیمتِ واقعیِ لینکِ اصلی ببیند و گمان کند خطاست.
            lirPrice: it.priceTL,
            cargoLirPrice: cargoTL || null,
            customerName: name,
            contact,
            description: `کاتالوگِ ترندیول (پیش‌نمایش) — ${it.nameFa || it.name} — سایز: ${it.size} — کالا: ${it.priceTL} لیر${
              cargoTL ? ` + برآوردِ کارگو: ${cargoTL} لیر` : " — کارگو: رایگان"
            }`,
          }),
        });
        if (!res.ok) throw new Error("order failed");
        const data = await res.json();
        if (data.id) ids.push(data.id);
      }
      setOrderIds(ids);
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
          پس از واریز، تصویرِ رسید را همین‌جا آپلود کن یا در تلگرام بفرست — هر کدام راحت‌تری. یک فیش
          برای همهٔ سفارش‌های این سبد کافی است.
        </p>
        <div className="mt-4">
          <ReceiptUpload orderId={orderIds} onDone={() => setReceiptDone(true)} />
        </div>
        {!receiptDone && (
          <>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-navy/35">
              <span className="h-px flex-1 bg-navy/10" />
              یا
              <span className="h-px flex-1 bg-navy/10" />
            </div>
            <a href={`https://t.me/${telegramSupport}`} target="_blank" rel="noopener" className="btn-outline mt-3 w-full">
              ارسال رسید در تلگرام
            </a>
          </>
        )}
        <Link href="/catalog" className="mt-3 block text-center text-[13px] text-navy/50 hover:text-gold">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-soft mx-auto max-w-md p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">🛒</div>
        <h3 className="mt-4 font-display text-lg font-semibold text-navy">سبدت خالی است</h3>
        <p className="mt-1.5 text-[13px] text-navy/50">از فروشگاه چند محصول انتخاب کن تا اینجا نمایش داده شوند.</p>
        <Link href="/catalog" className="btn-gold mt-5 inline-flex">
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_380px]">
      {/* فهرستِ آیتم‌ها */}
      <div className="space-y-3">
        {items.map((raw) => {
          const it = resolveItem(raw);
          const key = `${it.productId}:${it.size}`;
          const isInvalid = invalid.has(key);
          const cargoToman = itemCargoToman(it);
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
                ) : cargoToman > 0 ? (
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
        <p className="relative mt-2 rounded-lg bg-gold/8 px-3 py-2 text-center text-[11px] leading-5 text-navy/50">
          هزینهٔ ارسالِ داخلِ ایران (باربری تا تهران + پیک یا پستِ درِ منزل) پس از رسیدنِ سفارش به ایران محاسبه و جداگانه به شما اعلام می‌شود.
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
