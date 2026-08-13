import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "ورود / ثبت‌نام" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="grid min-h-[calc(100vh-74px)] md:grid-cols-2">
      {/* بندِ عکسِ ادیتوریال — فقط دسکتاپ */}
      <div className="relative hidden overflow-hidden bg-navy md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/quiet-luxury.jpg" alt="" className="kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
        <svg
          viewBox="0 0 200 200"
          className="animate-spinSlow pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 text-gold/[0.14]"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="46" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 46 * Math.cos(a), y1 = 100 + 46 * Math.sin(a);
            const x2 = 100 + 70 * Math.cos(a), y2 = 100 + 70 * Math.sin(a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
        <div className="reveal relative flex h-full flex-col justify-end p-10">
          <div className="rise-up inline-flex w-fit items-center gap-2.5 rounded-full border border-gold/35 bg-navy/30 py-1.5 pr-1.5 pl-4 text-[12px] tracking-[0.2em] text-champagne backdrop-blur-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-[11px]">✦</span>
            لونافورتونا
          </div>
          <h2 className="rise-up mt-5 max-w-sm font-display text-[clamp(24px,3vw,34px)] font-black leading-[1.25] text-cream" style={{ transitionDelay: "70ms" }}>
            تو فقط بگو چه می‌خواهی — خیالت راحت، بقیه‌اش با ما
          </h2>
        </div>
      </div>

      {/* فرم */}
      <div className="flex items-center justify-center bg-cream px-5 py-16">
        <div className="w-full max-w-sm">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
