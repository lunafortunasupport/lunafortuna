import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

// شروع جریان ورود با گوگل: کاربر را به صفحهٔ رضایتِ گوگل می‌فرستد.
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", req.url));
  }

  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // state برای جلوگیری از CSRF — در کوکیِ کوتاه‌مدت ذخیره و در callback بررسی می‌شود.
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  res.cookies.set("g_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // ۱۰ دقیقه
  });
  return res;
}
