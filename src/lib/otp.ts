import crypto from "node:crypto";
import { prisma } from "./prisma";

const CODE_TTL_MS = 10 * 60 * 1000; // ۱۰ دقیقه
const MAX_ATTEMPTS = 5;

function hash(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function normalizeIdentifier(raw: string): string {
  return raw.trim().toLowerCase();
}

/** تولید و ذخیرهٔ کد ۶ رقمی؛ کد خام را برمی‌گرداند تا ارسال شود. */
export async function createCode(identifier: string): Promise<string> {
  const id = normalizeIdentifier(identifier);
  // حذف کدهای قبلی همان identifier
  await prisma.verificationCode.deleteMany({ where: { identifier: id } });
  const code = String(crypto.randomInt(100000, 1000000));
  await prisma.verificationCode.create({
    data: { identifier: id, codeHash: hash(code), expiresAt: new Date(Date.now() + CODE_TTL_MS) },
  });
  return code;
}

export type VerifyResult = { ok: true } | { ok: false; reason: string };

export async function verifyCode(identifier: string, code: string): Promise<VerifyResult> {
  const id = normalizeIdentifier(identifier);
  const rec = await prisma.verificationCode.findFirst({
    where: { identifier: id },
    orderBy: { createdAt: "desc" },
  });
  if (!rec) return { ok: false, reason: "کدی برای این آدرس یافت نشد. دوباره درخواست بده." };
  if (rec.expiresAt < new Date()) {
    await prisma.verificationCode.delete({ where: { id: rec.id } });
    return { ok: false, reason: "کد منقضی شده. کد جدید بگیر." };
  }
  if (rec.attempts >= MAX_ATTEMPTS) {
    await prisma.verificationCode.delete({ where: { id: rec.id } });
    return { ok: false, reason: "تعداد تلاش زیاد شد. کد جدید بگیر." };
  }
  if (rec.codeHash !== hash(code.trim())) {
    await prisma.verificationCode.update({ where: { id: rec.id }, data: { attempts: rec.attempts + 1 } });
    return { ok: false, reason: "کد اشتباه است." };
  }
  await prisma.verificationCode.delete({ where: { id: rec.id } });
  return { ok: true };
}
