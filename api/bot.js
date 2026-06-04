const TelegramBot = require('node-telegram-bot-api');
const db = require('../lib/db');

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID;
const CARD_NUMBER = process.env.CARD_NUMBER || '5894-6311-5805-9998';
const CARD_OWNER = process.env.CARD_OWNER || 'عسل ملکی‌راد';
const CARD_BANK = process.env.CARD_BANK || 'بانک رفاه';

const bot = new TelegramBot(TOKEN, { polling: true });
const sessions = new Map();

function s(id) {
  if (!sessions.has(id)) sessions.set(id, {});
  return sessions.get(id);
}
function isAdmin(id) { return ADMIN_ID && id.toString() === ADMIN_ID.toString(); }

// ─── منوی مشتری ───
const cMenu = { reply_markup: { keyboard: [
  ['🛍 ثبت سفارش با لینک', '🔍 پیدا کردن محصول'],
  ['🔥 تخفیف‌ها و حراج‌ها', '💰 محاسبه قیمت'],
  ['📦 پیگیری سفارش',       '👤 سطح و تخفیف من'],
  ['📖 راهنمای خرید',        '📞 پشتیبانی'],
], resize_keyboard: true }};

// ─── منوی ادمین ───
const aMenu = { reply_markup: { keyboard: [
  ['📋 سفارش‌های جدید', '🔄 آپدیت وضعیت'],
  ['💱 نرخ لیر',         '📊 آمار'],
  ['📢 پیام همگانی',     '➕ ثبت سفارش دستی'],
], resize_keyboard: true }};

// ─── استارت ───
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.chat.first_name || 'عزیز';
  const ref = msg.text.split(' ')[1];

  const existing = db.getUser(chatId);
  db.saveUser(chatId, {
    name, username: msg.chat.username,
    joinedAt: existing?.joinedAt || new Date().toISOString(),
    referredBy: existing?.referredBy || ref || null,
    birthday: existing?.birthday || null,
  });

  if (isAdmin(chatId)) {
    return bot.sendMessage(chatId, `👑 خوش آمدی ${name}!\nپنل مدیریت Luna Fortuna 🌙`, aMenu);
  }

  const myOrders = db.getUserOrders(chatId);
  const level = db.getUserLevel(myOrders.filter(o => o.status === 'delivered').length);

  bot.sendMessage(chatId,
    `🌙 سلام ${name}!\n\nبه Luna Fortuna خوش آمدید\n\n` +
    `🇹🇷 بهترین برندهای ترکیه · ارسال مستقیم به ایران\n` +
    `✅ بررسی کیفیت و اصالت · قیمت مناسب\n\n` +
    `سطح شما: ${level.name}\n\nاز منو گزینه موردنظر را انتخاب کنید:`,
    cMenu
  );
});

// ─── ثبت تاریخ تولد ───
bot.onText(/\/birthday/, (msg) => {
  const chatId = msg.chat.id;
  s(chatId).step = 'birthday';
  bot.sendMessage(chatId,
    `🎂 تاریخ تولد شما (اختیاری)\n\nفرمت: روز/ماه — مثلاً: 15/3\n\nاگر نمی‌خواهید ثبت کنید /skip بنویسید`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── ثبت سفارش با لینک ───
bot.onText(/🛍 ثبت سفارش با لینک/, (msg) => {
  const chatId = msg.chat.id;
  s(chatId).step = 'link';
  bot.sendMessage(chatId,
    `🔗 لینک محصول مورد نظر را بفرستید\n\nمثلاً:\nhttps://www.trendyol.com/...\nhttps://www.zara.com/tr/...\n\nهر سایت ترکیه‌ای قابل قبول است 👇`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── پیدا کردن محصول ───
bot.onText(/🔍 پیدا کردن محصول/, (msg) => {
  const chatId = msg.chat.id;
  s(chatId).step = 'find';
  bot.sendMessage(chatId,
    `🔍 محصول مورد نظر خود را توصیف کنید:\n\nمثلاً:\n• کاپشن زنانه رنگ کرم، سبک مینیمال، تا ۲۰ میلیون\n• کتونی Nike سایز ۴۲، تا ۱۵ میلیون\n• ست آرایشی MAC، بودجه ۱۰ میلیون\n\nهر چه بیشتر توضیح دهید، بهتر پیدا می‌کنیم 👇`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── محاسبه قیمت ───
bot.onText(/💰 محاسبه قیمت/, (msg) => {
  const chatId = msg.chat.id;
  s(chatId).step = 'calc';
  bot.sendMessage(chatId,
    `💰 قیمت محصول را به لیر وارد کنید:\n\nمثلاً: 1200`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── سطح و تخفیف ───
bot.onText(/👤 سطح و تخفیف من/, (msg) => {
  const chatId = msg.chat.id;
  const myOrders = db.getUserOrders(chatId);
  const doneOrders = myOrders.filter(o => o.status === 'delivered').length;
  const level = db.getUserLevel(doneOrders);
  const refCode = db.generateReferralCode(chatId);
  const user = db.getUser(chatId);

  let nextLevel = '';
  if (doneOrders < 5) nextLevel = `\n🥈 تا سطح نقره: ${5 - doneOrders} خرید دیگر`;
  else if (doneOrders < 10) nextLevel = `\n🥇 تا سطح طلایی: ${10 - doneOrders} خرید دیگر`;
  else nextLevel = `\n🏆 شما در بالاترین سطح هستید!`;

  bot.sendMessage(chatId,
    `👤 پروفایل شما:\n\n` +
    `سطح: ${level.name}${nextLevel}\n\n` +
    `🎁 کد معرف شما:\n${refCode}\n` +
    `با معرفی دوستان تخفیف ویژه دریافت کنید!\n\n` +
    `📊 تعداد خریدهای تکمیل‌شده: ${doneOrders}\n` +
    (user?.birthday ? `🎂 تاریخ تولد: ${user.birthday}` : `🎂 تاریخ تولد ثبت نشده — /birthday`),
    cMenu
  );
});

// ─── تخفیف‌ها ───
bot.onText(/🔥 تخفیف‌ها و حراج‌ها/, (msg) => {
  bot.sendMessage(msg.chat.id, `🔥 کدام دسته‌بندی؟`, {
    reply_markup: { inline_keyboard: [
      [{ text: '👗 پوشاک',       callback_data: 'sale_clothing' }, { text: '👟 ورزشی',     callback_data: 'sale_sports' }],
      [{ text: '💄 آرایشی',      callback_data: 'sale_beauty'  }, { text: '👜 کیف و کفش', callback_data: 'sale_shoes'  }],
      [{ text: '🏠 لوازم خانه',  callback_data: 'sale_home'    }, { text: '🏪 مولتی‌برند', callback_data: 'sale_multi'  }],
    ]}
  });
});

// ─── پیگیری سفارش ───
bot.onText(/📦 پیگیری سفارش/, (msg) => {
  const chatId = msg.chat.id;
  const myOrders = db.getUserOrders(chatId).slice(-5);

  if (!myOrders.length) {
    return bot.sendMessage(chatId, `📭 هنوز سفارشی ثبت نکرده‌اید\n\nبرای ثبت سفارش گزینه «ثبت سفارش» را انتخاب کنید`, cMenu);
  }

  let text = `📦 سفارش‌های اخیر شما:\n\n`;
  myOrders.reverse().forEach((o, i) => {
    text += `${i+1}. #${o.shortId} — ${db.statusLabels[o.status]}\n`;
    if (o.description) text += `   📝 ${o.description.substring(0, 50)}\n`;
    if (o.totalPrice) text += `   💰 ${db.formatPrice(o.totalPrice)}\n`;
    text += '\n';
  });

  bot.sendMessage(chatId, text, cMenu);
});

// ─── راهنمای خرید ───
bot.onText(/📖 راهنمای خرید/, (msg) => {
  bot.sendMessage(msg.chat.id, `📖 راهنمای خرید از ترکیه`, {
    reply_markup: { inline_keyboard: [
      [{ text: '🔤 کلمات ترکی',          callback_data: 'guide_turkish'  }],
      [{ text: '📏 راهنمای سایز پوشاک',  callback_data: 'guide_clothing' }],
      [{ text: '👟 راهنمای سایز کفش',    callback_data: 'guide_shoes'    }],
      [{ text: '🔍 فیلترهای مهم سایت‌ها', callback_data: 'guide_filters'  }],
    ]}
  });
});

// ─── پشتیبانی ───
bot.onText(/📞 پشتیبانی/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `📞 پشتیبانی Luna Fortuna:\n\n📱 تلگرام: @LunaFortunaSupport\n📸 اینستاگرام: lunafortuna.shop\n☎️ تلفن: 0090-5318662989\n\n⏰ پاسخگویی: ۹ صبح تا ۱۱ شب`,
    cMenu
  );
});

// ─── بازگشت ───
bot.onText(/🔙 بازگشت/, (msg) => {
  const chatId = msg.chat.id;
  sessions.delete(chatId);
  bot.sendMessage(chatId, `به منوی اصلی بازگشتید 🌙`, isAdmin(chatId) ? aMenu : cMenu);
});

// ═══════ ادمین ═══════

bot.onText(/📋 سفارش‌های جدید/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  const pending = db.getAllOrders().filter(o => o.status === 'pending');
  if (!pending.length) return bot.sendMessage(msg.chat.id, `✅ سفارش جدیدی وجود ندارد`, aMenu);

  pending.slice(0, 10).forEach(o => {
    bot.sendMessage(msg.chat.id,
      `📋 سفارش #${o.shortId}\n\n👤 ${o.userName||'—'} (@${o.userUsername||'—'})\n🔗 ${o.link||'—'}\n📝 ${o.description||'—'}\n💰 ${o.totalPrice ? db.formatPrice(o.totalPrice) : '—'}\n📅 ${new Date(o.createdAt).toLocaleString('fa-IR')}`,
      { reply_markup: { inline_keyboard: [[
        { text: '✅ تأیید پرداخت', callback_data: `confirm_${o.id}` },
        { text: '🛒 خریداری شد',   callback_data: `buying_${o.id}`  },
        { text: '❌ لغو',           callback_data: `cancel_${o.id}`  },
      ]]}}
    );
  });
});

bot.onText(/🔄 آپدیت وضعیت/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  s(msg.chat.id).step = 'update_status';
  bot.sendMessage(msg.chat.id, `شماره سفارش را وارد کنید (مثلاً: 4157):`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

bot.onText(/💱 نرخ لیر/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  s(msg.chat.id).step = 'set_rate';
  bot.sendMessage(msg.chat.id, `💱 نرخ فعلی: ${db.getRate().toLocaleString('fa-IR')} تومان/لیر\n\nنرخ جدید را وارد کنید:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

bot.onText(/📊 آمار/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  const all = db.getAllOrders();
  const users = db.getAllUsers();
  const today = all.filter(o => o.createdAt?.startsWith(new Date().toISOString().split('T')[0]));
  const total = all.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.totalPrice||0), 0);

  bot.sendMessage(msg.chat.id,
    `📊 آمار Luna Fortuna:\n\n👥 کل کاربران: ${users.length}\n📦 کل سفارش‌ها: ${all.length}\n🆕 امروز: ${today.length}\n⏳ در انتظار: ${all.filter(o=>o.status==='pending').length}\n🛒 در حال خرید: ${all.filter(o=>o.status==='buying').length}\n🚚 ارسال شده: ${all.filter(o=>o.status==='shipped').length}\n✅ تحویل داده شده: ${all.filter(o=>o.status==='delivered').length}\n💰 مجموع فروش: ${db.formatPrice(total)}`,
    aMenu
  );
});

bot.onText(/📢 پیام همگانی/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  s(msg.chat.id).step = 'broadcast';
  bot.sendMessage(msg.chat.id, `📢 متن پیام همگانی را بنویسید:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

bot.onText(/➕ ثبت سفارش دستی/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  s(msg.chat.id).step = 'manual_chatid';
  bot.sendMessage(msg.chat.id, `آیدی تلگرام مشتری را وارد کنید:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── پردازش پیام‌ها ───
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const sess = s(chatId);

  if (!text || text.startsWith('/')) return;

  const menuTexts = ['🛍','🔍','🔥','💰','📦','👤','📖','📞','🔙','📋','🔄','💱','📊','📢','➕'];
  if (menuTexts.some(t => text.startsWith(t))) return;

  // عکس رسید
  if (msg.photo && sess.waitingReceipt) {
    const orderId = sess.waitingReceiptOrder;
    const order = db.getOrder(orderId);
    bot.sendMessage(chatId, `✅ رسید دریافت شد!\nدر حال بررسی...\nمعمولاً تا ۳۰ دقیقه تأیید می‌شود 🕐`, cMenu);
    if (ADMIN_ID && order) {
      bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
      bot.sendMessage(ADMIN_ID,
        `💳 رسید پرداخت جدید!\n\n👤 ${order.userName} (@${order.userUsername||'—'})\n🆔 سفارش: #${order.shortId}\n💰 ${db.formatPrice(order.totalPrice)}`,
        { reply_markup: { inline_keyboard: [[
          { text: '✅ تأیید پرداخت', callback_data: `confirm_${orderId}` },
          { text: '❌ رد',            callback_data: `reject_${orderId}`  },
        ]]}}
      );
    }
    delete sess.waitingReceipt;
    delete sess.waitingReceiptOrder;
    return;
  }

  // ─── لینک ───
  if (sess.step === 'link') {
    if (!text.startsWith('http')) return bot.sendMessage(chatId, `❌ لینک معتبر نیست\nلطفاً لینک کامل محصول را ارسال کنید`);
    sess.link = text;
    sess.step = 'link_price';
    return bot.sendMessage(chatId, `✅ لینک دریافت شد!\n\n💰 قیمت محصول را به لیر وارد کنید:\nمثلاً: 1200`);
  }

  // ─── قیمت لیر ───
  if (sess.step === 'link_price') {
    const lir = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!lir || lir <= 0) return bot.sendMessage(chatId, `❌ عدد معتبر نیست\nمثلاً: 1200`);

    const myOrders = db.getUserOrders(chatId);
    const doneCount = myOrders.filter(o => o.status === 'delivered').length;
    const user = db.getUser(chatId);
    const level = db.getUserLevel(doneCount);

    // تعیین کارمزد
    let fee = level.fee;
    let discountType = level.name;

    // بررسی تولد
    if (user?.birthday) {
      const today = new Date();
      const [day, month] = user.birthday.split('/').map(Number);
      if (today.getDate() === day && (today.getMonth()+1) === month) {
        fee = 0.12;
        discountType = '🎂 تولد مبارک';
      }
    }

    const normalPrice = db.calcPrice(lir, 0.15);
    const finalPrice = db.calcPrice(lir, fee);
    sess.lirPrice = lir;
    sess.totalPrice = finalPrice;
    sess.feeUsed = fee;
    sess.step = 'link_details';

    let priceMsg = `💎 قیمت نهایی: ${db.formatPrice(finalPrice)}`;
    if (fee < 0.15) {
      priceMsg = `💰 قیمت عادی: ${db.formatPrice(normalPrice)}\n🎁 قیمت با تخفیف ${discountType}: ${db.formatPrice(finalPrice)}`;
    }

    return bot.sendMessage(chatId, `${priceMsg}\n\n📝 سایز، رنگ و توضیحات را وارد کنید:`);
  }

  // ─── جزئیات سفارش ───
  if (sess.step === 'link_details') {
    sess.description = text;
    return bot.sendMessage(chatId,
      `📋 خلاصه سفارش:\n\n🔗 لینک: ${sess.link}\n📝 ${sess.description}\n💎 مبلغ قابل پرداخت: ${db.formatPrice(sess.totalPrice)}\n\nتأیید می‌کنید؟`,
      { reply_markup: { inline_keyboard: [[
        { text: '✅ تأیید و ادامه', callback_data: 'order_confirm' },
        { text: '❌ انصراف',        callback_data: 'order_cancel'  },
      ]]}}
    );
  }

  // ─── محاسبه قیمت ───
  if (sess.step === 'calc') {
    const lir = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!lir) return bot.sendMessage(chatId, `❌ عدد معتبر نیست`);

    const myOrders = db.getUserOrders(chatId);
    const doneCount = myOrders.filter(o => o.status === 'delivered').length;
    const level = db.getUserLevel(doneCount);
    const normalPrice = db.calcPrice(lir, 0.15);
    const finalPrice = db.calcPrice(lir, level.fee);
    sessions.delete(chatId);

    let msg = `💎 قیمت نهایی: ${db.formatPrice(finalPrice)}`;
    if (level.fee < 0.15) {
      msg = `💰 قیمت عادی: ${db.formatPrice(normalPrice)}\n🎁 قیمت شما (${level.name}): ${db.formatPrice(finalPrice)}`;
    }
    return bot.sendMessage(chatId, `${msg}\n\nبرای سفارش لینک محصول را ارسال کنید 👇`, cMenu);
  }

  // ─── پیدا کردن محصول ───
  if (sess.step === 'find') {
    const { id, shortId } = db.addOrder({
      chatId: chatId.toString(),
      userName: msg.chat.first_name,
      userUsername: msg.chat.username,
      type: 'find',
      description: text,
    });
    sessions.delete(chatId);

    bot.sendMessage(chatId,
      `✅ درخواست شما ثبت شد!\n\n📝 ${text}\n\n⏰ ظرف ۲۴ ساعت گزینه‌های پیشنهادی برایتان ارسال می‌کنیم\n🆔 شماره پیگیری: #${shortId}`,
      cMenu
    );

    if (ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🔍 درخواست پیدا کردن محصول!\n\n👤 ${msg.chat.first_name} (@${msg.chat.username||'—'})\n📝 ${text}\n🆔 #${shortId}`,
        { reply_markup: { inline_keyboard: [[
          { text: '✅ پیدا کردم — ارسال به مشتری', callback_data: `found_${id}` },
        ]]}}
      );
    }
    return;
  }

  // ─── تولد ───
  if (sess.step === 'birthday') {
    if (!/^\d{1,2}\/\d{1,2}$/.test(text)) return bot.sendMessage(chatId, `❌ فرمت اشتباه\nمثلاً: 15/3`);
    db.saveUser(chatId, { birthday: text });
    sessions.delete(chatId);
    return bot.sendMessage(chatId, `🎂 تاریخ تولد شما ثبت شد!\nروز تولدتان سورپریزی برایتان داریم 🌙`, cMenu);
  }

  // ─── نرخ لیر ───
  if (sess.step === 'set_rate' && isAdmin(chatId)) {
    const rate = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!rate) return bot.sendMessage(chatId, `❌ عدد معتبر نیست`);
    db.setRate(rate);
    sessions.delete(chatId);
    return bot.sendMessage(chatId, `✅ نرخ لیر به‌روز شد: ${rate.toLocaleString('fa-IR')} تومان/لیر`, aMenu);
  }

  // ─── پیام همگانی ───
  if (sess.step === 'broadcast' && isAdmin(chatId)) {
    const users = db.getAllUsers().filter(u => u.chatId.toString() !== ADMIN_ID);
    let sent = 0;
    for (const u of users) {
      try { await bot.sendMessage(u.chatId, `📢 Luna Fortuna:\n\n${text}`); sent++; } catch(e) {}
    }
    sessions.delete(chatId);
    return bot.sendMessage(chatId, `✅ پیام به ${sent} نفر ارسال شد`, aMenu);
  }

  // ─── آپدیت وضعیت ───
  if (sess.step === 'update_status' && isAdmin(chatId)) {
    const order = db.getAllOrders().find(o => o.shortId === text.trim());
    if (!order) return bot.sendMessage(chatId, `❌ سفارش با این شماره پیدا نشد`);
    sess.step = 'update_status2';
    sess.updateOrderId = order.id;
    return bot.sendMessage(chatId,
      `سفارش #${order.shortId} پیدا شد\nوضعیت جدید را انتخاب کنید:`,
      { reply_markup: { inline_keyboard: [
        [{ text: '✅ پرداخت تأیید شد', callback_data: `setstatus_paid_${order.id}`      }],
        [{ text: '🛒 در حال خرید',      callback_data: `setstatus_buying_${order.id}`    }],
        [{ text: '🚚 ارسال شد',          callback_data: `setstatus_shipped_${order.id}`   }],
        [{ text: '📦 تحویل داده شد',    callback_data: `setstatus_delivered_${order.id}` }],
        [{ text: '❌ لغو شد',            callback_data: `setstatus_cancelled_${order.id}` }],
      ]}}
    );
  }
});

// ─── Callbacks ───
bot.on('callback_query', async (q) => {
  const chatId = q.message.chat.id;
  const data = q.data;
  bot.answerCallbackQuery(q.id);

  // ─── تخفیف‌ها ───
  if (data === 'sale_multi') {
    const btns = db.brands.multi.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `🏪 مولتی‌برند:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_clothing') {
    return bot.sendMessage(chatId, `👗 پوشاک — کدام گروه؟`, { reply_markup: { inline_keyboard: [
      [{ text: '👩 زنانه',          callback_data: 'sale_women' }, { text: '👨 مردانه',  callback_data: 'sale_men'  }],
      [{ text: '👶 کودک',           callback_data: 'sale_kids'  }, { text: '🧒 نوجوان', callback_data: 'sale_teen' }],
    ]}});
  }
  if (data === 'sale_women') {
    const btns = db.brands.clothing.women.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `👗 پوشاک زنانه:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_men') {
    const btns = db.brands.clothing.men.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `👔 پوشاک مردانه:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_kids') {
    const btns = db.brands.clothing.kids.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `👶 کودک:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_teen') {
    const btns = db.brands.clothing.teen.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `🧒 نوجوان و تینیجر:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_sports') {
    const btns = db.brands.sports.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `👟 ورزشی:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_shoes') {
    const btns = db.brands.shoes.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `👜 کیف و کفش:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_beauty') {
    const btns = db.brands.beauty.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `💄 آرایشی و بهداشتی:`, { reply_markup: { inline_keyboard: btns }});
  }
  if (data === 'sale_home') {
    const btns = db.brands.home.map(b => [{ text: b.name, url: b.url }]);
    return bot.sendMessage(chatId, `🏠 لوازم خانه و آشپزخانه:`, { reply_markup: { inline_keyboard: btns }});
  }

  // ─── راهنما ───
  if (data === 'guide_turkish') {
    let text = `🔤 کلمات پرکاربرد ترکی:\n\n`;
    Object.entries(db.turkishGuide).forEach(([fa, tr]) => { text += `🔹 ${fa} = ${tr}\n`; });
    text += `\n💡 İndirim = تخفیف\n💡 Kampanya = حراج\n💡 Sepet = سبد خرید\n💡 Ücretsiz Kargo = ارسال رایگان\n💡 Yeni = جدید\n💡 En Çok Satan = پرفروش`;
    return bot.sendMessage(chatId, text, cMenu);
  }
  if (data === 'guide_clothing') return bot.sendMessage(chatId, db.sizeGuide.clothing, cMenu);
  if (data === 'guide_shoes')    return bot.sendMessage(chatId, db.sizeGuide.shoes, cMenu);
  if (data === 'guide_filters') {
    return bot.sendMessage(chatId,
      `🔍 فیلترهای مهم در سایت‌های ترکیه:\n\nFiyat = قیمت\nBeden = سایز\nRenk = رنگ\nİndirim = تخفیف\nKampanya = حراج\nÜcretsiz Kargo = ارسال رایگان\nYeni = جدید\nEn Çok Satan = پرفروش\nMarka = برند\nKadın = زن\nErkek = مرد\nÇocuk = کودک`,
      cMenu
    );
  }

  // ─── تأیید سفارش ───
  if (data === 'order_confirm') {
    const sess = s(chatId);
    const { id, shortId } = db.addOrder({
      chatId: chatId.toString(),
      userName: q.from.first_name,
      userUsername: q.from.username,
      link: sess.link,
      description: sess.description,
      lirPrice: sess.lirPrice,
      totalPrice: sess.totalPrice,
      feeUsed: sess.feeUsed,
      type: 'link',
    });
    sessions.delete(chatId);

    // منتظر رسید
    s(chatId).waitingReceipt = true;
    s(chatId).waitingReceiptOrder = id;

    bot.sendMessage(chatId,
      `✅ سفارش شما ثبت شد!\n🆔 شماره پیگیری: #${shortId}\n\n` +
      `💳 اطلاعات واریز:\n\n` +
      `🏦 ${CARD_BANK}\n` +
      `💳 شماره کارت:\n${CARD_NUMBER}\n\n` +
      `👤 به نام: ${CARD_OWNER}\n\n` +
      `💎 مبلغ قابل پرداخت:\n${db.formatPrice(sess.totalPrice)}\n\n` +
      `━━━━━━━━━━━━━━\n` +
      `⚠️ پس از واریز، تصویر رسید را\nهمینجا ارسال کنید`,
      cMenu
    );

    if (ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 سفارش جدید!\n\n👤 ${q.from.first_name} (@${q.from.username||'—'})\n🔗 ${sess.link}\n📝 ${sess.description}\n💎 ${db.formatPrice(sess.totalPrice)}\n🆔 #${shortId}`,
        { reply_markup: { inline_keyboard: [[
          { text: '✅ تأیید پرداخت', callback_data: `confirm_${id}` },
          { text: '🛒 خریداری شد',   callback_data: `buying_${id}`  },
          { text: '❌ لغو',           callback_data: `cancel_${id}`  },
        ]]}}
      );
    }
    return;
  }

  if (data === 'order_cancel') { sessions.delete(chatId); return bot.sendMessage(chatId, `سفارش لغو شد`, cMenu); }

  // ─── ادمین callbacks ───
  if (isAdmin(chatId)) {
    if (data.startsWith('confirm_')) {
      const oid = data.replace('confirm_', '');
      const order = db.getOrder(oid);
      if (!order) return;
      db.updateOrder(oid, { status: 'paid' });
      bot.sendMessage(chatId, `✅ پرداخت تأیید شد`, aMenu);
      bot.sendMessage(order.chatId, `✅ پرداخت شما با موفقیت تأیید شد\n🌙 ممنون از اعتماد شما به Luna Fortuna\n🛒 محصول شما در حال خریداری است\nپس از ارسال، اطلاع‌رسانی خواهیم کرد 📦`);
      return;
    }

    if (data.startsWith('reject_')) {
      const oid = data.replace('reject_', '');
      const order = db.getOrder(oid);
      if (!order) return;
      bot.sendMessage(chatId, `❌ رسید رد شد`, aMenu);
      bot.sendMessage(order.chatId, `❌ رسید پرداخت شما تأیید نشد\nلطفاً با پشتیبانی تماس بگیرید`);
      return;
    }

    if (data.startsWith('buying_')) {
      const oid = data.replace('buying_', '');
      const order = db.getOrder(oid);
      if (!order) return;
      db.updateOrder(oid, { status: 'buying' });
      bot.sendMessage(chatId, `🛒 وضعیت به «در حال خرید» تغییر کرد`, aMenu);
      bot.sendMessage(order.chatId, `🛒 محصول شما در حال خریداری است\nپس از ارسال، اطلاع‌رسانی خواهیم کرد 📦`);
      return;
    }

    if (data.startsWith('cancel_')) {
      const oid = data.replace('cancel_', '');
      const order = db.getOrder(oid);
      if (!order) return;
      db.updateOrder(oid, { status: 'cancelled' });
      bot.sendMessage(chatId, `❌ سفارش لغو شد`, aMenu);
      if (order.chatId) bot.sendMessage(order.chatId, `❌ سفارش شما لغو شد\nبرای اطلاعات بیشتر با پشتیبانی تماس بگیرید`);
      return;
    }

    if (data.startsWith('setstatus_')) {
      const parts = data.replace('setstatus_', '').split('_');
      const newStatus = parts[0];
      const oid = parts.slice(1).join('_');
      const order = db.getOrder(oid);
      if (!order) return;
      db.updateOrder(oid, { status: newStatus });
      sessions.delete(chatId);
      bot.sendMessage(chatId, `✅ وضعیت سفارش #${order.shortId} به «${db.statusLabels[newStatus]}» تغییر کرد`, aMenu);

      const statusMessages = {
        paid:      `✅ پرداخت شما با موفقیت تأیید شد\n🌙 ممنون از اعتماد شما به Luna Fortuna\n🛒 محصول شما در حال خریداری است\nپس از ارسال، اطلاع‌رسانی خواهیم کرد 📦`,
        buying:    `🛒 محصول شما در حال خریداری است\nبه زودی ارسال خواهد شد 📦`,
        shipped:   `📦 محصول شما ارسال شد!\n🌙 از صبر و اعتماد شما سپاسگزاریم\nامیدواریم از خریدتان لذت ببرید 🎁`,
        delivered: `✅ محصول شما تحویل داده شد\n🌙 خوشحال می‌شویم نظرتان را بشنویم\nمنتظر خریدهای بعدی شما هستیم 🛍`,
        cancelled: `❌ سفارش شما لغو شد\nبرای اطلاعات بیشتر با پشتیبانی تماس بگیرید`,
      };

      if (order.chatId && statusMessages[newStatus]) {
        bot.sendMessage(order.chatId, statusMessages[newStatus]);
      }
      return;
    }

    if (data.startsWith('found_')) {
      const oid = data.replace('found_', '');
      s(chatId).step = 'send_found';
      s(chatId).foundOrderId = oid;
      return bot.sendMessage(chatId,
        `لینک و توضیحات محصول پیدا شده را بفرستید:`,
        { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
      );
    }
  }
});

console.log('🌙 Luna Fortuna Bot v3.0 is running...');
