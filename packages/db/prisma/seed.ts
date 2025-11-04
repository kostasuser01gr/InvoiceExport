import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo invoices for both brands
  const europcarInvoice = await prisma.invoice.upsert({
    where: { number: "ECP-2025-0001" },
    update: {},
    create: {
      brand: "EUROPCAR",
      number: "ECP-2025-0001",
      customerName: "Demo Customer",
      customerEmail: "demo@europcar.com",
      totalAmount: 240,
      netAmount: 193.55,
      vatAmount: 46.45,
      currency: "EUR",
      status: "DRAFT",
    },
  });

  const goldcarInvoice = await prisma.invoice.upsert({
    where: { number: "GLD-2025-0001" },
    update: {},
    create: {
      brand: "GOLDCAR",
      number: "GLD-2025-0001",
      customerName: "Test Customer",
      customerEmail: "test@goldcar.com",
      totalAmount: 360,
      netAmount: 290.32,
      vatAmount: 69.68,
      currency: "EUR",
      status: "DRAFT",
    },
  });

  console.log("✅ Seeded invoices:", { europcarInvoice, goldcarInvoice });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
