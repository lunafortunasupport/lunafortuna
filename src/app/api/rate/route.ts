import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSettings();
  const perLir = Math.round(s.exchangeRate * (1 + s.feeNormal));
  return NextResponse.json({
    exchangeRate: s.exchangeRate,
    perLirToman: perLir,
    rateSource: s.rateSource,
    rateUpdatedAt: s.rateUpdatedAt,
  });
}
