import { and, eq, ne } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import * as z from 'zod';
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
import { logger } from '@/libs/Logger';
import { orderSchema, paymentSchema } from '@/models/Schema';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/types/Order';
import { getGatewayOutcome, isValidMidtransSignature, parseGatewayOrderId } from '@/utils/Payments';

const notification = z.object({
  order_id: z.string(),
  status_code: z.string(),
  gross_amount: z.string(),
  signature_key: z.string(),
  transaction_status: z.string(),
  fraud_status: z.string().optional(),
  payment_type: z.string().optional(),
  transaction_id: z.string().optional(),
});

/** Midtrans payment notification (webhook). Set its URL in the Midtrans dashboard. */
export async function POST(request: Request) {
  if (!Env.MIDTRANS_SERVER_KEY) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const parsed = notification.safeParse(await request.json().catch(() => null));

  if (!parsed.success || !isValidMidtransSignature(parsed.data, Env.MIDTRANS_SERVER_KEY)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const body = parsed.data;
  const paymentId = parseGatewayOrderId(body.order_id);

  if (!paymentId) {
    return NextResponse.json({ ok: true }); // Not one of ours (e.g. Midtrans dashboard test)
  }

  const [payment] = await db.select().from(paymentSchema).where(eq(paymentSchema.id, paymentId)).limit(1);

  // The signed amount must equal what we expect; guards against a mismatched or replayed notification
  if (!payment || Number(body.gross_amount) !== payment.amountIdr) {
    logger.error(`Midtrans notification mismatch for ${body.order_id}`);

    return NextResponse.json({ error: 'mismatch' }, { status: 400 });
  }

  const outcome = getGatewayOutcome(body.transaction_status, body.fraud_status);

  if (outcome === 'paid') {
    await db.transaction(async (tx) => {
      const updated = await tx
        .update(paymentSchema)
        .set({
          status: PAYMENT_STATUS.PAID,
          paidAt: new Date(),
          method: body.payment_type ? `midtrans_${body.payment_type}` : 'midtrans',
          reference: body.transaction_id ?? body.order_id,
        })
        .where(and(eq(paymentSchema.id, payment.id), ne(paymentSchema.status, PAYMENT_STATUS.PAID)))
        .returning({ id: paymentSchema.id });

      // First money in: the order no longer needs manual confirmation
      if (updated.length > 0) {
        await tx
          .update(orderSchema)
          .set({ status: ORDER_STATUS.CONFIRMED })
          .where(and(eq(orderSchema.id, payment.orderId), eq(orderSchema.status, ORDER_STATUS.PENDING)));
      }
    });
  }

  // Failed/expired attempts leave the installment unpaid so the customer can simply try again
  return NextResponse.json({ ok: true });
}
