import { sqliteTable, text, integer, check, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const products = sqliteTable('products', { id: text('id').primaryKey(), data: text('data').notNull(), visible: integer('visible').notNull().default(1) });
export const variants = sqliteTable('variants', {
  id: text('id').primaryKey(), productId: text('product_id').notNull().references(() => products.id), color: text('color').notNull(), storage: text('storage').notNull(), image: text('image').notNull(), price: integer('price').notNull(), stock: integer('stock').notNull(),
}, t => [check('nonnegative_stock', sql`${t.stock} >= 0`), check('positive_price', sql`${t.price} > 0`)]);
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(), password: text('password').notNull(), role: text('role').notNull().default('customer'), phone: text('phone').notNull().default(''), addresses: text('addresses').notNull().default('[]'), wishlist: text('wishlist').notNull().default('[]'),
}, t => [uniqueIndex('single_initial_admin').on(t.role).where(sql`${t.role} = 'admin'`)]);
export const sessions = sqliteTable('sessions', { token: text('token').primaryKey(), userId: text('user_id').notNull().references(() => users.id), expires: integer('expires').notNull() });
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), code: text('code').notNull().unique(), userId: text('user_id'), idempotencyKey: text('idempotency_key').notNull().unique(), requestHash: text('request_hash').notNull(), recipient: text('recipient').notNull(), phone: text('phone').notNull(), items: text('items').notNull(), subtotal: integer('subtotal').notNull(), discount: integer('discount').notNull(), shipping: integer('shipping').notNull(), total: integer('total').notNull(), payment: text('payment').notNull(), status: text('status').notNull(), createdAt: text('created_at').notNull(), history: text('history').notNull(),
});
export const coupons = sqliteTable('coupons', { code: text('code').primaryKey(), amount: integer('amount').notNull(), minimum: integer('minimum').notNull(), expires: text('expires').notNull(), remaining: integer('remaining').notNull() }, t => [check('coupon_remaining', sql`${t.remaining} >= 0`)]);
export const auditLogs = sqliteTable('audit_logs', { id: text('id').primaryKey(), userId: text('user_id').notNull(), action: text('action').notNull(), details: text('details').notNull(), createdAt: text('created_at').notNull() });
export const rateLimits = sqliteTable('rate_limits', { key: text('key').primaryKey(), attempts: integer('attempts').notNull(), expires: integer('expires').notNull() });
