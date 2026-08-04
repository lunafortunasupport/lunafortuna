// راهنمای خرید — کلمات ترکی و راهنمای سایز (پورت‌شده از نسخهٔ قبلی)

export const turkishGuide: Record<string, { label: string; items: [string, string][] }> = {
  women: {
    label: "👗 پوشاک زنانه",
    items: [
      ["شلوار", "Pantolon"], ["پیراهن", "Elbise"], ["بلوز", "Bluz"],
      ["تیشرت", "Tişört"], ["نیم‌تنه", "Crop Top"], ["سوتین", "Sütyen"],
      ["سوتین ورزشی", "Spor Sütyeni"], ["دامن", "Etek"], ["کاپشن", "Mont / Kaban"],
      ["ژاکت / بافت", "Kazak / Hırka"], ["شلوارک", "Şort"], ["لباس زیر", "İç Çamaşırı"],
      ["جوراب", "Çorap"], ["روسری", "Eşarp"], ["کلاه", "Şapka / Bere"],
    ],
  },
  men: {
    label: "👔 پوشاک مردانه",
    items: [
      ["پیراهن", "Gömlek"], ["شلوار", "Pantolon"], ["تیشرت", "Tişört"],
      ["کت", "Ceket"], ["کاپشن", "Mont / Kaban"], ["شلوارک", "Şort"],
      ["بافت / ژاکت", "Kazak"], ["لباس زیر", "İç Çamaşırı"], ["جوراب", "Çorap"],
    ],
  },
  shoes: {
    label: "👟 کفش",
    items: [
      ["کفش", "Ayakkabı"], ["کفش ورزشی", "Spor Ayakkabı"], ["بوت", "Bot"],
      ["صندل", "Sandalet"], ["کتونی", "Sneaker"],
    ],
  },
  bags: {
    label: "👜 کیف",
    items: [
      ["کیف", "Çanta"], ["کیف دستی", "El Çantası"], ["کوله پشتی", "Sırt Çantası"],
      ["کیف شانه", "Omuz Çantası"], ["کیف پول", "Cüzdan"], ["کمربند", "Kemer"],
    ],
  },
  beauty: {
    label: "💄 آرایشی",
    items: [
      ["رژ لب", "Ruj"], ["کرم پودر", "Fondöten"], ["ریمل", "Maskara"],
      ["عطر", "Parfüm"], ["کرم", "Krem"], ["شامپو", "Şampuan"],
      ["ضد آفتاب", "Güneş Kremi"],
    ],
  },
  home: {
    label: "🏠 خانه",
    items: [
      ["ملحفه", "Nevresim"], ["حوله", "Havlu"], ["پرده", "Perde"],
      ["رومیزی", "Masa Örtüsü"], ["فرش", "Halı / Kilim"],
    ],
  },
};

export const sizeGuide = {
  clothing: [
    ["XS", "۳۲-۳۴"], ["S", "۳۶-۳۸"], ["M", "۳۸-۴۰"],
    ["L", "۴۰-۴۲"], ["XL", "۴۲-۴۴"], ["XXL", "۴۴-۴۶"],
  ] as [string, string][],
  shoes: ["۳۶", "۳۷", "۳۸", "۳۹", "۴۰", "۴۱", "۴۲", "۴۳", "۴۴"],
};

export const filters: [string, string][] = [
  ["Fiyat", "قیمت"], ["Beden", "سایز"], ["Renk", "رنگ"],
  ["İndirim", "تخفیف"], ["Kampanya", "حراج"], ["Ücretsiz Kargo", "ارسال رایگان"],
  ["Yeni", "جدید"], ["En Çok Satan", "پرفروش"], ["Marka", "برند"],
  ["Kadın", "زن"], ["Erkek", "مرد"], ["Çocuk", "کودک"],
];

export const statusLabels: Record<string, string> = {
  pending: "⏳ در انتظار پرداخت",
  paid: "✅ پرداخت تأیید شد",
  received: "📦 محصول دریافت و بررسی شد",
  shipped: "🚚 ارسال شد",
  delivered: "✅ تحویل داده شد",
  cancelled: "❌ لغو شد",
};
