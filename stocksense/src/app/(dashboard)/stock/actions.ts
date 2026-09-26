"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const unit = formData.get("unit") as string;
  const cost = Number(formData.get("cost"));
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
          cost: isNaN(cost) ? 0 : cost,
        },
      });

      if (!isNaN(initialStock) && initialStock > 0 && locationId) {
        await tx.stockQuant.create({
          data: {
            productId: product.id,
            locationId: locationId,
            quantity: initialStock,
          }
        });

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
      redirect("/stock?error=SKU_EXISTS");
    }
    throw error;
  }

  revalidatePath("/stock");
  revalidatePath("/");
  redirect("/stock");
}

export async function updateStock(productId: string, difference: number) {
  if (difference === 0) return;

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { stockQuants: true } });
  if (!product) return;

  // For manual adjustments, if no location exists, we must create a virtual one or fail.
  // In a real system, they select location. Here we just pick the first available or default.
  let targetLocation = product.stockQuants[0]?.locationId;
  
  if (!targetLocation) {
    const defaultLoc = await prisma.location.findFirst();
    if (!defaultLoc) return; // Cannot adjust if no locations exist in system
    targetLocation = defaultLoc.id;
  }

  await prisma.$transaction(async (tx) => {
    const quant = await tx.stockQuant.findUnique({
      where: { productId_locationId: { productId, locationId: targetLocation } }
    });

    if (quant) {
      await tx.stockQuant.update({
        where: { id: quant.id },
        data: { quantity: quant.quantity + difference }
      });
    } else {
      await tx.stockQuant.create({
        data: { productId, locationId: targetLocation, quantity: difference }
      });
    }

    const count = await tx.move.count();
    const reference = `ADJ-${String(count + 1).padStart(5, '0')}`;
    await tx.move.create({
      data: {
        reference,
        type: "ADJUSTMENT",
        status: "DONE",
        destLocationId: difference > 0 ? targetLocation : null,
        sourceLocationId: difference < 0 ? targetLocation : null,
        lines: {
          create: [{ productId, quantity: Math.abs(difference) }]
        }
      }
    });
  });

  revalidatePath("/stock");
}

