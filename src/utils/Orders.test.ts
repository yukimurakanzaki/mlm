import { describe, expect, it } from 'vitest';
import { buildInstallmentPlan, formatIDR, generateOrderCode, NEXT_STATUSES, normalizePhone } from './Orders';

describe('Orders utils', () => {
  describe('formatIDR', () => {
    it('formats whole Rupiah with Indonesian separators', () => {
      expect(formatIDR(1500000)).toMatch(/^Rp\s1\.500\.000$/);
    });
  });

  describe('generateOrderCode', () => {
    it('uses the date and a 6 character suffix', () => {
      const code = generateOrderCode(new Date('2025-10-09T03:00:00Z'));

      expect(code).toMatch(/^MLM-251009-[A-Z2-9]{6}$/);
    });

    it('produces different codes on repeated calls', () => {
      const codes = new Set(Array.from({ length: 50 }, () => generateOrderCode()));

      expect(codes.size).toBe(50);
    });
  });

  describe('normalizePhone', () => {
    it.each([
      ['0812-3456-7890', '6281234567890'],
      ['+62 812 3456 7890', '6281234567890'],
      ['6281234567890', '6281234567890'],
    ])('normalizes %s', (input, expected) => {
      expect(normalizePhone(input)).toBe(expected);
    });

    it.each(['12345', '0212345678', 'abc', '+1 415 555 0100'])('rejects %s', (input) => {
      expect(normalizePhone(input)).toBeNull();
    });
  });

  describe('buildInstallmentPlan', () => {
    it('returns a single installment for full payment', () => {
      expect(buildInstallmentPlan(500000, 1, new Date('2025-10-09T00:00:00Z'))).toEqual([
        { installmentNo: 1, amountIdr: 500000, dueDate: '2025-10-09' },
      ]);
    });

    it('splits evenly and puts the remainder in the first installment', () => {
      const plan = buildInstallmentPlan(1000001, 3, new Date('2025-10-09T00:00:00Z'));

      expect(plan.map(p => p.amountIdr)).toEqual([333335, 333333, 333333]);
      expect(plan.reduce((sum, p) => sum + p.amountIdr, 0)).toBe(1000001);
      expect(plan.map(p => p.dueDate)).toEqual(['2025-10-09', '2025-11-09', '2025-12-09']);
    });

    it('clamps the due day to the end of shorter months', () => {
      const plan = buildInstallmentPlan(300000, 3, new Date('2025-01-31T00:00:00Z'));

      expect(plan.map(p => p.dueDate)).toEqual(['2025-01-31', '2025-02-28', '2025-03-31']);
    });

    it('rejects invalid input', () => {
      expect(() => buildInstallmentPlan(0, 1)).toThrow(RangeError);
      expect(() => buildInstallmentPlan(1000, 0)).toThrow(RangeError);
    });
  });

  describe('NEXT_STATUSES', () => {
    it('does not allow leaving a final status', () => {
      expect(NEXT_STATUSES.delivered).toEqual([]);
      expect(NEXT_STATUSES.cancelled).toEqual([]);
    });
  });
});
