// ارسال ایمیل — در توسعه فقط در کنسول لاگ می‌شود؛ در پروداکشن از Resend استفاده می‌کند.

export async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "LunaFortuna <noreply@lunafortuna.store>";

  if (!apiKey) {
    // حالت توسعه: کد را در کنسول سرور نمایش بده
    console.log(`\n📧 [DEV EMAIL] به: ${to}\nموضوع: ${subject}\n${text}\n`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
    return res.ok;
  } catch (e) {
    console.error("[mailer] error", e);
    return false;
  }
}
