import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { intakeFormSchema } from '@/lib/validators'
import { getTenantConfig } from '@/config/tenants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input
    const validatedData = intakeFormSchema.parse(body)
    
    // Get tenant configuration
    const tenantConfig = getTenantConfig(validatedData.brand)
    if (!tenantConfig) {
      return NextResponse.json(
        { error: 'Invalid brand' },
        { status: 400 }
      )
    }

    // Find or create tenant
    let tenant = await prisma.tenant.findUnique({
      where: { key: validatedData.brand },
    })

    if (!tenant) {
      // Create tenant if not exists (for development)
      tenant = await prisma.tenant.create({
        data: {
          key: validatedData.brand,
          name: tenantConfig.name,
          logoUrl: tenantConfig.logoUrl,
          invoiceSeriesPrefix: tenantConfig.invoiceSeriesPrefix,
          theme: tenantConfig.theme as any,
          taxSettings: tenantConfig.taxSettings as any,
        },
      })
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        afm: validatedData.afm || null,
        address: validatedData.address || null,
        licenseNo: validatedData.licenseNo || null,
        idDoc: validatedData.idDoc || null,
      },
    })

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        reservationNo: validatedData.reservationNo || null,
        vehiclePlate: validatedData.vehiclePlate,
        vehicleGroup: validatedData.vehicleGroup || null,
        pickupAt: validatedData.pickupAt ? new Date(validatedData.pickupAt) : null,
        returnAt: validatedData.returnAt ? new Date(validatedData.returnAt) : null,
        locationIn: validatedData.locationIn || null,
        locationOut: validatedData.locationOut || null,
        mileageIn: validatedData.mileageIn || null,
        mileageOut: validatedData.mileageOut || null,
        fuelPolicy: validatedData.fuelPolicy || null,
        notes: validatedData.notes || null,
        extras: validatedData.extras || [],
      },
    })

    // Create draft invoice
    const invoice = await prisma.invoice.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        contractId: contract.id,
        status: 'DRAFT',
        currency: 'EUR',
        vatRate: tenantConfig.taxSettings.defaultVatRate,
        net: 0,
        vat: 0,
        total: 0,
        meta: {
          consents: {
            privacy: validatedData.privacyConsent,
            dataUse: validatedData.dataUseConsent,
          },
          submittedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({
      success: true,
      invoiceId: invoice.id,
      customerId: customer.id,
      contractId: contract.id,
    })
  } catch (error) {
    console.error('Intake submission error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process intake form' },
      { status: 500 }
    )
  }
}
