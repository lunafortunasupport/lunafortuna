// ترجمهٔ دسته‌ایِ نامِ محصولات از ترکی به فارسیِ روان و تجاری، با هوش مصنوعی (AI Gateway).
// نامِ ترکیِ MirrorProduct.nameTr → MirrorProduct.nameFa (فقط آن‌هایی که هنوز nameFa ندارند).
//
// نیاز: DATABASE_URL و AI_GATEWAY_API_KEY در محیط (از scripts/.sync-prod.env خوانده می‌شوند
// توسطِ scripts/translate-names-local.sh). سبک است و به Trendyol وصل نمی‌شود، پس از هرجا اجرا می‌شود.
//
//   LIMIT=20 npx tsx scripts/translate-names.mjs   ← تستِ کیفیت روی ۲۰ محصول
//   npx tsx scripts/translate-names.mjs            ← همهٔ محصولاتِ بدونِ نامِ فارسی
import { PrismaClient } from "@prisma/client";
import { generateObject } from "ai";
import { z } from "zod";

const prisma = new PrismaClient();
const LIMIT = Number(process.env.LIMIT) || Infinity;
const BATCH = Number(process.env.BATCH) || 25;
const MODEL = process.env.TRANSLATE_MODEL || "anthropic/claude-sonnet-5";

const INSTRUCTIONS = `تو مترجمِ حرفه‌ایِ نامِ محصولاتِ مُد از ترکی به فارسی برای یک فروشگاهِ آنلاینِ لوکس هستی.
هر نامِ ترکی را به یک نامِ فارسیِ کوتاه، طبیعی و تجاری تبدیل کن که برای خریدارِ ایرانی واضح و جذاب باشد.
قوانین:
- کدهای محصول/انبار و رشته‌های بی‌معنی (مثلِ YK00021، TWOAW23PL00401، CI00029) را کامل حذف کن.
- ویژگی‌های مهم را حفظ کن: نوعِ محصول، رنگ، مدل/برش، جنس/پارچه، جزئیاتِ شاخص.
- کوتاه و مثلِ عنوانِ محصول باشد (نه جمله)، معمولاً ۳ تا ۸ کلمه.
- واژه‌های مدِ رایج را طبیعی فارسی کن (Palazzo→پالازو، Oversize→اورسایز، Crop→کراپ، Wide Leg→پاچه‌گشاد، Triko→بافت، Bluz→بلوز، Gömlek→پیراهن، Elbise→لباس، Ceket→کت/ژاکت، Pantolon→شلوار، Etek→دامن، Çanta→کیف، Kadın→زنانه، Erkek→مردانه، Çocuk→بچگانه).
- هیچ توضیح یا علامتِ نگارشیِ اضافه نده؛ فقط نامِ فارسیِ تمیز.`;

const schema = z.object({
  items: z.array(z.object({ id: z.string(), fa: z.string() })),
});

async function translateBatch(rows) {
  const list = rows.map((r) => `${r.id} :: ${r.nameTr}`).join("\n");
  const { object } = await generateObject({
    model: MODEL,
    schema,
    system: INSTRUCTIONS,
    prompt: `این محصولات را ترجمه کن. برای هرکدام id را عیناً برگردان و fa را نامِ فارسیِ تمیز بگذار.\n\n${list}`,
  });
  const byId = new Map(object.items.map((i) => [i.id, i.fa]));
  return byId;
}

async function main() {
  const rows = await prisma.mirrorProduct.findMany({
    where: { isActive: true, nameFa: null, nameTr: { not: "" } },
    select: { id: true, nameTr: true },
    take: LIMIT === Infinity ? undefined : LIMIT,
  });
  console.log(`ترجمهٔ ${rows.length} محصول (دسته‌های ${BATCH}تایی، مدل ${MODEL})…`);

  let ok = 0,
    failed = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    try {
      const byId = await translateBatch(batch);
      await Promise.all(
        batch.map(async (r) => {
          const fa = (byId.get(r.id) || "").trim();
          if (fa && fa.length > 1) {
            await prisma.mirrorProduct.update({ where: { id: r.id }, data: { nameFa: fa } });
            ok++;
          } else {
            failed++;
          }
        })
      );
      console.log(`  پیشرفت: ${Math.min(i + BATCH, rows.length)}/${rows.length} (موفق ${ok})`);
    } catch (e) {
      failed += batch.length;
      console.log(`  دسته ${i}-${i + BATCH} خطا: ${String(e).slice(0, 120)}`);
    }
  }

  console.log(`\n✓ تمام شد. ترجمه‌شده: ${ok}، ناموفق: ${failed}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
