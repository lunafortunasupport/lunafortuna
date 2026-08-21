#!/usr/bin/env bash
# ترجمهٔ نامِ محصولات روی دیتابیسِ production. سبک و بدونِ Trendyol — از هرجا اجرا می‌شود.
# نیاز: در scripts/.sync-prod.env دو خط باشد:
#   DATABASE_URL="postgresql://...Neon..."
#   AI_GATEWAY_API_KEY="...از Vercel..."
#
# تستِ کیفیت:  LIMIT=20 bash scripts/translate-names-local.sh
# اجرای کامل:  bash scripts/translate-names-local.sh
set -e
cd "$(dirname "$0")/.."

ENV_FILE="scripts/.sync-prod.env"
[ -f "$ENV_FILE" ] || { echo "❌ $ENV_FILE پیدا نشد."; exit 1; }
set -a; source "$ENV_FILE"; set +a
[ -n "$DATABASE_URL" ] || { echo "❌ DATABASE_URL خالی است."; exit 1; }
[ -n "$AI_GATEWAY_API_KEY" ] || { echo "❌ AI_GATEWAY_API_KEY در $ENV_FILE نیست. از Vercel → Settings → Environment Variables کپی کن."; exit 1; }
export DATABASE_URL AI_GATEWAY_API_KEY

cleanup() { git checkout -- prisma/schema.prisma 2>/dev/null || true; npx prisma generate >/dev/null 2>&1 || true; }
trap cleanup EXIT

node -e "const fs=require('fs');const p='prisma/schema.prisma';let s=fs.readFileSync(p,'utf8');fs.writeFileSync(p,s.replace('provider = \"sqlite\"','provider = \"postgresql\"'));"
npx prisma generate >/dev/null

npx tsx scripts/translate-names.mjs
