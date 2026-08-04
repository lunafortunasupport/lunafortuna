import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm from "../BannerForm";

export const dynamic = "force-dynamic";

export default async function EditBanner({ params }: { params: { id: string } }) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) notFound();
  return <BannerForm banner={banner} />;
}
