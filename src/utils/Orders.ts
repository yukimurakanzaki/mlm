import type { OrderStatus } from '@/types/Order';
import { ORDER_STATUS } from '@/types/Order';

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // No look-alike characters (0/O, 1/I/L)

/** Formats whole Rupiah, e.g. 1500000 -> "Rp 1.500.000". */
export const formatIDR = (amount: number, locale = 'id') =>
  new Intl.NumberFormat(locale === 'en' ? 'en-ID' : 'id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * Generates a public order reference, e.g. `MLM-251009-K7Q2XM`.
 * The random part (31^6, about 887 million combinations) makes codes impractical to guess.
 */
export const generateOrderCode = (now = new Date(), random: (max: number) => number = max => crypto.getRandomValues(new Uint32Array(1))[0]! % max) => {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const suffix = Array.from({ length: 6 }, () => CODE_ALPHABET[random(CODE_ALPHABET.length)]).join('');

  return `MLM-${yy}${mm}${dd}-${suffix}`;
};

/**
 * Normalizes an Indonesian phone number to digits with country code.
 * `0812-3456-789`, `+62 812 3456 789` and `62812...` all become `62812...`.
 * @returns The normalized number, or `null` if it is not a valid Indonesian mobile number.
 */
export const normalizePhone = (input: string) => {
  const digits = input.replace(/[\s\-().]/g, '');
  const withCountry = digits.startsWith('+62')
    ? digits.slice(1)
    : digits.startsWith('0')
      ? `62${digits.slice(1)}`
      : digits;

  return /^628[1-9]\d{7,11}$/.test(withCountry) ? withCountry : null;
};

export type InstallmentPlanItem = {
  installmentNo: number;
  amountIdr: number;
  dueDate: string; // YYYY-MM-DD
};

/**
 * Splits a total into equal monthly installments. The first installment is due on `start`
 * and absorbs any rounding remainder, so the parts always add up to the total.
 */
export const buildInstallmentPlan = (totalIdr: number, count: number, start = new Date()): InstallmentPlanItem[] => {
  if (!Number.isInteger(totalIdr) || totalIdr <= 0) {
    throw new RangeError('Total must be a positive whole number');
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('Installment count must be at least 1');
  }

  const base = Math.floor(totalIdr / count);
  const remainder = totalIdr - base * count;

  return Array.from({ length: count }, (_, index) => {
    const due = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1));
    const lastDay = new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth() + 1, 0)).getUTCDate();
    due.setUTCDate(Math.min(start.getUTCDate(), lastDay)); // Clamp, e.g. 31 Jan -> 28 Feb

    return {
      installmentNo: index + 1,
      amountIdr: index === 0 ? base + remainder : base,
      dueDate: due.toISOString().slice(0, 10),
    };
  });
};

/** Statuses an admin may move an order to from its current status. */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PACKED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PACKED]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

/** URL-safe product slug, e.g. "Paket Keluarga!" -> "paket-keluarga". */
export const slugify = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/** Products with a visible price can be ordered online; the rest are "ask for a quote". */
export const canOrderOnline = <T extends { priceIdr: number | null; showPrice: boolean }>(product: T): product is T & { priceIdr: number } =>
  product.showPrice && product.priceIdr !== null;
