import { Buffer } from 'node:buffer';
import { createHash, timingSafeEqual } from 'node:crypto';

/** Midtrans order ids look like `P12-1760000000000`: our payment id plus a per-attempt suffix. */
export const buildGatewayOrderId = (paymentId: number, now = Date.now()) => `P${paymentId}-${now}`;

export const parseGatewayOrderId = (gatewayOrderId: string) => {
  const match = /^P(\d+)-\d+$/.exec(gatewayOrderId);

  return match ? Number(match[1]) : null;
};

/** Midtrans signs notifications with SHA512(order_id + status_code + gross_amount + server_key). */
export const isValidMidtransSignature = (
  body: { order_id: string; status_code: string; gross_amount: string; signature_key: string },
  serverKey: string,
) => {
  const expected = createHash('sha512')
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
    .digest('hex');
  const given = Buffer.from(body.signature_key, 'hex');
  const wanted = Buffer.from(expected, 'hex');

  return given.length === wanted.length && timingSafeEqual(given, wanted);
};

export type GatewayOutcome = 'paid' | 'failed' | 'pending';

/** Maps a Midtrans notification to what it means for an installment. */
export const getGatewayOutcome = (transactionStatus: string, fraudStatus?: string): GatewayOutcome => {
  if (transactionStatus === 'settlement') {
    return 'paid';
  }

  if (transactionStatus === 'capture') {
    return fraudStatus === 'accept' ? 'paid' : 'pending';
  }

  if (['deny', 'cancel', 'expire', 'failure'].includes(transactionStatus)) {
    return 'failed';
  }

  return 'pending';
};
