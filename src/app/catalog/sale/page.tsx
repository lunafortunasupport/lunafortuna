import Link from "next/link";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { queryMirrorProducts } from "@/lib/trendyolCatalog";
import TrendyolDemoCard from "@/components/TrendyolDemoCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "تخفیف‌ها — پیش‌نمایشِ ترندیول" };

export default async function TrendyolSalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));
  const page = Number(sp.page) || 1;

  const { items, total, pageCount } = await queryMirrorProducts({ onSale: true, page }, perLirToman);

  const qs = (p: number) => (p > 1 ? `/catalog/sale?page=${p}` : "/catalog/sale");

  return (
    <div>
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-[#b8442f]/20" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#b8442f]/40 bg-[#b8442f]/15 px-3 py-1 text-[11px] tracking-widest text-[#ff9d84]">
            🏷️ تخفیف‌های امروز
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">تخفیف‌های امروزِ ترندیول</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            محصولاتی که همین حالا نسبت به قیمتِ اصلی‌شان تخفیف دارند — با آخرین سینکِ کاتالوگ.
          </p>
        </div>
      </div>

      <div className="container-luna py-10">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">🏷️</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">فعلاً تخفیفی ثبت نشده</h3>
            <p className="mt-1.5 text-[13px] text-navy/50">
              با اجرای بعدیِ رباتِ سینک، محصولاتِ تخفیف‌دار اینجا ظاهر می‌شوند.
            </p>
            <Link href="/catalog" className="btn-outline mt-5 inline-flex">
              مشاهدهٔ فروشگاه
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 text-[11.5px] text-navy/40">{total.toLocaleString("fa-IR")} محصولِ تخفیف‌دار</div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <TrendyolDemoCard key={p.id} product={p} perLirToman={perLirToman} cargoFeeEstimateTL={s.cargoFeeEstimateTL} cargoFeeEstimateMillaTL={s.cargoFeeEstimateMillaTL} />
              ))}
            </div>

            {pageCount > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="صفحه‌بندی">
                <PageLink href={qs(page - 1)} disabled={page <= 1}>
                  ← قبلی
                </PageLink>
                <span className="px-3 text-[12.5px] text-navy/50 tabular-nums">
                  صفحهٔ {page.toLocaleString("fa-IR")} از {pageCount.toLocaleString("fa-IR")}
                </span>
                <PageLink href={qs(page + 1)} disabled={page >= pageCount}>
                  بعدی →
                </PageLink>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PageLink({ href, disabled, children }: { href: string; disabled?: boolean; children: React.ReactNode }) {
  if (disabled) {
    return <span className="rounded-full border border-navy/8 px-4 py-2 text-[12.5px] text-navy/25">{children}</span>;
  }
  return (
    <Link
      href={href}
      className="rounded-full border border-navy/12 bg-white px-4 py-2 text-[12.5px] text-navy/70 transition-colors hover:border-gold/40 hover:text-gold"
    >
      {children}
    </Link>
  );
}
