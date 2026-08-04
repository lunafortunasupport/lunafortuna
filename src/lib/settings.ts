import { prisma } from "./prisma";
import type { Fees } from "./pricing";

const SINGLETON_ID = "singleton";

/** خواندن تنظیمات؛ اگر نبود، با مقادیر پیش‌فرض می‌سازد. */
export async function getSettings() {
  let s = await prisma.settings.findUnique({ where: { id: SINGLETON_ID } });
  if (!s) {
    s = await prisma.settings.create({
      data: {
        id: SINGLETON_ID,
        exchangeRate: Number(process.env.DEFAULT_EXCHANGE_RATE) || 4800,
      },
    });
  }
  return s;
}

export function feesFromSettings(s: {
  feeNormal: number;
  feeSilver: number;
  feeGold: number;
  feeBirthday: number;
  feeReferral: number;
}): Fees {
  return {
    normal: s.feeNormal,
    silver: s.feeSilver,
    gold: s.feeGold,
    birthday: s.feeBirthday,
    referral: s.feeReferral,
  };
}
