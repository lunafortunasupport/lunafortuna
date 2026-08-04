import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCode, normalizeIdentifier } from "@/lib/otp";
import { setSession, makeReferralCode } from "@/lib/auth";
import { sendAdminMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = normalizeIdentifier(String(body.email || ""));
  const code = String(body.code || "");
  const referral = String(body.referral || "").trim().toUpperCase();
  const name = String(body.name || "").trim().slice(0, 120);

  const result = await verifyCode(email, code);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  let isNew = false;

  if (!user) {
    isNew = true;
    // اعتبارسنجی کد معرف (اگر داده شده)
    let referredBy: string | null = null;
    if (referral) {
      const ref = await prisma.user.findUnique({ where: { referralCode: referral } });
      if (ref) referredBy = ref.referralCode;
    }
    // تولید کد معرف یکتا
    let refCode = makeReferralCode();
    while (await prisma.user.findUnique({ where: { referralCode: refCode } })) {
      refCode = makeReferralCode();
    }
    user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        emailVerified: new Date(),
        referralCode: refCode,
        referredBy,
      },
    });
    if (referredBy) {
      await sendAdminMessage(`👥 عضو جدید با کد معرف <b>${referredBy}</b>\n📧 ${email}`);
    }
  } else if (name && !user.name) {
    user = await prisma.user.update({ where: { id: user.id }, data: { name } });
  }

  setSession(user.id);
  return NextResponse.json({ ok: true, isNew, referralCode: user.referralCode });
}
