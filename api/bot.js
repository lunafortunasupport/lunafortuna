const TelegramBot = require('node-telegram-bot-api');
const db = require('../lib/db');

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID;
const CARD = '5894-6311-5805-9998';
const CARD_OWNER = 'عسل ملکی‌راد';
const CARD_BANK = 'بانک رفاه';

const bot = new TelegramBot(TOKEN, { polling: true });
const sessions = new Map();

function ss(id) { if (!sessions.has(id)) sessions.set(id, {}); return sessions.get(id); }
function isAdmin(id) { return ADMIN_ID && id.toString() === ADMIN_ID.toString(); }

// ─── منوها ───
const cMenu = { reply_markup: { keyboard: [
  ['🛍 ثبت سفارش با لینک', '🔍 پیدا کردن محصول'],
  ['💱 نرخ لیر',            '📦 پیگیری سفارش'],
  ['👤 سطح من',             '👥 دعوت دوستان'],
  ['📖 راهنمای خرید',       '📞 پشتیبانی'],
], resize_keyboard: true }};

const aMenu = { reply_markup: { keyboard: [
  ['📋 سفارش‌های جدید', '🔄 آپدیت وضعیت'],
  ['💱 تنظیم نرخ لیر',  '📊 آمار'],
  ['📢 پیام همگانی',    '➕ ثبت سفارش دستی'],
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
    referredBy: existing?.referredBy || (ref && ref !== db.generateReferralCode(chatId) ? ref : null),
  });

  if (isAdmin(chatId)) {
    return bot.sendMessage(chatId, `👑 خوش آمدی ${name}!\nپنل مدیریت Luna Fortuna 🌙`, aMenu);
  }

  const doneOrders = db.getUserOrders(chatId).filter(o => o.status === 'delivered').length;
  const level = db.getUserLevel(doneOrders);
  const isNewWithRef = ref && !existing?.referredBy && ref !== db.generateReferralCode(chatId);

  if (isNewWithRef) {
    bot.sendMessage(chatId,
      `🌙 سلام ${name}!\nبه Luna Fortuna خوش آمدید\n\n🎁 کد معرف تأیید شد!\n✨ تخفیف ویژه اولین خرید شما فعال شد\n\nاز منو گزینه موردنظر را انتخاب کنید:`,
      cMenu
    );
    if (ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `👥 عضو جدید با کد معرف!\n\n👤 مشتری جدید: ${name} (@${msg.chat.username||'—'})\n🎁 کد معرف استفاده شده: ${ref}\n📅 ${new Date().toLocaleString('fa-IR')}`
      );
    }
  } else {
    bot.sendMessage(chatId,
      `🌙 سلام ${name}!\nبه Luna Fortuna خوش آمدید\n\n🇹🇷 بهترین برندهای ترکیه · ارسال مستقیم به ایران\n✅ بررسی کیفیت و اصالت · قیمت مناسب\n\nسطح شما: ${level.name}\nاز منو گزینه موردنظر را انتخاب کنید:`,
      cMenu
    );
  }
});

// ─── ثبت سفارش ───
bot.onText(/🛍 ثبت سفارش با لینک/, (msg) => {
  const chatId = msg.chat.id;
  ss(chatId).step = 'link';
  bot.sendMessage(chatId,
    `🔗 لینک محصول مورد نظر را بفرستید\n\nمثلاً:\nhttps://www.trendyol.com/...\nhttps://www.zara.com/tr/...\n\nهر سایت ترکیه‌ای قابل قبول است 👇`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── پیدا کردن محصول ───
bot.onText(/🔍 پیدا کردن محصول/, (msg) => {
  const chatId = msg.chat.id;
  ss(chatId).step = 'find';
  bot.sendMessage(chatId,
    `🔍 محصول مورد نظر خود را توصیف کنید:\n\nمثلاً:\n• کاپشن زنانه رنگ کرم، سبک مینیمال، تا ۲۰ میلیون\n• کتونی Nike سایز ۴۲، تا ۱۵ میلیون\n• ست آرایشی MAC، بودجه ۱۰ میلیون\n\nهر چه بیشتر توضیح دهید، بهتر پیدا می‌کنیم 👇`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── نرخ لیر ───
bot.onText(/💱 نرخ لیر$/, (msg) => {
  if (isAdmin(msg.chat.id)) return;
  bot.sendMessage(msg.chat.id,
    `💱 نرخ لیر امروز: ${db.getFinalRate().toLocaleString('fa-IR')} تومان`,
    cMenu
  );
});

// ─── پیگیری سفارش ───
bot.onText(/📦 پیگیری سفارش/, (msg) => {
  const chatId = msg.chat.id;
  const myOrders = db.getUserOrders(chatId).reverse().slice(0, 5);
  if (!myOrders.length) {
    return bot.sendMessage(chatId, `📭 هنوز سفارشی ثبت نکرده‌اید\n\nبرای ثبت سفارش گزینه «ثبت سفارش» را انتخاب کنید`, cMenu);
  }
  let text = `📦 سفارش‌های اخیر شما:\n\n`;
  myOrders.forEach((o, i) => {
    text += `${i+1}. #${o.shortId} — ${db.statusLabels[o.status]}\n`;
    if (o.description) text += `   📝 ${o.description.substring(0,50)}\n`;
    if (o.totalPrice) text += `   💰 ${db.formatPrice(o.totalPrice)}\n`;
    text += '\n';
  });
  bot.sendMessage(chatId, text, cMenu);
});

// ─── سطح من ───
bot.onText(/👤 سطح من/, (msg) => {
  const chatId = msg.chat.id;
  const doneOrders = db.getUserOrders(chatId).filter(o => o.status === 'delivered').length;
  const level = db.getUserLevel(doneOrders);
  const user = db.getUser(chatId);

  let nextLevel = '';
  if (doneOrders < 5) nextLevel = `\n🥈 تا سطح نقره: ${5 - doneOrders} خرید دیگر`;
  else if (doneOrders < 10) nextLevel = `\n🥇 تا سطح طلایی: ${10 - doneOrders} خرید دیگر`;
  else nextLevel = `\n🏆 شما در بالاترین سطح هستید!`;

  bot.sendMessage(chatId,
    `👤 سطح شما:\n\n⭐ سطح: ${level.name}${nextLevel}\n\n📊 خریدهای تکمیل‌شده: ${doneOrders}\n🎂 تاریخ تولد: ${user?.birthday || 'ثبت نشده'}`,
    {
      reply_markup: {
        keyboard: user?.birthday
          ? [['🔙 بازگشت']]
          : [['🎂 ثبت تاریخ تولد'], ['🔙 بازگشت']],
        resize_keyboard: true
      }
    }
  );
});

// ─── دعوت دوستان ───
bot.onText(/👥 دعوت دوستان/, (msg) => {
  const chatId = msg.chat.id;
  const refCode = db.generateReferralCode(chatId);
  bot.sendMessage(chatId,
    `👥 دعوت دوستان\n\nبا معرفی Luna Fortuna به دوستانتان\nهر دوی شما از قیمت ویژه بهره‌مند می‌شوید!\n\n🎁 دوستت: اولین خریدش با قیمت ویژه\n🎁 شما: خرید بعدیتان با قیمت ویژه\n\n🔗 لینک اختصاصی شما:\nt.me/LunaFortunaSupport_bot?start=${refCode}\n\n👆 لینک را کپی کنید و برای دوستانتان بفرستید`,
    cMenu
  );
});

// ─── راهنمای خرید ───
bot.onText(/📖 راهنمای خرید/, (msg) => {
  bot.sendMessage(msg.chat.id, `📖 راهنمای خرید از ترکیه`, {
    reply_markup: { inline_keyboard: [
      [{ text: '👗 کلمات ترکی — پوشاک زنانه',  callback_data: 'guide_women'    }],
      [{ text: '👔 کلمات ترکی — پوشاک مردانه', callback_data: 'guide_men'      }],
      [{ text: '👟 کلمات ترکی — کفش',           callback_data: 'guide_shoes'    }],
      [{ text: '👜 کلمات ترکی — کیف',           callback_data: 'guide_bags'     }],
      [{ text: '💄 کلمات ترکی — آرایشی',        callback_data: 'guide_beauty'   }],
      [{ text: '🏠 کلمات ترکی — خانه',          callback_data: 'guide_home'     }],
      [{ text: '📏 راهنمای سایز پوشاک',         callback_data: 'guide_clothing' }],
      [{ text: '👟 راهنمای سایز کفش',           callback_data: 'guide_shoesz'   }],
      [{ text: '🔍 فیلترهای مهم سایت‌ها',       callback_data: 'guide_filters'  }],
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

// ─── ثبت تولد ───
bot.onText(/🎂 ثبت تاریخ تولد/, (msg) => {
  const chatId = msg.chat.id;
  ss(chatId).step = 'birthday';
  bot.sendMessage(chatId,
    `🎂 تاریخ تولد خود را وارد کنید:\n\nفرمت: روز/ماه\nمثلاً: 15/3`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── بازگشت ───
bot.onText(/🔙 بازگشت/, (msg) => {
  const chatId = msg.chat.id;
  sessions.delete(chatId);
  bot.sendMessage(chatId, `به منوی اصلی بازگشتید 🌙`, isAdmin(chatId) ? aMenu : cMenu);
});

// ═══ ادمین ═══

bot.onText(/📋 سفارش‌های جدید/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  const pending = db.getAllOrders().filter(o => o.status === 'pending');
  if (!pending.length) return bot.sendMessage(msg.chat.id, `✅ سفارش جدیدی وجود ندارد`, aMenu);
  pending.slice(0, 10).forEach(o => {
    bot.sendMessage(msg.chat.id,
      `📋 سفارش #${o.shortId}\n\n👤 ${o.userName||'—'} (@${o.userUsername||'—'})\n⭐ سطح: ${o.levelName||'عادی'}\n🎁 تخفیف: ${o.hasDiscount ? 'دارد' : 'ندارد'}\n🔗 ${o.link||'—'}\n📝 ${o.description||'—'}\n💰 ${o.totalPrice ? db.formatPrice(o.totalPrice) : '—'}\n📅 ${new Date(o.createdAt).toLocaleString('fa-IR')}`,
      { reply_markup: { inline_keyboard: [[
        { text: '✅ تأیید پرداخت', callback_data: `confirm_${o.id}` },
        { text: '❌ لغو',           callback_data: `cancel_${o.id}`  },
      ]]}}
    );
  });
});

bot.onText(/🔄 آپدیت وضعیت/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  ss(msg.chat.id).step = 'update_status';
  bot.sendMessage(msg.chat.id, `شماره سفارش را وارد کنید (مثلاً: 4157):`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

bot.onText(/💱 تنظیم نرخ لیر/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  ss(msg.chat.id).step = 'set_rate';
  bot.sendMessage(msg.chat.id,
    `💱 نرخ صرافی فعلی: ${db.getRate().toLocaleString('fa-IR')} تومان/لیر\n💎 نرخ نهایی فعلی: ${db.getFinalRate().toLocaleString('fa-IR')} تومان/لیر\n\nنرخ جدید صرافی را وارد کنید:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

bot.onText(/📊 آمار/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  const all = db.getAllOrders();
  const users = db.getAllUsers();
  const today = all.filter(o => o.createdAt?.startsWith(new Date().toISOString().split('T')[0]));
  const total = all.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalPrice||0), 0);
  bot.sendMessage(msg.chat.id,
    `📊 آمار Luna Fortuna:\n\n👥 کل کاربران: ${users.length}\n📦 کل سفارش‌ها: ${all.length}\n🆕 امروز: ${today.length}\n⏳ در انتظار: ${all.filter(o=>o.status==='pending').length}\n🚚 ارسال شده: ${all.filter(o=>o.status==='shipped').length}\n✅ تحویل داده شده: ${all.filter(o=>o.status==='delivered').length}\n💰 مجموع فروش: ${db.formatPrice(total)}`,
    aMenu
  );
});

bot.onText(/📢 پیام همگانی/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  ss(msg.chat.id).step = 'broadcast';
  bot.sendMessage(msg.chat.id, `📢 متن پیام همگانی را بنویسید:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

bot.onText(/➕ ثبت سفارش دستی/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  ss(msg.chat.id).step = 'manual_chatid';
  bot.sendMessage(msg.chat.id, `آیدی تلگرام مشتری را وارد کنید:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
  );
});

// ─── پردازش پیام‌ها ───
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const sess = ss(chatId);

  // رسید عکس
  if (msg.photo && sess.waitingReceipt) {
    const orderId = sess.waitingReceiptOrder;
    const order = db.getOrder(orderId);
    bot.sendMessage(chatId, `✅ رسید دریافت شد!\nدر حال بررسی...\nمعمولاً تا ۳۰ دقیقه تأیید می‌شود 🕐`, cMenu);
    if (ADMIN_ID && order) {
      bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
      bot.sendMessage(ADMIN_ID,
        `💳 رسید پرداخت جدید!\n\n👤 ${order.userName} (@${order.userUsername||'—'})\n⭐ سطح: ${order.levelName||'عادی'}\n🎁 تخفیف: ${order.hasDiscount ? 'دارد' : 'ندارد'}\n🆔 سفارش: #${order.shortId}\n💰 ${db.formatPrice(order.totalPrice)}`,
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

  if (!text || text.startsWith('/')) return;
  const menuBtns = ['🛍','🔍','💱','📦','👤','👥','📖','📞','🎂','🔙','📋','🔄','💱','📊','📢','➕'];
  if (menuBtns.some(b => text.startsWith(b))) return;

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

    const user = db.getUser(chatId);
    const doneOrders = db.getUserOrders(chatId).filter(o => o.status === 'delivered').length;
    const level = db.getUserLevel(doneOrders);

    // تعیین نوع تخفیف
    let feeType = level.fee;
    let hasDiscount = level.fee !== 'normal';

    // بررسی تولد
    if (user?.birthday) {
      const today = new Date();
      const [day, month] = user.birthday.split('/').map(Number);
      if (today.getDate() === day && (today.getMonth()+1) === month) {
        feeType = 'birthday';
        hasDiscount = true;
      }
    }

    // بررسی کد معرف — اولین خرید
    if (user?.referredBy && doneOrders === 0) {
      feeType = 'referral';
      hasDiscount = true;
    }

    const normalPrice = db.calcPrice(lir, 'normal');
    const finalPrice = db.calcPrice(lir, feeType);

    sess.lirPrice = lir;
    sess.totalPrice = finalPrice;
    sess.feeType = feeType;
    sess.hasDiscount = hasDiscount;
    sess.levelName = level.name;
    sess.step = 'link_details';

    let priceMsg = `💱 نرخ لیر: ${db.getFinalRate().toLocaleString('fa-IR')} تومان\n💎 قیمت نهایی: ${db.formatPrice(finalPrice)}`;
    if (hasDiscount) {
      priceMsg = `💱 نرخ لیر: ${db.getFinalRate().toLocaleString('fa-IR')} تومان\n💰 قیمت عادی: ${db.formatPrice(normalPrice)}\n💎 قیمت شما: ${db.formatPrice(finalPrice)}`;
    }

    return bot.sendMessage(chatId,
      `${priceMsg}\n\nآیا محصول نیاز به سایز، رنگ یا توضیح خاصی دارد؟`,
      { reply_markup: { inline_keyboard: [[
        { text: '✅ بله', callback_data: 'need_details' },
        { text: '❌ خیر', callback_data: 'no_details'   },
      ]]}}
    );
  }

  // ─── جزئیات ───
  if (sess.step === 'link_details_text') {
    sess.description = text;
    return showOrderConfirm(chatId, sess);
  }

  // ─── پیدا کردن ───
  if (sess.step === 'find') {
    const doneOrders = db.getUserOrders(chatId).filter(o => o.status === 'delivered').length;
    const level = db.getUserLevel(doneOrders);
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
        `🔍 درخواست پیدا کردن محصول!\n\n👤 ${msg.chat.first_name} (@${msg.chat.username||'—'})\n⭐ سطح: ${level.name}\n📝 ${text}\n🆔 #${shortId}`,
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

  // ─── نرخ لیر ادمین ───
  if (sess.step === 'set_rate' && isAdmin(chatId)) {
    const rate = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!rate) return bot.sendMessage(chatId, `❌ عدد معتبر نیست`);
    db.setRate(rate);
    sessions.delete(chatId);
    return bot.sendMessage(chatId,
      `✅ نرخ صرافی به‌روز شد!\n💱 نرخ صرافی: ${rate.toLocaleString('fa-IR')} تومان/لیر\n💎 نرخ نهایی: ${db.getFinalRate().toLocaleString('fa-IR')} تومان/لیر`,
      aMenu
    );
  }

  // ─── پیام همگانی ───
  if (sess.step === 'broadcast' && isAdmin(chatId)) {
    const allUsers = db.getAllUsers().filter(u => u.chatId.toString() !== ADMIN_ID);
    let sent = 0;
    for (const u of allUsers) {
      try { await bot.sendMessage(u.chatId, `📢 Luna Fortuna:\n\n${text}`); sent++; } catch(e) {}
    }
    sessions.delete(chatId);
    return bot.sendMessage(chatId, `✅ پیام به ${sent} نفر ارسال شد`, aMenu);
  }

  // ─── آپدیت وضعیت ───
  if (sess.step === 'update_status' && isAdmin(chatId)) {
    const order = db.getAllOrders().find(o => o.shortId === text.trim());
    if (!order) return bot.sendMessage(chatId, `❌ سفارش پیدا نشد`);
    sess.step = 'update_status2';
    sess.updateOrderId = order.id;
    return bot.sendMessage(chatId,
      `سفارش #${order.shortId} — ${order.userName||'—'}\nوضعیت جدید:`,
      { reply_markup: { inline_keyboard: [
        [{ text: '✅ پرداخت تأیید شد',    callback_data: `st_paid_${order.id}`      }],
        [{ text: '📦 محصول دریافت و بررسی شد', callback_data: `st_received_${order.id}` }],
        [{ text: '🚚 ارسال شد',            callback_data: `st_shipped_${order.id}`   }],
        [{ text: '✅ تحویل داده شد',       callback_data: `st_delivered_${order.id}` }],
        [{ text: '❌ لغو شد',              callback_data: `st_cancelled_${order.id}` }],
      ]}}
    );
  }
});

function showOrderConfirm(chatId, sess) {
  let priceMsg = `💎 مبلغ قابل پرداخت: ${db.formatPrice(sess.totalPrice)}`;
  if (sess.hasDiscount) {
    const normalPrice = db.calcPrice(sess.lirPrice, 'normal');
    priceMsg = `💰 قیمت عادی: ${db.formatPrice(normalPrice)}\n💎 قیمت شما: ${db.formatPrice(sess.totalPrice)}`;
  }
  bot.sendMessage(chatId,
    `📋 خلاصه سفارش:\n\n🔗 ${sess.link}\n${sess.description ? `📝 ${sess.description}\n` : ''}${priceMsg}\n\nتأیید می‌کنید؟`,
    { reply_markup: { inline_keyboard: [[
      { text: '✅ تأیید و ادامه', callback_data: 'order_confirm' },
      { text: '❌ انصراف',        callback_data: 'order_cancel'  },
    ]]}}
  );
}

// ─── Callbacks ───
bot.on('callback_query', async (q) => {
  const chatId = q.message.chat.id;
  const data = q.data;
  const sess = ss(chatId);
  bot.answerCallbackQuery(q.id);

  // ─── راهنما ───
  if (data.startsWith('guide_')) {
    const key = data.replace('guide_', '');
    if (key === 'clothing') return bot.sendMessage(chatId, db.sizeGuide.clothing, cMenu);
    if (key === 'shoesz')   return bot.sendMessage(chatId, db.sizeGuide.shoes, cMenu);
    if (key === 'filters')  return bot.sendMessage(chatId, db.filters, cMenu);

    const guideMap = { women: 'women', men: 'men', shoes: 'shoes', bags: 'bags', beauty: 'beauty', home: 'home' };
    const cat = guideMap[key];
    if (cat && db.turkishGuide[cat]) {
      const labels = { women: '👗 پوشاک زنانه', men: '👔 پوشاک مردانه', shoes: '👟 کفش', bags: '👜 کیف', beauty: '💄 آرایشی', home: '🏠 خانه' };
      let text = `${labels[cat]}:\n\n`;
      db.turkishGuide[cat].forEach(([fa, tr]) => { text += `🔹 ${fa} = ${tr}\n`; });
      return bot.sendMessage(chatId, text, cMenu);
    }
  }

  // ─── جزئیات سفارش ───
  if (data === 'need_details') {
    sess.step = 'link_details_text';
    return bot.sendMessage(chatId, `📝 سایز، رنگ و توضیحات را وارد کنید:\nمثلاً: سایز M، رنگ کرم، مدل آستین بلند`);
  }
  if (data === 'no_details') {
    sess.description = '';
    return showOrderConfirm(chatId, sess);
  }

  // ─── تأیید سفارش ───
  if (data === 'order_confirm') {
    const user = db.getUser(chatId);
    const { id, shortId } = db.addOrder({
      chatId: chatId.toString(),
      userName: q.from.first_name,
      userUsername: q.from.username,
      link: sess.link,
      description: sess.description || '',
      lirPrice: sess.lirPrice,
      totalPrice: sess.totalPrice,
      feeType: sess.feeType,
      hasDiscount: sess.hasDiscount,
      levelName: sess.levelName,
      type: 'link',
    });

    // اگه کد معرف داشت، بعد از تأیید سفارش علامت بزن
    if (user?.referredBy) {
      db.saveUser(chatId, { referralUsed: true });
    }

    sessions.delete(chatId);
    ss(chatId).waitingReceipt = true;
    ss(chatId).waitingReceiptOrder = id;

    let priceMsg = `💎 مبلغ قابل پرداخت:\n${db.formatPrice(sess.totalPrice)}`;
    if (sess.hasDiscount) {
      const normalPrice = db.calcPrice(sess.lirPrice, 'normal');
      priceMsg = `💰 قیمت عادی: ${db.formatPrice(normalPrice)}\n💎 قیمت شما: ${db.formatPrice(sess.totalPrice)}`;
    }

    bot.sendMessage(chatId,
      `✅ سفارش شما ثبت شد!\n🆔 شماره پیگیری: #${shortId}\n\n💳 اطلاعات واریز:\n\n🏦 ${CARD_BANK}\n💳 شماره کارت:\n${CARD}\n\n👤 به نام: ${CARD_OWNER}\n\n${priceMsg}\n\n━━━━━━━━━━━━━━\n⚠️ پس از واریز، تصویر رسید را\nهمینجا ارسال کنید`,
      cMenu
    );

    if (ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 سفارش جدید!\n\n👤 ${q.from.first_name} (@${q.from.username||'—'})\n⭐ سطح: ${sess.levelName||'عادی'}\n🎁 تخفیف: ${sess.hasDiscount ? 'دارد' : 'ندارد'}\n🔗 ${sess.link}\n📝 ${sess.description||'—'}\n💰 ${db.formatPrice(sess.totalPrice)}\n🆔 #${shortId}`,
        { reply_markup: { inline_keyboard: [[
          { text: '✅ تأیید پرداخت', callback_data: `confirm_${id}` },
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
      bot.sendMessage(order.chatId, db.statusMessages.paid);
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

    if (data.startsWith('cancel_')) {
      const oid = data.replace('cancel_', '');
      const order = db.getOrder(oid);
      if (!order) return;
      db.updateOrder(oid, { status: 'cancelled' });
      bot.sendMessage(chatId, `❌ سفارش لغو شد`, aMenu);
      if (order.chatId) bot.sendMessage(order.chatId, db.statusMessages.cancelled);
      return;
    }

    if (data.startsWith('st_')) {
      const parts = data.replace('st_', '').split('_');
      const newStatus = parts[0];
      const oid = parts.slice(1).join('_');
      const order = db.getOrder(oid);
      if (!order) return;
      db.updateOrder(oid, { status: newStatus });
      sessions.delete(chatId);
      bot.sendMessage(chatId, `✅ وضعیت سفارش #${order.shortId} به «${db.statusLabels[newStatus]}» تغییر کرد`, aMenu);

      if (order.chatId && db.statusMessages[newStatus]) {
        // برای وضعیت received دکمه پشتیبانی اضافه میشه
        if (newStatus === 'received') {
          bot.sendMessage(order.chatId, db.statusMessages.received, {
            reply_markup: { inline_keyboard: [[
              { text: '📩 ارتباط با پشتیبانی', url: 'https://t.me/LunaFortunaSupport' }
            ]]}
          });
        } else {
          bot.sendMessage(order.chatId, db.statusMessages[newStatus]);
        }
      }

      // ارتقا سطح بعد از تحویل
      if (newStatus === 'delivered' && order.chatId) {
        const doneOrders = db.getUserOrders(order.chatId).filter(o => o.status === 'delivered').length;

        if (doneOrders === 5) {
          bot.sendMessage(order.chatId, `🎉 تبریک!\n🥈 سطح شما به نقره ارتقا یافت!\n🌙 ممنون از اعتماد شما به Luna Fortuna`);
          if (ADMIN_ID) bot.sendMessage(ADMIN_ID, `⭐ ارتقا سطح!\n\n👤 ${order.userName} (@${order.userUsername||'—'})\n🥈 سطح جدید: نقره\n📦 تعداد خرید: ۵`);
        } else if (doneOrders === 10) {
          bot.sendMessage(order.chatId, `🎉 تبریک!\n🥇 سطح شما به طلایی ارتقا یافت!\n🌙 ممنون از وفاداری شما به Luna Fortuna`);
          if (ADMIN_ID) bot.sendMessage(ADMIN_ID, `⭐ ارتقا سطح!\n\n👤 ${order.userName} (@${order.userUsername||'—'})\n🥇 سطح جدید: طلایی\n📦 تعداد خرید: ۱۰`);
        }

        // اطلاع به معرف
        const user = db.getUser(order.chatId);
        if (user?.referredBy && !user?.referralRewardGiven) {
          const allUsers = db.getAllUsers();
          const referrer = allUsers.find(u => db.generateReferralCode(u.chatId) === user.referredBy);
          if (referrer) {
            bot.sendMessage(referrer.chatId, `🎉 دوستت خرید کرد!\n🌙 ممنون از اینکه Luna Fortuna را معرفی کردید\n🎁 تخفیف ویژه شما برای خرید بعدی فعال شد`);
            db.saveUser(order.chatId, { referralRewardGiven: true });
            if (ADMIN_ID) {
              bot.sendMessage(ADMIN_ID,
                `👥 خرید با کد معرف تکمیل شد!\n\n👤 خریدار: ${order.userName} (@${order.userUsername||'—'})\n🎁 معرف: ${referrer.name} (@${referrer.username||'—'})\n💰 ${db.formatPrice(order.totalPrice)}\n🆔 #${order.shortId}`
              );
            }
          }
        }
      }
      return;
    }

    if (data.startsWith('found_') && isAdmin(chatId)) {
      const oid = data.replace('found_', '');
      ss(chatId).step = 'send_found';
      ss(chatId).foundOrderId = oid;
      return bot.sendMessage(chatId, `لینک و توضیحات محصول پیدا شده را بفرستید:`,
        { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true }}
      );
    }
  }
});

// ─── بررسی تولد هر روز ───
function checkBirthdays() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  db.getAllUsers().forEach(u => {
    if (!u.birthday || isAdmin(u.chatId)) return;
    const [d, m] = u.birthday.split('/').map(Number);
    if (d === day && m === month) {
      bot.sendMessage(u.chatId, `🎂 تولدت مبارک ${u.name} عزیز!\n🌙 Luna Fortuna برایت آرزوی بهترین‌ها را دارد\n🎁 تخفیف ویژه تولد شما امروز فعال است`);
      if (ADMIN_ID) bot.sendMessage(ADMIN_ID, `🎂 امروز تولد یک مشتری است!\n\n👤 ${u.name} (@${u.username||'—'})\n📅 ${d}/${m}`);
    }
  });
}

// هر روز ساعت ۹ صبح چک میکنه
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 9 && now.getMinutes() === 0) checkBirthdays();
}, 60000);

console.log('🌙 Luna Fortuna Bot v4.0 is running...');
