import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await prisma.category.findMany({
    where: { scope: "warehouse" },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
  return <ProductForm categories={categories} />;
}
