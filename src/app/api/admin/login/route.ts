import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, setAdminCookie } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");

  if (!checkCredentials(username, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), { status: 303 });
  }
  setAdminCookie();
  return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
}
