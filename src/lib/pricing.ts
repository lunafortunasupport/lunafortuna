// منطق قیمت‌گذاری و سطوح وفاداری — پورت‌شده از نسخهٔ قبلی (lib/db.js)

export type FeeType = "normal" | "silver" | "gold" | "birthday" | "referral";

export interface Fees {
  normal: number;
  silver: number;
  gold: number;
  birthday: number;
  referral: number;
}

export const DEFAULT_FEES: Fees = {
  normal: 0.15,
  silver: 0.12,
  gold: 0.1,
  birthday: 0.12,
  referral: 0.12,
};

/** قیمت تومان نهایی = لیر × نرخ صرافی × (۱ + کارمزد) */
export function calcToman(lir: number, exchangeRate: number, fee: number): number {
  return Math.round(lir * exchangeRate * (1 + fee));
}

/** سطح مشتری بر اساس تعداد خریدهای تحویل‌شده */
export function getUserLevel(doneCount: number): { key: "gold" | "silver" | "normal"; name: string; fee: FeeType } {
  if (doneCount >= 10) return { key: "gold", name: "🥇 طلایی", fee: "gold" };
  if (doneCount >= 5) return { key: "silver", name: "🥈 نقره", fee: "silver" };
  return { key: "normal", name: "🥉 عادی", fee: "normal" };
}

export function feeValue(fees: Fees, type: FeeType): number {
  return fees[type] ?? fees.normal;
}
