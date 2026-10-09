import { boolean, date, index, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/types/Order';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`
// 3. Commit the generated migration file in `migrations/`.

// All money values are stored as whole Rupiah (IDR has no minor unit in practice).

export const orderStatusEnum = pgEnum('order_status', [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.PAID,
  PAYMENT_STATUS.FAILED,
]);

export const productSchema = pgTable('product', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  priceIdr: integer('price_idr').notNull(),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const orderSchema = pgTable('order', {
  id: serial('id').primaryKey(),
  // Public, hard-to-guess reference shown to the customer, e.g. MLM-251009-K7Q2XM
  code: text('code').notNull().unique(),
  // Clerk user id when the customer was signed in; null for guest (lead) orders
  clerkUserId: text('clerk_user_id'),
  customerName: text('customer_name').notNull(),
  // Normalized to digits with country code, e.g. 628123456789
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  shippingAddress: text('shipping_address').notNull(),
  notes: text('notes'),
  status: orderStatusEnum('status').notNull().default(ORDER_STATUS.PENDING),
  totalIdr: integer('total_idr').notNull(),
  installmentCount: integer('installment_count').notNull().default(1),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, table => [
  index('order_clerk_user_id_idx').on(table.clerkUserId),
  index('order_created_at_idx').on(table.createdAt),
]);

export const orderItemSchema = pgTable('order_item', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orderSchema.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => productSchema.id, { onDelete: 'restrict' }),
  // Snapshots, so history stays correct when the catalog changes
  productName: text('product_name').notNull(),
  unitPriceIdr: integer('unit_price_idr').notNull(),
  quantity: integer('quantity').notNull(),
}, table => [
  index('order_item_order_id_idx').on(table.orderId),
]);

// One row per installment. A full payment is a single installment.
export const paymentSchema = pgTable('payment', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orderSchema.id, { onDelete: 'cascade' }),
  installmentNo: integer('installment_no').notNull(),
  amountIdr: integer('amount_idr').notNull(),
  dueDate: date('due_date', { mode: 'string' }).notNull(),
  status: paymentStatusEnum('status').notNull().default(PAYMENT_STATUS.PENDING),
  paidAt: timestamp('paid_at', { mode: 'date' }),
  method: text('method'),
  reference: text('reference'),
}, table => [
  index('payment_order_id_idx').on(table.orderId),
]);
