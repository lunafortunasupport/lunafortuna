"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GOOGLE_ERRORS: Record<string, string> = {
  google_not_configured: "ورود با گوگل هنوز فعال نشده است.",
  google_cancelled: "ورود با گوگل لغو شد.",
  google_state: "نشست ورود منقضی شد؛ دوباره تلاش کن.",
  google_token: "ارتباط با گوگل ناموفق بود؛ دوباره تلاش کن.",
  google_email: "ایمیل گوگل تأیید نشده است.",
};

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = GOOGLE_ERRORS[searchParams.get("error") || ""] || "";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referral, setReferral] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestCode() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setStep("code");
      else setError(data.error || "خطا");
    } catch {
      setError("خطای شبکه");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, name, referral }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/account");
        router.refresh();
      } else setError(data.error || "کد اشتباه است");
    } catch {
      setError("خطای شبکه");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-soft p-7">
      <div className="mb-6 text-center">
        <div className="font-display text-2xl font-semibold text-navy">ورود به حساب</div>
        <p className="mt-1 text-sm text-navy/50">
          {step === "email" ? "با ایمیلت وارد شو یا حساب بساز" : `کد ارسال‌شده به ${email} را وارد کن`}
        </p>
      </div>

      {(error || urlError) && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">
          {error || urlError}
        </div>
      )}

      {/* ورود با گوگل */}
      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold hover:bg-gold/5"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.4 35.6 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        ورود با حساب گوگل
      </a>

      <div className="my-4 flex items-center gap-3 text-[11px] text-navy/35">
        <span className="h-px flex-1 bg-navy/10" />
        یا با ایمیل
        <span className="h-px flex-1 bg-navy/10" />
      </div>

      {step === "email" ? (
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل (Gmail)"
            dir="ltr"
            className="inp"
            onKeyDown={(e) => e.key === "Enter" && requestCode()}
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام (اختیاری، برای ثبت‌نام)"
            className="inp"
          />
          <input
            value={referral}
            onChange={(e) => setReferral(e.target.value.toUpperCase())}
            placeholder="کد معرف (اختیاری)"
            dir="ltr"
            className="inp"
          />
          <button onClick={requestCode} disabled={loading || !email} className="btn-gold w-full disabled:opacity-50">
            {loading ? "در حال ارسال…" : "ارسال کد فعال‌سازی"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="کد ۶ رقمی"
            dir="ltr"
            inputMode="numeric"
            className="inp text-center text-lg tracking-[0.5em]"
            onKeyDown={(e) => e.key === "Enter" && verify()}
          />
          <button onClick={verify} disabled={loading || code.length < 6} className="btn-gold w-full disabled:opacity-50">
            {loading ? "در حال بررسی…" : "ورود"}
          </button>
          <button onClick={() => setStep("email")} className="w-full text-center text-[13px] text-navy/50 hover:text-gold">
            ← تغییر ایمیل
          </button>
        </div>
      )}

      <p className="mt-5 text-center text-[11px] text-navy/40">
        ورود با شماره موبایل ایران به‌زودی اضافه می‌شود.
      </p>

      <style jsx>{`
        :global(.inp) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(21, 35, 73, 0.15);
          background: #fff;
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.inp:focus) {
          border-color: #9a7a43;
        }
      `}</style>
    </div>
  );
}
