"use server";

import { createInvoice } from "@invoice-suite/db/repositories";

export async function submitIntake(formData: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
}) {
  const invoice = await createInvoice({
    brand: "GOLDCAR",
    customerName: formData.customerName,
    customerEmail: formData.customerEmail,
    customerPhone: formData.customerPhone,
    totalAmount: formData.totalAmount,
    meta: { source: "intake" },
  });

  return { success: true, invoiceId: invoice.id };
}
