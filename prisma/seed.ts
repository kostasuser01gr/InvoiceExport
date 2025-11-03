import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Europcar tenant
  const europcar = await prisma.tenant.upsert({
    where: { key: 'europcar' },
    update: {},
    create: {
      key: 'europcar',
      name: 'Europcar Greece',
      logoUrl: '/logos/europcar.svg',
      invoiceSeriesPrefix: 'ECP-',
      theme: {
        primary: '#0EAD00',
        primaryRgb: '14, 173, 0',
        secondary: '#005A2C',
        accent: '#FFB81C',
      },
      taxSettings: {
        defaultVatRate: 24,
        vatNumber: 'EL999999999',
        companyName: 'Europcar Greece S.A.',
        address: 'Heraklion Airport, Crete, Greece',
      },
    },
  })

  console.log('Created Europcar tenant:', europcar.id)

  // Create Goldcar tenant
  const goldcar = await prisma.tenant.upsert({
    where: { key: 'goldcar' },
    update: {},
    create: {
      key: 'goldcar',
      name: 'Goldcar Greece',
      logoUrl: '/logos/goldcar.svg',
      invoiceSeriesPrefix: 'GLD-',
      theme: {
        primary: '#FFD400',
        primaryRgb: '255, 212, 0',
        secondary: '#1A1A1A',
        accent: '#FF6B00',
      },
      taxSettings: {
        defaultVatRate: 24,
        vatNumber: 'EL888888888',
        companyName: 'Goldcar Greece S.A.',
        address: 'Heraklion Airport, Crete, Greece',
      },
    },
  })

  console.log('Created Goldcar tenant:', goldcar.id)

  // Create staff user
  const staffEmail = process.env.ALLOWLISTED_STAFF_EMAIL || 'heraklion.airport@europcargreece.com'
  
  const staffUser = await prisma.user.upsert({
    where: { email: staffEmail },
    update: {},
    create: {
      email: staffEmail,
      name: 'Staff User',
      role: 'STAFF',
    },
  })

  console.log('Created staff user:', staffUser.id)

  // Link staff user to both tenants
  await prisma.userTenant.upsert({
    where: {
      userId_tenantId: {
        userId: staffUser.id,
        tenantId: europcar.id,
      },
    },
    update: {},
    create: {
      userId: staffUser.id,
      tenantId: europcar.id,
      role: 'STAFF',
    },
  })

  await prisma.userTenant.upsert({
    where: {
      userId_tenantId: {
        userId: staffUser.id,
        tenantId: goldcar.id,
      },
    },
    update: {},
    create: {
      userId: staffUser.id,
      tenantId: goldcar.id,
      role: 'STAFF',
    },
  })

  console.log('Linked staff user to both tenants')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
