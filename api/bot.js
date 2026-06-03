const TelegramBot = require('node-telegram-bot-api');
const db = require('../lib/db');

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_CHAT_ID; // آیدی تلگرام ادمین

const bot = new TelegramBot(TOKEN, { polling: true });

// ─── وضعیت مکالمه هر کاربر ───
const sessions = new Map();

function session(chatId) {
  if (!sessions.has(chatId)) sessions.set(chatId, {});
  return sessions.get(chatId);
}

// ─── محاسبه قیمت ───
function calcPrice(lirPrice) {
  const rate = db.getRate();
  const base = lirPrice * rate;
  const fee = base * 0.15;
  const total = base + fee;
  return { base, fee, total, rate };
}

function formatPrice(n) {
  return Math.round(n).toLocaleString('fa-IR') + ' تومان';
}

// ─── منوی اصلی مشتری ───
const customerMenu = {
  reply_markup: {
    keyboard: [
      ['🛍 ثبت سفارش با لینک', '🔍 پیدا کردن محصول'],
      ['📦 وضعیت سفارشم', '💰 محاسبه قیمت'],
      ['🔥 حراج‌های امروز', '📞 پشتیبانی'],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  }
};

// ─── منوی ادمین ───
const adminMenu = {
  reply_markup: {
    keyboard: [
      ['📋 سفارش‌های جدید', '✅ تأیید پرداخت'],
      ['🔄 آپدیت وضعیت', '💱 تنظیم نرخ لیر'],
      ['📊 آمار امروز', '📢 پیام همگانی'],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  }
};

function isAdmin(chatId) {
  return ADMIN_ID && chatId.toString() === ADMIN_ID.toString();
}

// ─── استارت ───
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.chat.first_name || 'عزیز';
  db.saveUser(chatId, { name, username: msg.chat.username });

  if (isAdmin(chatId)) {
    bot.sendMessage(chatId,
      `👑 خوش اومدی ${name}!\n\nپنل مدیریت Luna Fortuna`,
      adminMenu
    );
    return;
  }

  bot.sendMessage(chatId,
    `🌙 سلام ${name}!\n\nبه Luna Fortuna خوش اومدی\n\n` +
    `🇹🇷 ما محصولات ترکیه رو برات میخریم و به ایران میفرستیم\n\n` +
    `از منو یه گزینه انتخاب کن:`,
    customerMenu
  );
});

// ─── ثبت سفارش با لینک ───
bot.onText(/🛍 ثبت سفارش با لینک/, (msg) => {
  const chatId = msg.chat.id;
  session(chatId).step = 'waiting_link';
  bot.sendMessage(chatId,
    `🔗 لینک محصول رو از سایت ترکیه بفرست\n\n` +
    `مثلاً:\nhttps://www.trendyol.com/...\nhttps://www.hepsiburada.com/...\n\n` +
    `💡 محصول رو توی سایت پیدا کن، لینک صفحه‌اش رو کپی کن و اینجا بفرست`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true } }
  );
});

// ─── محاسبه قیمت ───
bot.onText(/💰 محاسبه قیمت/, (msg) => {
  const chatId = msg.chat.id;
  session(chatId).step = 'calc_price';
  bot.sendMessage(chatId,
    `💱 قیمت محصول رو به لیر بفرست\n\nمثلاً: 1200`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true } }
  );
});

// ─── پیدا کردن محصول ───
bot.onText(/🔍 پیدا کردن محصول/, (msg) => {
  const chatId = msg.chat.id;
  session(chatId).step = 'find_product';
  bot.sendMessage(chatId,
    `🔍 توضیح بده چی میخوای:\n\n` +
    `مثلاً:\n• کاپشن زنانه رنگ کرم، سبک مینیمال، تا ۲۰ میلیون\n• کتونی Nike سایز ۴۲، تا ۱۵ میلیون\n• ست آرایشی MAC، بودجه ۱۰ میلیون\n\n` +
    `هر چی بیشتر توضیح بدی بهتر پیدا میکنیم 👇`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true } }
  );
});

// ─── وضعیت سفارش ───
bot.onText(/📦 وضعیت سفارشم/, (msg) => {
  const chatId = msg.chat.id;
  const userOrders = db.getAllOrders().filter(o => o.chatId === chatId.toString());

  if (!userOrders.length) {
    bot.sendMessage(chatId, `📭 هنوز سفارشی ثبت نکردی\n\nبرای ثبت سفارش از منو استفاده کن`, customerMenu);
    return;
  }

  let text = `📦 سفارش‌های شما:\n\n`;
  userOrders.slice(-5).forEach((o, i) => {
    text += `${i+1}. ${o.productName || 'محصول'}\n`;
    text += `   وضعیت: ${db.statusLabels[o.status] || o.status}\n`;
    text += `   مبلغ: ${formatPrice(o.totalPrice)}\n\n`;
  });

  bot.sendMessage(chatId, text, customerMenu);
});

// ─── حراج‌های امروز ───
bot.onText(/🔥 حراج‌های امروز/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `🔥 حراج‌های فعال این هفته:\n\n` +
    `🏷 Trendyol — تا ۷۰٪ تخفیف\n` +
    `🏷 Koton — تا ۵۰٪ تخفیف\n` +
    `🏷 Decathlon — تا ۴۰٪ تخفیف\n` +
    `🏷 Gratis — تا ۳۵٪ تخفیف\n` +
    `🏷 LC Waikiki — تا ۴۵٪ تخفیف\n\n` +
    `برای سفارش لینک محصول رو بفرست 👇`,
    customerMenu
  );
});

// ─── پشتیبانی ───
bot.onText(/📞 پشتیبانی/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `📞 پشتیبانی Luna Fortuna:\n\n` +
    `📱 تلگرام: @LunaFortunaSupport\n` +
    `📸 اینستاگرام: lunafortuna.shop\n` +
    `☎️ تلفن: 0090-5318662989\n\n` +
    `⏰ ساعت پاسخگویی: ۹ صبح تا ۱۱ شب`,
    customerMenu
  );
});

// ─── بازگشت ───
bot.onText(/🔙 بازگشت/, (msg) => {
  const chatId = msg.chat.id;
  sessions.delete(chatId);
  bot.sendMessage(chatId, `به منو اصلی برگشتی`, isAdmin(chatId) ? adminMenu : customerMenu);
});

// ═══════ پنل ادمین ═══════

// سفارش‌های جدید
bot.onText(/📋 سفارش‌های جدید/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  const pending = db.getAllOrders().filter(o => o.status === 'pending');

  if (!pending.length) {
    bot.sendMessage(msg.chat.id, `✅ سفارش جدیدی نیست`, adminMenu);
    return;
  }

  pending.forEach(o => {
    const keyboard = {
      inline_keyboard: [[
        { text: '✅ تأیید پرداخت', callback_data: `confirm_${o.id}` },
        { text: '❌ لغو', callback_data: `cancel_${o.id}` },
      ]]
    };
    bot.sendMessage(msg.chat.id,
      `📋 سفارش جدید #${o.id.slice(-4)}\n\n` +
      `👤 مشتری: ${o.userName || 'نامشخص'}\n` +
      `🔗 لینک: ${o.link || '—'}\n` +
      `📝 توضیحات: ${o.description || '—'}\n` +
      `💰 مبلغ: ${formatPrice(o.totalPrice)}\n` +
      `📅 تاریخ: ${new Date(o.createdAt).toLocaleString('fa-IR')}`,
      { reply_markup: keyboard }
    );
  });
});

// تنظیم نرخ لیر
bot.onText(/💱 تنظیم نرخ لیر/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  session(msg.chat.id).step = 'set_rate';
  bot.sendMessage(msg.chat.id,
    `💱 نرخ فعلی: ${db.getRate().toLocaleString('fa-IR')} تومان/لیر\n\nنرخ جدید رو بفرست:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true } }
  );
});

// آمار
bot.onText(/📊 آمار امروز/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  const all = db.getAllOrders();
  const today = all.filter(o => o.createdAt?.startsWith(new Date().toISOString().split('T')[0]));
  const totalAmount = all.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalPrice || 0), 0);

  bot.sendMessage(msg.chat.id,
    `📊 آمار کلی:\n\n` +
    `📦 کل سفارش‌ها: ${all.length}\n` +
    `🆕 سفارش امروز: ${today.length}\n` +
    `⏳ در انتظار پرداخت: ${all.filter(o=>o.status==='pending').length}\n` +
    `🚚 در راه: ${all.filter(o=>o.status==='shipped').length}\n` +
    `💰 مجموع فروش: ${formatPrice(totalAmount)}\n` +
    `👥 کل کاربران: ${db.getAllUsers().length}`,
    adminMenu
  );
});

// پیام همگانی
bot.onText(/📢 پیام همگانی/, (msg) => {
  if (!isAdmin(msg.chat.id)) return;
  session(msg.chat.id).step = 'broadcast';
  bot.sendMessage(msg.chat.id,
    `📢 متن پیامی که میخوای به همه بفرستی رو بنویس:`,
    { reply_markup: { keyboard: [['🔙 بازگشت']], resize_keyboard: true } }
  );
});

// ─── پردازش پیام‌های متنی ───
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const s = session(chatId);

  if (!text || text.startsWith('/') || text.startsWith('🛍') || text.startsWith('🔍') ||
      text.startsWith('📦') || text.startsWith('💰') || text.startsWith('🔥') ||
      text.startsWith('📞') || text.startsWith('🔙') || text.startsWith('📋') ||
      text.startsWith('✅') || text.startsWith('🔄') || text.startsWith('💱') ||
      text.startsWith('📊') || text.startsWith('📢')) return;

  // ─── مرحله دریافت لینک ───
  if (s.step === 'waiting_link') {
    if (!text.startsWith('http')) {
      bot.sendMessage(chatId, `❌ لینک معتبر نیست\nلطفاً لینک کامل محصول رو بفرست (باید با http شروع بشه)`);
      return;
    }
    s.link = text;
    s.step = 'waiting_link_price';
    bot.sendMessage(chatId,
      `✅ لینک دریافت شد!\n\n` +
      `💰 قیمت محصول رو به لیر بفرست\n(عدد روی صفحه محصول)`,
    );
    return;
  }

  // ─── قیمت لیر برای سفارش ───
  if (s.step === 'waiting_link_price') {
    const lir = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!lir || lir <= 0) {
      bot.sendMessage(chatId, `❌ عدد معتبر نیست\nمثلاً: 1200`);
      return;
    }
    const { base, fee, total } = calcPrice(lir);
    s.lirPrice = lir;
    s.totalPrice = total;
    s.step = 'waiting_link_details';

    bot.sendMessage(chatId,
      `💰 محاسبه قیمت:\n\n` +
      `قیمت لیر: ${lir.toLocaleString()} ₺\n` +
      `نرخ امروز: ${db.getRate().toLocaleString()} تومان/لیر\n` +
      `قیمت پایه: ${formatPrice(base)}\n` +
      `کارمزد خدمات (۱۵٪): ${formatPrice(fee)}\n` +
      `━━━━━━━━━━━━\n` +
      `💎 مبلغ نهایی: ${formatPrice(total)}\n\n` +
      `📝 سایز، رنگ و توضیحات رو بنویس:`,
    );
    return;
  }

  // ─── جزئیات سفارش ───
  if (s.step === 'waiting_link_details') {
    s.description = text;
    s.step = 'confirm_order';
    const user = db.getUser(chatId);

    bot.sendMessage(chatId,
      `📋 خلاصه سفارش:\n\n` +
      `🔗 لینک: ${s.link}\n` +
      `📝 جزئیات: ${s.description}\n` +
      `💰 مبلغ قابل پرداخت: ${formatPrice(s.totalPrice)}\n\n` +
      `تأیید میکنی؟`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ تأیید و ادامه', callback_data: 'confirm_order' },
            { text: '❌ انصراف', callback_data: 'cancel_order' },
          ]]
        }
      }
    );
    return;
  }

  // ─── محاسبه قیمت ساده ───
  if (s.step === 'calc_price') {
    const lir = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!lir || lir <= 0) {
      bot.sendMessage(chatId, `❌ عدد معتبر نیست\nمثلاً: 1200`);
      return;
    }
    const { base, fee, total } = calcPrice(lir);
    sessions.delete(chatId);
    bot.sendMessage(chatId,
      `💰 محاسبه قیمت:\n\n` +
      `قیمت لیر: ${lir.toLocaleString()} ₺\n` +
      `نرخ امروز: ${db.getRate().toLocaleString()} تومان/لیر\n` +
      `قیمت پایه: ${formatPrice(base)}\n` +
      `کارمزد خدمات (۱۵٪): ${formatPrice(fee)}\n` +
      `━━━━━━━━━━━━\n` +
      `💎 مبلغ نهایی: ${formatPrice(total)}\n\n` +
      `+ هزینه باربری بعد از رسیدن محصول`,
      customerMenu
    );
    return;
  }

  // ─── پیدا کردن محصول ───
  if (s.step === 'find_product') {
    const orderId = db.addOrder({
      chatId: chatId.toString(),
      userName: msg.chat.first_name,
      type: 'find',
      description: text,
      status: 'pending',
      totalPrice: 0,
    });
    sessions.delete(chatId);

    bot.sendMessage(chatId,
      `✅ درخواستت ثبت شد!\n\n` +
      `📝 توضیحات: ${text}\n\n` +
      `⏰ ظرف ۲۴ ساعت گزینه‌های پیشنهادی برات میفرستیم\n` +
      `شماره پیگیری: #${orderId.slice(-4)}`,
      customerMenu
    );

    // اطلاع به ادمین
    if (ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🔍 درخواست پیدا کردن محصول جدید!\n\n` +
        `👤 مشتری: ${msg.chat.first_name} (@${msg.chat.username || '—'})\n` +
        `📝 توضیحات: ${text}\n` +
        `🆔 شماره: #${orderId.slice(-4)}`
      );
    }
    return;
  }

  // ─── تنظیم نرخ (ادمین) ───
  if (s.step === 'set_rate' && isAdmin(chatId)) {
    const rate = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!rate || rate <= 0) {
      bot.sendMessage(chatId, `❌ عدد معتبر نیست`);
      return;
    }
    db.setRate(rate);
    sessions.delete(chatId);
    bot.sendMessage(chatId,
      `✅ نرخ لیر آپدیت شد!\n💱 نرخ جدید: ${rate.toLocaleString()} تومان/لیر`,
      adminMenu
    );
    return;
  }

  // ─── پیام همگانی (ادمین) ───
  if (s.step === 'broadcast' && isAdmin(chatId)) {
    const users = db.getAllUsers();
    let sent = 0;
    for (const user of users) {
      try {
        await bot.sendMessage(user.chatId, `📢 پیام از Luna Fortuna:\n\n${text}`);
        sent++;
      } catch(e) {}
    }
    sessions.delete(chatId);
    bot.sendMessage(chatId, `✅ پیام به ${sent} نفر فرستاده شد`, adminMenu);
    return;
  }
});

// ─── Callback ها ───
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const s = session(chatId);

  bot.answerCallbackQuery(query.id);

  // تأیید سفارش توسط مشتری
  if (data === 'confirm_order') {
    const orderId = db.addOrder({
      chatId: chatId.toString(),
      userName: query.from.first_name,
      link: s.link,
      description: s.description,
      lirPrice: s.lirPrice,
      totalPrice: s.totalPrice,
      type: 'link',
    });
    sessions.delete(chatId);

    bot.sendMessage(chatId,
      `✅ سفارشت ثبت شد!\n\n` +
      `شماره پیگیری: #${orderId.slice(-4)}\n\n` +
      `💳 برای پرداخت:\n` +
      `شماره کارت: 6037-XXXX-XXXX-XXXX\n` +
      `به نام: لونا فورتونا\n\n` +
      `مبلغ: ${formatPrice(s.totalPrice)}\n\n` +
      `بعد از واریز، رسید رو همینجا بفرست 👇`,
      customerMenu
    );

    // اطلاع به ادمین
    if (ADMIN_ID) {
      bot.sendMessage(ADMIN_ID,
        `🆕 سفارش جدید!\n\n` +
        `👤 ${query.from.first_name} (@${query.from.username || '—'})\n` +
        `🔗 ${s.link}\n` +
        `📝 ${s.description}\n` +
        `💰 ${formatPrice(s.totalPrice)}\n` +
        `🆔 #${orderId.slice(-4)}`,
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ تأیید پرداخت', callback_data: `confirm_${orderId}` },
              { text: '❌ لغو', callback_data: `cancel_${orderId}` },
            ]]
          }
        }
      );
    }
    return;
  }

  if (data === 'cancel_order') {
    sessions.delete(chatId);
    bot.sendMessage(chatId, `سفارش لغو شد`, customerMenu);
    return;
  }

  // تأیید پرداخت توسط ادمین
  if (data.startsWith('confirm_') && isAdmin(chatId)) {
    const orderId = data.replace('confirm_', '');
    const order = db.getOrder(orderId);
    if (!order) return;

    db.updateOrderStatus(orderId, 'paid');
    bot.sendMessage(chatId, `✅ پرداخت تأیید شد — شروع به خرید میکنیم`, adminMenu);

    // اطلاع به مشتری
    bot.sendMessage(order.chatId,
      `✅ پرداختت تأیید شد!\n\n` +
      `🛒 داریم محصولت رو میخریم\n` +
      `به محض ارسال خبرت میدیم 📦`
    );
    return;
  }

  if (data.startsWith('cancel_') && isAdmin(chatId)) {
    const orderId = data.replace('cancel_', '');
    const order = db.getOrder(orderId);
    if (!order) return;

    db.updateOrderStatus(orderId, 'cancelled');
    bot.sendMessage(chatId, `❌ سفارش لغو شد`, adminMenu);

    if (order.chatId) {
      bot.sendMessage(order.chatId, `❌ متأسفانه سفارش شما لغو شد\nبرای اطلاعات بیشتر با پشتیبانی تماس بگیرید`);
    }
    return;
  }

  // آپدیت وضعیت
  if (data.startsWith('status_') && isAdmin(chatId)) {
    const [, orderId, newStatus] = data.split('_');
    const order = db.getOrder(orderId);
    if (!order) return;

    db.updateOrderStatus(orderId, newStatus);
    bot.sendMessage(chatId, `✅ وضعیت آپدیت شد: ${db.statusLabels[newStatus]}`);

    if (order.chatId) {
      bot.sendMessage(order.chatId,
        `📦 وضعیت سفارشت آپدیت شد!\n\n${db.statusLabels[newStatus]}`
      );
    }
  }
});

console.log('🌙 Luna Fortuna Bot is running...');
