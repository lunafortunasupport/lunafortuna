"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("unauthorized");

  const name = String(formData.get("name") || "").trim().slice(0, 120);
  const birthdayRaw = String(formData.get("birthday") || "").trim();
  // فرمت روز/ماه
  const birthday = /^\d{1,2}\/\d{1,2}$/.test(birthdayRaw) ? birthdayRaw : user.birthday;

  await prisma.user.update({
    where: { id: user.id },
    data: { name: name || user.name, birthday },
  });
  revalidatePath("/account");
}
