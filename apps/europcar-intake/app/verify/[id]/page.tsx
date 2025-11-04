import { getInvoiceById } from "@invoice-suite/db/repositories";
import { Card, CardContent, CardHeader, CardTitle } from "@invoice-suite/ui/card";
import { formatCurrency, formatDate, qrDataURL } from "@invoice-suite/utils";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const verifyUrl = `${process.env.PUBLIC_BASE_URL || "http://localhost:3001"}/verify/${id}`;
  const qrCode = await qrDataURL(verifyUrl);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-[#0EAD00]">Invoice Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Image
                src={qrCode}
                alt="QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Invoice Number:</span>
                <span>{invoice.number}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Customer:</span>
                <span>{invoice.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Date:</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-[#0EAD00]">
                  {formatCurrency(Number(invoice.totalAmount))}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Status:</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {invoice.status}
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>This invoice has been successfully submitted.</p>
              <p>You will receive a copy via email once approved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
