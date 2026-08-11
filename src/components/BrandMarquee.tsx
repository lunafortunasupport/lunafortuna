interface MarqueeBrand {
  slug: string;
  name: string;
  logoUrl: string | null;
}

// نوارِ مارکیِ بی‌نهایتِ برندها — اثباتِ اجتماعیِ باوقار (لوگو خاکستری، با hover رنگی).
export default function BrandMarquee({ brands }: { brands: MarqueeBrand[] }) {
  const list = brands.filter((b) => b.logoUrl).slice(0, 24);
  if (list.length < 6) return null;
  const track = [...list, ...list]; // تکرار برای حلقهٔ بی‌درز

  return (
    <div
      className="group overflow-hidden border-y border-navy/8 bg-cream py-7"
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
      aria-label="برندهای معتبر ترکیه"
    >
      <div className="flex w-max items-center gap-12 animate-marquee group-hover:[animation-play-state:paused]">
        {track.map((b, i) => (
          <div key={`${b.slug}-${i}`} className="flex shrink-0 items-center gap-2.5 opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0">
            {b.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logoUrl} alt="" className="h-7 w-7 object-contain" loading="lazy" />
            )}
            <span className="whitespace-nowrap font-display text-lg font-bold text-navy/70">{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
