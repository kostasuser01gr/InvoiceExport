"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@invoice-suite/ui/card";
import { Button } from "@invoice-suite/ui/button";
import { submitIntake } from "./actions";
import { useRouter } from "next/navigation";

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    totalAmount: 0,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitIntake(formData);
      if (result.success) {
        router.push(`/verify/${result.invoiceId}`);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("Failed to submit intake. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-[#FFD400]">Invoice Intake - Goldcar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Amount (EUR) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD400] hover:bg-[#E6BF00]"
              >
                {loading ? "Submitting..." : "Submit Invoice"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
