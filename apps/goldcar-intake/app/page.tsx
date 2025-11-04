import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@invoice-suite/ui/card";
import { Button } from "@invoice-suite/ui/button";
import Link from "next/link";
import { FileText, Car } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#0EAD00" }}>
            Europcar Greece
          </h1>
          <p className="text-lg text-gray-600">
            Complete your rental details and receive your invoice
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Car className="h-8 w-8 text-[#0EAD00]" />
                <CardTitle className="text-[#0EAD00]">Invoice Intake</CardTitle>
              </div>
              <CardDescription>
                Start the invoice submission process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/intake">
                <Button
                  className="w-full bg-[#0EAD00] hover:bg-[#0C9300]"
                  size="lg"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Begin Intake Form
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
