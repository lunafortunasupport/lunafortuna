// لایهٔ دادهٔ کاتالوگِ آینه‌ایِ ترندیول — جایگزینِ trendyolDemo.ts. دادهٔ واقعی توسط
// scripts/sync-trendyol.mjs (زمان‌بندی‌شده، هر ۱۲ ساعت) در MirrorProduct/MirrorVariant پر می‌شود؛
// این فایل فقط کوئری می‌زند، سینک نمی‌کند.
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/util";
import { cargoFeeTL } from "@/lib/cargo";
import type { MirrorProduct, MirrorVariant } from "@prisma/client";

export const PAGE_SIZE = 24;

// محصولاتِ «پوشیدهٔ حجاب» (raw category ترکی همیشه با «Tesettür» شروع می‌شود — چه در دیکشنریِ
// ترجمه باشد چه نه) عمداً و همیشه از کاتالوگِ سایت حذف می‌شوند — تصمیمِ کاربر. یک ثابتِ واحد که در
// همهٔ کوئری‌های این فایل اعمال می‌شود، تا اگر بعداً هم دوباره سینک شدند، باز هم نمایش داده نشوند.
const HIDDEN_CATEGORY_PREFIX = "Tesettür";
const NOT_HIDDEN = { NOT: { category: { startsWith: HIDDEN_CATEGORY_PREFIX } } };

// لوگوی برند = از سرویسِ unavatar.io که لوگو/آیکونِ رسمیِ دامنه را از چند منبع (سرویس‌های
// لوگو + فاویکونِ خودِ سایت) جمع می‌کند و تصویری بزرگ‌تر و تمیزتر از فاویکونِ گوگل می‌دهد.
// کنارِ نامِ برند در ویترین‌ها نمایش داده می‌شود. فقط برندهایی که دامنهٔ مطمئن دارند.
// (Clearbit تعطیل شد؛ unavatar جایگزینِ زندهٔ رایگان و بدونِ توکن است و خودش به فاویکون fallback می‌کند.)
const brandIcon = (domain: string) => `https://unavatar.io/${domain}`;
const BRAND_DOMAINS: Record<string, string> = {
  trendyol: "trendyol.com",
  "trendyol-milla": "trendyol.com",
  "trendyol-kids": "trendyol.com",
  "trendyol-shoes": "trendyol.com",
  mango: "mango.com",
  koton: "koton.com",
  defacto: "defacto.com.tr",
  mavi: "mavi.com",
  ltb: "ltbjeans.com",
  "us-polo": "uspoloassn.com",
  penti: "penti.com",
  happiness: "happinessistanbul.com",
  suwen: "suwen.com",
  dagi: "dagi.com.tr",
  hm: "hm.com",
  decathlon: "decathlon.com.tr",
  "jack-jones": "jackjones.com",
  colins: "colins.com.tr",
  "massimo-dutti": "massimodutti.com",
  stradivarius: "stradivarius.com",
  bershka: "bershka.com",
  oysho: "oysho.com",
  "pull-bear": "pullandbear.com",
  guess: "guess.com",
  "madame-coco": "madamecoco.com",
  "english-home": "englishhome.com",
  olalook: "olalook.com",
  karaca: "karaca.com",
  korkmaz: "korkmaz.com.tr",
  superstep: "superstep.com.tr",
  greyder: "greyder.com",
  sportive: "sportive.com.tr",
  levis: "levi.com.tr",
};
export const brandLogo = (slug: string): string | null =>
  BRAND_DOMAINS[slug] ? brandIcon(BRAND_DOMAINS[slug]) : null;

export type SortOption = "popular" | "price_asc" | "price_desc" | "new";
export type PriceBucket = "under1" | "1to3" | "3to6" | "over6";

export interface CatalogFilters {
  q?: string;
  category?: string;
  brand?: string;
  size?: string;
  price?: PriceBucket;
  sort?: SortOption;
  page?: number;
  featuredBrand?: string;
  onSale?: boolean;
  source?: string; // ستونِ اصلی: trendyol | trendyol-milla | ambar
  categoryIn?: string[]; // برای کالکشن‌ها: هر کدام از این دسته‌های فارسی (categoryFa)
  categoryContains?: string; // برای کالکشن‌ها: دسته‌ای که این رشته را در نامش دارد
  audience?: string; // برای کالکشن‌ها: men | kids | home (نوعِ لباس بینِ زنانه/مردانه مشترک است، پس این جدا ذخیره می‌شود)
  audienceNull?: boolean; // کالکشنِ «پوشاکِ زنانه»: صریحاً audience IS NULL (چون audience برای زنانهٔ عمومی خالی می‌ماند)
}

// سه ستونِ اصلیِ کاتالوگ (بر اساسِ sourceSite). ترندیول = ملتی‌برند (همهٔ برندها).
export interface Pillar {
  slug: string; // = sourceSite
  nameFa: string;
  nameEn: string;
  blurbFa: string;
  cover?: string; // عکسِ کاورِ کیوریت‌شده (مدلِ برند) برای کاشیِ بزرگِ «سه دنیای خرید»
}
export const PILLARS: Pillar[] = [
  { slug: "trendyol", nameFa: "ترندیول", nameEn: "Trendyol", blurbFa: "ملتی‌برندِ بزرگِ ترکیه — پرفروش‌ترین‌ها و تخفیف‌دارها از ده‌ها برند.", cover: "/images/pillar-trendyol.jpg" },
  { slug: "trendyol-milla", nameFa: "ترندیول‌میلا", nameEn: "TRENDYOLMİLLA", blurbFa: "برندِ اختصاصیِ زنانهٔ ترندیول — پوشاکِ روزمره تا مجلسی.", cover: "/images/pillar-milla.jpg" },
  { slug: "ambar", nameFa: "آمبار", nameEn: "Ambar", blurbFa: "برندِ ترکِ پوشاکِ زنانه (Ambar Giyim) — از سایتِ رسمیِ خودشان.", cover: "/images/pillar-ambar.jpg" },
];
export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

// ── کالکشن‌های دست‌چین ──
// روی دسته‌بندیِ واقعیِ محصولات (categoryFa) تعریف می‌شوند، نه فرضی. هر کالکشن یا یک لیستِ ثابت از
// دسته‌ها (categoryIn) دارد یا یک زیررشتهٔ مشترک (categoryContains — مثلِ «مردانه» که چند دستهٔ
// «پیراهنِ مردانه»/«تی‌شرتِ مردانه»/… را یک‌جا می‌گیرد).
export interface Collection {
  slug: string;
  nameFa: string;
  emoji: string;
  blurbFa: string;
  // عکسِ کاورِ کیوریت‌شدهٔ ثابت (لوکال در public/images) — مرتبط و باکیفیت، جایگزینِ عکسِ محصولِ
  // اتفاقی. اگر نباشد، به sampleImage (عکسِ پرپسندِ همان کالکشن) برمی‌گردیم.
  cover?: string;
  filter: { categoryIn?: string[]; categoryContains?: string; audience?: string; audienceNull?: boolean; onSale?: boolean };
}
export const COLLECTIONS: Collection[] = [
  {
    slug: "women",
    nameFa: "پوشاکِ زنانه",
    emoji: "👗",
    blurbFa: "طیفِ کاملِ پوشاکِ زنانه — از روزمره تا مجلسی، از ده‌ها برند.",
    cover: "/images/women.jpg",
    filter: { audienceNull: true },
  },
  {
    slug: "evening",
    nameFa: "استایلِ مجلسی",
    emoji: "✨",
    blurbFa: "برای مهمانی و مناسبت‌های خاص.",
    cover: "/images/evening.jpg",
    filter: { categoryIn: ["لباسِ مجلسی/فارغ‌التحصیلی", "بوستیه"] },
  },
  {
    slug: "basics",
    nameFa: "بیسیکِ روزمره",
    emoji: "👕",
    blurbFa: "بلوز، تی‌شرت و شلوارِ همیشه‌کاربردی.",
    cover: "/images/basics.jpg",
    filter: { categoryIn: ["بلوز", "تی‌شرت", "شلوار", "شلوار جین"] },
  },
  {
    slug: "men",
    nameFa: "دنیای مردانه",
    emoji: "🧔",
    blurbFa: "پیراهن، تی‌شرت، شلوار و کاپشنِ مردانه.",
    cover: "/images/men.jpg",
    filter: { audience: "men" },
  },
  {
    slug: "kids",
    nameFa: "دنیای بچگانه",
    emoji: "🧸",
    blurbFa: "پوشاکِ بچگانه و نوزادی.",
    cover: "/images/kids.jpg",
    filter: { audience: "kids" },
  },
  {
    slug: "home",
    nameFa: "خانه و آشپزخانه",
    emoji: "🏠",
    blurbFa: "روتختی، حوله، دکوراسیون و لوازمِ آشپزخانه.",
    cover: "/images/home.jpg",
    filter: { audience: "home" },
  },
  {
    slug: "lingerie",
    nameFa: "لباسِ‌زیر و راحتی",
    emoji: "💗",
    blurbFa: "سوتین، لباسِ‌خواب و مایو — از برندهایی مثلِ پنتی.",
    cover: "/images/lingerie.jpg",
    filter: { audience: "lingerie" },
  },
  {
    slug: "sale",
    nameFa: "حراجِ ویژه",
    emoji: "🏷️",
    blurbFa: "همین حالا تخفیف خورده‌اند.",
    cover: "/images/sale.jpg",
    filter: { onSale: true },
  },
];
export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export interface CollectionStat extends Collection {
  count: number;
  sampleImages: string[];
}

/** آمارِ کالکشن‌ها — فقط آن‌هایی که همین حالا محصول دارند نشان داده می‌شوند. */
export async function getCollectionStats(): Promise<CollectionStat[]> {
  const stats = await Promise.all(
    COLLECTIONS.map(async (c) => {
      const where: Record<string, unknown> = { isActive: true, ...NOT_HIDDEN };
      if (c.filter.categoryIn) where.categoryFa = { in: c.filter.categoryIn };
      else if (c.filter.categoryContains) where.categoryFa = { contains: c.filter.categoryContains };
      if (c.filter.audienceNull) where.audience = null;
      else if (c.filter.audience) where.audience = c.filter.audience;
      if (c.filter.onSale) where.onSale = true;
      // عکسِ نمونه (برای بنر/هیرو/کارت استفاده می‌شود) باید همیشه لباس/فشن باشد، نه لوازمِ خانه —
      // مثلاً «حراجِ ویژه» همهٔ audienceها را می‌گیرد و بدونِ این فیلتر ممکن است عکسِ نمونه‌اش یک
      // کالای خانه/نظافت با بیشترین پسند باشد (بی‌ربط و نامناسبِ نمایشِ برجسته). فقط وقتی کالکشن
      // خودش قبلاً audience را مقید نکرده (نه men/kids/lingerie/خودِ home) این فیلتر اضافه می‌شود؛
      // وگرنه spreadِ ساده جایگزینِ محدودیتِ اصلی می‌شد نه مکمّلش.
      // نکته: audience برای اکثرِ محصولات null است (یعنی زنانهٔ عمومی)، و SQL با منطقِ سه‌حالته
      // ردیف‌های audience=NULL را از `{ not: "home" }` هم حذف می‌کند (NULL != 'home' نامشخص است، نه
      // true) — پس باید صریحاً audience=null را هم با OR برگردانیم، وگرنه دقیقاً همین کالکشنِ سالم
      // (زنانهٔ عمومی که audience=null دارد) خالی می‌شد.
      const constrainsAudience = c.filter.audienceNull || c.filter.audience;
      const sampleWhere: Record<string, unknown> = constrainsAudience
        ? { ...where, image: { not: null } }
        : { ...where, image: { not: null }, OR: [{ audience: null }, { audience: { not: "home" } }] };
      const [count, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where }),
        prisma.mirrorProduct.findMany({
          where: sampleWhere,
          orderBy: [{ favoriteCount: { sort: "desc", nulls: "last" } }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...c, count, sampleImages: samples.map((s) => s.image!).filter(Boolean) };
    })
  );
  return stats;
}

// ── لوک‌بوک / منتخبِ سردبیر ──
// «داستان»‌های استایلِ دست‌چین با روایتِ مجله‌ای. مثلِ COLLECTIONS در کد تعریف می‌شوند ولی
// محصولاتشان زنده از کاتالوگِ سینک‌شده می‌آید (فیلترِ categoryFa)، پس همیشه تازه‌اند و لینکِ
// خرابی ندارند. متنِ سردبیری (title/dek/intro) دستی نوشته می‌شود — همان چیزی که حسِ «مجله» می‌دهد.
export interface Editorial {
  slug: string;
  title: string; // «شبِ مهمانی»
  dek: string; // یک‌خطیِ گیرا زیرِ عنوان
  intro: string; // ۲–۳ جملهٔ روایتِ سردبیری
  heroEmoji: string; // اکسنتِ fallback وقتی عکسِ نمونه نیست
  theme: "navy" | "gold" | "cream"; // حالِ رنگیِ هیرو
  filter: { categoryIn?: string[]; audience?: string; audienceNull?: boolean; onSale?: boolean };
  sort?: SortOption; // پیش‌فرض "popular"
}
export const EDITORIALS: Editorial[] = [
  {
    slug: "evening",
    title: "شبِ مهمانی",
    dek: "برای شب‌هایی که باید بدرخشی.",
    intro:
      "از لباسِ بلندِ مجلسی تا بوستیه و پیراهنِ شیک — تکه‌هایی که برای مهمانی، عروسی و مناسبت‌های خاص انتخاب کرده‌ایم. منتخبی از برندهای ترکیه، همه به فارسی و تومان.",
    heroEmoji: "✨",
    theme: "navy",
    filter: { categoryIn: ["لباسِ مجلسی/فارغ‌التحصیلی", "بوستیه", "لباس"], audienceNull: true },
  },
  {
    slug: "everyday",
    title: "راحتِ روزمره",
    dek: "سادگیِ شیک برای هر روز.",
    intro:
      "بلوز، تی‌شرت، پلیور و ژاکتِ کش‌باف — پایه‌های همیشه‌کاربردیِ کمد که به هم می‌آیند و راحتی را قربانیِ استایل نمی‌کنند.",
    heroEmoji: "👕",
    theme: "cream",
    filter: { categoryIn: ["بلوز", "تی‌شرت", "پلیور", "ژاکتِ کش‌باف"], audienceNull: true },
  },
  {
    slug: "denim",
    title: "جین، همیشه جین",
    dek: "کلاسیکی که هیچ‌وقت از مد نمی‌افتد.",
    intro:
      "منتخبی از شلوارهای جین با فیت‌ها و رنگ‌های مختلف — از مام‌استایلِ فاق‌بلند تا پاچه‌گشاد. تکه‌ای که با همه‌چیز ست می‌شود.",
    heroEmoji: "👖",
    theme: "navy",
    filter: { categoryIn: ["شلوار جین"], audienceNull: true },
  },
  {
    slug: "bags-shoes",
    title: "کیف و کفشِ منتخب",
    dek: "جزئیاتی که استایل را کامل می‌کنند.",
    intro:
      "کیفِ دستی و دوشی، کفشِ پاشنه‌دار و کتانی — اکسسوری‌هایی که یک ست را از معمولی به خاص می‌رسانند.",
    heroEmoji: "👜",
    theme: "gold",
    filter: { categoryIn: ["کیف", "کیفِ دوشی", "کیفِ دستی", "کفش", "کفشِ پاشنه‌دار", "کفشِ اسپرت"], audienceNull: true },
  },
  {
    slug: "winter",
    title: "گرمِ زمستان",
    dek: "لایه‌های گرم و شیکِ فصلِ سرد.",
    intro:
      "کاپشن، پالتو، تریکو و ترنچ‌کت — لایه‌هایی که سرما را بیرون نگه می‌دارند و استایل را زنده. منتخبِ زمستانیِ ما از برندهای ترکیه.",
    heroEmoji: "🧥",
    theme: "navy",
    filter: { categoryIn: ["کاپشن", "پالتو", "تریکو", "پلیور", "ترنچ‌کت"], audienceNull: true },
  },
];
export function getEditorial(slug: string): Editorial | undefined {
  return EDITORIALS.find((e) => e.slug === slug);
}

export interface EditorialStat extends Editorial {
  count: number;
  sampleImages: string[];
}

/** آمارِ لوک‌بوک — فقط لوک‌هایی که همین حالا محصول دارند نمایش داده می‌شوند. */
export async function getEditorialStats(): Promise<EditorialStat[]> {
  const stats = await Promise.all(
    EDITORIALS.map(async (e) => {
      const where: Record<string, unknown> = { isActive: true, ...NOT_HIDDEN };
      if (e.filter.categoryIn) where.categoryFa = { in: e.filter.categoryIn };
      if (e.filter.audienceNull) where.audience = null;
      else if (e.filter.audience) where.audience = e.filter.audience;
      if (e.filter.onSale) where.onSale = true;
      const [count, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where }),
        prisma.mirrorProduct.findMany({
          where: { ...where, image: { not: null } },
          orderBy: [{ favoriteCount: { sort: "desc", nulls: "last" } }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...e, count, sampleImages: samples.map((s) => s.image!).filter(Boolean) };
    })
  );
  return stats;
}

export interface FeaturedBrand {
  slug: string;
  nameFa: string;
  nameEn: string;
  blurbFa: string;
}

// منبعِ واحدِ برندهای منتخب — ترتیب همان ترتیبِ نمایش در صفحهٔ برندها.
export const FEATURED_BRANDS: FeaturedBrand[] = [
  { slug: "trendyol-milla", nameFa: "ترندیول‌میلا", nameEn: "TRENDYOLMİLLA", blurbFa: "برندِ اختصاصیِ زنانهٔ ترندیول — پوشاکِ روزمره تا مجلسی." },
  { slug: "mango", nameFa: "مانگو", nameEn: "MANGO", blurbFa: "برندِ اسپانیاییِ محبوب — پوشاکِ شیک و مینیمالِ زنانه و مردانه." },
  { slug: "koton", nameFa: "کوتون", nameEn: "Koton", blurbFa: "برندِ پرطرفدارِ ترکیه — مُد روز با قیمتِ مناسب." },
  { slug: "defacto", nameFa: "دیفکتو", nameEn: "DeFacto", blurbFa: "پوشاکِ روزمرهٔ خانواده — زنانه، مردانه و بچگانه." },
  { slug: "mavi", nameFa: "ماوی", nameEn: "Mavi", blurbFa: "برندِ مشهورِ جین و دنیمِ ترکیه." },
  { slug: "ltb", nameFa: "ال‌تی‌بی", nameEn: "LTB", blurbFa: "جین و پوشاکِ جوان‌پسندِ Little Big." },
  { slug: "us-polo", nameFa: "یو‌اس پولو", nameEn: "U.S. Polo Assn.", blurbFa: "پوشاکِ کلاسیک و اسپرتِ برندِ آمریکاییِ محبوب." },
  { slug: "happiness", nameFa: "هپینس استانبول", nameEn: "Happiness İstanbul", blurbFa: "استریت‌ویرِ محبوبِ استانبول — راحت، اسپرت، جوان‌پسند." },
  { slug: "penti", nameFa: "پنتی", nameEn: "Penti", blurbFa: "برندِ محبوبِ ترکیه در لباسِ‌زیر، جوراب و لباسِ‌راحتیِ زنانه." },
  { slug: "suwen", nameFa: "سووِن", nameEn: "Suwen", blurbFa: "لباسِ‌زیر، لباسِ‌خواب و لباسِ‌راحتیِ زنانه." },
  { slug: "dagi", nameFa: "داغی", nameEn: "Dagi", blurbFa: "لباسِ‌راحتی و خانگیِ زنانه و مردانه." },
  { slug: "trendyol-kids", nameFa: "ترندیول کیدز", nameEn: "TRENDYOLKIDS", blurbFa: "پوشاکِ بچگانهٔ برندِ خودِ ترندیول." },
  { slug: "trendyol-shoes", nameFa: "ترندیول شوز", nameEn: "TRENDYOL SHOES", blurbFa: "کفشِ زنانهٔ برندِ خودِ ترندیول." },
  // فازِ ۲ (دستهٔ اول)
  { slug: "hm", nameFa: "اچ‌اند‌ام", nameEn: "H&M", blurbFa: "برندِ سوئدیِ پرطرفدار — مُدِ روز با قیمتِ مناسب، زنانه و مردانه." },
  { slug: "decathlon", nameFa: "دکتلون", nameEn: "Decathlon", blurbFa: "لوازم و پوشاکِ ورزشیِ فرانسوی — تمامِ رشته‌ها، زنانه و مردانه." },
  { slug: "jack-jones", nameFa: "جک‌اند‌جونز", nameEn: "Jack & Jones", blurbFa: "برندِ دانمارکیِ پوشاکِ مردانه — کژوال تا رسمی." },
  { slug: "colins", nameFa: "کالینز", nameEn: "Colin's", blurbFa: "برندِ ترکیه‌ایِ جین و پوشاکِ روزمره." },
  { slug: "massimo-dutti", nameFa: "ماسیمودوتی", nameEn: "Massimo Dutti", blurbFa: "پوشاکِ اسپانیاییِ باکیفیت و شیک، زنانه و مردانه." },
  // فازِ ۲ (دستهٔ دوم)
  { slug: "stradivarius", nameFa: "استرادیواریوس", nameEn: "Stradivarius", blurbFa: "برندِ اسپانیاییِ مُدِ روزِ زنانه." },
  { slug: "bershka", nameFa: "برشکا", nameEn: "Bershka", blurbFa: "برندِ اسپانیاییِ جوان‌پسند — استریت‌ویر و مُدِ روز." },
  { slug: "oysho", nameFa: "اویشو", nameEn: "Oysho", blurbFa: "برندِ اسپانیاییِ لباسِ‌زیر، لباسِ‌خواب و لباسِ‌راحتیِ زنانه." },
  { slug: "pull-bear", nameFa: "پول‌اند‌بیر", nameEn: "Pull & Bear", blurbFa: "برندِ اسپانیاییِ کژوال و استریت‌ویرِ جوان‌پسند." },
  { slug: "guess", nameFa: "گس", nameEn: "GUESS", blurbFa: "برندِ آمریکاییِ محبوب — پوشاک، کیف و اکسسوریِ شیک." },
  // فازِ ۲ (دستهٔ سوم) — خانه/آشپزخانه، کفش و پوشاک
  { slug: "madame-coco", nameFa: "مادام‌کوکو", nameEn: "Madame Coco", blurbFa: "برندِ محبوبِ خانه و دکوراسیون — سرویسِ خواب، حوله و لوازمِ خانه." },
  { slug: "english-home", nameFa: "انگلیش‌هوم", nameEn: "English Home", blurbFa: "خانه و آشپزخانه — سرویسِ خواب، حوله، سرویسِ غذاخوری و دکور." },
  { slug: "olalook", nameFa: "اولالوک", nameEn: "Olalook", blurbFa: "برندِ پوشاکِ زنانهٔ ترکیه — شیک و مُدِ روز." },
  { slug: "karaca", nameFa: "کاراجا", nameEn: "Karaca", blurbFa: "برندِ مشهورِ آشپزخانه و سرویسِ غذاخوریِ ترکیه." },
  { slug: "korkmaz", nameFa: "کورکماز", nameEn: "Korkmaz", blurbFa: "لوازمِ آشپزخانه و پخت‌وپزِ باکیفیتِ ترکیه." },
  { slug: "superstep", nameFa: "سوپراستپ", nameEn: "Superstep", blurbFa: "فروشگاهِ کفشِ اسنیکر و اسپرتِ برندهای مطرح." },
  { slug: "greyder", nameFa: "گریدر", nameEn: "Greyder", blurbFa: "برندِ کفشِ چرمِ باکیفیتِ ترکیه، زنانه و مردانه." },
  { slug: "sportive", nameFa: "اسپورتیو", nameEn: "Sportive", blurbFa: "پوشاک و لوازمِ ورزشیِ ترکیه." },
  { slug: "levis", nameFa: "لیوایز", nameEn: "Levi's", blurbFa: "برندِ افسانه‌ایِ جین و دنیمِ آمریکایی." },
  { slug: "ambar", nameFa: "آمبار", nameEn: "Ambar", blurbFa: "برندِ ترکِ پوشاکِ زنانه (Ambar Giyim) — از سایتِ رسمیِ خودشان." },
];

export function getFeaturedBrand(slug: string): FeaturedBrand | undefined {
  return FEATURED_BRANDS.find((b) => b.slug === slug);
}

export interface MirrorProductWithVariants extends MirrorProduct {
  variants: MirrorVariant[];
}

/** lowercase امنِ ترکی — باید دقیقاً هم‌الگوی trLower در scripts/trendyol-fa-dict.mjs بماند. */
function trLower(s: string): string {
  return String(s || "")
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR");
}

/** توکن‌سازیِ عبارتِ سرچ برای تطبیقِ چندکلمه‌ای و مقاوم به شکلِ نگارش:
 *  - lowercaseِ امنِ ترکی (elbise/Elbi̇se)،
 *  - یکسان‌سازیِ حروفِ عربی↔فارسی (ي→ی، ك→ک، ة→ه) تا تایپِ عربی هم نتیجه بدهد،
 *  - نیم‌فاصله (ZWNJ) و فاصله جداکنندهٔ توکن‌اند، پس «دکمه دار» و «دکمه‌دار» هر دو می‌خورند.
 *  هر توکن باید در searchText یا categoryFa باشد (AND روی توکن‌ها) — نه لزوماً کنارِ هم. */
function searchTokens(q: string): string[] {
  return trLower(q)
    .replace(/ي/g, "ی") // ي → ی
    .replace(/ك/g, "ک") // ك → ک
    .replace(/ة/g, "ه") // ة → ه
    .replace(/[‌‏‎]/g, " ") // ZWNJ/RLM/LRM → فاصله
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

const PRICE_BUCKETS_TOMAN: Record<PriceBucket, [number, number | null]> = {
  under1: [0, 1_000_000],
  "1to3": [1_000_000, 3_000_000],
  "3to6": [3_000_000, 6_000_000],
  over6: [6_000_000, null],
};

export async function queryMirrorProducts(filters: CatalogFilters, perLirToman: number) {
  const where: Record<string, unknown> = { isActive: true, ...NOT_HIDDEN };
  if (filters.source) where.sourceSite = filters.source;
  if (filters.category) where.category = filters.category;
  if (filters.brand) where.brand = filters.brand;
  if (filters.featuredBrand) where.featuredBrand = filters.featuredBrand;
  if (filters.onSale) where.onSale = true;
  if (filters.categoryIn) where.categoryFa = { in: filters.categoryIn };
  else if (filters.categoryContains) where.categoryFa = { contains: filters.categoryContains };
  if (filters.audienceNull) where.audience = null;
  else if (filters.audience) where.audience = filters.audience;
  if (filters.size) where.variants = { some: { size: filters.size, inStock: true } };
  // جستجو: هم متنِ ترکیِ ذخیره‌شده (نام + برند) و هم دستهٔ فارسی (categoryFa) — تا سرچِ فارسیِ
  // نوعِ محصول («کیف»، «لباس»، «شلوار») هم نتیجه بدهد، نه فقط کلیدواژهٔ ترکی/برندِ لاتین.
  if (filters.q) {
    const tokens = searchTokens(filters.q);
    if (tokens.length > 0) {
      // هر توکن باید جایی (نام/برندِ لاتین در searchText یا دستهٔ فارسی) باشد — ترتیب مهم نیست.
      where.AND = tokens.map((t) => ({
        OR: [{ searchText: { contains: t } }, { categoryFa: { contains: t } }],
      }));
    }
  }
  if (filters.price) {
    const [minToman, maxToman] = PRICE_BUCKETS_TOMAN[filters.price];
    const minTL = minToman / perLirToman;
    const priceFilter: Record<string, number> = { gte: minTL };
    if (maxToman != null) priceFilter.lte = maxToman / perLirToman;
    where.minPriceTL = priceFilter;
  }

  // nulls:last → محصولاتِ بدونِ امتیاز/پسند آخر می‌آیند (وگرنه Postgres آن‌ها را «اول» می‌آورد و
  // پرطرفدارها/ستاره‌دارها ته لیست می‌افتند). روی PostgreSQLِ prod و SQLiteِ dev هر دو پشتیبانی می‌شود.
  let orderBy: unknown[] = [
    { favoriteCount: { sort: "desc", nulls: "last" } },
    { ratingScore: { sort: "desc", nulls: "last" } },
  ];
  if (filters.sort === "price_asc") orderBy = [{ minPriceTL: { sort: "asc", nulls: "last" } }];
  else if (filters.sort === "price_desc") orderBy = [{ minPriceTL: { sort: "desc", nulls: "last" } }];
  else if (filters.sort === "new") orderBy = [{ lastSyncedAt: "desc" }];
  else if (filters.onSale) orderBy = [{ discountPct: { sort: "desc", nulls: "last" } }];

  const page = Math.max(1, filters.page || 1);
  const [items, total] = await Promise.all([
    prisma.mirrorProduct.findMany({
      where,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: orderBy as any,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { variants: true },
    }),
    prisma.mirrorProduct.count({ where }),
  ]);

  return { items: items as MirrorProductWithVariants[], total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getMirrorProduct(id: string): Promise<MirrorProductWithVariants | null> {
  const p = await prisma.mirrorProduct.findUnique({ where: { id }, include: { variants: true } });
  // حتی با لینکِ مستقیمِ قدیمی هم نشان داده نشود (همان تصمیمِ حذفِ کاملِ محصولاتِ پوشیدهٔ حجاب).
  if (p && p.category.startsWith(HIDDEN_CATEGORY_PREFIX)) return null;
  return p as MirrorProductWithVariants | null;
}

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "استاندارد"];
function sizeSortKey(s: string): [number, number, string] {
  const n = Number(s);
  if (!isNaN(n)) return [0, n, s];
  const idx = SIZE_ORDER.indexOf(s);
  return [1, idx === -1 ? SIZE_ORDER.length : idx, s];
}

export interface CatalogFacets {
  categories: { key: string; labelFa: string; count: number }[];
  brands: { key: string; count: number }[];
  sizes: string[];
}

/** فیلترهای قابل‌انتخاب، مشتق از محصولاتِ فعالِ فعلی (نه یک لیستِ ثابت). به منبع (ستون) محدود
 * می‌شود تا مثلاً در ستونِ ترندیول فقط برند/دسته‌های ترندیول نشان داده شوند. */
export async function getFacets(source?: string): Promise<CatalogFacets> {
  const baseWhere = source ? { isActive: true, sourceSite: source, ...NOT_HIDDEN } : { isActive: true, ...NOT_HIDDEN };
  const [categoryRows, brandRows, sizeRows] = await Promise.all([
    prisma.mirrorProduct.groupBy({ by: ["category", "categoryFa"], where: baseWhere, _count: { _all: true } }),
    prisma.mirrorProduct.groupBy({ by: ["brand"], where: baseWhere, _count: { _all: true } }),
    prisma.mirrorVariant.findMany({
      where: { inStock: true, product: baseWhere },
      select: { size: true },
      distinct: ["size"],
    }),
  ]);

  return {
    categories: categoryRows
      .map((r) => ({ key: r.category, labelFa: r.categoryFa, count: r._count._all }))
      .sort((a, b) => b.count - a.count),
    brands: brandRows
      .map((r) => ({ key: r.brand, count: r._count._all }))
      .sort((a, b) => (a.key === "TRENDYOLMİLLA" ? -1 : b.key === "TRENDYOLMİLLA" ? 1 : b.count - a.count)),
    sizes: sizeRows.map((r) => r.size).sort((a, b) => {
      const [ta, na] = sizeSortKey(a);
      const [tb, nb] = sizeSortKey(b);
      return ta - tb || na - nb;
    }),
  };
}

export interface PriceBreakdown {
  itemToman: number | null;
  cargoToman: number;
  totalToman: number | null;
  freeCargo: boolean;
}

export function priceBreakdown(
  variant: { priceTL: number | null; freeCargo: boolean } | null | undefined,
  perLirToman: number,
  cargoFeeEstimateTL: number,
  sourceSite?: string,
  cargoFeeEstimateMillaTL?: number
): PriceBreakdown {
  if (!variant || variant.priceTL == null) {
    return { itemToman: null, cargoToman: 0, totalToman: null, freeCargo: true };
  }
  const itemToman = Math.round(variant.priceTL * perLirToman);
  const feeTL = cargoFeeTL(sourceSite, variant.priceTL, variant.freeCargo, cargoFeeEstimateTL, cargoFeeEstimateMillaTL);
  const cargoToman = Math.round(feeTL * perLirToman);
  return { itemToman, cargoToman, totalToman: itemToman + cargoToman, freeCargo: feeTL === 0 };
}

export function parseImages(images: string): string[] {
  return parseJson<string[]>(images, []);
}
export function parseAttributes(attributes: string): { labelFa: string; valueFa: string }[] {
  return parseJson(attributes, []);
}

export interface SaleView {
  onSale: boolean;
  currentToman: number | null;
  originalToman: number | null;
  discountPct: number | null;
  promoLabel: string | null;
}

/**
 * نمای تخفیف بر اساسِ ارزان‌ترین قیمتِ محصول (minPriceTL) و قیمتِ قبلی (originalPriceTL).
 *
 * نکته: originalPriceTL از سطحِ لیستینگِ جستجو گرفته می‌شود، در حالی‌که minPriceTL از
 * ارزان‌ترینِ سایزهای واقعاً اسکرپ‌شده در صفحهٔ جزئیات می‌آید — این دو گاهی به یک سایز/واریانت
 * اشاره ندارند (مثلاً وقتی چند رنگ‌بندی زیرِ یک لیستینگ ادغام شده‌اند) و می‌تواند «قیمتِ قبلی»یی
 * کمتر از قیمتِ فعلی برگرداند که منطقاً یعنی تخفیف واقعی نیست. برای همین فقط وقتی originalToman
 * واقعاً از currentToman بیشتر باشد onSale=true می‌شود؛ در غیرِ این صورت برچسب پنهان می‌ماند.
 */
export function saleView(p: MirrorProduct, perLirToman: number): SaleView {
  const currentToman = p.minPriceTL != null ? Math.round(p.minPriceTL * perLirToman) : null;
  const rawOriginalToman = p.onSale && p.originalPriceTL != null ? Math.round(p.originalPriceTL * perLirToman) : null;
  const genuineDiscount = rawOriginalToman != null && currentToman != null && rawOriginalToman > currentToman;
  return {
    onSale: genuineDiscount,
    currentToman,
    originalToman: genuineDiscount ? rawOriginalToman : null,
    discountPct: genuineDiscount ? p.discountPct : null,
    promoLabel: genuineDiscount ? p.promoLabel : null,
  };
}

export interface FeaturedBrandStat extends FeaturedBrand {
  count: number;
  sampleImages: string[];
  logo: string | null;
}

/** برای صفحهٔ ایندکسِ برندها: تعدادِ محصولِ فعال + چند عکسِ نمونه per برندِ منتخب. */
export async function getFeaturedBrandStats(): Promise<FeaturedBrandStat[]> {
  const stats = await Promise.all(
    FEATURED_BRANDS.map(async (b) => {
      const [count, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where: { isActive: true, featuredBrand: b.slug, ...NOT_HIDDEN } }),
        prisma.mirrorProduct.findMany({
          where: { isActive: true, featuredBrand: b.slug, image: { not: null }, ...NOT_HIDDEN },
          orderBy: [{ favoriteCount: "desc" }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...b, count, sampleImages: samples.map((s) => s.image!).filter(Boolean), logo: brandLogo(b.slug) };
    })
  );
  return stats;
}

export interface PillarStat extends Pillar {
  count: number;
  brandCount: number; // چند برندِ متمایز زیرِ این ستون هست (برای ترندیول یعنی «۱۰۰+ برند»)
  sampleImages: string[];
  logo: string | null;
}

/** آمارِ سه ستونِ اصلی (بر اساسِ sourceSite) — برای صفحهٔ برندها، mega-menu و صفحهٔ اصلی. */
export async function getPillarStats(): Promise<PillarStat[]> {
  const stats = await Promise.all(
    PILLARS.map(async (p) => {
      const where = { isActive: true, sourceSite: p.slug, ...NOT_HIDDEN };
      const [count, brands, samples] = await Promise.all([
        prisma.mirrorProduct.count({ where }),
        prisma.mirrorProduct.findMany({ where, select: { brand: true }, distinct: ["brand"] }),
        prisma.mirrorProduct.findMany({
          where: { ...where, image: { not: null } },
          orderBy: [{ favoriteCount: "desc" }],
          take: 3,
          select: { image: true },
        }),
      ]);
      return { ...p, count, brandCount: brands.length, sampleImages: samples.map((s) => s.image!).filter(Boolean), logo: brandLogo(p.slug) };
    })
  );
  return stats;
}
