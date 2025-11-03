import { describe, it, expect } from 'vitest'
import { validateAFM, validateGreekPlate } from '@/lib/validators'

describe('validators', () => {
  describe('validateAFM', () => {
    it('validates correct 9-digit AFM', () => {
      expect(validateAFM('123456789')).toBe(true)
    })

    it('validates AFM with spaces', () => {
      expect(validateAFM('123 456 789')).toBe(true)
    })

    it('rejects invalid AFM', () => {
      expect(validateAFM('12345')).toBe(false)
      expect(validateAFM('12345678a')).toBe(false)
      expect(validateAFM('')).toBe(false)
    })
  })

  describe('validateGreekPlate', () => {
    it('validates standard Greek plate (3 letters + 4 digits)', () => {
      expect(validateGreekPlate('ABC1234')).toBe(true)
      expect(validateGreekPlate('XYZ9999')).toBe(true)
    })

    it('validates alternative format (2 letters + 5 digits)', () => {
      expect(validateGreekPlate('AB12345')).toBe(true)
    })

    it('handles plates with hyphens', () => {
      expect(validateGreekPlate('ABC-1234')).toBe(true)
    })

    it('handles lowercase plates', () => {
      expect(validateGreekPlate('abc1234')).toBe(true)
    })

    it('rejects invalid plates', () => {
      expect(validateGreekPlate('ABCD1234')).toBe(false) // too many letters
      expect(validateGreekPlate('AB123')).toBe(false) // too few digits
      expect(validateGreekPlate('123ABCD')).toBe(false) // wrong order
    })
  })
})
