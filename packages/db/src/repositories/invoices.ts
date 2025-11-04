import { prisma } from "../client";

export type Brand = "EUROPCAR" | "GOLDCAR";

function seqName(brand: Brand): string {
  return brand === "EUROPCAR" ? "seq_invoice_ecp" : "seq_invoice_gld";
}

export async function allocateNextNumber(
  brand: Brand,
  year = new Date().getFullYear()
): Promise<string> {
  const seq = seqName(brand);
  const result = await prisma.$queryRawUnsafe<{ nextval: bigint }[]>(
    `SELECT nextval('${seq}') as nextval;`
  );
  const nextval = Number(result[0].nextval);
  const padded = String(nextval).padStart(4, "0");
  const prefix = brand === "EUROPCAR" ? "ECP" : "GLD";
  return `${prefix}-${year}-${padded}`;
}

export async function createInvoice(data: {
  brand: Brand;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAFM?: string;
  totalAmount: number;
  netAmount?: number;
  vatAmount?: number;
  currency?: string;
  vatRate?: number;
  meta?: any;
}) {
  const number = await allocateNextNumber(data.brand);
  
  const netAmount = data.netAmount ?? data.totalAmount / (1 + (data.vatRate ?? 24) / 100);
  const vatAmount = data.vatAmount ?? data.totalAmount - netAmount;

  return prisma.invoice.create({
    data: {
      brand: data.brand,
      number,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAFM: data.customerAFM,
      totalAmount: data.totalAmount,
      netAmount,
      vatAmount,
      currency: data.currency ?? "EUR",
      vatRate: data.vatRate ?? 24,
      meta: data.meta,
      status: "DRAFT",
    },
  });
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
  });
}

export async function listInvoicesByBrand(brand: Brand, limit = 100) {
  return prisma.invoice.findMany({
    where: { brand },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function updateInvoiceStatus(id: string, status: string) {
  return prisma.invoice.update({
    where: { id },
    data: { status },
  });
}
