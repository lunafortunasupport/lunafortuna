import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  clearAdminCookie();
  return NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });
}
