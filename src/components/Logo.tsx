import Link from "next/link";

export default function Logo({
  light = false,
  showText = true,
  size = 44,
  href = "/",
}: {
  light?: boolean;
  showText?: boolean;
  size?: number;
  href?: string | null;
}) {
  const inner = (
    <span className="flex items-center gap-2.5">
      {light ? (
        // روی زمینهٔ تیره: لوگو به‌صورت ماسک با گرادیان روشن (بدون پس‌زمینه)
        <span
          className="inline-block shrink-0"
          style={{
            width: size,
            height: size,
            WebkitMaskImage: "url(/logo.png)",
            maskImage: "url(/logo.png)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            background: "linear-gradient(135deg, #F5F1E8 0%, #C9A96A 60%, #9A7A43 100%)",
          }}
          aria-label="LunaFortuna"
        />
      ) : (
        <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="LunaFortuna" className="h-full w-full object-contain" />
        </span>
      )}
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-lg font-semibold tracking-[0.28em] ${light ? "text-cream" : "text-navy"}`}>
            LUNA
          </span>
          <span className="mt-0.5 text-[9px] tracking-[0.24em] text-gold">FORTUNA</span>
        </span>
      )}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="LunaFortuna">
      {inner}
    </Link>
  );
}
