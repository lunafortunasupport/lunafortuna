import Link from "next/link";
import Logo from "./Logo";
import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const s = await getSettings();
  return (
    <footer className="mt-24 bg-navy text-cream">
      <div className="container-luna grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-7 text-cream/70">
            واسطهٔ مطمئن خرید از ترکیه برای ایران. تو فقط بگو چه می‌خواهی — خیالت راحت، بقیه‌اش با ما.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-champagne">دسترسی سریع</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            <li><Link href="/shop" className="hover:text-champagne">موجودی انبار</Link></li>
            <li><Link href="/brands" className="hover:text-champagne">برندها</Link></li>
            <li><Link href="/order" className="hover:text-champagne">ثبت سفارش</Link></li>
            <li><Link href="/guide" className="hover:text-champagne">راهنمای خرید</Link></li>
            <li><Link href="/about" className="hover:text-champagne">دربارهٔ ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-champagne">ارتباط با ما</h4>
          <ul className="space-y-2.5 text-sm text-cream/70">
            <li>
              <a href={`https://t.me/${s.telegramSupport}`} target="_blank" rel="noopener" className="hover:text-champagne">
                تلگرام: @{s.telegramSupport}
              </a>
            </li>
            <li>
              <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener" className="hover:text-champagne">
                اینستاگرام: {s.instagram}
              </a>
            </li>
            <li dir="ltr" className="text-right">
              <a href={`tel:${s.phone}`} className="hover:text-champagne">
                {s.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-luna flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <span>© {new Date().getFullYear()} LunaFortuna — تمام حقوق محفوظ است.</span>
          <span className="text-champagne">🌙 خیالت راحت، بقیه‌اش با ما</span>
        </div>
      </div>
    </footer>
  );
}
