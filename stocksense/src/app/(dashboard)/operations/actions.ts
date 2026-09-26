"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOperation(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  
  const user = await prisma.user.findFirst({ where: { loginId: (session.user as any).loginId } });

  const type = formData.get("type") as string;
  const dbTypeMap: Record<string, string> = { "RECEIPTS": "RECEIPT", "DELIVERIES": "DELIVERY", "ADJUSTMENTS": "ADJUSTMENT", "INTERNAL": "INTERNAL" };
  const dbType = dbTypeMap[type.toUpperCase()];

  const contact = formData.get("contact") as string;
  const scheduleDateStr = formData.get("scheduleDate") as string;
  const locationId = formData.get("locationId") as string;
  const destLocationId = formData.get("destLocationId") as string;
  
  if (!locationId) throw new Error("Location is required to generate reference");

  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: { warehouse: true }
  });

  if (!location) throw new Error("Invalid location");

  const warehouseCode = location.warehouse.shortCode;
  const operationCode = dbType === "RECEIPT" ? "IN" : dbType === "DELIVERY" ? "OUT" : dbType === "INTERNAL" ? "INT" : "ADJ";

  const count = await prisma.move.count({
    where: { 
      type: dbType, 
      reference: { startsWith: `${warehouseCode}/${operationCode}/` }
    }
  });

  const nextId = String(count + 1).padStart(4, '0');
  const reference = `${warehouseCode}/${operationCode}/${nextId}`;

  const scheduleDate = scheduleDateStr ? new Date(scheduleDateStr) : new Date();

  const newMove = await prisma.move.create({
    data: {
      reference,
      type: dbType,
      status: "DRAFT",
      contact,
      scheduleDate,
      responsibleId: user?.id,
      destLocationId: dbType === "RECEIPT" || dbType === "ADJUSTMENT" ? locationId : dbType === "INTERNAL" ? destLocationId : null,
      sourceLocationId: dbType === "DELIVERY" || dbType === "INTERNAL" ? locationId : null,
    }
  });

  revalidatePath(`/operations/${type.toLowerCase()}`);
  redirect(`/operations/${type.toLowerCase()}/${newMove.id}`);
}

export async function addMoveLine(formData: FormData) {
  const moveId = formData.get("moveId") as string;
  const productId = formData.get("productId") as string;
  const quantity = Number(formData.get("quantity"));
  if (!moveId || !productId || !quantity) return;

  const move = await prisma.move.findUnique({ where: { id: moveId } });
  if (!move || move.status === "DONE" || move.status === "CANCELED") return;

  await prisma.moveLine.create({
    data: { moveId, productId, quantity }
  });

  // If Draft, move to Ready/Waiting depending on type
  if (move.status === "DRAFT") {
    let nextStatus = "READY";
    if (move.type === "DELIVERY") {
      // Check stock availability
      const product = await prisma.product.findUnique({ where: { id: productId }, include: { stockQuants: true } });
      const locationStock = product?.stockQuants.find(q => q.locationId === move.sourceLocationId)?.quantity || 0;
      if (locationStock < quantity) nextStatus = "WAITING";
    }
    await prisma.move.update({ where: { id: moveId }, data: { status: nextStatus } });
  }

  revalidatePath(`/operations`);
}

export async function validateOperation(formData: FormData) {
  const moveId = formData.get("moveId") as string;
  if (!moveId) return;

  const move = await prisma.move.findUnique({ where: { id: moveId }, include: { lines: true } });
  if (!move || move.status === "DONE" || move.status === "CANCELED") return;

  await prisma.$transaction(async (tx) => {
    // Process stock quants based on type
    for (const line of move.lines) {
      // Outgoing
      if (move.sourceLocationId) {
        const quant = await tx.stockQuant.findUnique({ where: { productId_locationId: { productId: line.productId, locationId: move.sourceLocationId } } });
        if (quant) {
          await tx.stockQuant.update({ where: { id: quant.id }, data: { quantity: quant.quantity - line.quantity } });
        } else {
          await tx.stockQuant.create({ data: { productId: line.productId, locationId: move.sourceLocationId, quantity: -line.quantity } });
        }
      }
      
      // Incoming
      if (move.destLocationId) {
        const quant = await tx.stockQuant.findUnique({ where: { productId_locationId: { productId: line.productId, locationId: move.destLocationId } } });
        if (quant) {
          await tx.stockQuant.update({ where: { id: quant.id }, data: { quantity: quant.quantity + line.quantity } });
        } else {
          await tx.stockQuant.create({ data: { productId: line.productId, locationId: move.destLocationId, quantity: line.quantity } });
        }
      }
    }

    await tx.move.update({ where: { id: moveId }, data: { status: "DONE" } });
  });

  revalidatePath(`/operations`);
}

export async function cancelOperation(formData: FormData) {
  const moveId = formData.get("moveId") as string;
  if (!moveId) return;
  await prisma.move.update({ where: { id: moveId }, data: { status: "CANCELED" } });
  revalidatePath(`/operations`);
}

