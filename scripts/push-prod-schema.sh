#!/usr/bin/env bash
# اعمالِ تغییراتِ افزایشیِ schema.prisma روی دیتابیسِ production (Neon).
# چرا دستی؟ Vercel هنگام دیپلوی فقط `prisma generate` می‌زند، نه db push — پس ستون/جدولِ
# جدید باید یک‌بار دستی روی prod ساخته شود، وگرنه کدِ جدید که آن ستون را می‌خواند خطا می‌دهد.
#
# امن است: بدونِ --accept-data-loss اجرا می‌شود، پس اگر پریسما تغییرِ مخرب (حذفِ ستون/جدول)
# تشخیص دهد، به‌جای اجرا خطا می‌دهد و چیزی را از دست نمی‌دهی. فقط افزودنِ ستون/جدول اعمال می‌شود.
#
# اجرا (Git Bash):  bash scripts/push-prod-schema.sh
set -e
cd "$(dirname "$0")/.."

ENV_FILE="scripts/.sync-prod.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE پیدا نشد (همان فایلِ سینک؛ باید DATABASE_URLِ Neon داخلش باشد)."
  exit 1
fi
set -a; source "$ENV_FILE"; set +a
if [ -z "$DATABASE_URL" ]; then echo "❌ DATABASE_URL خالی است."; exit 1; fi
export DATABASE_URL

cleanup() {
  echo "↩️  برگرداندنِ schema.prisma به sqlite (برای dev محلی)…"
  git checkout -- prisma/schema.prisma 2>/dev/null || true
  npx prisma generate >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "🔄 سوییچِ موقتِ provider به postgresql…"
node -e "const fs=require('fs');const p='prisma/schema.prisma';let s=fs.readFileSync(p,'utf8');fs.writeFileSync(p,s.replace('provider = \"sqlite\"','provider = \"postgresql\"'));"

echo "📦 اعمالِ تغییراتِ افزایشی روی prod…"
npx prisma db push --skip-generate

echo ""
echo "✅ schema روی production به‌روز شد. حالا می‌توان کدِ جدید را دیپلوی کرد."
