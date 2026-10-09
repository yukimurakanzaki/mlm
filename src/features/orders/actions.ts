'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, gte, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { isAdmin } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { orderItemSchema, orderSchema, paymentSchema, productSchema } from '@/models/Schema';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/types/Order';
import { AppConfig } from '@/utils/AppConfig';
import { buildInstallmentPlan, generateOrderCode, NEXT_STATUSES, normalizePhone } from '@/utils/Orders';

export type OrderFormState = {
  // Keys of the `OrderForm.errors` messages
  error?: 'invalid' | 'phone' | 'out_of_stock' | 'unknown';
  fieldErrors?: Partial<Record<'customerName' | 'customerPhone' | 'customerEmail' | 'shippingAddress' | 'quantity', true>>;
};

const orderInput = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(1).max(99),
  installmentCount: z.coerce.number().int().refine(n => (AppConfig.installmentOptions as readonly number[]).includes(n)),
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(1).max(30),
  customerEmail: z.union([z.literal(''), z.email().max(200)]).optional(),
  shippingAddress: z.string().trim().min(10).max(500),
  notes: z.string().trim().max(500).optional(),
  locale: z.string().max(5).default('id'),
});

class OutOfStockError extends Error {}

/** Creates an order for a lead/guest or a signed-in customer, then redirects to the tracking page. */
export async function createOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  const parsed = orderInput.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: NonNullable<OrderFormState['fieldErrors']> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0];

      if (key === 'customerName' || key === 'customerPhone' || key === 'customerEmail' || key === 'shippingAddress' || key === 'quantity') {
        fieldErrors[key] = true;
      }
    }

    return { error: 'invalid', fieldErrors };
  }

  const input = parsed.data;
  const phone = normalizePhone(input.customerPhone);

  if (!phone) {
    return { error: 'phone', fieldErrors: { customerPhone: true } };
  }

  // `auth()` throws when Clerk did not run for this request (guest without a session)
  const userId = await auth().then(session => session.userId).catch(() => null);
  let orderCode: string;

  try {
    orderCode = await db.transaction(async (tx) => {
      // Atomic stock check + decrement: no overselling under concurrent orders
      const [product] = await tx
        .update(productSchema)
        .set({ stock: sql`${productSchema.stock} - ${input.quantity}` })
        .where(and(
          eq(productSchema.id, input.productId),
          eq(productSchema.isActive, true),
          gte(productSchema.stock, input.quantity),
        ))
        .returning();

      if (!product) {
        throw new OutOfStockError();
      }

      const totalIdr = product.priceIdr * input.quantity;
      const code = generateOrderCode();

      const [order] = await tx
        .insert(orderSchema)
        .values({
          code,
          clerkUserId: userId,
          customerName: input.customerName,
          customerPhone: phone,
          customerEmail: input.customerEmail || null,
          shippingAddress: input.shippingAddress,
          notes: input.notes || null,
          totalIdr,
          installmentCount: input.installmentCount,
        })
        .returning({ id: orderSchema.id });

      await tx.insert(orderItemSchema).values({
        orderId: order!.id,
        productId: product.id,
        productName: product.name,
        unitPriceIdr: product.priceIdr,
        quantity: input.quantity,
      });

      await tx.insert(paymentSchema).values(
        buildInstallmentPlan(totalIdr, input.installmentCount).map(item => ({ ...item, orderId: order!.id })),
      );

      return code;
    });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return { error: 'out_of_stock' };
    }

    logger.error(`createOrder failed: ${error instanceof Error ? error.message : String(error)}`);

    return { error: 'unknown' };
  }

  const prefix = input.locale === AppConfig.i18n.defaultLocale ? '' : `/${input.locale}`;
  redirect(`${prefix}/track?code=${orderCode}&phone=${phone}`);
}

/** Admin only: moves an order along its lifecycle. Cancelling returns the stock. */
export async function updateOrderStatus(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error('Forbidden');
  }

  const orderId = z.coerce.number().int().positive().parse(formData.get('orderId'));
  const next = z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]).parse(formData.get('status'));

  await db.transaction(async (tx) => {
    const [order] = await tx.select().from(orderSchema).where(eq(orderSchema.id, orderId)).for('update');

    if (!order || !(NEXT_STATUSES[order.status] as string[]).includes(next)) {
      throw new Error('Invalid status transition');
    }

    await tx.update(orderSchema).set({ status: next as typeof order.status }).where(eq(orderSchema.id, orderId));

    if (next === ORDER_STATUS.CANCELLED) {
      const items = await tx.select().from(orderItemSchema).where(eq(orderItemSchema.orderId, orderId));

      for (const item of items) {
        await tx
          .update(productSchema)
          .set({ stock: sql`${productSchema.stock} + ${item.quantity}` })
          .where(eq(productSchema.id, item.productId));
      }
    }
  });

  revalidatePath('/[locale]/dashboard/admin', 'page');
}

/** Admin only: records that an installment has been received. */
export async function markPaymentPaid(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error('Forbidden');
  }

  const paymentId = z.coerce.number().int().positive().parse(formData.get('paymentId'));

  await db
    .update(paymentSchema)
    .set({ status: PAYMENT_STATUS.PAID, paidAt: new Date(), method: 'manual_transfer' })
    .where(and(eq(paymentSchema.id, paymentId), eq(paymentSchema.status, PAYMENT_STATUS.PENDING)));

  revalidatePath('/[locale]/dashboard/admin', 'page');
}
