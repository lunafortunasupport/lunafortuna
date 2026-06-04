const users = new Map();
const orders = new Map();
const settings = { rate: 4800 };

// نرخ نهایی لیر (صرافی + 15٪)
function getFinalRate() { return Math.round(settings.rate * 1.15); }

// محاسبه قیمت نهایی بر اساس نوع تخفیف
function calcPrice(lir, feeType) {
  const fees = { normal: 0.15, referral: 0.12, birthday: 0.12, silver: 0.12, gold: 0.10 };
  const fee = fees[feeType] || 0.15;
  return Math.round(lir * settings.rate * (1 + fee));
}

function formatPrice(n) { return Math.round(n).toLocaleString('fa-IR') + ' تومان'; }

function getUserLevel(doneCount) {
  if (doneCount >= 10) return { name: '🥇 طلایی', fee: 'gold' };
  if (doneCount >= 5)  return { name: '🥈 نقره',  fee: 'silver' };
  return { name: '🥉 عادی', fee: 'normal' };
}

function generateReferralCode(chatId) { return 'LUNA' + chatId.toString().slice(-4); }

const turkishGuide = {
  women: [
    ['شلوار', 'Pantolon'], ['پیراهن', 'Elbise'], ['بلوز', 'Bluz'],
    ['تیشرت', 'Tişört'], ['نیم‌تنه', 'Crop Top'], ['سوتین', 'Sütyen'],
    ['سوتین ورزشی', 'Spor Sütyeni'], ['دامن', 'Etek'], ['کاپشن', 'Mont / Kaban'],
    ['ژاکت / بافت', 'Kazak / Hırka'], ['شلوارک', 'Şort'], ['لباس زیر', 'İç Çamaşırı'],
    ['جوراب', 'Çorap'], ['روسری', 'Eşarp'], ['کلاه', 'Şapka / Bere'],
  ],
  men: [
    ['پیراهن', 'Gömlek'], ['شلوار', 'Pantolon'], ['تیشرت', 'Tişört'],
    ['کت', 'Ceket'], ['کاپشن', 'Mont / Kaban'], ['شلوارک', 'Şort'],
    ['بافت / ژاکت', 'Kazak'], ['لباس زیر', 'İç Çamaşırı'], ['جوراب', 'Çorap'],
  ],
  shoes: [
    ['کفش', 'Ayakkabı'], ['کفش ورزشی', 'Spor Ayakkabı'], ['بوت', 'Bot'],
    ['صندل', 'Sandalet'], ['کتونی', 'Sneaker'],
  ],
  bags: [
    ['کیف', 'Çanta'], ['کیف دستی', 'El Çantası'], ['کوله پشتی', 'Sırt Çantası'],
    ['کیف شانه', 'Omuz Çantası'], ['کیف پول', 'Cüzdan'], ['کمربند', 'Kemer'],
  ],
  beauty: [
    ['رژ لب', 'Ruj'], ['کرم پودر', 'Fondöten'], ['ریمل', 'Maskara'],
    ['عطر', 'Parfüm'], ['کرم', 'Krem'], ['شامپو', 'Şampuan'],
    ['ضد آفتاب', 'Güneş Kremi'],
  ],
  home: [
    ['ملحفه', 'Nevresim'], ['حوله', 'Havlu'], ['پرده', 'Perde'],
    ['رومیزی', 'Masa Örtüsü'], ['فرش', 'Halı / Kilim'],
  ],
};

const sizeGuide = {
  clothing: `📏 راهنمای سایز پوشاک:\n\nXS = ۳۲-۳۴\nS  = ۳۶-۳۸\nM  = ۳۸-۴۰\nL  = ۴۰-۴۲\nXL = ۴۲-۴۴\nXXL = ۴۴-۴۶\n\n💡 Beden = سایز\n💡 Renk = رنگ`,
  shoes: `👟 راهنمای سایز کفش:\n\n۳۶ · ۳۷ · ۳۸ · ۳۹ · ۴۰\n۴۱ · ۴۲ · ۴۳ · ۴۴\n\n💡 Numara = سایز\n💡 Spor Ayakkabı = کفش ورزشی\n💡 Bot = بوت`,
};

const filters = `🔍 فیلترهای مهم سایت‌های ترکیه:\n\nFiyat = قیمت\nBeden = سایز\nRenk = رنگ\nİndirim = تخفیف\nKampanya = حراج\nÜcretsiz Kargo = ارسال رایگان\nYeni = جدید\nEn Çok Satan = پرفروش\nMarka = برند\nKadın = زن\nErkek = مرد\nÇocuk = کودک`;

const statusLabels = {
  pending:   '⏳ در انتظار پرداخت',
  paid:      '✅ پرداخت تأیید شد',
  received:  '📦 محصول دریافت و بررسی شد',
  shipped:   '🚚 ارسال شد',
  delivered: '✅ تحویل داده شد',
  cancelled: '❌ لغو شد',
};

const statusMessages = {
  paid: `✅ پرداخت شما با موفقیت تأیید شد\n🌙 ممنون از اعتماد شما به Luna Fortuna\n🛒 سفارش شما ثبت و در صف خرید قرار گرفت`,
  received: `📦 کارگو در استانبول محصول شما را به ما تحویل داد\n✅ محصول شما بررسی و تأیید شد\n\n❓ سوالی دارید؟`,
  shipped: `🚚 محصول شما از استانبول ارسال شد!\n🌙 از صبر و اعتماد شما سپاسگزاریم\nامیدواریم از خریدتان لذت ببرید 🎁`,
  delivered: `✅ محصول شما تحویل داده شد\n🌙 خوشحال می‌شویم نظرتان را بشنویم\nمنتظر خریدهای بعدی شما هستیم 🛍`,
  cancelled: `❌ سفارش شما لغو شد\nبرای اطلاعات بیشتر با پشتیبانی تماس بگیرید`,
};

module.exports = {
  saveUser(chatId, data) {
    const ex = users.get(chatId.toString()) || {};
    users.set(chatId.toString(), { ...ex, chatId, ...data });
  },
  getUser(chatId) { return users.get(chatId.toString()); },
  getAllUsers() { return Array.from(users.values()); },

  addOrder(order) {
    const id = Date.now().toString();
    const shortId = id.slice(-4);
    orders.set(id, { ...order, id, shortId, status: 'pending', createdAt: new Date().toISOString() });
    return { id, shortId };
  },
  getOrder(id) { return orders.get(id); },
  getAllOrders() { return Array.from(orders.values()); },
  updateOrder(id, data) {
    const o = orders.get(id);
    if (o) { orders.set(id, { ...o, ...data }); return true; }
    return false;
  },
  getUserOrders(chatId) {
    return Array.from(orders.values()).filter(o => o.chatId === chatId.toString());
  },

  getRate() { return settings.rate; },
  setRate(v) { settings.rate = Number(v); },
  getFinalRate,
  calcPrice,
  formatPrice,
  getUserLevel,
  generateReferralCode,
  turkishGuide,
  sizeGuide,
  filters,
  statusLabels,
  statusMessages,
};
