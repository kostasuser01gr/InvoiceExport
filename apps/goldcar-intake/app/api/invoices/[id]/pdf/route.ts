import { NextResponse } from "next/server";
import { getInvoiceById } from "@invoice-suite/db/repositories";
import { renderInvoicePDF } from "@invoice-suite/pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3003";
    const invoiceUrl = `${baseUrl}/verify/${id}`;

    const pdf = await renderInvoicePDF(invoiceUrl);

    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
