// جداکنندهٔ ادیتوریال: خط‌کشِ طلاییِ محو + شمسهٔ کوچک در مرکز.
export default function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`container-luna ${className}`}>
      <div className="flex items-center gap-5 opacity-80">
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/45 to-transparent" />
        <svg width="22" height="22" viewBox="0 0 22 22" className="shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
          <circle cx="11" cy="11" r="3.6" />
          <path d="M11 1.5V6M11 16v4.5M1.5 11H6M16 11h4.5M4.6 4.6l2.5 2.5M14.9 14.9l2.5 2.5M17.4 4.6l-2.5 2.5M7.1 14.9l-2.5 2.5" />
          <circle cx="11" cy="11" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      </div>
    </div>
  );
}
