"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
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

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">{error}</div>}

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
