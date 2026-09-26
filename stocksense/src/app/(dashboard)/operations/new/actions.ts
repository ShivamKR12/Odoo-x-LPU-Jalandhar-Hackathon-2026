"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMove(formData: FormData) {
  const type = formData.get("type") as string;
  const sourceLocationId = formData.get("sourceLocationId") as string | null;
  const destLocationId = formData.get("destLocationId") as string | null;
  const productId = formData.get("productId") as string;
  const quantityStr = formData.get("quantity") as string;
  const quantity = parseInt(quantityStr, 10);

  if (!type || !productId || isNaN(quantity) || quantity <= 0) {
    throw new Error("Invalid input");
  }

  // Generate Reference
  const count = await prisma.move.count();
  const reference = `${type.substring(0, 3)}-${String(count + 1).padStart(5, '0')}`;

  // Execute in Transaction to ensure data integrity
  await prisma.$transaction(async (tx) => {
    // 1. Create the Move and MoveLine
    const move = await tx.move.create({
      data: {
        reference,
        type,
        status: "DONE", // Automatically validating for this prototype
        sourceLocationId: sourceLocationId || null,
        destLocationId: destLocationId || null,
        lines: {
          create: [{ productId, quantity }]
        }
      }
    });

    // 2. Update StockQuants
    if (sourceLocationId) {
      const srcQuant = await tx.stockQuant.findUnique({
        where: { productId_locationId: { productId, locationId: sourceLocationId } }
      });
      if (srcQuant) {
        await tx.stockQuant.update({
          where: { id: srcQuant.id },
          data: { quantity: srcQuant.quantity - quantity }
        });
      } else {
        await tx.stockQuant.create({
          data: { productId, locationId: sourceLocationId, quantity: -quantity }
        });
      }
    }

    if (destLocationId) {
      const destQuant = await tx.stockQuant.findUnique({
        where: { productId_locationId: { productId, locationId: destLocationId } }
      });
      if (destQuant) {
        await tx.stockQuant.update({
          where: { id: destQuant.id },
          data: { quantity: destQuant.quantity + quantity }
        });
      } else {
        await tx.stockQuant.create({
          data: { productId, locationId: destLocationId, quantity }
        });
      }
    }
  });

  revalidatePath("/operations");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/operations");
}
