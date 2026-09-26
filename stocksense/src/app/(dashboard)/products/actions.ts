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
  const initialStock = Number(formData.get("initialStock"));
  const locationId = formData.get("locationId") as string;

  if (!name || !sku || !category || !unit) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          sku,
          category,
          unit,
          minStock: isNaN(minStock) ? 0 : minStock,
        },
      });

      if (!isNaN(initialStock) && initialStock > 0 && locationId) {
        // Create the stock quant
        await tx.stockQuant.create({
          data: {
            productId: product.id,
            locationId: locationId,
            quantity: initialStock,
          }
        });

        // Record it as an inventory adjustment move for history accuracy
        const count = await tx.move.count();
        const reference = `ADJ-${String(count + 1).padStart(5, '0')}`;
        await tx.move.create({
          data: {
            reference,
            type: "ADJUSTMENT",
            status: "DONE",
            destLocationId: locationId,
            lines: {
              create: [{ productId: product.id, quantity: initialStock }]
            }
          }
        });
      }
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
