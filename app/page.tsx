import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, FileText } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Invoice Export System</h1>
          <p className="text-lg text-gray-600">
            Multi-tenant invoicing for Europcar and Goldcar Greece
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow" data-brand="europcar">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Car className="h-8 w-8 text-[#0EAD00]" />
                <CardTitle className="text-[#0EAD00]">Europcar Greece</CardTitle>
              </div>
              <CardDescription>
                Complete your rental details and receive your invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/intake?brand=europcar">
                <Button className="w-full bg-[#0EAD00] hover:bg-[#0C9300]">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Europcar Intake
                </Button>
              </Link>
              <p className="text-xs text-gray-500 text-center">
                Scan the QR code at our counter or click above
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" data-brand="goldcar">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Car className="h-8 w-8 text-[#FFD400]" />
                <CardTitle className="text-[#FFD400]">Goldcar Greece</CardTitle>
              </div>
              <CardDescription>
                Complete your rental details and receive your invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/intake?brand=goldcar">
                <Button className="w-full bg-[#FFD400] text-black hover:bg-[#E6BF00]">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Goldcar Intake
                </Button>
              </Link>
              <p className="text-xs text-gray-500 text-center">
                Scan the QR code at our counter or click above
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Link href="/admin">
            <Button variant="outline">
              Staff Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
