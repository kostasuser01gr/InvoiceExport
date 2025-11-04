import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  afm: z.string().optional(),
  address: z.string().optional(),
  licenseNo: z.string().optional(),
  idDoc: z.string().optional(),
});

export const contractSchema = z.object({
  reservationNo: z.string().optional(),
  vehiclePlate: z.string().optional(),
  vehicleGroup: z.string().optional(),
  pickupAt: z.string().optional(),
  returnAt: z.string().optional(),
  locationIn: z.string().optional(),
  locationOut: z.string().optional(),
  mileageIn: z.number().optional(),
  mileageOut: z.number().optional(),
  fuelPolicy: z.string().optional(),
  notes: z.string().optional(),
});

export const invoiceLineSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  vatRate: z.number().nonnegative("VAT rate must be non-negative").default(24),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type InvoiceLineInput = z.infer<typeof invoiceLineSchema>;
