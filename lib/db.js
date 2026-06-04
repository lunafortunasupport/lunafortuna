// ─── دیتابیس Luna Fortuna v3 ───
const users = new Map();
const orders = new Map();
const settings = { rate: 4800 };

// ─── سطح مشتری ───
const levels = {
  bronze: { name: '🥉 عادی', minOrders: 0, fee: 0.15 },
  silver: { name: '🥈 نقره', minOrders: 5, fee: 0.12 },
  gold:   { name: '🥇 طلایی', minOrders: 10, fee: 0.10 },
};

function getUserLevel(orderCount) {
  if (orderCount >= 10) return levels.gold;
  if (orderCount >= 5)  return levels.silver;
  return levels.bronze;
}

// ─── محاسبه قیمت ───
function calcPrice(lirAmount, feePercent) {
  const rate = settings.rate;
  const fee = feePercent || levels.bronze.fee;
  return Math.round(lirAmount * rate * (1 + fee));
}

function formatPrice(n) {
  return Math.round(n).toLocaleString('fa-IR') + ' تومان';
}

// ─── کد معرف ───
function generateReferralCode(chatId) {
  return 'LUNA' + chatId.toString().slice(-4);
}

// ─── کارمزد بر اساس وضعیت ───
const feeTypes = {
  normal:   { label: 'عادی',      fee: 0.15 },
  referral: { label: 'کد معرف',   fee: 0.12 },
  birthday: { label: 'تولد',      fee: 0.12 },
  silver:   { label: 'مشتری نقره', fee: 0.12 },
  gold:     { label: 'مشتری طلایی', fee: 0.10 },
};

// ─── برندها ───
const brands = {
  multi: [
    { name: 'Trendyol',          url: 'https://www.trendyol.com/kampanya' },
    { name: 'Hepsiburada',       url: 'https://www.hepsiburada.com/indirim' },
    { name: 'N11',               url: 'https://www.n11.com/indirim' },
    { name: 'Boyner',            url: 'https://www.boyner.com.tr/indirim' },
    { name: 'Sportive',          url: 'https://www.sportive.com.tr/indirim' },
    { name: 'Superstep',         url: 'https://www.superstep.com.tr/indirim' },
    { name: 'House of Superstep',url: 'https://www.houseofsuperstep.com/indirim' },
    { name: 'Intersport',        url: 'https://www.intersport.com.tr/indirim' },
    { name: 'Pazarama',          url: 'https://www.pazarama.com/indirim' },
  ],
  clothing: {
    women: [
      { name: 'Zara TR',         url: 'https://www.zara.com/tr/tr/woman-sale-l1056.html' },
      { name: 'Mango TR',        url: 'https://shop.mango.com/tr/kadin/kampanya' },
      { name: 'H&M TR',          url: 'https://www2.hm.com/tr_tr/kadin/indirim.html' },
      { name: 'Koton',           url: 'https://www.koton.com/kadin-indirimli-urunler' },
      { name: 'DeFacto',         url: 'https://www.defacto.com.tr/kadin-indirim' },
      { name: 'LC Waikiki',      url: 'https://www.lcwaikiki.com/tr-TR/TR/kadin-indirim' },
      { name: 'Trendyol Milla',  url: 'https://www.milla.com.tr/indirim' },
      { name: 'İpekyol',         url: 'https://www.ipekyol.com.tr/indirim' },
      { name: 'Vakko',           url: 'https://www.vakko.com/indirim' },
      { name: 'Oysho',           url: 'https://www.oysho.com/tr/indirim' },
      { name: 'Stradivarius',    url: 'https://www.stradivarius.com/tr/indirim' },
      { name: 'Massimo Dutti',   url: 'https://www.massimodutti.com/tr/indirim' },
      { name: 'Penti',           url: 'https://www.penti.com/indirim' },
      { name: 'Mavi',            url: 'https://www.mavi.com/kadin-indirim' },
      { name: 'Guess TR',        url: 'https://www.guess.com.tr/indirim' },
      { name: 'Michael Kors',    url: 'https://www.michaelkors.com/tr/indirim' },
      { name: 'Tommy Hilfiger',  url: 'https://tr.tommy.com/indirim' },
      { name: 'Calvin Klein',    url: 'https://www.calvinklein.com/tr/indirim' },
      { name: 'Lefties',         url: 'https://www.lefties.com/tr/indirim' },
      { name: 'LTB',             url: 'https://www.ltb.com.tr/kadin-indirim' },
      { name: "Levi's TR",       url: 'https://www.levis.com.tr/kadin-indirim' },
    ],
    men: [
      { name: 'Zara TR',         url: 'https://www.zara.com/tr/tr/man-sale-l1056.html' },
      { name: 'Mango TR',        url: 'https://shop.mango.com/tr/erkek/kampanya' },
      { name: 'H&M TR',          url: 'https://www2.hm.com/tr_tr/erkek/indirim.html' },
      { name: 'Koton',           url: 'https://www.koton.com/erkek-indirimli-urunler' },
      { name: 'DeFacto',         url: 'https://www.defacto.com.tr/erkek-indirim' },
      { name: 'LC Waikiki',      url: 'https://www.lcwaikiki.com/tr-TR/TR/erkek-indirim' },
      { name: 'Kiğılı',          url: 'https://www.kigili.com.tr/indirim' },
      { name: "Colin's",         url: 'https://www.colins.com.tr/erkek-indirim' },
      { name: 'Altınyıldız',     url: 'https://www.altinyildiz.com.tr/indirim' },
      { name: 'Avva',            url: 'https://www.avva.com.tr/indirim' },
      { name: 'Jack & Jones',    url: 'https://www.jackjones.com/tr/indirim' },
      { name: 'US Polo Assn',    url: 'https://www.uspoloassn.com.tr/indirim' },
      { name: 'Mavi',            url: 'https://www.mavi.com/erkek-indirim' },
      { name: "Levi's TR",       url: 'https://www.levis.com.tr/erkek-indirim' },
      { name: 'LTB',             url: 'https://www.ltb.com.tr/erkek-indirim' },
    ],
    kids: [
      { name: 'Zara Kids',       url: 'https://www.zara.com/tr/tr/kids-sale-l1056.html' },
      { name: 'H&M Kids',        url: 'https://www2.hm.com/tr_tr/cocuk/indirim.html' },
      { name: 'Mango Kids',      url: 'https://shop.mango.com/tr/cocuk/kampanya' },
      { name: 'LC Waikiki Kids', url: 'https://www.lcwaikiki.com/tr-TR/TR/cocuk-indirim' },
      { name: 'Koton Kids',      url: 'https://www.koton.com/cocuk-indirimli-urunler' },
      { name: 'DeFacto Kids',    url: 'https://www.defacto.com.tr/cocuk-indirim' },
      { name: 'Lefties Kids',    url: 'https://www.lefties.com/tr/cocuk-indirim' },
      { name: 'Chicco TR',       url: 'https://www.chicco.com.tr/indirim' },
      { name: 'Ebebek',          url: 'https://www.ebebek.com/indirim' },
    ],
    teen: [
      { name: 'Bershka',         url: 'https://www.bershka.com/tr/indirim' },
      { name: 'Pull&Bear',       url: 'https://www.pullandbear.com/tr/indirim' },
      { name: 'Stradivarius',    url: 'https://www.stradivarius.com/tr/indirim' },
      { name: 'Mavi Teen',       url: 'https://www.mavi.com/genc-indirim' },
      { name: 'DeFacto Teen',    url: 'https://www.defacto.com.tr/genc-indirim' },
    ],
  },
  sports: [
    { name: 'Adidas TR',         url: 'https://www.adidas.com.tr/indirim' },
    { name: 'Puma TR',           url: 'https://tr.puma.com/indirim' },
    { name: 'Reebok TR',         url: 'https://www.reebok.com.tr/indirim' },
    { name: 'New Balance TR',    url: 'https://www.newbalance.com.tr/indirim' },
    { name: 'Decathlon TR',      url: 'https://www.decathlon.com.tr/indirim' },
    { name: 'Under Armour',      url: 'https://www.underarmour.com/tr/indirim' },
    { name: 'Hummel TR',         url: 'https://www.hummel.net/tr/indirim' },
    { name: 'The North Face',    url: 'https://www.thenorthface.com/tr/indirim' },
    { name: 'Converse TR',       url: 'https://www.converse.com.tr/indirim' },
    { name: 'Vans TR',           url: 'https://www.vans.com.tr/indirim' },
    { name: 'Skechers TR',       url: 'https://www.skechers.com.tr/indirim' },
  ],
  shoes: [
    { name: 'Flo',               url: 'https://www.flo.com.tr/indirim' },
    { name: 'Aldo TR',           url: 'https://www.aldoshoes.com/tr/indirim' },
    { name: 'Elle TR',           url: 'https://www.elle.com.tr/indirim' },
    { name: 'Derimod',           url: 'https://www.derimod.com.tr/indirim' },
    { name: 'Twist',             url: 'https://www.twist.com.tr/indirim' },
    { name: 'Steve Madden',      url: 'https://www.stevemadden.com.tr/indirim' },
    { name: 'Nine West TR',      url: 'https://www.ninewest.com.tr/indirim' },
  ],
  beauty: [
    { name: 'Gratis',            url: 'https://www.gratis.com/indirim' },
    { name: 'Rossmann TR',       url: 'https://www.rossmann.com.tr/indirim' },
    { name: 'Watsons TR',        url: 'https://www.watsons.com.tr/indirim' },
    { name: 'Sephora TR',        url: 'https://www.sephora.com.tr/indirim' },
    { name: 'Flormar',           url: 'https://www.flormar.com.tr/indirim' },
    { name: 'Golden Rose',       url: 'https://www.goldenrose.com.tr/indirim' },
    { name: 'MAC TR',            url: 'https://www.maccosmetics.com/tr/indirim' },
    { name: 'Kiko Milano',       url: 'https://www.kikomilanoshopping.com/tr/indirim' },
    { name: 'eveShop',           url: 'https://www.eveshop.com.tr/indirim' },
    { name: "L'Oréal TR",        url: 'https://www.loreal.com.tr/indirim' },
    { name: 'Clinique TR',       url: 'https://www.clinique.com/tr/indirim' },
    { name: 'Estée Lauder',      url: 'https://www.esteelauder.com/tr/indirim' },
    { name: 'Lancôme TR',        url: 'https://www.lancome.com/tr/indirim' },
  ],
  home: [
    { name: 'Karaca',            url: 'https://www.karaca.com/indirim' },
    { name: 'English Home',      url: 'https://www.englishhome.com/indirim' },
    { name: 'Madame Coco',       url: 'https://www.madamecoco.com.tr/indirim' },
    { name: 'IKEA TR',           url: 'https://www.ikea.com/tr/tr/campaigns/indirim/' },
    { name: 'Yataş',             url: 'https://www.yatas.com.tr/indirim' },
    { name: 'Bellona',           url: 'https://www.bellona.com.tr/indirim' },
    { name: 'Özdilek',           url: 'https://www.ozdilek.com.tr/indirim' },
    { name: 'Bellamaison',       url: 'https://www.bellamaison.com.tr/indirim' },
    { name: 'Zara Home',         url: 'https://www.zarahome.com/tr/indirim' },
    { name: 'H&M Home',          url: 'https://www2.hm.com/tr_tr/ev/indirim.html' },
    { name: 'Korkmaz',           url: 'https://www.korkmaz.com.tr/indirim' },
    { name: 'Tefal TR',          url: 'https://www.tefal.com.tr/indirim' },
    { name: 'Beko TR',           url: 'https://www.beko.com/tr-tr/indirim' },
    { name: 'Arçelik',           url: 'https://www.arcelik.com.tr/indirim' },
    { name: 'Vestel',            url: 'https://www.vestel.com.tr/indirim' },
  ],
};

// ─── راهنمای ترکی ───
const turkishGuide = {
  'شلوار': 'Pantolon', 'پیراهن': 'Elbise / Gömlek', 'کت': 'Ceket',
  'کاپشن': 'Mont / Kaban', 'کفش': 'Ayakkabı', 'کیف': 'Çanta',
  'تیشرت': 'Tişört', 'بلوز': 'Bluz', 'ژاکت': 'Kazak',
  'شورت': 'Şort', 'دامن': 'Etek', 'آرایش': 'Makyaj',
  'عطر': 'Parfüm', 'ساعت': 'Saat', 'جوراب': 'Çorap',
  'لباس زیر': 'İç Giyim', 'کیف پول': 'Cüzdan', 'کمربند': 'Kemer',
  'روسری': 'Eşarp', 'کلاه': 'Şapka / Bere',
};

// ─── راهنمای سایز ───
const sizeGuide = {
  clothing: `📏 راهنمای سایز پوشاک:\n\nXS = ۳۲-۳۴\nS = ۳۶-۳۸\nM = ۳۸-۴۰\nL = ۴۰-۴۲\nXL = ۴۲-۴۴\nXXL = ۴۴-۴۶\n\n💡 Beden = سایز\n💡 Renk = رنگ\n💡 İndirim = تخفیف`,
  shoes: `👟 راهنمای سایز کفش:\n\n۳۶ TR · ۳۷ TR · ۳۸ TR · ۳۹ TR\n۴۰ TR · ۴۱ TR · ۴۲ TR · ۴۳ TR · ۴۴ TR\n\n💡 Numara = سایز\n💡 Spor Ayakkabı = کفش ورزشی\n💡 Bot = بوت`,
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
  setRate(v) { settings.rate = v; },

  calcPrice,
  formatPrice,
  generateReferralCode,
  getUserLevel,
  feeTypes,
  levels,
  brands,
  turkishGuide,
  sizeGuide,

  statusLabels: {
    pending:   '⏳ در انتظار پرداخت',
    paid:      '✅ پرداخت تأیید شد',
    buying:    '🛒 در حال خرید',
    shipped:   '🚚 ارسال شد',
    delivered: '📦 تحویل داده شد',
    cancelled: '❌ لغو شد',
  },
};
