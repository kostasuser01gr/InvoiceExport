import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

const statusColors = {
  DRAFT: 'bg-gray-500',
  REVIEW: 'bg-blue-500',
  APPROVED: 'bg-green-500',
  SENT: 'bg-purple-500',
  CANCELED: 'bg-red-500',
}

export default async function InvoiceVerificationPage({ params }: PageProps) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      contract: true,
      tenant: true,
      lines: true,
    },
  })

  if (!invoice) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Invoice Verification</CardTitle>
                <CardDescription>
                  {invoice.tenant.name}
                </CardDescription>
              </div>
              <span className={`px-3 py-1 rounded-full text-white text-sm ${statusColors[invoice.status]}`}>
                {invoice.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {invoice.number && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
                <p className="font-semibold text-lg">{invoice.number}</p>
              </div>
            )}

            {invoice.issueDate && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                <p className="font-medium">{formatDate(invoice.issueDate)}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Name:</span> {invoice.customer.name}</p>
                {invoice.customer.email && (
                  <p><span className="text-gray-600">Email:</span> {invoice.customer.email}</p>
                )}
                {invoice.customer.phone && (
                  <p><span className="text-gray-600">Phone:</span> {invoice.customer.phone}</p>
                )}
                {invoice.customer.afm && (
                  <p><span className="text-gray-600">AFM:</span> {invoice.customer.afm}</p>
                )}
              </div>
            </div>

            {invoice.contract && (
              <div>
                <h3 className="font-semibold mb-2">Rental Information</h3>
                <div className="space-y-1 text-sm">
                  {invoice.contract.vehiclePlate && (
                    <p><span className="text-gray-600">Vehicle:</span> {invoice.contract.vehiclePlate}</p>
                  )}
                  {invoice.contract.reservationNo && (
                    <p><span className="text-gray-600">Reservation:</span> {invoice.contract.reservationNo}</p>
                  )}
                  {invoice.contract.pickupAt && (
                    <p><span className="text-gray-600">Pickup:</span> {formatDate(invoice.contract.pickupAt)}</p>
                  )}
                  {invoice.contract.returnAt && (
                    <p><span className="text-gray-600">Return:</span> {formatDate(invoice.contract.returnAt)}</p>
                  )}
                </div>
              </div>
            )}

            {invoice.lines.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Invoice Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Qty</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lines.map((line) => (
                        <tr key={line.id} className="border-t">
                          <td className="p-2">{line.description}</td>
                          <td className="text-right p-2">{line.qty.toString()}</td>
                          <td className="text-right p-2">{formatCurrency(line.unitPrice.toNumber())}</td>
                          <td className="text-right p-2">{formatCurrency(line.total.toNumber())}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.net.toNumber())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT ({invoice.vatRate.toString()}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.vat.toNumber())}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total.toNumber())}</span>
                </div>
              </div>
            </div>

            {invoice.mydataMark && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800 mb-1">myDATA MARK</p>
                <p className="font-mono text-xs break-all">{invoice.mydataMark}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
