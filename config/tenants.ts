export interface TenantConfig {
  key: 'europcar' | 'goldcar'
  name: string
  displayName: string
  logoUrl: string
  invoiceSeriesPrefix: string
  theme: {
    primary: string
    primaryRgb: string
    secondary: string
    accent: string
  }
  colors: {
    light: string
    dark: string
  }
  taxSettings: {
    defaultVatRate: number
    vatNumber: string
    companyName: string
    address: string
  }
  emailSettings: {
    fromName: string
    replyTo: string
  }
}

export const TENANTS: Record<string, TenantConfig> = {
  europcar: {
    key: 'europcar',
    name: 'europcar',
    displayName: 'Europcar Greece',
    logoUrl: '/logos/europcar.svg',
    invoiceSeriesPrefix: 'ECP-',
    theme: {
      primary: '#0EAD00',
      primaryRgb: '14, 173, 0',
      secondary: '#005A2C',
      accent: '#FFB81C',
    },
    colors: {
      light: '#E8F5E9',
      dark: '#1B5E20',
    },
    taxSettings: {
      defaultVatRate: 24,
      vatNumber: 'EL999999999',
      companyName: 'Europcar Greece S.A.',
      address: 'Heraklion Airport, Crete, Greece',
    },
    emailSettings: {
      fromName: 'Europcar Greece',
      replyTo: 'heraklion.airport@europcargreece.com',
    },
  },
  goldcar: {
    key: 'goldcar',
    name: 'goldcar',
    displayName: 'Goldcar Greece',
    logoUrl: '/logos/goldcar.svg',
    invoiceSeriesPrefix: 'GLD-',
    theme: {
      primary: '#FFD400',
      primaryRgb: '255, 212, 0',
      secondary: '#1A1A1A',
      accent: '#FF6B00',
    },
    colors: {
      light: '#FFF9E6',
      dark: '#4A3800',
    },
    taxSettings: {
      defaultVatRate: 24,
      vatNumber: 'EL888888888',
      companyName: 'Goldcar Greece S.A.',
      address: 'Heraklion Airport, Crete, Greece',
    },
    emailSettings: {
      fromName: 'Goldcar Greece',
      replyTo: 'info@goldcar-greece.com',
    },
  },
}

export function getTenantConfig(key: string): TenantConfig | null {
  return TENANTS[key] || null
}

export function validateBrand(brand: string | null): boolean {
  return brand === 'europcar' || brand === 'goldcar'
}
