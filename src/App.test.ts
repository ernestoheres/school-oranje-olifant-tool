import { calculateTotals, btw } from './App'
import { describe, expect, test } from 'vitest'

describe('calculateTotals', () => {
  test('base case: under 5,000 -> 3% discount', () => {
    const r = calculateTotals(100, 10, 'nl', btw)
    expect(r.sumAantal).toBe(1000)
    expect(r.kortingProcent).toBeCloseTo(0.03)
    expect(r.kortingBedrag).toBeCloseTo(30)
    expect(r.subtotaalNaKorting).toBeCloseTo(970)
    expect(r.btwBedrag).toBeCloseTo(203.7)
    expect(r.finalAmount).toBeCloseTo(1173.7)
  })

  test('medium case: between 7,000 and 10,000 -> 7% discount', () => {
    const r = calculateTotals(200, 50, 'nl', btw)
    // sum = 10,000 -> still 7% with current rules
    expect(r.sumAantal).toBe(10000)
    expect(r.kortingProcent).toBeCloseTo(0.07)
    expect(r.kortingBedrag).toBeCloseTo(700)
    expect(r.subtotaalNaKorting).toBeCloseTo(9300)
    expect(r.btwBedrag).toBeCloseTo(1953) // 21% of 9300
    expect(r.finalAmount).toBeCloseTo(11253)
  })

  test('different country btw (DE 19%)', () => {
    const r = calculateTotals(100, 100, 'de', btw)
    // sum = 10,000 -> 7% discount with current rules
    expect(r.kortingProcent).toBeCloseTo(0.07)
    expect(r.subtotaalNaKorting).toBeCloseTo(9300)
    expect(r.btwBedrag).toBeCloseTo(1767) // 19% of 9300
    expect(r.finalAmount).toBeCloseTo(11067)
  })

  test('highest discount tier > 500,000', () => {
    const r = calculateTotals(1000, 600, 'nl', btw)
    expect(r.kortingProcent).toBeCloseTo(0.15)
    expect(r.sumAantal).toBe(600000)
    expect(r.kortingBedrag).toBeCloseTo(90000)
    expect(r.subtotaalNaKorting).toBeCloseTo(510000)
    expect(r.btwBedrag).toBeCloseTo(107100)
    expect(r.finalAmount).toBeCloseTo(617100)
  })
})