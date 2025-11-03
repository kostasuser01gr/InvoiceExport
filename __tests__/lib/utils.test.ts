import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, calculateVAT, calculateTotal } from '@/lib/utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats EUR currency correctly', () => {
      const result = formatCurrency(100)
      expect(result).toContain('100')
      expect(result).toContain('€')
    })

    it('handles string input', () => {
      const result = formatCurrency('150.50')
      expect(result).toContain('150')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toBeTruthy()
      expect(result).toContain('2024')
    })

    it('handles string date input', () => {
      const result = formatDate('2024-01-15')
      expect(result).toBeTruthy()
    })
  })

  describe('calculateVAT', () => {
    it('calculates 24% VAT correctly', () => {
      const vat = calculateVAT(100, 24)
      expect(vat).toBe(24)
    })

    it('handles zero VAT', () => {
      const vat = calculateVAT(100, 0)
      expect(vat).toBe(0)
    })

    it('calculates for decimal amounts', () => {
      const vat = calculateVAT(99.99, 24)
      expect(vat).toBeCloseTo(23.9976, 2)
    })
  })

  describe('calculateTotal', () => {
    it('calculates total with VAT correctly', () => {
      const total = calculateTotal(100, 24)
      expect(total).toBe(124)
    })

    it('handles zero VAT', () => {
      const total = calculateTotal(100, 0)
      expect(total).toBe(100)
    })
  })
})
