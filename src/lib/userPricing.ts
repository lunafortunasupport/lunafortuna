import { prisma } from "./prisma";
import { getUserLevel, type FeeType, type Fees } from "./pricing";

export interface UserForPricing {
  id: string;
  birthday: string | null;
  referredBy: string | null;
  referralUsed: boolean;
  referralRewardPending: boolean;
}

export interface ResolvedFee {
  feeType: FeeType;
  fee: number;
  deliveredCount: number;
  levelName: string;
  /** اگر کارمزد معرف انتخاب شد، نوعش: new = خرید اولِ دعوت‌شده | reward = پاداشِ دعوت‌کننده */
  referralKind: "new" | "reward" | null;
}

/** تعیین بهترین (کمترین) کارمزد برای یک کاربر بر اساس سطح، تولد و کد معرف. */
export async function resolveUserFee(user: UserForPricing, fees: Fees): Promise<ResolvedFee> {
  const deliveredCount = await prisma.order.count({
    where: { userId: user.id, status: "delivered" },
  });
  const level = getUserLevel(deliveredCount);

  type Cand = { type: FeeType; fee: number; referralKind: "new" | "reward" | null };
  const candidates: Cand[] = [{ type: level.fee, fee: fees[level.fee], referralKind: null }];

  // تولد
  if (user.birthday && isBirthdayToday(user.birthday)) {
    candidates.push({ type: "birthday", fee: fees.birthday, referralKind: null });
  }
  // خرید اولِ دعوت‌شده با کد معرف (یک‌بار)
  if (user.referredBy && !user.referralUsed) {
    candidates.push({ type: "referral", fee: fees.referral, referralKind: "new" });
  }
  // پاداشِ دعوت‌کننده (یک‌بار، پس از خرید دعوت‌شده)
  if (user.referralRewardPending) {
    candidates.push({ type: "referral", fee: fees.referral, referralKind: "reward" });
  }

  // کمترین کارمزد به نفع مشتری؛ در تساوی، معرف اولویت دارد تا مصرف شود
  candidates.sort((a, b) => a.fee - b.fee || (b.referralKind ? 1 : 0) - (a.referralKind ? 1 : 0));
  const best = candidates[0];

  return {
    feeType: best.type,
    fee: best.fee,
    deliveredCount,
    levelName: level.name,
    referralKind: best.type === "referral" ? best.referralKind : null,
  };
}

export function isBirthdayToday(birthday: string): boolean {
  const m = birthday.split("/").map((x) => parseInt(x));
  if (m.length < 2) return false;
  const [day, month] = m;
  const now = new Date();
  return now.getDate() === day && now.getMonth() + 1 === month;
}
