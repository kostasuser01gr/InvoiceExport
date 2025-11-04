import { NextResponse } from "next/server";
import { getInvoiceById } from "@invoice-suite/db/repositories";
import { renderInvoicePDF } from "@invoice-suite/pdf";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await getInvoiceById(params.id);

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3001";
    const invoiceUrl = `${baseUrl}/verify/${params.id}`;

    const pdf = await renderInvoicePDF(invoiceUrl);

    return new NextResponse(pdf, {
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
