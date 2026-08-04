// اسکریپت build مخصوص Vercel:
// provider را به postgresql سوییچ می‌کند، جدول‌ها را می‌سازد، seed می‌کند، بعد build.
// (توسعهٔ محلی روی SQLite دست‌نخورده می‌ماند چون این اسکریپت فقط در Vercel اجرا می‌شود.)

const { execSync } = require("node:child_process");
const fs = require("node:fs");

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

// ۱) سوییچ provider به postgresql
const schemaPath = "prisma/schema.prisma";
let schema = fs.readFileSync(schemaPath, "utf8");
if (schema.includes('provider = "sqlite"')) {
  schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema);
  console.log("✓ provider → postgresql");
}

// ۲) تولید Prisma Client
run("prisma generate");

// ۳) اگر دیتابیس متصل است، جدول‌ها را بساز و seed کن
if (process.env.DATABASE_URL) {
  try {
    run("prisma db push --accept-data-loss --skip-generate");
    try {
      run("tsx prisma/seed.ts");
    } catch (e) {
      console.warn("⚠ seed با خطا مواجه شد (غیرکشنده) — ادامه می‌دهیم.");
    }
  } catch (e) {
    console.warn("⚠ db push با خطا مواجه شد — احتمالاً DATABASE_URL درست تنظیم نشده.");
  }
} else {
  console.warn("⚠ DATABASE_URL تنظیم نشده — از db push/seed صرف‌نظر شد.");
}

// ۴) build نهایی
run("next build");
