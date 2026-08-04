"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/adminAuth";
import { getSettings } from "@/lib/settings";
import { sendAdminMessage } from "@/lib/telegram";

function guard() {
  if (!isAdmin()) throw new Error("unauthorized");
}

function toLines(s: string): string[] {
  return s
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// ── سفارش‌ها ──
export async function updateOrderStatus(formData: FormData) {
  guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  const order = await prisma.order.findUnique({ where: { id } });
  await prisma.order.update({ where: { id }, data: { status } });

  // آزادسازی پاداش دعوت‌کننده وقتی خریدِ دعوت‌شده تأیید (پرداخت) شد
  if (
    order &&
    status === "paid" &&
    order.referralKind === "new" &&
    !order.referralRewarded &&
    order.userId
  ) {
    const buyer = await prisma.user.findUnique({ where: { id: order.userId } });
    if (buyer?.referredBy) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: buyer.referredBy } });
      if (referrer && !referrer.referralRewardPending) {
        await prisma.user.update({
          where: { id: referrer.id },
          data: { referralRewardPending: true },
        });
      }
      await prisma.order.update({ where: { id }, data: { referralRewarded: true } });
      await sendAdminMessage(
        `👥 <b>پاداش معرف فعال شد</b>\nدعوت‌شده «${escapeHtml(buyer.name || buyer.email || "کاربر")}» خرید کرد؛ تخفیف معرف برای دعوت‌کننده (کد ${escapeHtml(buyer.referredBy)}) در خرید بعدی فعال شد.`
      );
    }
  }

  revalidatePath("/admin/orders");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── محصولات ──
export async function saveProduct(formData: FormData) {
  guard();
  const id = String(formData.get("id") || "");
  const data = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    categoryId: String(formData.get("categoryId") || "") || null,
    brandName: String(formData.get("brandName") || "").trim() || null,
    images: JSON.stringify(toLines(String(formData.get("images") || ""))),
    sizes: JSON.stringify(toLines(String(formData.get("sizes") || ""))),
    priceToman: parseInt(String(formData.get("priceToman") || "0").replace(/\D/g, "")) || 0,
    stock: parseInt(String(formData.get("stock") || "0")) || 0,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };
  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  guard();
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

// ── بنرها ──
export async function saveBanner(formData: FormData) {
  guard();
  const id = String(formData.get("id") || "");
  const data = {
    title: String(formData.get("title") || "").trim(),
    subtitle: String(formData.get("subtitle") || "").trim(),
    imageUrl: String(formData.get("imageUrl") || "").trim(),
    link: String(formData.get("link") || "").trim(),
    ctaText: String(formData.get("ctaText") || "").trim(),
    placement: String(formData.get("placement") || "promo"),
    theme: String(formData.get("theme") || "navy"),
    sortOrder: parseInt(String(formData.get("sortOrder") || "0")) || 0,
    isActive: formData.get("isActive") === "on",
  };
  if (id) await prisma.banner.update({ where: { id }, data });
  else await prisma.banner.create({ data });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(formData: FormData) {
  guard();
  await prisma.banner.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

// ── برندها ──
export async function toggleBrand(formData: FormData) {
  guard();
  const id = String(formData.get("id"));
  const field = String(formData.get("field")); // isActive | isFeatured
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) return;
  const value = field === "isFeatured" ? !brand.isFeatured : !brand.isActive;
  await prisma.brand.update({ where: { id }, data: { [field]: value } });
  revalidatePath("/admin/brands");
  revalidatePath("/brands");
}

export async function saveBrand(formData: FormData) {
  guard();
  const id = String(formData.get("id"));
  const data: Record<string, unknown> = {
    name: String(formData.get("name") || "").trim(),
    siteUrl: String(formData.get("siteUrl") || "").trim(),
    logoUrl: String(formData.get("logoUrl") || "").trim() || null,
  };
  // لینک‌های دسته‌بندی (JSON) — فقط اگر معتبر بود ذخیره می‌شود
  const rawLinks = String(formData.get("categoryLinks") || "").trim();
  if (rawLinks) {
    try {
      JSON.parse(rawLinks);
      data.categoryLinks = rawLinks;
    } catch {
      // JSON نامعتبر — نادیده گرفته می‌شود تا داده خراب نشود
    }
  }
  await prisma.brand.update({ where: { id }, data });
  revalidatePath("/admin/brands");
  revalidatePath("/brands");
  redirect("/admin/brands");
}

// ── تنظیمات ──
export async function updateSettings(formData: FormData) {
  guard();
  await getSettings();
  const num = (k: string, d: number) => {
    const v = parseFloat(String(formData.get(k) ?? "").replace(/[^0-9.]/g, ""));
    return isNaN(v) ? d : v;
  };
  const cur = await prisma.settings.findUnique({ where: { id: "singleton" } });

  await prisma.settings.update({
    where: { id: "singleton" },
    data: {
      exchangeRate: Math.round(num("exchangeRate", cur?.exchangeRate ?? 4800)),
      rateSource: String(formData.get("rateSource") || cur?.rateSource || "manual"),
      feeNormal: num("feeNormal", cur?.feeNormal ?? 0.15),
      feeSilver: num("feeSilver", cur?.feeSilver ?? 0.12),
      feeGold: num("feeGold", cur?.feeGold ?? 0.1),
      feeBirthday: num("feeBirthday", cur?.feeBirthday ?? 0.12),
      feeReferral: num("feeReferral", cur?.feeReferral ?? 0.12),
      cardNumber: String(formData.get("cardNumber") || ""),
      cardOwner: String(formData.get("cardOwner") || ""),
      cardBank: String(formData.get("cardBank") || ""),
      telegramBot: String(formData.get("telegramBot") || ""),
      telegramSupport: String(formData.get("telegramSupport") || ""),
      instagram: String(formData.get("instagram") || ""),
      phone: String(formData.get("phone") || ""),
      aboutContent: JSON.stringify({
        intro: String(formData.get("aboutIntro") || ""),
        story: String(formData.get("aboutStory") || ""),
        team: parseTeam(String(formData.get("aboutTeam") || "")),
      }),
    },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  redirect("/admin/settings");
}

function parseTeam(raw: string): { name: string; role: string; photoUrl?: string }[] {
  // هر خط: نام | نقش | لینک عکس(اختیاری)
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [name, role, photoUrl] = l.split("|").map((x) => x.trim());
      return { name: name || "", role: role || "", photoUrl: photoUrl || undefined };
    })
    .filter((m) => m.name);
}
