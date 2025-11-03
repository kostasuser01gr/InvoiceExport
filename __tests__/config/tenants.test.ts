import { describe, it, expect } from 'vitest'
import { getTenantConfig, validateBrand, TENANTS } from '@/config/tenants'

describe('tenants', () => {
  describe('getTenantConfig', () => {
    it('returns Europcar config', () => {
      const config = getTenantConfig('europcar')
      expect(config).toBeTruthy()
      expect(config?.key).toBe('europcar')
      expect(config?.invoiceSeriesPrefix).toBe('ECP-')
    })

    it('returns Goldcar config', () => {
      const config = getTenantConfig('goldcar')
      expect(config).toBeTruthy()
      expect(config?.key).toBe('goldcar')
      expect(config?.invoiceSeriesPrefix).toBe('GLD-')
    })

    it('returns null for invalid brand', () => {
      const config = getTenantConfig('invalid')
      expect(config).toBeNull()
    })
  })

  describe('validateBrand', () => {
    it('validates europcar', () => {
      expect(validateBrand('europcar')).toBe(true)
    })

    it('validates goldcar', () => {
      expect(validateBrand('goldcar')).toBe(true)
    })

    it('rejects invalid brand', () => {
      expect(validateBrand('invalid')).toBe(false)
    })

    it('rejects null', () => {
      expect(validateBrand(null)).toBe(false)
    })
  })

  describe('TENANTS constant', () => {
    it('has correct structure for Europcar', () => {
      const europcar = TENANTS.europcar
      expect(europcar.theme.primary).toBe('#0EAD00')
      expect(europcar.taxSettings.defaultVatRate).toBe(24)
    })

    it('has correct structure for Goldcar', () => {
      const goldcar = TENANTS.goldcar
      expect(goldcar.theme.primary).toBe('#FFD400')
      expect(goldcar.taxSettings.defaultVatRate).toBe(24)
    })
  })
})
