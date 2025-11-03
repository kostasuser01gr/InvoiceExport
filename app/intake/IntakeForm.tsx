'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { getTenantConfig } from '@/config/tenants'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const steps = [
  { id: 1, title: 'Customer Information' },
  { id: 2, title: 'Contract Details' },
  { id: 3, title: 'Vehicle Information' },
  { id: 4, title: 'Review & Consent' },
]

export default function IntakeForm() {
  const searchParams = useSearchParams()
  const brand = searchParams.get('brand') as 'europcar' | 'goldcar' | null
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    afm: '',
    address: '',
    licenseNo: '',
    idDoc: '',
    reservationNo: '',
    vehiclePlate: '',
    vehicleGroup: '',
    pickupAt: '',
    returnAt: '',
    locationIn: '',
    locationOut: '',
    mileageIn: '',
    mileageOut: '',
    fuelPolicy: '',
    notes: '',
    extras: [] as string[],
    privacyConsent: false,
    dataUseConsent: false,
  })

  if (!brand || (brand !== 'europcar' && brand !== 'goldcar')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Brand</CardTitle>
            <CardDescription>Please select a valid brand (Europcar or Goldcar)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="/?brand=europcar">Europcar</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/?brand=goldcar">Goldcar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tenantConfig = getTenantConfig(brand)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, brand }),
      })

      if (response.ok) {
        const result = await response.json()
        window.location.href = `/intake/success?id=${result.invoiceId}`
      } else {
        alert('Failed to submit intake form. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8"
      data-brand={brand}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: tenantConfig?.theme.primary }}>
            {tenantConfig?.displayName}
          </h1>
          <p className="text-gray-600">Customer Intake Form</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.id
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    style={{
                      backgroundColor: currentStep >= step.id ? tenantConfig?.theme.primary : undefined,
                    }}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  {step.id < steps.length && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step.id ? '' : 'bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: currentStep > step.id ? tenantConfig?.theme.primary : undefined,
                      }}
                    />
                  )}
                </div>
                <p className="text-xs mt-2 text-center">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+30 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="afm">AFM / VAT Number</Label>
                  <Input
                    id="afm"
                    value={formData.afm}
                    onChange={(e) => updateField('afm', e.target.value)}
                    placeholder="999999999"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Street, City, Postal Code"
                  />
                </div>
                <div>
                  <Label htmlFor="licenseNo">Driver&apos;s License Number</Label>
                  <Input
                    id="licenseNo"
                    value={formData.licenseNo}
                    onChange={(e) => updateField('licenseNo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="idDoc">ID / Passport Number</Label>
                  <Input
                    id="idDoc"
                    value={formData.idDoc}
                    onChange={(e) => updateField('idDoc', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contract Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reservationNo">Reservation / Contract Number</Label>
                  <Input
                    id="reservationNo"
                    value={formData.reservationNo}
                    onChange={(e) => updateField('reservationNo', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickupAt">Pickup Date/Time *</Label>
                    <Input
                      id="pickupAt"
                      type="datetime-local"
                      value={formData.pickupAt}
                      onChange={(e) => updateField('pickupAt', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnAt">Return Date/Time *</Label>
                    <Input
                      id="returnAt"
                      type="datetime-local"
                      value={formData.returnAt}
                      onChange={(e) => updateField('returnAt', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="locationIn">Pickup Location</Label>
                  <Input
                    id="locationIn"
                    value={formData.locationIn}
                    onChange={(e) => updateField('locationIn', e.target.value)}
                    placeholder="Heraklion Airport"
                  />
                </div>
                <div>
                  <Label htmlFor="locationOut">Return Location</Label>
                  <Input
                    id="locationOut"
                    value={formData.locationOut}
                    onChange={(e) => updateField('locationOut', e.target.value)}
                    placeholder="Heraklion Airport"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Vehicle Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehiclePlate">Vehicle Plate Number *</Label>
                  <Input
                    id="vehiclePlate"
                    value={formData.vehiclePlate}
                    onChange={(e) => updateField('vehiclePlate', e.target.value)}
                    placeholder="XXX-1234"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleGroup">Vehicle Group / Model</Label>
                  <Input
                    id="vehicleGroup"
                    value={formData.vehicleGroup}
                    onChange={(e) => updateField('vehicleGroup', e.target.value)}
                    placeholder="Compact / Toyota Yaris"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileageIn">Mileage In (km)</Label>
                    <Input
                      id="mileageIn"
                      type="number"
                      value={formData.mileageIn}
                      onChange={(e) => updateField('mileageIn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mileageOut">Mileage Out (km)</Label>
                    <Input
                      id="mileageOut"
                      type="number"
                      value={formData.mileageOut}
                      onChange={(e) => updateField('mileageOut', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fuelPolicy">Fuel Policy</Label>
                  <Input
                    id="fuelPolicy"
                    value={formData.fuelPolicy}
                    onChange={(e) => updateField('fuelPolicy', e.target.value)}
                    placeholder="Full to Full"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Consent */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold mb-2">Review Your Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Name:</span> {formData.name}</p>
                    <p><span className="font-medium">Email:</span> {formData.email || 'N/A'}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phone || 'N/A'}</p>
                    <p><span className="font-medium">Vehicle:</span> {formData.vehiclePlate}</p>
                    <p><span className="font-medium">Pickup:</span> {formData.pickupAt}</p>
                    <p><span className="font-medium">Return:</span> {formData.returnAt}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.privacyConsent}
                      onCheckedChange={(checked) => updateField('privacyConsent', checked)}
                    />
                    <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer">
                      I accept the privacy policy and terms of service *
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dataUse"
                      checked={formData.dataUseConsent}
                      onCheckedChange={(checked) => updateField('dataUseConsent', checked)}
                    />
                    <Label htmlFor="dataUse" className="text-sm font-normal cursor-pointer">
                      I consent to the use of my data for invoice processing *
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto"
                  style={{ backgroundColor: tenantConfig?.theme.primary }}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.privacyConsent || !formData.dataUseConsent || isSubmitting}
                  className="ml-auto"
                  style={{ backgroundColor: tenantConfig?.theme.primary }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
