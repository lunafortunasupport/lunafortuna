import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession, makeReferralCode } from "@/lib/auth";
import { normalizeIdentifier } from "@/lib/otp";

export const dynamic = "force-dynamic";

function loginError(req: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}`, req.url));
}

// بازگشت از گوگل: code را به توکن تبدیل، ایمیل را استخراج، کاربر را وارد می‌کند.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = req.cookies.get("g_oauth_state")?.value;

  if (url.searchParams.get("error") || !code) return loginError(req, "google_cancelled");
  if (!state || !savedState || state !== savedState) return loginError(req, "google_state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return loginError(req, "google_not_configured");

  const redirectUri = `${url.origin}/api/auth/google/callback`;

  // ۱) تبدیل code به توکن
  let idToken: string;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id_token) return loginError(req, "google_token");
    idToken = tokenData.id_token;
  } catch {
    return loginError(req, "google_token");
  }

  // ۲) استخراج payload از id_token (که مستقیم و روی TLS از گوگل آمده)
  let payload: { email?: string; email_verified?: boolean; name?: string; picture?: string };
  try {
    const part = idToken.split(".")[1];
    payload = JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return loginError(req, "google_token");
  }

  const email = normalizeIdentifier(String(payload.email || ""));
  if (!email || payload.email_verified === false) return loginError(req, "google_email");

  const name = (payload.name || "").trim().slice(0, 120) || null;
  const image = payload.picture || null;

  // ۳) یافتن یا ساختن کاربر
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    let refCode = makeReferralCode();
    while (await prisma.user.findUnique({ where: { referralCode: refCode } })) {
      refCode = makeReferralCode();
    }
    user = await prisma.user.create({
      data: { email, name, image, emailVerified: new Date(), referralCode: refCode },
    });
  } else {
    // پر کردن نام/عکس اگر خالی بودند
    const patch: Record<string, unknown> = {};
    if (!user.name && name) patch.name = name;
    if (!user.image && image) patch.image = image;
    if (Object.keys(patch).length) {
      user = await prisma.user.update({ where: { id: user.id }, data: patch });
    }
  }

  // ۴) ورود + پاک‌کردن کوکیِ state، سپس هدایت به حساب کاربری
  setSession(user.id);
  const res = NextResponse.redirect(new URL("/account", req.url));
  res.cookies.set("g_oauth_state", "", { path: "/", maxAge: 0 });
  return res;
}
