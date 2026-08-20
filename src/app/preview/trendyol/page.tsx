import Link from "next/link";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { queryMirrorProducts, getFacets, type PriceBucket, type SortOption } from "@/lib/trendyolCatalog";
import TrendyolDemoCard from "@/components/TrendyolDemoCard";
import TrendyolFilters from "@/components/TrendyolFilters";

export const dynamic = "force-dynamic";
export const metadata = { title: "پیش‌نمایشِ فنی — کاتالوگِ ترندیول" };

const VALID_SORTS: SortOption[] = ["popular", "price_asc", "price_desc", "new"];
const VALID_BUCKETS: PriceBucket[] = ["under1", "1to3", "3to6", "over6"];

export default async function TrendyolPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  const filters = {
    q: sp.q || undefined,
    category: sp.cat || undefined,
    brand: sp.brand || undefined,
    size: sp.size || undefined,
    price: VALID_BUCKETS.includes(sp.price as PriceBucket) ? (sp.price as PriceBucket) : undefined,
    sort: VALID_SORTS.includes(sp.sort as SortOption) ? (sp.sort as SortOption) : undefined,
    page: Number(sp.page) || 1,
  };

  const [{ items, total, page, pageCount }, facets] = await Promise.all([
    queryMirrorProducts(filters, perLirToman),
    getFacets(),
  ]);

  const qs = (p: number) => {
    const next = new URLSearchParams();
    if (filters.q) next.set("q", filters.q);
    if (filters.category) next.set("cat", filters.category);
    if (filters.brand) next.set("brand", filters.brand);
    if (filters.size) next.set("size", filters.size);
    if (filters.price) next.set("price", filters.price);
    if (filters.sort) next.set("sort", filters.sort);
    if (p > 1) next.set("page", String(p));
    const s = next.toString();
    return s ? `/preview/trendyol?${s}` : "/preview/trendyol";
  };

  return (
    <div>
      {/* هدر/معرفی */}
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy text-cream">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 top-1/2 h-80 w-80 -translate-y-1/2 animate-spinSlow rounded-full border border-gold/15" />
          <div className="absolute -right-4 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,106,0.14),transparent_62%)]" />
        </div>
        <div className="container-luna relative py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] tracking-widest text-champagne">
            🧪 پیش‌نمایشِ فنی
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold md:text-4xl">کاتالوگِ ترندیول، به فارسی و تومان</h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-7 text-cream/70">
            این صفحه برای بررسیِ داخلی است (از منو لینک نشده). محصولات یک <b className="text-champagne">عکسِ‌لحظه‌ایِ واقعی</b>{" "}
            از ترندیول‌اند (نه ساختگی) و هر ۱۲ ساعت به‌روزرسانی می‌شوند — قیمت با نرخِ روز به تومان، به‌علاوهٔ برآوردِ
            هزینهٔ کارگوی داخلِ ترکیه وقتی رایگان نباشد. سرچ کن، فیلتر کن، سایز را انتخاب و به سبد اضافه کن.
          </p>
        </div>
      </div>

      <TrendyolFilters facets={facets} total={total} />

      <div className="container-luna py-10">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-navy/8 bg-white py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/5 text-2xl">🔍</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy">چیزی با این فیلترها پیدا نشد</h3>
            <p className="mt-1.5 text-[13px] text-navy/50">فیلترها را کم‌تر کن یا کلیدواژهٔ دیگری امتحان کن.</p>
            <Link href="/preview/trendyol" className="btn-outline mt-5 inline-flex">
              پاک‌کردنِ فیلترها
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <TrendyolDemoCard key={p.id} product={p} perLirToman={perLirToman} cargoFeeEstimateTL={s.cargoFeeEstimateTL} />
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
