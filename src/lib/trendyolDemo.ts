// پیش‌نمایشِ فنی: گرفتنِ دادهٔ زنده از صفحهٔ محصولِ ترندیول (سرور-رندر، بدونِ نیاز به مرورگر)
// این فایل فقط برای دموی /preview/trendyol است — پایپ‌لاینِ نهایی (کش، صف، دیتابیس) بعداً طراحی می‌شود.

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** استخراجِ بلوکِ JSONِ بعد از `window["key"]=` با شمارشِ متعادلِ آکولاد (امن‌تر از regex). */
function extractWindowJson(html: string, key: string): any | null {
  const marker = `window["${key}"]=`;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  let i = idx + marker.length;
  if (html[i] !== "{") return null;
  const start = i;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  let esc = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inStr = true;
      strCh = c;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  try {
    return JSON.parse(html.slice(start, i));
  } catch {
    return null;
  }
}

export interface TrendyolVariant {
  size: string;
  inStock: boolean;
  priceTL: number | null;
}

export interface TrendyolAttribute {
  labelFa: string;
  valueFa: string;
}

export interface TrendyolProduct {
  id: number;
  name: string;
  /** نامِ فارسیِ خوانا برای نمایش در صفحهٔ جزئیات/سبد؛ اگر نبود از `name` (ترکی) استفاده می‌شود. */
  nameFa?: string;
  brand: string;
  category: string;
  image: string | null;
  /** گالریِ چندعکسی برای صفحهٔ جزئیات؛ اگر نبود همان `image` تنها عکس است. */
  images?: string[];
  /** ویژگی‌های محصول (جنس، رنگ، قالب…) به فارسی — دستی از دادهٔ واقعیِ ترندیول برگردانده شده. */
  attributes?: TrendyolAttribute[];
  descriptionFa?: string;
  sourceUrl: string;
  variants: TrendyolVariant[];
  minPriceTL: number | null;
}

export async function fetchTrendyolProduct(url: string): Promise<TrendyolProduct | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "tr-TR,tr;q=0.9" },
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const shared = extractWindowJson(html, "__envoy__SHARED_PROPS");
    const p = shared?.product;
    if (!p) return null;

    const variants: TrendyolVariant[] = (p.variants || []).map((v: any) => ({
      size: v.beautifiedValue || v.value || "",
      inStock: !!v.inStock,
      priceTL: typeof v.price?.value === "number" ? v.price.value : null,
    }));
    const prices = variants.map((v) => v.priceTL).filter((n): n is number => n != null);

    return {
      id: p.id,
      name: p.name || "",
      brand: p.brand?.name || "",
      category: p.category?.name || p.webCategory?.name || "",
      image: Array.isArray(p.images) ? p.images[0] || null : null,
      sourceUrl: url,
      variants,
      minPriceTL: prices.length ? Math.min(...prices) : null,
    };
  } catch {
    return null;
  }
}

export async function fetchTrendyolProducts(urls: string[]): Promise<TrendyolProduct[]> {
  const results = await Promise.all(urls.map((u) => fetchTrendyolProduct(u)));
  return results.filter((p): p is TrendyolProduct => p !== null);
}

// ── یافتهٔ مهم (باید در گزارش به کاربر بیاید) ──
// fetchTrendyolProduct بالا تئوری درست است (HTMLِ سرور-رندرشده واقعاً شاملِ JSONِ کامل است)
// ولی در عمل با fetchِ خودِ Node (که Vercel/Next.js هم همین را زیرِ لایه استفاده می‌کند) با ۴۰۳
// مسدود می‌شود — حتی با User-Agentِ درست. تستِ curl با همان هدرها موفق بود (۲۰۰)، یعنی مسدودسازی
// روی امضای TLS/HTTP2 (JA3/JA4) است، نه روی User-Agent. یعنی برای تولیدِ واقعی به مرورگرِ واقعی
// (Playwright، دقیقاً مثلِ ربات‌های audit-brand-links-browser.mjs / check-sales.mjs که از قبل داریم)
// نیاز داریم، نه fetchِ سبک. این خودِ تابعِ بالا برای مستندسازی نگه داشته شده؛ دموی فعلی از یک
// عکسِ‌لحظه‌ای real (نه ساختگی) که با همان تکنیکِ مرورگرِ واقعی گرفته شده استفاده می‌کند.
//
// دربارهٔ «ترندیول میلا»: جست‌وجو کردیم و به‌عنوانِ یک برندِ قابل‌خرید در نتایجِ جست‌وجو پیدا نشد —
// در دادهٔ خودِ ترندیول یک پرچمِ `isTrendyolMilla` دیدیم که به‌نظر مربوط به یک ویژگیِ دیگر (شاید
// دستیارِ سایز/فیت) است، نه یک برندِ فروشیِ مستقل. باید با کاربر چک شود دقیقاً منظورش چیست.
export const SNAPSHOT_PRODUCTS: TrendyolProduct[] = [
  {
    id: 905066889,
    name: "Kadın Beyaz Uzun Kollu Basic Gömlek 50324791-VR013",
    nameFa: "پیراهنِ سفیدِ ساده، آستین‌بلند (بیسیک)",
    brand: "U.S. Polo Assn.",
    category: "Gömlek",
    image: "https://cdn.dsmcdn.com/ty1939/prod/QC_ENRICHMENT/20260730/21/63eaefc5-0056-3282-8b7a-5954c1b8cdab/1_org_zoom.jpg",
    images: [
      "https://cdn.dsmcdn.com/ty1939/prod/QC_ENRICHMENT/20260730/21/63eaefc5-0056-3282-8b7a-5954c1b8cdab/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1930/prod/QC_ENRICHMENT/20260730/21/f9e31e88-d19b-3efd-9462-fa26f9a328d0/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1933/prod/QC_ENRICHMENT/20260730/21/25db9a76-6a53-3945-bc4e-2ed821f1b5d4/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1931/prod/QC_ENRICHMENT/20260730/21/c439ef91-c5c5-37f2-afe0-db6db9ef9aad/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1909/prod/QC_ENRICHMENT/20260730/21/090bdbc5-bb8c-3233-b131-6f1622519a25/1_org_zoom.jpg",
    ],
    descriptionFa:
      "پیراهنِ کلاسیکِ سفید با یقهٔ پیراهنی و آستینِ بلند، دکمه‌دار و بدونِ طرح — ساده و همیشه‌کاربردی، مناسبِ پوششِ روزمره یا اداری.",
    attributes: [
      { labelFa: "رنگ", valueFa: "سفید" },
      { labelFa: "جنس", valueFa: "پارچه‌ای (۶۰٪ نخ، ۴۰٪ پلی‌استر)" },
      { labelFa: "نوعِ یقه", valueFa: "یقهٔ پیراهنی" },
      { labelFa: "نوعِ آستین", valueFa: "آستینِ بلند" },
      { labelFa: "نوعِ بستن", valueFa: "دکمه‌دار" },
      { labelFa: "طرح", valueFa: "ساده، بدونِ چاپ" },
      { labelFa: "کالکشن", valueFa: "بیسیک" },
      { labelFa: "فصل", valueFa: "همهٔ فصل‌ها" },
      { labelFa: "کشورِ سازنده", valueFa: "ترکیه" },
    ],
    sourceUrl:
      "https://www.trendyol.com/u-s-polo-assn/kadin-beyaz-uzun-kollu-basic-gomlek-50324791-vr013-p-905066889?boutiqueId=61&merchantId=163",
    variants: [
      { size: "32", inStock: false, priceTL: 1500 },
      { size: "34", inStock: true, priceTL: 1273 },
      { size: "36", inStock: true, priceTL: 1329.05 },
      { size: "38", inStock: true, priceTL: 1281.55 },
      { size: "40", inStock: true, priceTL: 1258.75 },
      { size: "42", inStock: true, priceTL: 1258.75 },
      { size: "44", inStock: true, priceTL: 719.98 },
      { size: "46", inStock: true, priceTL: 719.98 },
    ],
    minPriceTL: 719.98,
  },
  {
    id: 888523389,
    name: "Yanları ve Önü Cep Detaylı Vizon Kadın Sırt Çantası",
    brand: "BAGLOVİS",
    category: "Sırt Çantası",
    image:
      "https://cdn.dsmcdn.com/ty1821/prod/QC_ENRICHMENT/20260209/18/87038b48-8182-338f-af58-6c0cdf60ce2c/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/baglovis/yanlari-ve-onu-cep-detayli-vizon-kadin-sirt-cantasi-p-888523389?boutiqueId=61&merchantId=1057503",
    variants: [{ size: "استاندارد", inStock: true, priceTL: 589 }],
    minPriceTL: 589,
  },
  {
    id: 1073625919,
    name: "Kadın Çanta Kapitone Desen Siyah Sırt ve Omuz Çantası",
    brand: "Gebiç",
    category: "Sırt Çantası",
    image:
      "https://cdn.dsmcdn.com/ty1801/prod/QC_PREP/20251219/00/0518ea1a-015b-3722-bcbc-0098c9695c83/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/gebic/kadin-canta-kapitone-desen-siyah-sirt-ve-omuz-cantasi-p-1073625919?boutiqueId=61&merchantId=860877",
    variants: [{ size: "استاندارد", inStock: true, priceTL: 739.99 }],
    minPriceTL: 739.99,
  },
  {
    id: 206686187,
    name: "Kadın Kapitone Sırt Çantası Siyah",
    brand: "macharelbasic",
    category: "Sırt Çantası",
    image:
      "https://cdn.dsmcdn.com/ty1452/product/media/images/prod/QC/20240801/15/781bac05-a372-3bb4-88ec-d86cd7a5ec50/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/macharelbasic/kadin-kapitone-sirt-cantasi-siyah-p-206686187?boutiqueId=61&merchantId=792345",
    variants: [{ size: "استاندارد", inStock: true, priceTL: 479.2 }],
    minPriceTL: 479.2,
  },
  {
    id: 928058445,
    name: "Yumuşak Deri Orta Boy Kadın Sırt Çantası",
    brand: "Buldug",
    category: "Sırt Çantası",
    image:
      "https://cdn.dsmcdn.com/ty1791/prod/QC_ENRICHMENT/20251121/12/ee5d9d6f-037b-3b16-ac2f-ba2f2c9c90a0/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/buldug/yumusak-deri-orta-boy-kadin-sirt-cantasi-genis-hacim-cok-gozlu-tablet-uyumlu-p-928058445?boutiqueId=61&merchantId=809607",
    variants: [{ size: "استاندارد", inStock: false, priceTL: 1099 }],
    minPriceTL: 1099,
  },
  {
    id: 1157324887,
    name: "Kadın Halter Yaka Sıfır Kol Bol Paça Cepli Siyah Tulum",
    brand: "Diemmood",
    category: "Tulum",
    image:
      "https://cdn.dsmcdn.com/ty1908/prod/QC_PREP/20260617/09/d13805ad-8557-3355-9c00-8578fdbaf920/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/diemmood/kadin-halter-yaka-sifir-kol-bol-paca-cepli-siyah-tulum-p-1157324887?boutiqueId=61&merchantId=1253836",
    variants: [
      { size: "S", inStock: true, priceTL: 2149 },
      { size: "M", inStock: true, priceTL: 2149 },
      { size: "L", inStock: true, priceTL: 2149 },
    ],
    minPriceTL: 2149,
  },
  {
    id: 929273674,
    name: "Bordo Halter Yaka Uzun Tulum",
    brand: "ESRAHELVACI",
    category: "Tulum",
    image:
      "https://cdn.dsmcdn.com/ty1902/prod/QC_ENRICHMENT/20260810/13/847ea73d-6a58-3a22-870f-febc88ebd4c8/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/esrahelvaci/bordo-halter-yaka-uzun-tulum-p-929273674?boutiqueId=61&merchantId=267844",
    variants: [
      { size: "S", inStock: true, priceTL: 1996 },
      { size: "M", inStock: true, priceTL: 1996 },
      { size: "L", inStock: false, priceTL: 1996 },
    ],
    minPriceTL: 1996,
  },
  {
    id: 379979439,
    name: "Siyah Krep Kumaş Askılı Kruvaze Yaka Abiye Tulum",
    brand: "ORZUQLIFE",
    category: "Tulum",
    image:
      "https://cdn.dsmcdn.com/ty1255/product/media/images/prod/SPM/PIM/20240413/13/1d4cbfe1-da4f-33a5-b4c2-861e2843ff84/1_org_zoom.jpg",
    sourceUrl:
      "https://www.trendyol.com/orzuqlife/siyah-krep-kumas-askili-kruvaze-yaka-abiye-tulum-p-379979439?boutiqueId=61&merchantId=1239778",
    variants: [
      { size: "S", inStock: true, priceTL: 990 },
      { size: "M", inStock: true, priceTL: 990 },
      { size: "L", inStock: true, priceTL: 990 },
    ],
    minPriceTL: 990,
  },
  // ── برندِ اختصاصیِ خودِ ترندیول («TRENDYOLMİLLA») — کاربر خواست اولویت داشته باشد.
  // این برند از سایتِ جدایش (trendyol-milla.com) گرفته شده، نه از trendyol.com.
  {
    id: 1101590393,
    name: "Yeşil Oversize İnce Dökümlü Dokuma Bluz TWOSS26BZ00653",
    nameFa: "بلوزِ سبزِ اورسایز، بافتِ نازک و دورریز",
    brand: "TRENDYOLMİLLA",
    category: "Bluz",
    image:
      "https://cdn.dsmcdn.com/ty1000396/product/media/images/prod/PIM/20260508/09/725840a1-7ac9-416b-a192-d2ae56d43211/1_org_zoom.jpg",
    images: [
      "https://cdn.dsmcdn.com/ty1000396/product/media/images/prod/PIM/20260508/09/725840a1-7ac9-416b-a192-d2ae56d43211/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1000395/product/media/images/prod/PIM/20260508/09/736c2782-37ba-4d57-b76d-7566d7d380a5/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1000395/product/media/images/prod/PIM/20260508/09/a20b7e7d-609b-41ec-b36b-8984339130d2/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1000395/product/media/images/prod/PIM/20260508/09/41ea5a2d-41ff-4aaa-b51a-373be5c77b99/1_org_zoom.jpg",
    ],
    descriptionFa:
      "بلوزی اورسایزِ سبک با یقه‌گرد و آستینِ خفاشی، از پارچهٔ بافتهٔ نخیِ نازک — برای پوششِ روزمرهٔ راحت و خنک.",
    attributes: [
      { labelFa: "رنگ", valueFa: "سبز" },
      { labelFa: "جنس", valueFa: "نخی (۸۷٪ نخ، ۱۳٪ پلی‌آمید)" },
      { labelFa: "قالب", valueFa: "اورسایز" },
      { labelFa: "نوعِ یقه", valueFa: "یقه‌گرد (بیسیکل)" },
      { labelFa: "نوعِ آستین", valueFa: "آستینِ خفاشیِ بلند" },
      { labelFa: "نوعِ پارچه", valueFa: "بافتهٔ نازک (ووال)" },
      { labelFa: "طرح", valueFa: "ساده" },
      { labelFa: "فصل", valueFa: "بهار / پاییز" },
      { labelFa: "کشورِ سازنده", valueFa: "ترکیه" },
    ],
    sourceUrl:
      "https://www.trendyol-milla.com/trendyolmilla/yesil-oversize-ince-dokumlu-dokuma-bluz-twoss26bz00653-p-1101590393?boutiqueId=651724&merchantId=968",
    variants: [{ size: "استاندارد", inStock: true, priceTL: 819.99 }],
    minPriceTL: 819.99,
  },
  {
    id: 938914429,
    name: "Siyah Saten Degaje Party Bluz TPRAW26BZ00003",
    nameFa: "بلوزِ ساتنِ مشکی، یقه‌هالتر (مخصوصِ مهمانی)",
    brand: "TRENDYOLMİLLA",
    category: "Bluz",
    image:
      "https://cdn.dsmcdn.com/ty1714/prod/PLM/20250725/2018925/2025904/2043850/52eb82a3-42c1-445c-b156-7977b44a5b7c/0_org_zoom.jpg",
    images: [
      "https://cdn.dsmcdn.com/ty1714/prod/PLM/20250725/2018925/2025904/2043850/52eb82a3-42c1-445c-b156-7977b44a5b7c/0_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1713/prod/PLM/20250725/2018925/2025904/2043850/a71df5d1-af38-4611-8a35-7a6ebceaa564/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1715/prod/PLM/20250725/2018925/2025904/2043850/afc38165-c740-402e-8f24-dda62bacfd31/2_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1715/prod/PLM/20250725/2018925/2025904/2043850/7e64b065-fd6f-404b-be13-6be802d41cf9/3_org_zoom.jpg",
    ],
    descriptionFa:
      "بلوزی شیک از ساتنِ مشکیِ خالدار با یقه‌هالتر و بدونِ آستین — انتخابی مناسب برای مهمانی و مناسبت‌های ویژه.",
    attributes: [
      { labelFa: "رنگ", valueFa: "مشکی" },
      { labelFa: "جنس", valueFa: "پلی‌استر (۱۰۰٪)" },
      { labelFa: "قالب", valueFa: "معمولی" },
      { labelFa: "نوعِ یقه", valueFa: "یقه‌هالتر" },
      { labelFa: "نوعِ آستین", valueFa: "بدونِ آستین" },
      { labelFa: "نوعِ پارچه", valueFa: "ساتن" },
      { labelFa: "طرح", valueFa: "خالدار" },
      { labelFa: "مناسبتِ استفاده", valueFa: "مهمانی" },
      { labelFa: "کشورِ سازنده", valueFa: "ترکیه" },
    ],
    sourceUrl:
      "https://www.trendyol-milla.com/trendyolmilla/siyah-saten-degaje-party-bluz-tpraw26bz00003-p-938914429?boutiqueId=651724&merchantId=968",
    variants: [
      { size: "32", inStock: true, priceTL: 399.99 },
      { size: "34", inStock: true, priceTL: 399.99 },
      { size: "36", inStock: true, priceTL: 399.99 },
      { size: "38", inStock: true, priceTL: 399.99 },
      { size: "40", inStock: false, priceTL: 399.99 },
      { size: "42", inStock: false, priceTL: 399.99 },
    ],
    minPriceTL: 399.99,
  },
  {
    id: 994002982,
    name: "Koyu Mavi Yüksek Bel Orta Esnek Wide Leg Palazzo Jeans TWOAW26JE00084",
    nameFa: "شلوارِ جینِ سرمه‌ای، کمرِ بلند و پاچه‌گشاد (پالاتزو)",
    brand: "TRENDYOLMİLLA",
    category: "Jeans",
    image:
      "https://cdn.dsmcdn.com/ty1782/prod/PLM/20251103/2018925/2029892/2021916/34d506c8-8da8-4050-9e56-7d17bc015ed8/0_org_zoom.jpg",
    images: [
      "https://cdn.dsmcdn.com/ty1782/prod/PLM/20251103/2018925/2029892/2021916/34d506c8-8da8-4050-9e56-7d17bc015ed8/0_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1784/prod/PLM/20251103/2018925/2029892/2021916/ffd483a7-197a-45d6-9b20-17481168231a/1_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1784/prod/PLM/20251103/2018925/2029892/2021916/9dd71d10-ab0f-4a6a-b566-1861674661b0/2_org_zoom.jpg",
      "https://cdn.dsmcdn.com/ty1784/prod/PLM/20251103/2018925/2029892/2021916/035ea0a1-e522-410c-9f12-df56d3926502/3_org_zoom.jpg",
    ],
    descriptionFa:
      "شلوارِ جینِ کمربلند با پاچه‌گشادِ پالاتزو و کششِ متوسط — راحت و شیک، برای استفادهٔ روزمره.",
    attributes: [
      { labelFa: "رنگ", valueFa: "سرمه‌ای" },
      { labelFa: "جنس", valueFa: "نخی (۹۹٪ نخ، ۱٪ الاستان)" },
      { labelFa: "کمر", valueFa: "کمرِ بلند" },
      { labelFa: "نوعِ پاچه", valueFa: "پاچه‌گشاد" },
      { labelFa: "سیلوئت", valueFa: "پاچه‌گشاد (Wide Leg)" },
      { labelFa: "نوعِ پارچه", valueFa: "جین (دنیم راحت)" },
      { labelFa: "طرح", valueFa: "ساده" },
      { labelFa: "مناسبتِ استفاده", valueFa: "روزمره" },
      { labelFa: "کشورِ سازنده", valueFa: "ترکیه" },
    ],
    sourceUrl:
      "https://www.trendyol-milla.com/trendyolmilla/koyu-mavi-yuksek-bel-orta-esnek-wide-leg-palazzo-jeans-twoaw26je00084-p-994002982?boutiqueId=651724&merchantId=968",
    variants: [
      { size: "32", inStock: true, priceTL: 716.99 },
      { size: "34", inStock: true, priceTL: 716.99 },
      { size: "36", inStock: true, priceTL: 716.99 },
      { size: "38", inStock: true, priceTL: 716.99 },
      { size: "40", inStock: true, priceTL: 716.99 },
      { size: "42", inStock: true, priceTL: 716.99 },
    ],
    minPriceTL: 716.99,
  },
];

/** پیداکردنِ یک محصولِ عکسِ‌لحظه‌ای با شناسه — برای صفحهٔ جزئیات و سبد. */
export function getSnapshotProduct(id: number): TrendyolProduct | undefined {
  return SNAPSHOT_PRODUCTS.find((p) => p.id === id);
}

export const CATEGORY_LABELS_FA: Record<string, string> = {
  Gömlek: "پیراهن",
  "Sırt Çantası": "کوله‌پشتی",
  Tulum: "تولوم (سرهمی)",
  Bluz: "بلوز",
  Jeans: "شلوار جین",
};
