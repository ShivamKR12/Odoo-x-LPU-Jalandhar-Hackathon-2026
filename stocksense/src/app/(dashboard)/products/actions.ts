"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const unit = formData.get("unit") as string;
  const minStock = Number(formData.get("minStock"));

  if (!name || !sku || !category || !unit) {
    throw new Error("Missing required fields");
  }

  await prisma.product.create({
    data: {
      name,
      sku,
      category,
      unit,
      minStock: isNaN(minStock) ? 0 : minStock,
    },
  });

  revalidatePath("/products");
  revalidatePath("/");
}
