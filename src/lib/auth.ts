import { cookies } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "./prisma";

const COOKIE = "luna_session";
const SECRET = process.env.AUTH_SECRET || process.env.ADMIN_SESSION_SECRET || "dev-secret";

function sign(userId: string): string {
  const mac = crypto.createHmac("sha256", SECRET).update(userId).digest("hex");
  return `${userId}.${mac}`;
}

function verify(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const userId = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(userId).digest("hex");
  if (mac.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  return userId;
}

export function setSession(userId: string) {
  cookies().set(COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // ۳۰ روز
  });
}

export function clearSession() {
  cookies().set(COOKIE, "", { path: "/", maxAge: 0 });
}

export function getSessionUserId(): string | null {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return null;
  return verify(c);
}

export async function getCurrentUser() {
  const id = getSessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({ where: { id } });
}

/** تولید کد معرف یکتا برای کاربر جدید */
export function makeReferralCode(): string {
  return "LUNA" + crypto.randomBytes(3).toString("hex").toUpperCase();
}
