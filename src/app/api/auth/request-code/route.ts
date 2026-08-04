import { NextRequest, NextResponse } from "next/server";
import { createCode, normalizeIdentifier } from "@/lib/otp";
import { sendEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const id = normalizeIdentifier(String(email || ""));
  if (!EMAIL_RE.test(id)) {
    return NextResponse.json({ error: "ایمیل معتبر وارد کن" }, { status: 400 });
  }

  const code = await createCode(id);
  await sendEmail(
    id,
    "کد ورود به LunaFortuna 🌙",
    `سلام!\nکد ورود تو به LunaFortuna:\n\n${code}\n\nاین کد تا ۱۰ دقیقه معتبر است. اگر این درخواست از طرف تو نبوده، نادیده بگیر.\n\nخیالت راحت، بقیه‌اش با ما 🌙`
  );

  return NextResponse.json({ ok: true });
}
