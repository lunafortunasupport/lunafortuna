import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { getMirrorProduct, parseImages, parseAttributes } from "@/lib/trendyolCatalog";
import TrendyolDetail from "@/components/TrendyolDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getMirrorProduct(id);
  return { title: product ? product.nameFa || product.nameTr : "محصول یافت نشد" };
}

export default async function TrendyolProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getMirrorProduct(id);
  if (!product) notFound();

  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  return (
    <div className="container-luna py-10">
      <Link
        href="/preview/trendyol"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-navy/50 transition-colors hover:text-gold"
      >
        ← بازگشت به کاتالوگ
      </Link>
      <TrendyolDetail
        product={product}
        images={parseImages(product.images)}
        attributes={parseAttributes(product.attributes)}
        perLirToman={perLirToman}
        cargoFeeEstimateTL={s.cargoFeeEstimateTL}
      />
    </div>
  );
}
