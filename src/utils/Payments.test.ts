import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildGatewayOrderId, getGatewayOutcome, isValidMidtransSignature, parseGatewayOrderId } from './Payments';

describe('gateway order id', () => {
  it('round-trips the payment id', () => {
    expect(parseGatewayOrderId(buildGatewayOrderId(42, 1760000000000))).toBe(42);
  });

  it('rejects ids that are not ours', () => {
    expect(parseGatewayOrderId('MLM-251009-ABC')).toBeNull();
    expect(parseGatewayOrderId('P12')).toBeNull();
  });
});

describe('isValidMidtransSignature', () => {
  const base = { order_id: 'P1-1', status_code: '200', gross_amount: '150000.00' };
  const sign = (key: string) => createHash('sha512').update(`P1-1200150000.00${key}`).digest('hex');

  it('accepts a correct signature', () => {
    expect(isValidMidtransSignature({ ...base, signature_key: sign('secret') }, 'secret')).toBe(true);
  });

  it('rejects a wrong key, tampered amount or garbage', () => {
    expect(isValidMidtransSignature({ ...base, signature_key: sign('other') }, 'secret')).toBe(false);
    expect(isValidMidtransSignature({ ...base, gross_amount: '1.00', signature_key: sign('secret') }, 'secret')).toBe(false);
    expect(isValidMidtransSignature({ ...base, signature_key: 'zz' }, 'secret')).toBe(false);
  });
});

describe('getGatewayOutcome', () => {
  it('maps statuses', () => {
    expect(getGatewayOutcome('settlement')).toBe('paid');
    expect(getGatewayOutcome('capture', 'accept')).toBe('paid');
    expect(getGatewayOutcome('capture', 'challenge')).toBe('pending');
    expect(getGatewayOutcome('expire')).toBe('failed');
    expect(getGatewayOutcome('pending')).toBe('pending');
  });
});
