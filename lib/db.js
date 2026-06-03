// ذخیره‌سازی ساده در حافظه (برای Vercel)
// در نسخه واقعی از Supabase استفاده میشه

const orders = new Map();
const users = new Map();
const rate = { lir: 4800 }; // نرخ لیر به تومان

module.exports = {
  // سفارش‌ها
  addOrder(order) {
    const id = Date.now().toString();
    orders.set(id, { ...order, id, status: 'pending', createdAt: new Date().toISOString() });
    return id;
  },
  getOrder(id) { return orders.get(id); },
  getAllOrders() { return Array.from(orders.values()); },
  updateOrderStatus(id, status) {
    const o = orders.get(id);
    if (o) { o.status = status; orders.set(id, o); return true; }
    return false;
  },

  // کاربران
  saveUser(chatId, data) { users.set(chatId.toString(), { chatId, ...data }); },
  getUser(chatId) { return users.get(chatId.toString()); },
  getAllUsers() { return Array.from(users.values()); },

  // نرخ لیر
  getRate() { return rate.lir; },
  setRate(val) { rate.lir = val; },

  statusLabels: {
    pending:    '⏳ در انتظار پرداخت',
    paid:       '✅ پرداخت تأیید شد',
    buying:     '🛒 در حال خرید',
    shipped:    '🚚 ارسال شد',
    delivered:  '📦 تحویل داده شد',
    cancelled:  '❌ لغو شد',
  }
};
