import Link from "next/link";
import Logo from "./Logo";
import Divider from "./Divider";
import { getSettings } from "@/lib/settings";

const TRUST = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 6.5V11c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6.5L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "تضمین اصالت کالا",
    desc: "مستقیم از سایت رسمی برند",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="6" width="19" height="13" rx="2" />
        <path d="M2.5 10.5h19M6.5 15h4" />
      </svg>
    ),
    title: "قیمت شفاف",
    desc: "قبل از خرید، تأیید صریح تو",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8V6a2 2 0 0 0-2-2H8L3 9v9a2 2 0 0 0 2 2h4" />
        <path d="M16 22v-4a2 2 0 0 1 2-2h4M22 22l-2.2-2.2" />
        <circle cx="18.5" cy="15.5" r="3.2" />
      </svg>
    ),
    title: "پیگیری سفارش",
    desc: "از خرید تا رسیدن به دستت",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v12H8l-4 4V4Z" />
        <path d="M8 9h8M8 12.5h5" />
      </svg>
    ),
    title: "پشتیبانی فارسی",
    desc: "پاسخ‌گو در تلگرام و اینستاگرام",
  },
];

const SocialIcons = {
  telegram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.5 3-19 7.6 6 2.2m13-9.8L15 19.5l-6.5-6.7m13-9.8-13 9.8" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
};

export default async function Footer() {
  const s = await getSettings();
  return (
    <footer className="reveal relative mt-24 overflow-hidden bg-navy text-cream">
      {/* المان‌های گرافیکیِ زمینه — همان زبانِ بصریِ سایر بخش‌های نیوی */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.12),transparent_65%)]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.08),transparent_65%)]" />
      </div>

      {/* نوارِ اعتماد */}
      <div className="relative border-b border-cream/10">
        <div className="container-luna grid grid-cols-2 gap-x-6 gap-y-7 py-10 sm:grid-cols-4">
          {TRUST.map((t, i) => (
            <div key={t.title} className="rise-up flex flex-col items-center gap-2.5 text-center sm:flex-row sm:items-start sm:text-right" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                <span className="h-[18px] w-[18px]">{t.icon}</span>
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-cream">{t.title}</span>
                <span className="mt-0.5 block text-[11.5px] leading-6 text-cream/50">{t.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-luna relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="rise-up">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-cream/60">
            واسطهٔ مطمئنِ خرید از ترکیه برای ایران. تو فقط بگو چه می‌خواهی — خیالت راحت، بقیه‌اش با ما.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={`https://t.me/${s.telegramSupport}`}
              target="_blank"
              rel="noopener"
              aria-label="تلگرام"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
            >
              <span className="h-4 w-4">{SocialIcons.telegram}</span>
            </a>
            <a
              href={`https://instagram.com/${s.instagram}`}
              target="_blank"
              rel="noopener"
              aria-label="اینستاگرام"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
            >
              <span className="h-4 w-4">{SocialIcons.instagram}</span>
            </a>
            <a
              href={`tel:${s.phone}`}
              aria-label="تماس تلفنی"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
            >
              <span className="h-4 w-4">{SocialIcons.phone}</span>
            </a>
          </div>
        </div>

        <div className="rise-up" style={{ transitionDelay: "80ms" }}>
          <h4 className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-champagne">
            <span className="h-px w-5 bg-champagne/50" />
            دسترسی سریع
          </h4>
          <ul className="space-y-3 text-[13.5px] text-cream/65">
            <li><Link href="/catalog" className="transition-colors hover:text-champagne">فروشگاهِ ترکیه</Link></li>
            <li><Link href="/brands" className="transition-colors hover:text-champagne">برندها</Link></li>
            <li><Link href="/order" className="transition-colors hover:text-champagne">ثبت سفارش</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-champagne">مجله</Link></li>
            <li><Link href="/guide" className="transition-colors hover:text-champagne">راهنمای خرید</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-champagne">دربارهٔ ما</Link></li>
          </ul>
        </div>

        <div className="rise-up" style={{ transitionDelay: "150ms" }}>
          <h4 className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-champagne">
            <span className="h-px w-5 bg-champagne/50" />
            ارتباط با ما
          </h4>
          <ul className="space-y-3 text-[13.5px] text-cream/65">
            <li>
              <a href={`https://t.me/${s.telegramSupport}`} target="_blank" rel="noopener" className="transition-colors hover:text-champagne">
                تلگرام: @{s.telegramSupport}
              </a>
            </li>
            <li>
              <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener" className="transition-colors hover:text-champagne">
                اینستاگرام: {s.instagram}
              </a>
            </li>
            <li dir="ltr" className="text-right">
              <a href={`tel:${s.phone}`} className="transition-colors hover:text-champagne">
                {s.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative">
        <Divider className="opacity-40" />
      </div>

      <div className="relative border-t border-cream/10">
        <div className="container-luna flex flex-col items-center justify-between gap-2 py-6 text-[11.5px] text-cream/45 sm:flex-row">
          <span>© {new Date().getFullYear()} LunaFortuna — تمام حقوق محفوظ است.</span>
          <span className="tracking-wide text-champagne/80">🌙 خیالت راحت، بقیه‌اش با ما</span>
        </div>
      </div>
    </footer>
  );
}
