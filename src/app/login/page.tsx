import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "ورود / ثبت‌نام" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="relative flex min-h-[calc(100vh-74px)] items-center justify-center overflow-hidden bg-navy px-5 py-16">
      {/* عکسِ تمام‌عرض */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/quiet-luxury.jpg" alt="" className="kenburns absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/55 to-navy/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201,169,106,0.12),transparent_60%)]" />

      {/* شمسهٔ بزرگِ چرخانِ محو، پشتِ کارت */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spinSlow pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 text-gold/[0.08]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
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

      {/* ذره‌های طلاییِ شناور — حسِ لوکسِ اضافه */}
      <span
        className="animate-float pointer-events-none absolute right-[18%] top-[22%] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.28),transparent_70%)] blur-md"
        style={{ animationDuration: "8s" }}
      />
      <span
        className="animate-float pointer-events-none absolute left-[15%] bottom-[20%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.2),transparent_70%)] blur-md"
        style={{ animationDuration: "10s", animationDelay: "1.5s" }}
      />
      <span
        className="animate-float pointer-events-none absolute left-[22%] top-[18%] h-14 w-14 rounded-full bg-[radial-gradient(circle,rgba(245,241,232,0.18),transparent_70%)] blur-sm"
        style={{ animationDuration: "6.5s", animationDelay: "0.8s" }}
      />

      <div className="reveal relative w-full max-w-sm">
        <div className="rise-up mb-7 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-2xl backdrop-blur-sm">
            🌙
          </span>
          <div className="mt-4 font-display text-lg font-semibold tracking-[0.15em] text-cream">لونافورتونا</div>
          <p className="mt-1.5 max-w-[19rem] text-[12.5px] leading-6 text-cream/60">
            تو فقط بگو چه می‌خواهی — خیالت راحت، بقیه‌اش با ما
          </p>
        </div>

        <div className="rise-up" style={{ transitionDelay: "90ms" }}>
          <AuthForm glass />
        </div>
      </div>
    </div>
  );
}
