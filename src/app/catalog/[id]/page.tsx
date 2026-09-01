import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, feesFromSettings } from "@/lib/settings";
import { getMirrorProduct, parseImages, parseAttributes } from "@/lib/trendyolCatalog";
import TrendyolDetail from "@/components/TrendyolDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getMirrorProduct(id);
  if (!product) return { title: "محصول یافت نشد" };
  const name = product.nameFa || product.nameTr;
  const imgs = parseImages(product.images);
  const desc = product.descriptionFa || `${name} از ${product.brand} — خرید از ترکیه با قیمتِ شفاف به تومان.`;
  return {
    title: name,
    description: desc,
    alternates: { canonical: `/catalog/${id}` },
    openGraph: { type: "website", title: name, description: desc, images: imgs.length ? [imgs[0]] : undefined },
  };
}

export default async function TrendyolProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getMirrorProduct(id);
  if (!product) notFound();

  const s = await getSettings();
  const fees = feesFromSettings(s);
  const perLirToman = Math.round(s.exchangeRate * (1 + fees.normal));

  // ── دادهٔ ساختاریِ محصول (Product JSON-LD) برای نتایجِ غنیِ گوگل ──
  const imgs = parseImages(product.images);
  const priceToman = product.minPriceTL != null ? Math.round(product.minPriceTL * perLirToman) : null;
  const inStock = product.variants.some((v) => v.inStock);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameFa || product.nameTr,
    image: imgs.length ? imgs : undefined,
    description: product.descriptionFa || undefined,
    brand: { "@type": "Brand", name: product.brand },
    sku: String(product.sourceId),
    ...(priceToman != null && {
      offers: {
        "@type": "Offer",
        url: `https://lunafortuna.store/catalog/${id}`,
        priceCurrency: "IRR", // قیمت به ریال (تومان × ۱۰) — واحدِ ISO؛ نمایشِ سایت به تومان است.
        price: priceToman * 10,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    }),
  };

  return (
    <div className="container-luna py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <Link
        href="/catalog"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-navy/50 transition-colors hover:text-gold"
      >
        ← بازگشت به فروشگاه
      </Link>
      <TrendyolDetail
        product={product}
        images={parseImages(product.images)}
        attributes={parseAttributes(product.attributes)}
        perLirToman={perLirToman}
        cargoFeeEstimateTL={s.cargoFeeEstimateTL}
        cargoFeeEstimateMillaTL={s.cargoFeeEstimateMillaTL}
      />
    </div>
  );
}
