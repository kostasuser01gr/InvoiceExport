import { Card, CardContent, CardHeader, CardTitle } from "@invoice-suite/ui/card";
import { listInvoicesByBrand } from "@invoice-suite/db/repositories";
import { formatCurrency, formatDate } from "@invoice-suite/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const invoices = await listInvoicesByBrand("EUROPCAR", 20);

  const stats = {
    draft: invoices.filter((i) => i.status === "DRAFT").length,
    pending: invoices.filter((i) => i.status === "PENDING").length,
    approved: invoices.filter((i) => i.status === "APPROVED").length,
    sent: invoices.filter((i) => i.status === "SENT").length,
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0EAD00] mb-8">
          Europcar Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Draft
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0EAD00]">{stats.sent}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Number</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{invoice.number}</td>
                      <td className="py-3">{invoice.customerName}</td>
                      <td className="py-3">{formatDate(invoice.issueDate)}</td>
                      <td className="py-3 font-medium">
                        {formatCurrency(Number(invoice.totalAmount))}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
