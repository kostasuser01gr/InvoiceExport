'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get('id')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Submission Successful!</CardTitle>
          <CardDescription>
            Your rental information has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Reference ID:</p>
            <p className="font-mono text-sm font-semibold break-all">{invoiceId}</p>
          </div>
          <p className="text-sm text-gray-600">
            Our staff will review your information and generate your invoice shortly.
            You will receive an email with your invoice once it&apos;s ready.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full" variant="outline">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
