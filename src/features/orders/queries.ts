import { and, count, desc, eq, sum } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { orderItemSchema, orderSchema, paymentSchema, productSchema } from '@/models/Schema';
import { ORDER_STATUS } from '@/types/Order';

export const listActiveProducts = (limit?: number) => {
  const query = db
    .select()
    .from(productSchema)
    .where(eq(productSchema.isActive, true))
    .orderBy(desc(productSchema.createdAt));

  return limit ? query.limit(limit) : query;
};

export const getActiveProductBySlug = async (slug: string) => {
  const [product] = await db
    .select()
    .from(productSchema)
    .where(and(eq(productSchema.slug, slug), eq(productSchema.isActive, true)))
    .limit(1);

  return product ?? null;
};

const withDetails = async (order: typeof orderSchema.$inferSelect) => {
  const [items, payments] = await Promise.all([
    db.select().from(orderItemSchema).where(eq(orderItemSchema.orderId, order.id)),
    db.select().from(paymentSchema).where(eq(paymentSchema.orderId, order.id)).orderBy(paymentSchema.installmentNo),
  ]);

  return { ...order, items, payments };
};

export type OrderWithDetails = Awaited<ReturnType<typeof withDetails>>;

/** Public lookup: both the order code and the phone number used when ordering must match. */
export const findOrderByCodeAndPhone = async (code: string, phone: string) => {
  const [order] = await db
    .select()
    .from(orderSchema)
    .where(and(eq(orderSchema.code, code.trim().toUpperCase()), eq(orderSchema.customerPhone, phone)))
    .limit(1);

  return order ? withDetails(order) : null;
};

export const listOrdersForUser = async (clerkUserId: string) => {
  const orders = await db
    .select()
    .from(orderSchema)
    .where(eq(orderSchema.clerkUserId, clerkUserId))
    .orderBy(desc(orderSchema.createdAt))
    .limit(100);

  return Promise.all(orders.map(withDetails));
};

export const listAllOrders = async (limit = 100) => {
  const orders = await db.select().from(orderSchema).orderBy(desc(orderSchema.createdAt)).limit(limit);

  return Promise.all(orders.map(withDetails));
};

export const getAdminStats = async () => {
  const [[orders], [pending], [revenue]] = await Promise.all([
    db.select({ value: count() }).from(orderSchema),
    db.select({ value: count() }).from(orderSchema).where(eq(orderSchema.status, ORDER_STATUS.PENDING)),
    db.select({ value: sum(paymentSchema.amountIdr) }).from(paymentSchema).where(eq(paymentSchema.status, 'paid')),
  ]);

  return {
    totalOrders: orders?.value ?? 0,
    pendingOrders: pending?.value ?? 0,
    collectedIdr: Number(revenue?.value ?? 0),
  };
};
