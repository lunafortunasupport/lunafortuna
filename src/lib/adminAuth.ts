import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE = "luna_admin";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret";

function token(): string {
  const user = process.env.ADMIN_USERNAME || "luna";
  return crypto.createHmac("sha256", SECRET).update(`admin:${user}`).digest("hex");
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || "luna";
  const p = process.env.ADMIN_PASSWORD || "changeme";
  // مقایسهٔ ثابت‌زمان
  return safeEqual(username, u) && safeEqual(password, p);
}

export function setAdminCookie() {
  cookies().set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // ۱۲ ساعت
  });
}

export function clearAdminCookie() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}

export function isAdmin(): boolean {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return false;
  return safeEqual(c, token());
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
