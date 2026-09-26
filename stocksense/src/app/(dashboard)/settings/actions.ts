"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWarehouse(formData: FormData) {
  const name = formData.get("name") as string;
  const shortCode = formData.get("shortCode") as string;
  const address = formData.get("address") as string;
  
  if (!name || !shortCode) return;

  await prisma.warehouse.create({
    data: { name, shortCode: shortCode.toUpperCase(), address }
  });
  revalidatePath("/settings");
}

export async function createLocation(formData: FormData) {
  const name = formData.get("name") as string;
  const shortCode = formData.get("shortCode") as string;
  const warehouseId = formData.get("warehouseId") as string;
  
  if (!name || !shortCode || !warehouseId) return;

  await prisma.location.create({
    data: { name, shortCode: shortCode.toUpperCase(), warehouseId }
  });
  revalidatePath("/settings");
}
