// سینکِ کاتالوگِ ترندیول: محصولاتِ پرطرفدار/پرامتیاز از دسته‌های متنوع (ترندیول + ترندیول‌میلا) را
// می‌خواند و در MirrorProduct/MirrorVariant ذخیره می‌کند. روی GitHub Actions زمان‌بندی می‌شود (هر ۱۲
// ساعت)، دقیقاً هم‌الگو با scripts/check-sales.mjs.
//
//   npx tsx scripts/sync-trendyol.mjs
//   LIMIT_CATEGORIES=2 LIMIT_PER_CATEGORY=8 npx tsx scripts/sync-trendyol.mjs   ← حالتِ تستِ سریع
//
// معماری (دو مرحله — هم «پرطرفدار» باشد هم کم‌ریسک):
//   ۱) لیستینگ: برای هر دسته، APIِ سرچِ ترندیول (fl=/q=, sst=BEST_SELLER) مستقیم fetch می‌شود
//      (نه page.goto — خیلی سریع‌تر، ۲۴ محصول در هر درخواست) تا کاندیدهای پرفروش پیدا شوند.
//   ۲) جزئیات: فقط برای کاندیدهای برگزیده (سقفِ هر دسته) صفحهٔ محصول با Playwright واقعی باز
//      می‌شود تا سایز/موجودی/کارگو/ویژگی‌ها دقیق گرفته شود (این داده فقط این‌جا هست).
//
// ── چرا fetchِ خامِ Node کار نمی‌کند ولی fetchِ داخلِ صفحه (مرورگرِ واقعی) کار می‌کند ──
// fetch()ِ سادهٔ Node (که Vercel/Next.js هم زیرش همین را دارد) با ۴۰۳ مسدود می‌شود — حتی با
// User-Agentِ درست — چون مسدودسازی روی امضای TLS/HTTP2 (JA3/JA4) است، نه هدرها. curl با همان
// هدرها موفق می‌شود؛ یعنی نیاز به یک استکِ TCP/TLSِ واقعی (مرورگر) هست. برای همین همه‌چیز از
// طریقِ Playwright/Chromiومِ واقعی انجام می‌شود: هم صفحاتِ جزئیات (page.goto) و هم APIِ لیستینگ
// (page.evaluate(() => fetch(...)))‌ — چون آن fetch هم از داخلِ contextِ مرورگرِ واقعی اجرا می‌شود.
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { translateAttributes, trLower, categoryLabelFa } from "./trendyol-fa-dict.mjs";

const prisma = new PrismaClient();
// شمارشِ محصولاتی که ادغامِ رنگ (سایزِ تکراری با قیمت‌های متفاوت) در آن‌ها تشخیص داده شد — فقط
// برای دیدنِ گستردگیِ مشکل در لاگِ خروجی، تصمیم‌گیریِ کد را عوض نمی‌کند.
let mergedColorDetections = 0;
// ممیزیِ قیمت: هر محصولی که قیمتِ روشِ قدیمی (variant) با قیمتِ درستِ جدید (winner) فرق داشت.
let priceCorrections = 0;
const auditLines = ["source\tbrand\told_price_TL\tnew_price_TL\turl"];

const LIMIT_CATEGORIES = Number(process.env.LIMIT_CATEGORIES) || Infinity;
const LIMIT_PER_CATEGORY = Number(process.env.LIMIT_PER_CATEGORY) || 60;
const TOTAL_CAP = Number(process.env.TOTAL_CAP) || 2800;
const DETAIL_CONCURRENCY = Number(process.env.DETAIL_CONCURRENCY) || 4;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ۴ محصولی که قبلاً دستی و باکیفیت ترجمه شدند — سینک این‌ها را بازنویسی نمی‌کند.
const MANUAL_OVERRIDES = {
  1101590393: {
    nameFa: "بلوزِ سبزِ اورسایز، بافتِ نازک و دورریز",
    descriptionFa:
      "بلوزی اورسایزِ سبک با یقه‌گرد و آستینِ خفاشی، از پارچهٔ بافتهٔ نخیِ نازک — برای پوششِ روزمرهٔ راحت و خنک.",
  },
  938914429: {
    nameFa: "بلوزِ ساتنِ مشکی، یقه‌هالتر (مخصوصِ مهمانی)",
    descriptionFa:
      "بلوزی شیک از ساتنِ مشکیِ خالدار با یقه‌هالتر و بدونِ آستین — انتخابی مناسب برای مهمانی و مناسبت‌های ویژه.",
  },
  994002982: {
    nameFa: "شلوارِ جینِ سرمه‌ای، کمرِ بلند و پاچه‌گشاد (پالاتزو)",
    descriptionFa: "شلوارِ جینِ کمربلند با پاچه‌گشادِ پالاتزو و کششِ متوسط — راحت و شیک، برای استفادهٔ روزمره.",
  },
  905066889: {
    nameFa: "پیراهنِ سفیدِ ساده، آستین‌بلند (بیسیک)",
    descriptionFa:
      "پیراهنِ کلاسیکِ سفید با یقهٔ پیراهنی و آستینِ بلند، دکمه‌دار و بدونِ طرح — ساده و همیشه‌کاربردی، مناسبِ پوششِ روزمره یا اداری.",
  },
};

// دسته‌ها: هرکدام یا `fl` (فیلترِ گردآوریِ ترندیول‌میلا) یا `q` (جست‌وجوی کلیدواژه‌ایِ ترندیولِ عمومی) دارد.
const CATEGORIES = [
  // ── ترندیول‌میلا (برندِ اختصاصیِ ترندیول — اولویتِ اول طبقِ خواستهٔ کاربر) ──
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "party-bluzlari", label: "بلوزِ مهمانی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "maxi-elbiseler", label: "لباسِ مکسی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "davet-elbiseleri", label: "لباسِ مجلسی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "midi-elbiseler", label: "لباسِ میدی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "mini-elbiseler", label: "لباسِ کوتاه" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "keten-elbiseler", label: "لباسِ کتان" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "mini-cantalar-2", label: "کیفِ کوچک" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "sik-gece-cantalari", label: "کیفِ مجلسی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", fl: "yazlik-pantolonlar", label: "شلوارِ تابستانی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", q: "bluz", label: "بلوز" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", q: "gömlek", label: "پیراهن" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", q: "kot pantolon", label: "شلوار جین" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", q: "sırt çantası", label: "کوله‌پشتی" },
  { site: "trendyol-milla", base: "https://www.trendyol-milla.com", q: "ceket", label: "ژاکت" },
  // ── ترندیولِ عمومی (ملتی‌برند — پرفروش‌ترین‌ها از ده‌ها برند، تنوعِ گسترده) ──
  // زنانه
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın bluz", label: "بلوز" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın gömlek", label: "پیراهن" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın kot pantolon", label: "شلوار جین" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın elbise", label: "لباس" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın etek", label: "دامن" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın ceket", label: "ژاکت" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın tulum", label: "تولوم" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın triko", label: "تریکو" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın sweatshirt", label: "سویشرت" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın kazak", label: "پلیور" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın hırka", label: "ژاکتِ کش‌باف" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın şort", label: "شورت" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın tişört", label: "تی‌شرت" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın mont", label: "کاپشن" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın trençkot", label: "ترنچ‌کت" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın çanta", label: "کیف" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın sırt çantası", label: "کوله‌پشتی" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın ayakkabı", label: "کفش" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın topuklu ayakkabı", label: "کفشِ پاشنه‌دار" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın sneaker", label: "کتانی" },
  // مردانه — audience:"men" چون نوعِ لباس (category خامِ ترکی) بینِ زنانه/مردانه مشترک است
  // («Gömlek» چه با کوئریِ زنانه چه مردانه پیدا شود همان می‌ماند)؛ بدونِ این تگ کالکشنِ
  // «دنیای مردانه» هیچ‌وقت نمی‌توانست این محصولات را از محصولاتِ زنانه جدا کند.
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek gömlek", label: "پیراهنِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek tişört", label: "تی‌شرتِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek pantolon", label: "شلوارِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek kot pantolon", label: "شلوار جینِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek sweatshirt", label: "سویشرتِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek ceket", label: "کتِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek mont", label: "کاپشنِ مردانه", audience: "men" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "erkek ayakkabı", label: "کفشِ مردانه", audience: "men" },
  // بچگانه
  { site: "trendyol", base: "https://www.trendyol.com", q: "çocuk elbise", label: "لباسِ بچگانه", audience: "kids" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "çocuk tişört", label: "تی‌شرتِ بچگانه", audience: "kids" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "çocuk ayakkabı", label: "کفشِ بچگانه", audience: "kids" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "bebek tulum", label: "سرهمیِ نوزاد", audience: "kids" },
  // خانه
  { site: "trendyol", base: "https://www.trendyol.com", q: "nevresim takımı", label: "روتختی", audience: "home" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "havlu", label: "حوله", audience: "home" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "ev dekorasyon", label: "دکوراسیونِ خانه", audience: "home" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "mutfak", label: "آشپزخانه", audience: "home" },
  // لباسِ‌زیر/راحتی/مایوِ زنانه — کالکشنِ زنانه را کامل‌تر می‌کند (جایگزینِ حذفِ محصولاتِ پوشیدهٔ
  // حجاب). عمداً بعدِ مردانه/بچگانه/خانه آمده تا سقفِ TOTAL_CAP اول آن‌ها را پر کند، نه این‌ها را.
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın sütyen", label: "سوتین", audience: "lingerie" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın iç giyim takım", label: "ست‌ِ لباسِ‌زیر", audience: "lingerie" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın gecelik", label: "لباسِ‌خواب", audience: "lingerie" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın mayo", label: "مایو", audience: "lingerie" },
  { site: "trendyol", base: "https://www.trendyol.com", q: "kadın bikini", label: "بیکینی", audience: "lingerie" },
  // ── برندهای منتخب (ویترینِ جدا) — featuredBrand ست می‌شود؛ brandMatch یعنی فقط محصولاتی که
  //    برندشان با این‌ها می‌خواند تگ بخورند (کوئریِ برند گاهی فروشنده‌های دیگر هم برمی‌گرداند). ──
  { site: "trendyol", base: "https://www.trendyol.com", q: "happiness istanbul", label: "Happiness", featuredBrand: "happiness", brandMatch: ["happiness"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "penti", label: "Penti", featuredBrand: "penti", brandMatch: ["penti"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "trendyolkids çocuk", label: "بچگانه", featuredBrand: "trendyol-kids", brandMatch: ["trendyolkids", "trendyol kids"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "trendyol shoes kadın", label: "کفش", featuredBrand: "trendyol-shoes", brandMatch: ["trendyol shoes"] },
  // ── برندهای محبوبِ ترندیول (هرکدام ویترینِ جدا؛ چند کوئری برای تنوعِ محصول) ──
  // مانگو
  { site: "trendyol", base: "https://www.trendyol.com", q: "mango kadın", label: "مانگو زنانه", featuredBrand: "mango", brandMatch: ["mango"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "mango elbise", label: "مانگو لباس", featuredBrand: "mango", brandMatch: ["mango"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "mango erkek", label: "مانگو مردانه", featuredBrand: "mango", brandMatch: ["mango"] },
  // کوتون
  { site: "trendyol", base: "https://www.trendyol.com", q: "koton kadın", label: "کوتون زنانه", featuredBrand: "koton", brandMatch: ["koton"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "koton elbise", label: "کوتون لباس", featuredBrand: "koton", brandMatch: ["koton"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "koton erkek", label: "کوتون مردانه", featuredBrand: "koton", brandMatch: ["koton"] },
  // دیفکتو
  { site: "trendyol", base: "https://www.trendyol.com", q: "defacto kadın", label: "دیفکتو زنانه", featuredBrand: "defacto", brandMatch: ["defacto", "de facto"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "defacto erkek", label: "دیفکتو مردانه", featuredBrand: "defacto", brandMatch: ["defacto", "de facto"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "defacto çocuk", label: "دیفکتو بچگانه", featuredBrand: "defacto", brandMatch: ["defacto", "de facto"] },
  // ماوی
  { site: "trendyol", base: "https://www.trendyol.com", q: "mavi kadın", label: "ماوی زنانه", featuredBrand: "mavi", brandMatch: ["mavi"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "mavi jean", label: "ماوی جین", featuredBrand: "mavi", brandMatch: ["mavi"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "mavi erkek", label: "ماوی مردانه", featuredBrand: "mavi", brandMatch: ["mavi"] },
  // ال‌تی‌بی
  { site: "trendyol", base: "https://www.trendyol.com", q: "ltb kadın", label: "LTB زنانه", featuredBrand: "ltb", brandMatch: ["ltb"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "ltb jean", label: "LTB جین", featuredBrand: "ltb", brandMatch: ["ltb"] },
  // یو‌اس پولو
  { site: "trendyol", base: "https://www.trendyol.com", q: "u.s. polo assn kadın", label: "US Polo زنانه", featuredBrand: "us-polo", brandMatch: ["u.s. polo", "us polo", "u.s. polo assn"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "u.s. polo assn erkek", label: "US Polo مردانه", featuredBrand: "us-polo", brandMatch: ["u.s. polo", "us polo", "u.s. polo assn"] },
  // لباسِ‌زیر/راحتی — سووِن و داغی
  { site: "trendyol", base: "https://www.trendyol.com", q: "suwen", label: "Suwen", featuredBrand: "suwen", brandMatch: ["suwen"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "dagi", label: "Dagi", featuredBrand: "dagi", brandMatch: ["dagi", "dağı"] },
  // ── فازِ ۲ (دستهٔ اول) — گسترشِ برندهای منتخب طبقِ درخواستِ کاربر؛ اول تست می‌شود، بعد دسته‌های بعدی اضافه می‌شوند ──
  // اچ‌اند‌ام
  { site: "trendyol", base: "https://www.trendyol.com", q: "h&m kadın", label: "H&M زنانه", featuredBrand: "hm", brandMatch: ["h&m"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "h&m erkek", label: "H&M مردانه", featuredBrand: "hm", brandMatch: ["h&m"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "h&m elbise", label: "H&M لباس", featuredBrand: "hm", brandMatch: ["h&m"] },
  // دکتلون
  { site: "trendyol", base: "https://www.trendyol.com", q: "decathlon spor", label: "دکتلون ورزشی", featuredBrand: "decathlon", brandMatch: ["decathlon"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "decathlon kadın", label: "دکتلون زنانه", featuredBrand: "decathlon", brandMatch: ["decathlon"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "decathlon erkek", label: "دکتلون مردانه", featuredBrand: "decathlon", brandMatch: ["decathlon"] },
  // جک‌اند‌جونز (فقط مردانه — برندِ اختصاصیِ مردانه)
  { site: "trendyol", base: "https://www.trendyol.com", q: "jack jones erkek", label: "جک‌اندجونز", featuredBrand: "jack-jones", brandMatch: ["jack & jones", "jack and jones", "jack-jones", "jack jones"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "jack jones tişört", label: "جک‌اندجونز تیشرت", featuredBrand: "jack-jones", brandMatch: ["jack & jones", "jack and jones", "jack-jones", "jack jones"] },
  // کالینز
  { site: "trendyol", base: "https://www.trendyol.com", q: "colin's kadın", label: "کالینز زنانه", featuredBrand: "colins", brandMatch: ["colin's", "colins"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "colin's erkek", label: "کالینز مردانه", featuredBrand: "colins", brandMatch: ["colin's", "colins"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "colin's jean", label: "کالینز جین", featuredBrand: "colins", brandMatch: ["colin's", "colins"] },
  // ماسیمودوتی
  { site: "trendyol", base: "https://www.trendyol.com", q: "massimo dutti kadın", label: "ماسیمودوتی زنانه", featuredBrand: "massimo-dutti", brandMatch: ["massimo dutti"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "massimo dutti erkek", label: "ماسیمودوتی مردانه", featuredBrand: "massimo-dutti", brandMatch: ["massimo dutti"] },
  // ── فازِ ۲ (دستهٔ دوم) — گروهِ اینتکس (تأییدشده روی ترندیول توسط کاربر) + گس ──
  // استرادیواریوس (عمدتاً زنانه)
  { site: "trendyol", base: "https://www.trendyol.com", q: "stradivarius kadın", label: "استرادیواریوس زنانه", featuredBrand: "stradivarius", brandMatch: ["stradivarius"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "stradivarius elbise", label: "استرادیواریوس لباس", featuredBrand: "stradivarius", brandMatch: ["stradivarius"] },
  // برشکا
  { site: "trendyol", base: "https://www.trendyol.com", q: "bershka kadın", label: "برشکا زنانه", featuredBrand: "bershka", brandMatch: ["bershka"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "bershka erkek", label: "برشکا مردانه", featuredBrand: "bershka", brandMatch: ["bershka"] },
  // اویشو (زنانه — لباسِ‌زیر/راحتی)
  { site: "trendyol", base: "https://www.trendyol.com", q: "oysho", label: "اویشو", featuredBrand: "oysho", brandMatch: ["oysho"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "oysho iç giyim", label: "اویشو لباسِ‌زیر", featuredBrand: "oysho", brandMatch: ["oysho"] },
  // پول‌اند‌بیر
  { site: "trendyol", base: "https://www.trendyol.com", q: "pull bear kadın", label: "پول‌اندبیر زنانه", featuredBrand: "pull-bear", brandMatch: ["pull & bear", "pull and bear", "pull&bear", "pull bear"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "pull bear erkek", label: "پول‌اندبیر مردانه", featuredBrand: "pull-bear", brandMatch: ["pull & bear", "pull and bear", "pull&bear", "pull bear"] },
  // گس
  { site: "trendyol", base: "https://www.trendyol.com", q: "guess kadın", label: "گس زنانه", featuredBrand: "guess", brandMatch: ["guess"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "guess erkek", label: "گس مردانه", featuredBrand: "guess", brandMatch: ["guess"] },
  { site: "trendyol", base: "https://www.trendyol.com", q: "guess çanta", label: "گس کیف", featuredBrand: "guess", brandMatch: ["guess"] },
].slice(0, LIMIT_CATEGORIES);

// همهٔ ورودی‌های ترندیول‌میلا برندِ منتخبِ trendyol-milla هستند.
for (const c of CATEGORIES) {
  if (c.site === "trendyol-milla" && !c.featuredBrand) c.featuredBrand = "trendyol-milla";
}

const APIGW = {
  "trendyol-milla": "https://apigw.trendyol-milla.com/discovery-sfint-search-service/api/search/products/",
  trendyol: "https://apigw.trendyol.com/discovery-sfint-search-service/api/search/products/",
};
const CHANNEL_ID = { "trendyol-milla": 8, trendyol: 1 };

/** یک صفحه از لیستینگ (۲۴ محصول) را با fetchِ داخلِ مرورگرِ واقعی می‌گیرد. */
async function fetchListingPage(page, cat, pageIndex) {
  const base = APIGW[cat.site];
  const params = new URLSearchParams({
    promotionSearch: "false",
    channelId: String(CHANNEL_ID[cat.site]),
    sst: "BEST_SELLER",
    pi: String(pageIndex),
    pageSize: "24",
  });
  if (cat.fl) params.set("fl", cat.fl);
  if (cat.q) params.set("q", cat.q);
  const url = `${base}?${params.toString()}`;
  return page.evaluate(async (u) => {
    try {
      const res = await fetch(u, { credentials: "include", headers: { Accept: "application/json" } });
      if (!res.ok) return { error: `http ${res.status}` };
      return await res.json();
    } catch (e) {
      return { error: String(e) };
    }
  }, url);
}

/** کاندیدهای یک دسته را جمع می‌کند (تا ۳ صفحه، تا سقفِ LIMIT_PER_CATEGORY). */
async function collectCandidates(page, cat) {
  // قبل از fetchِ اپی‌گیت‌وی، یک‌بار روی خودِ سایت باشیم (برای کوکی/کانتکستِ درست).
  await page.goto(cat.base, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  const out = [];
  for (let pi = 1; pi <= 3 && out.length < LIMIT_PER_CATEGORY; pi++) {
    const json = await fetchListingPage(page, cat, pi);
    const products = json?.products;
    if (!Array.isArray(products) || products.length === 0) break;
    for (const p of products) {
      if (!p?.id || !p?.url) continue;
      // برندِ منتخب: فقط اگر (الف) دسته featuredBrand ندارد، یا (ب) برندِ محصول با brandMatch می‌خواند.
      let featuredBrand = null;
      if (cat.featuredBrand) {
        const brandLc = (p.brand || "").toLocaleLowerCase("tr-TR");
        if (!cat.brandMatch || cat.brandMatch.some((m) => brandLc.includes(m))) {
          featuredBrand = cat.featuredBrand;
        }
      }
      // تخفیف: قیمتِ قبلی (old/originalPrice) در برابرِ قیمتِ فعلی (current).
      const cur = p.price?.current ?? p.price?.discountedPrice ?? null;
      const old = p.price?.originalPrice ?? p.price?.old ?? null;
      const onSale = cur != null && old != null && old > cur * 1.001;
      out.push({
        sourceId: p.id,
        sourceSite: cat.site,
        sourceUrl: new URL(p.url, cat.base).toString(),
        brand: p.brand || "",
        categoryTr: p.category?.name || cat.label,
        ratingScore: p.ratingScore?.averageRating ?? null,
        favoriteCount: p.ratingScore?.totalCount ?? null,
        featuredBrand,
        audience: cat.audience || null,
        onSale,
        originalPriceTL: onSale ? old : null,
        discountPct: onSale ? Math.round(((old - cur) / old) * 100) : null,
        promoLabel: p.singlePromotion?.name || p.promotions?.[0]?.name || null,
      });
      if (out.length >= LIMIT_PER_CATEGORY) break;
    }
  }
  return out;
}

/** استخراجِ بلوکِ JSONِ بعد از `window["key"]=` با شمارشِ متعادلِ آکولاد (امن‌تر از regex). */
function extractWindowJson(html, key) {
  const marker = `window["${key}"]=`;
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  let i = idx + marker.length;
  if (html[i] !== "{") return null;
  const start = i;
  let depth = 0,
    inStr = false,
    strCh = "",
    esc = false;
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

/** جزئیاتِ یک محصول را با ناوبریِ واقعی می‌گیرد. */
async function fetchDetail(page, sourceUrl) {
  const resp = await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  const status = resp ? resp.status() : 0;
  if (status === 403 || status === 429 || status === 503) return { error: "blocked" };
  const html = await page.content();
  const shared = extractWindowJson(html, "__envoy__SHARED_PROPS");
  const p = shared?.product;
  if (!p) return { error: "no-product-json" };

  // نکتهٔ مهم: freeCargo روی خودِ p.variants[] وجود ندارد (فقط size/inStock/price آنجاست).
  // تنها جایی که freeCargo واقعی هست merchantListing.winnerVariant است — یک بولیِ واحد برای
  // «سایزِ درحال‌انتخاب». چون آستانهٔ کارگوی رایگان به قیمتِ سبد بستگی دارد نه به تک‌تکِ سایزها،
  // همین یک مقدار را (به‌صورتِ محافظه‌کارانه) برای همهٔ سایزهای این محصول اعمال می‌کنیم.
  const winnerFreeCargo = !!p.merchantListing?.winnerVariant?.freeCargo;

  // ★ باگِ اصلیِ قیمت (تشخیصِ قطعی با diag-price.mjs): p.variants[].price قیمتِ یک فروشندهٔ
  //   دیگر/مرجع است، نه قیمتی که ترندیول واقعاً نمایش می‌دهد. قیمتِ نمایشیِ ترندیول همیشه
  //   merchantListing.winnerVariant.price (فروشندهٔ برنده) است. نمونه‌های واقعی:
  //     رافِ حمام: p.variants=۱۹۹.۳۹ ولی winner=۱۶۴.۳۹ (=دقیقاً چیزی که مشتری می‌بیند)
  //     پولوشرت:   p.variants=۷۹۹.۹۷ ولی winner=۳۹۸.۱۱
  //   پس قیمتِ برنده را می‌خوانیم؛ و برای ایمنی کمینهٔ آن با قیمتِ واریانت گرفته می‌شود تا
  //   هیچ‌وقت بیشتر از قیمتِ واقعیِ ترندیول به مشتری نشان/فروخته نشود.
  const wv = p.merchantListing?.winnerVariant?.price;
  const winnerPrice =
    (typeof wv?.discountedPrice?.value === "number" && wv.discountedPrice.value) ||
    (typeof wv?.sellingPrice?.value === "number" && wv.sellingPrice.value) ||
    (typeof wv?.originalPrice?.value === "number" && wv.originalPrice.value) ||
    null;

  // قیمتِ هر سایز: winnerVariant فقط قیمتِ سایزِ انتخاب‌شده را دارد، نه همهٔ سایزها. ولی نسبتِ
  // قیمتِ سایزها در p.variants درست است (فقط baseِ آن merchantِ اشتباه است). پس قیمتِ برندهٔ هر
  // سایز = قیمتِ برندهٔ سایزِ انتخاب‌شده × (قیمتِ این سایز ÷ قیمتِ سایزِ انتخاب‌شده). برای سایزهای
  // هم‌قیمت این نسبت ۱ است و همه قیمتِ برنده می‌گیرند؛ برای سایزهای گران‌ترِ واقعی، تفاوت حفظ می‌شود.
  const selectedVariant = (p.variants || []).find((v) => v.isSelected) || (p.variants || [])[0];
  const selectedVariantPrice =
    typeof selectedVariant?.price?.value === "number" ? selectedVariant.price.value : null;

  const variantOnlyPrices = []; // قیمتِ خامِ p.variants (روشِ قدیمی) — فقط برای ممیزی
  const rawVariants = (p.variants || []).map((v) => {
    const variantPrice = typeof v.price?.value === "number" ? v.price.value : null;
    if (variantPrice != null) variantOnlyPrices.push(variantPrice);
    let priceTL = variantPrice;
    if (winnerPrice != null) {
      if (variantPrice != null && selectedVariantPrice != null && selectedVariantPrice > 0) {
        const perSizeWinner = winnerPrice * (variantPrice / selectedVariantPrice);
        // کمینه با قیمتِ خودِ واریانت: تضمینِ اینکه هیچ‌وقت بیشتر از قیمتِ واقعی گرفته نشود.
        priceTL = Math.min(perSizeWinner, variantPrice);
      } else {
        priceTL = variantPrice != null ? Math.min(winnerPrice, variantPrice) : winnerPrice;
      }
    }
    return {
      size: v.beautifiedValue || v.value || "استاندارد",
      inStock: !!v.inStock,
      priceTL: priceTL != null ? Math.round(priceTL * 100) / 100 : null,
      freeCargo: winnerFreeCargo,
    };
  });
  // باگِ واقعی که پیدا شد: وقتی چند رنگ‌بندی زیرِ یک لیستینگ ادغام شده باشند، p.variants همان
  // سایز را چندبار برمی‌گرداند — یک‌بار به‌ازای هر رنگ، هرکدام با قیمتِ خودش (رنگ‌های خاص/محدود
  // گاهی گران‌تر از رنگِ پایه‌اند). قبلاً «اولین رخداد» نگه داشته می‌شد که کاملاً به ترتیبِ
  // برگشتیِ آرایه بستگی داشت — می‌توانست رنگِ گران‌تر را به‌جای رنگِ نمایش‌داده‌شده ذخیره کند
  // (دقیقاً همین باعثِ گزارشِ «قیمتِ سایت با ترندیول فرق دارد» شد). حالا برای هر سایزِ تکراری
  // **ارزان‌ترین قیمت** نگه داشته می‌شود — تضمین می‌کند هیچ‌وقت به مشتری بیشتر از کمترین قیمتِ
  // واقعیِ آن سایز نشان داده نشود (اگر رنگِ گران‌تر بود، staff موقعِ تأیید با لینکِ اصل می‌بیند).
  const bySize = new Map();
  let sawMergedColors = false;
  for (const v of rawVariants) {
    const prev = bySize.get(v.size);
    if (prev && v.priceTL != null && prev.priceTL != null && v.priceTL !== prev.priceTL) sawMergedColors = true;
    if (!prev || (v.priceTL != null && (prev.priceTL == null || v.priceTL < prev.priceTL))) {
      bySize.set(v.size, v);
    }
  }
  if (sawMergedColors) mergedColorDetections++;
  const variants = [...bySize.values()];
  const prices = variants.map((v) => v.priceTL).filter((n) => n != null);

  return {
    nameTr: p.name || "",
    brand: p.brand?.name || "",
    categoryTr: p.category?.name || p.webCategory?.name || "",
    image: Array.isArray(p.images) ? p.images.find((u) => !/placeholder/i.test(u)) || p.images[0] || null : null,
    images: Array.isArray(p.images) ? p.images.filter((u) => !/placeholder/i.test(u)).slice(0, 6) : [],
    attributes: translateAttributes(p.attributes),
    variants,
    minPriceTL: prices.length ? Math.min(...prices) : null,
    // برای ممیزی: قیمتِ روشِ قدیمی (فقط variant) در برابرِ روشِ جدید (winner) — اگر فرق داشت،
    // یعنی این محصول با روشِ قدیمی قیمتِ اشتباه می‌گرفت و حالا اصلاح شده.
    oldVariantMinTL: variantOnlyPrices.length ? Math.min(...variantOnlyPrices) : null,
  };
}

async function upsertProduct(c, detail, now) {
  // ترجمهٔ نامِ کامل هنوز خودکار نیست (جایگزینیِ واژه‌به‌واژه نتیجهٔ نصفه‌کاره/نامفهوم می‌داد —
  // بدتر از نشان‌دادنِ صادقانهٔ نامِ ترکی). فقط ۴ محصولِ MANUAL_OVERRIDES نامِ فارسیِ باکیفیت دارند؛
  // بقیه با نامِ ترکی نمایش داده می‌شوند تا ترجمهٔ AI (بعدِ فعال‌سازیِ چت‌بات) این را کامل کند.
  const override = MANUAL_OVERRIDES[c.sourceId];
  const nameFa = override?.nameFa || null;
  const descriptionFa = override?.descriptionFa || null;
  const categoryTr = detail.categoryTr || c.categoryTr;
  const searchText = trLower([nameFa, detail.nameTr, detail.brand].filter(Boolean).join(" "));

  // originalPriceTL از سطحِ لیستینگِ جستجو می‌آید ولی minPriceTL از ارزان‌ترینِ سایزهای واقعاً
  // اسکرپ‌شدهٔ همین محصول — وقتی چند رنگ‌بندی زیرِ یک لیستینگ ادغام شده باشند این دو به یک
  // سایز/واریانت اشاره ندارند و originalPriceTL می‌تواند حتی کمتر از minPriceTL دربیاید (تخفیفِ
  // منطقاً معکوس). فقط وقتی واقعاً originalPriceTL > minPriceTL باشد تخفیف را ذخیره کن.
  const genuineDiscount =
    !!c.onSale && c.originalPriceTL != null && detail.minPriceTL != null && c.originalPriceTL > detail.minPriceTL;
  // درصدِ تخفیف را از خودِ قیمت‌های ذخیره‌شده (قیمتِ اصلی و قیمتِ فعلیِ winner) حساب کن، نه از
  // درصدِ مرحلهٔ لیستینگ — وگرنه با قیمتِ نمایشیِ جدید نمی‌خواند و تخفیفِ نادرست نشان می‌دهد.
  const discountPct = genuineDiscount
    ? Math.round(((c.originalPriceTL - detail.minPriceTL) / c.originalPriceTL) * 100)
    : null;

  const data = {
    sourceUrl: c.sourceUrl,
    brand: detail.brand || c.brand,
    category: categoryTr,
    categoryFa: categoryLabelFa(categoryTr),
    nameTr: detail.nameTr,
    nameFa,
    descriptionFa,
    image: detail.image,
    images: JSON.stringify(detail.images || []),
    attributes: JSON.stringify(detail.attributes || []),
    searchText,
    minPriceTL: detail.minPriceTL,
    ratingScore: c.ratingScore,
    favoriteCount: c.favoriteCount,
    onSale: genuineDiscount,
    originalPriceTL: genuineDiscount ? c.originalPriceTL : null,
    discountPct,
    promoLabel: genuineDiscount ? c.promoLabel : null,
    featuredBrand: c.featuredBrand ?? null,
    audience: c.audience ?? null,
    isActive: true,
    lastSyncedAt: now,
  };

  const product = await prisma.mirrorProduct.upsert({
    where: { sourceSite_sourceId: { sourceSite: c.sourceSite, sourceId: c.sourceId } },
    create: { sourceSite: c.sourceSite, sourceId: c.sourceId, ...data },
    update: data,
  });

  // resyncِ واریانت‌ها: حذف و بازساخت داخلِ تراکنش (تعدادِ سایز ممکن است عوض شده باشد).
  await prisma.$transaction([
    prisma.mirrorVariant.deleteMany({ where: { productId: product.id } }),
    prisma.mirrorVariant.createMany({
      data: (detail.variants || []).map((v) => ({
        productId: product.id,
        size: v.size,
        inStock: v.inStock,
        priceTL: v.priceTL,
        freeCargo: v.freeCargo,
      })),
    }),
  ]);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`سینکِ کاتالوگِ ترندیول — ${CATEGORIES.length} دسته، سقفِ هر دسته ${LIMIT_PER_CATEGORY}`);
  const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
  const ctx = await browser.newContext({
    locale: "tr-TR",
    viewport: { width: 1366, height: 768 },
    userAgent: UA,
  });
  await ctx.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => undefined }));
  await ctx.route("**/*", (r) =>
    ["image", "media", "font"].includes(r.request().resourceType()) ? r.abort() : r.continue()
  );

  // ── مرحلهٔ ۱: لیستینگ (سریع، fetchِ APIِ داخلِ صفحه) ──
  const listingPage = await ctx.newPage();
  const seen = new Map(); // "site:sourceId" → candidate (دیدوپلیکیت بینِ دسته‌ها)
  for (const cat of CATEGORIES) {
    // برندهای منتخب از سقفِ کلی معاف‌اند تا همیشه سینک شوند (وگرنه چون آخرِ لیست‌اند، سقفِ
    // فایرهوزِ عمومی قبل از رسیدن به آن‌ها پُر می‌شود و اصلاً کوئری نمی‌شوند). سقف فقط عمومی را محدود می‌کند.
    if (!cat.featuredBrand && seen.size >= TOTAL_CAP) continue;
    try {
      const candidates = await collectCandidates(listingPage, cat);
      let added = 0;
      for (const c of candidates) {
        const key = `${c.sourceSite}:${c.sourceId}`;
        const prev = seen.get(key);
        if (!prev) {
          seen.set(key, c);
          added++;
        } else if (!prev.featuredBrand && c.featuredBrand) {
          // اگر همین محصول قبلاً از کوئریِ عمومی دیده شده بود، برچسبِ برندِ منتخب را حفظ کن.
          prev.featuredBrand = c.featuredBrand;
        }
      }
      console.log(`  لیستینگ ${cat.site}/${cat.label}: ${candidates.length} کاندید (${added} جدید)`);
    } catch (e) {
      console.log(`  لیستینگ ${cat.site}/${cat.label}: خطا — ${String(e).slice(0, 80)}`);
    }
  }
  await listingPage.close();
  // سقف فقط روی محصولاتِ عمومی اعمال می‌شود؛ همهٔ محصولاتِ برندهای منتخب حفظ می‌شوند
  // (حتی اگر بعد از پُرشدنِ سقف اضافه شده باشند)، وگرنه slice آن‌ها را که آخرند می‌بُرد.
  const seenVals = [...seen.values()];
  const candidates = [
    ...seenVals.filter((c) => !c.featuredBrand).slice(0, TOTAL_CAP),
    ...seenVals.filter((c) => c.featuredBrand),
  ];
  console.log(
    `مجموعِ کاندیدهای یکتا: ${candidates.length} (${candidates.filter((c) => c.featuredBrand).length} برندِ منتخب)`
  );

  // ── مرحلهٔ ۲: جزئیات (با همزمانیِ محدود، مثلِ check-sales.mjs) ──
  const now = new Date();
  let idx = 0,
    ok = 0,
    failed = 0;
  const pages = await Promise.all(Array.from({ length: DETAIL_CONCURRENCY }, () => ctx.newPage()));
  await Promise.all(
    pages.map(async (page) => {
      while (idx < candidates.length) {
        const c = candidates[idx++];
        await sleep(200 + Math.random() * 400); // ادبِ درخواست
        try {
          const detail = await fetchDetail(page, c.sourceUrl);
          if (detail.error) {
            failed++;
            continue;
          }
          // ممیزیِ سراسری: اگر قیمتِ روشِ قدیمی (variant) با قیمتِ درستِ جدید (winner) فرق داشت،
          // یعنی این محصول تا الان قیمتِ اشتباه داشت و همین سینک اصلاحش کرد. همه را در فایل ثبت کن.
          if (
            detail.oldVariantMinTL != null &&
            detail.minPriceTL != null &&
            Math.abs(detail.oldVariantMinTL - detail.minPriceTL) > 0.01
          ) {
            priceCorrections++;
            auditLines.push(
              `${c.sourceSite}\t${c.featuredBrand || "-"}\t${detail.oldVariantMinTL}\t${detail.minPriceTL}\t${c.sourceUrl}`
            );
          }
          await upsertProduct(c, detail, now);
          ok++;
          if (ok % 25 === 0) console.log(`  پیشرفت: ${ok}/${candidates.length}`);
        } catch (e) {
          failed++;
          console.log(`  خطا در ${c.sourceUrl.slice(0, 70)}: ${String(e).slice(0, 80)}`);
        }
      }
    })
  );
  await browser.close();

  // محصولاتی که این بار دیده نشدند (ولی قبلاً بودند) → غیرفعال (نه حذفِ فیزیکی).
  // فقط محصولاتِ همین سینک (trendyol + trendyol-milla) را غیرفعال کن — نه آمبار! آمبار منبعِ
  // جداست (sync-ambar.mjs) و این اجرا آن را نمی‌بیند؛ بدونِ این scope، sweep کلِ کاتالوگِ آمبار را
  // اشتباهی غیرفعال می‌کرد.
  const stale = await prisma.mirrorProduct.updateMany({
    where: { isActive: true, lastSyncedAt: { lt: now }, sourceSite: { in: ["trendyol", "trendyol-milla"] } },
    data: { isActive: false },
  });

  // نوشتنِ گزارشِ ممیزیِ قیمت — لیستِ کاملِ هر محصولی که قیمتش اصلاح شد (همهٔ ۵۴۰۰، نه نمونه).
  try {
    fs.writeFileSync("price-audit.tsv", auditLines.join("\n"), "utf8");
  } catch (e) {
    console.log("  (هشدار: نوشتنِ price-audit.tsv ناموفق:", String(e).slice(0, 80), ")");
  }

  console.log(
    `\n✓ تمام شد. موفق: ${ok}، ناموفق: ${failed}، غیرفعال‌شده (دیگر دیده نشد): ${stale.count}`
  );
  console.log(
    `📊 ممیزیِ قیمت: از ${ok} محصولِ بررسی‌شده، ${priceCorrections} محصول قیمتِ اشتباه داشت که اصلاح شد ` +
      `(جزئیاتِ کامل در price-audit.tsv). ادغامِ رنگ: ${mergedColorDetections}.`
  );
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
