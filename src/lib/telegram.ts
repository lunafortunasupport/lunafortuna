// ارسال پیام/عکس به ادمین از طریق Telegram Bot API (بدون polling؛ مناسب serverless)

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

const API = (method: string) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

export function telegramConfigured(): boolean {
  return Boolean(BOT_TOKEN && ADMIN_CHAT_ID);
}

export async function sendAdminMessage(text: string): Promise<boolean> {
  if (!telegramConfigured()) {
    console.warn("[telegram] BOT_TOKEN/ADMIN_CHAT_ID تنظیم نشده — پیام ارسال نشد.");
    return false;
  }
  try {
    const res = await fetch(API("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("[telegram] sendMessage error", e);
    return false;
  }
}

/** ارسال عکس رسید با کپشن (photoUrl می‌تواند URL عمومی Blob باشد) */
export async function sendAdminPhoto(photoUrl: string, caption: string): Promise<boolean> {
  if (!telegramConfigured()) return false;
  try {
    const res = await fetch(API("sendPhoto"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        photo: photoUrl,
        caption,
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("[telegram] sendPhoto error", e);
    return false;
  }
}
