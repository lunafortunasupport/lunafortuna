"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const SUGGESTIONS = [
  "یه برند مناسبِ کیفِ زنانه پیشنهاد بده",
  "بین دو محصول شک دارم، کمکم کن مقایسه کنم",
  "وضعیتِ سفارشم رو چک کن",
  "با پشتیبانیِ انسانی صحبت کنم",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function submit(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <>
      {/* دکمهٔ شناور */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="دستیارِ لونا"
        className="fixed bottom-[92px] left-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-champagne text-cream shadow-[0_10px_28px_rgba(154,122,67,0.45)] transition-transform hover:scale-105 active:scale-95 lg:bottom-6"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <span className="relative">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.4-.7L3 21l1.9-4.2A8.4 8.4 0 1 1 21 11.5Z" />
            </svg>
            <span className="absolute -left-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-navy ring-2 ring-cream" />
          </span>
        )}
      </button>

      {/* پنل چت */}
      {open && (
        <div className="fixed inset-0 z-[59] flex flex-col bg-cream sm:inset-auto sm:bottom-[164px] sm:left-5 sm:h-[560px] sm:w-[380px] sm:rounded-3xl sm:shadow-[0_24px_70px_rgba(21,35,73,0.28)] sm:ring-1 sm:ring-navy/10 lg:bottom-[86px]">
          {/* هدر */}
          <div className="relative flex shrink-0 items-center gap-3 overflow-hidden bg-navy px-5 py-4 text-cream sm:rounded-t-3xl">
            <span className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.18),transparent_65%)]" />
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-lg">
              🌙
            </span>
            <div className="relative min-w-0 flex-1">
              <div className="font-display text-[15px] font-semibold">دستیارِ لونا</div>
              <div className="flex items-center gap-1.5 text-[11px] text-cream/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                همیشه پاسخ‌گو
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="بستن"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          {/* پیام‌ها */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="rounded-2xl bg-white px-4 py-3 text-[13px] leading-6 text-navy/70 shadow-sm">
                  سلام 🌙 من دستیارِ لوناام. می‌توانم توی انتخابِ برند، مقایسهٔ محصول، پیگیریِ سفارش یا وصل‌شدن به
                  پشتیبانی کمکت کنم. چی می‌خواهی؟
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1.5 text-[12px] text-navy/70 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("");
              if (!text) return null;
              const mine = m.role === "user";
              return (
                <div key={m.id} className={`flex items-end gap-2 ${mine ? "justify-start flex-row-reverse" : "justify-start"}`}>
                  {!mine && (
                    <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy/10 text-[11px]">
                      🌙
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[13px] leading-7 ${
                      mine ? "bg-gradient-to-br from-gold to-champagne text-white" : "bg-white text-navy/80 shadow-sm"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="flex items-end gap-2">
                <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy/10 text-[11px]">🌙</span>
                <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/30 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/30 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/30 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-end gap-2">
                <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-[11px]">⚠️</span>
                <div className="max-w-[80%] rounded-2xl bg-red-50 px-4 py-2.5 text-[13px] leading-6 text-red-600">
                  یه مشکلِ موقت پیش اومد.{" "}
                  <button onClick={() => regenerate()} className="font-medium underline underline-offset-2">
                    دوباره تلاش کن
                  </button>{" "}
                  یا از تلگرام با پشتیبانی صحبت کن.
                </div>
              </div>
            )}
          </div>

          {/* ورودی */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex shrink-0 items-center gap-2 border-t border-navy/8 bg-white p-3 sm:rounded-b-3xl"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سؤالت رو بنویس…"
              disabled={busy}
              className="min-w-0 flex-1 rounded-xl border border-navy/12 bg-cream/50 px-3.5 py-2.5 text-[13px] outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(154,122,67,0.12)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="ارسال"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 -scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
