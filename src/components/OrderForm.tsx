"use client";

import { useMemo, useState } from "react";
import { formatToman } from "@/lib/format";
import ReceiptUpload from "@/components/ReceiptUpload";

interface Props {
  perLirToman: number;
  card: { number: string; owner: string; bank: string };
  telegramSupport: string;
}

export default function OrderForm({ perLirToman, card, telegramSupport }: Props) {
  const [link, setLink] = useState("");
  const [lir, setLir] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [shortId, setShortId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [receiptDone, setReceiptDone] = useState(false);

  const finalToman = useMemo(() => {
    const n = parseFloat(lir.replace(/[^0-9.]/g, ""));
    return n > 0 ? Math.round(n * perLirToman) : 0;
  }, [lir, perLirToman]);

  const canSubmit = link.startsWith("http") && contact.trim().length > 2;

  async function submit() {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "link",
          link,
          lirPrice: parseFloat(lir) || null,
          customerName: name,
          contact,
          description: desc,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortId(data.shortId);
        setOrderId(data.id);
        setStatus("done");
      } else setStatus("error");
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
      <div className="card-soft animate-fadeIn p-6 shadow-card">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">✅</div>
          <h3 className="mt-3 font-display text-xl font-semibold text-navy">سفارشت ثبت شد!</h3>
          <p className="mt-1 text-sm text-navy/60">
            شمارهٔ پیگیری: <span className="font-bold text-gold tabular-nums">#{shortId}</span>
          </p>
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
              {finalToman > 0 && (
                <div className="mt-3 flex items-center justify-between border-t border-gold/20 pt-3">
                  <span className="text-sm text-navy/60">مبلغ قابل پرداخت</span>
                  <span className="font-display text-lg font-bold text-gold">{formatToman(finalToman)}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-navy/60">اطلاعات کارت به‌زودی از طریق پشتیبانی اعلام می‌شود.</p>
          )}
        </div>

        <p className="mt-4 text-[13px] leading-6 text-navy/60">
          پس از واریز، تصویرِ رسید را همین‌جا آپلود کن یا در تلگرام بفرست — هر کدام راحت‌تری. به‌محضِ
          بررسی، سفارشت تأیید و پروسهٔ خرید شروع می‌شود.
        </p>

        <div className="mt-4">
          <ReceiptUpload orderId={orderId} onDone={() => setReceiptDone(true)} />
        </div>
        {!receiptDone && (
          <>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-navy/35">
              <span className="h-px flex-1 bg-navy/10" />
              یا
              <span className="h-px flex-1 bg-navy/10" />
            </div>
            <a
              href={`https://t.me/${telegramSupport}`}
              target="_blank"
              rel="noopener"
              className="btn-outline mt-3 w-full"
            >
              ارسال رسید در تلگرام
            </a>
          </>
        )}
        <p className="mt-4 rounded-lg bg-gold/8 px-3 py-2 text-center text-[11px] leading-5 text-navy/50">
          هزینهٔ ارسالِ داخلِ ایران (باربری تا تهران + پیک یا پستِ درِ منزل) پس از رسیدنِ سفارش به ایران محاسبه و جداگانه به شما اعلام می‌شود.
        </p>
      </div>
    );
  }

  return (
    <div className="card-soft relative overflow-hidden p-6 shadow-card">
      <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.1),transparent_65%)]" />
      <div className="relative mb-1 flex items-center gap-2.5 font-display text-lg font-semibold text-navy">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/12 text-gold">🛍</span>
        ثبت سفارش واسطه‌ای
      </div>
      <p className="relative mb-5 text-xs text-navy/50">لینک محصول از سایت برند ترکیه را بفرست تا برایت بخریم</p>

      <div className="relative space-y-3.5">
        <Field label="لینک محصول *">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.trendyol.com/..."
            dir="ltr"
            className="inp"
          />
        </Field>

        <Field label="قیمت محصول (لیر)">
          <input
            value={lir}
            onChange={(e) => setLir(e.target.value)}
            type="number"
            inputMode="decimal"
            placeholder="مثلاً: ۲۰۰"
            dir="ltr"
            className="inp"
          />
        </Field>

        {finalToman > 0 && (
          <div className="flex animate-fadeIn items-center justify-between rounded-xl border border-gold/20 bg-gold/5 px-4 py-3">
            <span className="text-sm text-navy/60">قیمت تومان نهایی</span>
            <span className="font-display text-lg font-bold text-gold tabular-nums">{formatToman(finalToman)}</span>
          </div>
        )}

        <Field label="سایز، رنگ و توضیحات">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            placeholder="مثلاً: سایز M، رنگ کرم"
            className="inp resize-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
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
      </div>

      <button onClick={submit} disabled={!canSubmit || status === "sending"} className="btn-gold mt-5 w-full disabled:opacity-50">
        {status === "sending" ? "در حال ثبت…" : "ثبت سفارش"}
      </button>
      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-500">خطا در ثبت. دوباره تلاش کن یا از تلگرام سفارش بده.</p>
      )}

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
