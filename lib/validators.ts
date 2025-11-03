import { z } from 'zod'

// Customer intake form schema
export const intakeFormSchema = z.object({
  // Customer details
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional().or(z.literal('')),
  afm: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  licenseNo: z.string().optional().or(z.literal('')),
  idDoc: z.string().optional().or(z.literal('')),

  // Contract details
  reservationNo: z.string().optional().or(z.literal('')),
  vehiclePlate: z.string().min(1, 'Vehicle plate is required'),
  vehicleGroup: z.string().optional().or(z.literal('')),
  pickupAt: z.string(),
  returnAt: z.string(),
  locationIn: z.string().optional().or(z.literal('')),
  locationOut: z.string().optional().or(z.literal('')),
  mileageIn: z.number().int().positive().optional(),
  mileageOut: z.number().int().positive().optional(),
  fuelPolicy: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),

  // Extras
  extras: z.array(z.string()).optional(),

  // Consent
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  dataUseConsent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to data usage',
  }),

  // Brand
  brand: z.enum(['europcar', 'goldcar']),
})

export type IntakeFormData = z.infer<typeof intakeFormSchema>

// Invoice line schema
export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  qty: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
  vatRate: z.number().min(0).max(100, 'VAT rate must be between 0 and 100'),
})

export type InvoiceLineData = z.infer<typeof invoiceLineSchema>

// Invoice update schema
export const invoiceUpdateSchema = z.object({
  lines: z.array(invoiceLineSchema),
  notes: z.string().optional(),
})

export type InvoiceUpdateData = z.infer<typeof invoiceUpdateSchema>

// AFM validation (Greek tax number - 9 digits)
export function validateAFM(afm: string): boolean {
  const cleaned = afm.replace(/\s/g, '')
  return /^\d{9}$/.test(cleaned)
}

// License plate validation (Greek format)
export function validateGreekPlate(plate: string): boolean {
  const cleaned = plate.replace(/\s|-/g, '').toUpperCase()
  // Greek plates: 3 letters + 4 digits or other variations
  return /^[A-Z]{3}\d{4}$/.test(cleaned) || /^[A-Z]{2}\d{5}$/.test(cleaned)
}
