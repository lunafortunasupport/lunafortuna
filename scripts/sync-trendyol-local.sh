#!/usr/bin/env bash
# سینکِ ترندیول از کامپیوترِ ترکیه به دیتابیسِ production (Neon).
# چرا این‌جا و نه GitHub؟ ترندیول فقط از داخلِ ترکیه دادهٔ کاملِ کاتالوگ می‌دهد؛ رانرهای GitHub
# (بیرونِ ترکیه) تقریباً چیزی نمی‌گیرند. این کامپیوتر در ترکیه است، پس داده کامل و درست می‌آید.
#
# راه‌اندازیِ یک‌بار:
#   ۱) فایلِ scripts/.sync-prod.env بساز (کنارِ همین اسکریپت) با یک خط:
#        DATABASE_URL=postgresql://...   ← رشتهٔ اتصالِ Neon از Vercel (Settings → Environment Variables)
#      این فایل در .gitignore هست و هیچ‌وقت کامیت نمی‌شود.
#   ۲) یک‌بار Chromium نصب کن:  npx playwright install chromium
#
# اجرای دستی (Git Bash):  bash scripts/sync-trendyol-local.sh
# اجرای خودکار: از Windows Task Scheduler هر ۱۲ ساعت این را صدا بزن (راهنما در پایین فایل).

set -e
cd "$(dirname "$0")/.."

ENV_FILE="scripts/.sync-prod.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ فایلِ $ENV_FILE پیدا نشد. یک خط DATABASE_URL=... از Neon داخلش بگذار (بالای همین فایل توضیح داده شده)."
  exit 1
fi
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL در $ENV_FILE خالی است."
  exit 1
fi
export DATABASE_URL

cleanup() {
  echo ""
  echo "↩️  برگرداندنِ schema.prisma به sqlite (برای dev محلی)…"
  git checkout -- prisma/schema.prisma 2>/dev/null || true
  npx prisma generate >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "🔄 سوییچِ موقتِ provider به postgresql…"
node -e "const fs=require('fs');const p='prisma/schema.prisma';let s=fs.readFileSync(p,'utf8');fs.writeFileSync(p,s.replace('provider = \"sqlite\"','provider = \"postgresql\"'));"
npx prisma generate >/dev/null

echo ""
echo "📦 سینکِ ترندیول (ملتی‌برند + حراج) روی production — ممکن است ۲۰ تا ۴۰ دقیقه طول بکشد…"
npx tsx scripts/sync-trendyol.mjs

echo ""
echo "✅ سینکِ ترندیول تمام شد."

# ─────────────────────────────────────────────────────────────────────────────
# راه‌اندازیِ اجرای خودکارِ هر ۱۲ ساعت (یک‌بار، در PowerShell با دسترسیِ معمولی):
#
#   $bash = "C:\Program Files\Git\bin\bash.exe"
#   $proj = "E:\Luna\lunafortuna002"
#   $act  = New-ScheduledTaskAction -Execute $bash -Argument "scripts/sync-trendyol-local.sh" -WorkingDirectory $proj
#   $trg  = New-ScheduledTaskTrigger -Daily -At 3am ; $trg2 = New-ScheduledTaskTrigger -Daily -At 3pm
#   Register-ScheduledTask -TaskName "LunaFortuna Trendyol Sync" -Action $act -Trigger @($trg,$trg2) -Description "سینکِ کاتالوگِ ترندیول از ترکیه"
#
# (کامپیوتر باید هنگامِ اجرا روشن باشد. برای اجرای فوریِ تست:  Start-ScheduledTask -TaskName "LunaFortuna Trendyol Sync")
# ─────────────────────────────────────────────────────────────────────────────
