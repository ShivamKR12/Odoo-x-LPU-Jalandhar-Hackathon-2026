"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWarehouse(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;

  await prisma.warehouse.create({
    data: { name }
  });
  revalidatePath("/settings");
}

export async function createLocation(formData: FormData) {
  const name = formData.get("name") as string;
  const warehouseId = formData.get("warehouseId") as string;
  
  if (!name || !warehouseId) return;

  await prisma.location.create({
    data: { name, warehouseId }
  });
  revalidatePath("/settings");
}
