// دیکشنریِ ترکی→فارسی برای سینکِ کاتالوگِ ترندیول.
// فقط توسط scripts/sync-trendyol.mjs استفاده می‌شود (خودکفا، بدون importِ src/ — هم‌راستا با
// scripts/check-sales.mjs که هیچ importِ داخلیِ اپ ندارد).

// برچسبِ فارسیِ دسته‌ها (کلیدِ خامِ ترکیِ `category.name` از دادهٔ ترندیول).
export const CATEGORY_LABELS_FA = {
  Bluz: "بلوز",
  Gömlek: "پیراهن",
  "Kot Pantolon": "شلوار جین",
  Pantolon: "شلوار",
  Jean: "شلوار جین",
  "Sırt Çantası": "کوله‌پشتی",
  Elbise: "لباس",
  Ceket: "ژاکت",
  Mont: "کاپشن",
  Etek: "دامن",
  Çanta: "کیف",
  Tulum: "تولوم (سرهمی)",
  Triko: "تریکو",
  Ayakkabı: "کفش",
  "T-Shirt": "تی‌شرت",
  Şort: "شورت (کوتاه)",
  Kazak: "پلیور",
  Hırka: "ژاکتِ کش‌باف",
  Jeans: "شلوار جین",
  "Omuz Çantası": "کیفِ دوشی",
  "El Çantası": "کیفِ دستی",
  "Portföy & Clutch Çanta": "کیفِ مجلسی",
  "Okul Çantası": "کیفِ مدرسه",
  "Tesettür Elbise": "لباسِ پوشیده (حجاب)",
  "Tesettür Etek": "دامنِ پوشیده (حجاب)",
  "Abiye & Mezuniyet Elbisesi": "لباسِ مجلسی/فارغ‌التحصیلی",
  "Blazer Ceket": "بلیزر",
  "Deniz Ayakkabısı": "کفشِ ساحلی",
  Panço: "پانچو",
  Salopet: "سرهمیِ شلواری",
  Sneaker: "کفشِ اسپرت",
  Atlet: "زیرپوش/تاپ",
  Büstiyer: "بوستیه",
  Sandalet: "صندل",
};

// کلیدهای رایجِ ویژگی (attribute.key.name) → برچسبِ فارسی.
export const ATTR_KEY_FA = {
  Renk: "رنگ",
  "Kumaş Tipi": "نوعِ پارچه",
  Materyal: "جنس",
  "Materyal Bileşeni": "ترکیبِ جنس",
  Kalıp: "قالب",
  Desen: "طرح",
  "Yaka Tipi": "نوعِ یقه",
  "Kol Tipi": "نوعِ آستین",
  "Kol Boyu": "طولِ آستین",
  Boy: "بلندی",
  Bel: "کمر",
  "Paça Tipi": "نوعِ پاچه",
  Siluet: "سیلوئت",
  Ortam: "مناسبتِ استفاده",
  Sezon: "فصل",
  Menşei: "کشورِ سازنده",
  "Dokuma Tipi": "نوعِ بافت",
  Persona: "سبک",
  "Kapama Şekli": "نوعِ بستن",
  Cep: "جیب",
  Koleksiyon: "کالکشن",
  "Ek Özellik": "ویژگیِ اضافه",
  "Kemer/Kuşak Durumu": "وضعیتِ کمربند",
  Topuk: "پاشنه",
  "Ayakkabı Burnu": "نوکِ کفش",
};

// مقادیرِ رایج (attribute.value.name یا واژه‌های داخلِ نام) → فارسی.
export const VALUE_FA = {
  // رنگ‌ها
  Siyah: "مشکی", Beyaz: "سفید", Kırmızı: "قرمز", Mavi: "آبی", Lacivert: "سرمه‌ای",
  Yeşil: "سبز", Sarı: "زرد", Turuncu: "نارنجی", Mor: "بنفش", Pembe: "صورتی",
  Gri: "طوسی", Kahverengi: "قهوه‌ای", Bej: "بژ", Vizon: "ویزون (خاکستری‌مایل‌به‌قهوه‌ای)",
  Ekru: "کرم", Bordo: "زرشکی", Krem: "کرم", Altın: "طلایی", Gümüş: "نقره‌ای",
  // جنس/پارچه
  Pamuklu: "نخی", Pamuk: "نخ", Polyester: "پلی‌استر", Poliamid: "پلی‌آمید",
  Elastan: "الاستان", Keten: "کتان", Yün: "پشمی", Deri: "چرم", Süet: "جیر",
  Dokuma: "بافته", Örme: "کش‌باف", Denim: "جین (دنیم)", Saten: "ساتن", Vual: "ووال",
  Şifon: "شیفون", Tül: "تور", Kadife: "مخمل", Viskoz: "ویسکوز", Modal: "مودال",
  Likra: "لایکرا", Naylon: "نایلون", Rayon: "رایون", Spandex: "اسپاندکس",
  // قالب/طرح
  Düz: "ساده", Oversize: "اورسایز", Regular: "معمولی", Slim: "اسلیم (چسبان)",
  "Wide Leg": "پاچه‌گشاد", Skinny: "اسلیم", Straight: "راست", Puantiyeli: "خالدار",
  Çizgili: "راه‌راه", Desenli: "طرح‌دار", Çiçekli: "گل‌دار",
  // یقه/آستین
  "Bisiklet Yaka": "یقه‌گرد", "Halter Yaka": "یقه‌هالتر", "V Yaka": "یقه‌هفت",
  "Gömlek Yaka": "یقه‌پیراهنی", "Dik Yaka": "یقه‌ایستاده", "Kayık Yaka": "یقه‌قایقی",
  "Kare Yaka": "یقه‌مربعی", "Kapüşonlu": "کلاه‌دار", Kolsuz: "بدونِ آستین",
  "Uzun Kol": "آستینِ بلند", "Kısa Kol": "آستینِ کوتاه", "Yarasa Kol": "آستینِ خفاشی",
  "3/4 Kol": "آستینِ سه‌ربع",
  Uzun: "بلند", Kısa: "کوتاه", Midi: "میدی", Maxi: "مکسی", Mini: "کوتاه",
  // مناسبت/فصل/سبک
  "Casual/Günlük": "روزمره", Party: "مهمانی", Smart: "شیک", Feminine: "زنانه",
  "Cool & Comfort": "راحت و خنک", "Tüm Sezonlar": "همهٔ فصل‌ها", Sportive: "اسپرت",
  "İlkbahar / Sonbahar": "بهار / پاییز", Yaz: "تابستان", Kış: "زمستان", İlkbahar: "بهار", Sonbahar: "پاییز",
  // متفرقه
  Düğmeli: "دکمه‌دار", Cepsiz: "بدونِ جیب", Fermuarlı: "زیپ‌دار",
  Belirtilmemiş: "مشخص‌نشده", Yok: "ندارد", Var: "دارد", Evet: "بله", Hayır: "خیر",
  TR: "ترکیه", "Türkiye": "ترکیه", Çin: "چین", Bangladeş: "بنگلادش", Hindistan: "هند",
};

/** lowercase امنِ ترکی (İ/I را درست تبدیل می‌کند) — هم در سینک هم در کوئریِ سرچ باید یکسان استفاده شود. */
export function trLower(s) {
  return String(s || "")
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR");
}

/** ترجمهٔ آرایهٔ attributes خامِ ترندیول (`{key:{name}, value:{name}}[]`) به `{labelFa, valueFa}[]`. */
export function translateAttributes(rawAttributes) {
  if (!Array.isArray(rawAttributes)) return [];
  const out = [];
  for (const a of rawAttributes) {
    const keyTr = a?.key?.name;
    const valTr = a?.value?.name;
    if (!keyTr || !valTr) continue;
    const labelFa = ATTR_KEY_FA[keyTr];
    if (!labelFa) continue; // فقط کلیدهایی که نگاشتِ فارسی دارند نمایش داده می‌شوند (بدونِ درج خام ترکی)
    const valueFa = translateComposition(valTr) || VALUE_FA[valTr];
    if (!valueFa) continue; // مقدارِ ناشناخته را نشان نده (تا ترکیِ خام وسطِ جدولِ فارسی درز نکند)
    out.push({ labelFa, valueFa });
  }
  return out;
}

/** رشته‌های ترکیبیِ جنس مثلِ "87% Pamuk,13% Poliamid" را به فارسی برمی‌گرداند؛ در غیرِ این صورت null. */
function translateComposition(v) {
  if (!/%/.test(v)) return null;
  const parts = String(v).split(",").map((s) => s.trim());
  const out = [];
  for (const part of parts) {
    const m = part.match(/^(\d+)%\s*(.+)$/);
    if (!m) return null;
    const [, pct, word] = m;
    const wordFa = VALUE_FA[word.trim()] || word.trim();
    out.push(`${toFaDigits(pct)}٪ ${wordFa}`);
  }
  return out.join("، ");
}

function toFaDigits(n) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

export function categoryLabelFa(categoryNameTr) {
  return CATEGORY_LABELS_FA[categoryNameTr] || categoryNameTr;
}
