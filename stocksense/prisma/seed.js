const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Warehouse
  const wh = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      shortCode: "WH",
      address: "123 Industrial Parkway",
    }
  });

  // 2. Create Locations
  const locStore = await prisma.location.create({
    data: { name: "Main Store", shortCode: "STR", warehouseId: wh.id }
  });
  
  const locRack = await prisma.location.create({
    data: { name: "Production Rack", shortCode: "PRD", warehouseId: wh.id }
  });

  // 3. Create Products
  const steel = await prisma.product.create({
    data: { name: "Steel Rods", sku: "SR-101", category: "Raw Material", unit: "kg", cost: 15.50, minStock: 20 }
  });

  const wood = await prisma.product.create({
    data: { name: "Oak Boards", sku: "OW-202", category: "Raw Material", unit: "m", cost: 45.00, minStock: 10 }
  });

  const chair = await prisma.product.create({
    data: { name: "Office Chair", sku: "CH-303", category: "Finished Goods", unit: "pcs", cost: 2500.00, minStock: 5 }
  });

  // 4. Create Initial Stock (via Adjustments to populate Move History correctly)
  // Give Steel to Main Store
  await prisma.stockQuant.create({ data: { productId: steel.id, locationId: locStore.id, quantity: 100 } });
  await prisma.move.create({
    data: {
      reference: "WH/ADJ/0001", type: "ADJUSTMENT", status: "DONE", destLocationId: locStore.id, contact: "Initial Inventory",
      lines: { create: [{ productId: steel.id, quantity: 100 }] }
    }
  });

  // Give Wood to Main Store
  await prisma.stockQuant.create({ data: { productId: wood.id, locationId: locStore.id, quantity: 50 } });
  await prisma.move.create({
    data: {
      reference: "WH/ADJ/0002", type: "ADJUSTMENT", status: "DONE", destLocationId: locStore.id, contact: "Initial Inventory",
      lines: { create: [{ productId: wood.id, quantity: 50 }] }
    }
  });

  // Give Chairs to Production Rack
  await prisma.stockQuant.create({ data: { productId: chair.id, locationId: locRack.id, quantity: 12 } });
  await prisma.move.create({
    data: {
      reference: "WH/ADJ/0003", type: "ADJUSTMENT", status: "DONE", destLocationId: locRack.id, contact: "Initial Inventory",
      lines: { create: [{ productId: chair.id, quantity: 12 }] }
    }
  });

  // 5. Create a Pending Receipt
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  await prisma.move.create({
    data: {
      reference: "WH/IN/0001", type: "RECEIPT", status: "READY", destLocationId: locStore.id, contact: "Acme Steel Corp", scheduleDate: nextWeek,
      lines: { create: [{ productId: steel.id, quantity: 200 }] }
    }
  });

  // 6. Create a Late Delivery
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 3);

  await prisma.move.create({
    data: {
      reference: "WH/OUT/0001", type: "DELIVERY", status: "WAITING", sourceLocationId: locRack.id, contact: "TechStart Inc", scheduleDate: lastWeek,
      lines: { create: [{ productId: chair.id, quantity: 15 }] } // 15 is more than the 12 in stock, triggering waiting/red alert!
    }
  });

  // 7. Create a Pending Internal Transfer
  await prisma.move.create({
    data: {
      reference: "WH/INT/0001", type: "INTERNAL", status: "DRAFT", sourceLocationId: locStore.id, destLocationId: locRack.id, contact: "Restock Production",
      lines: { create: [{ productId: wood.id, quantity: 20 }] }
    }
  });

  console.log("Database seeded successfully!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
