"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const unit = formData.get("unit") as string;
  const minStock = Number(formData.get("minStock"));

  if (!name || !sku || !category || !unit) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.product.create({
      data: {
        name,
        sku,
        category,
        unit,
        minStock: isNaN(minStock) ? 0 : minStock,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      redirect("/products?error=SKU_EXISTS");
    }
    throw error;
  }

  revalidatePath("/products");
  revalidatePath("/");
  redirect("/products");
}
