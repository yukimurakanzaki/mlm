// Inserts sample products for local development. Safe to run repeatedly (skips existing slugs).
// Usage: npm run db:seed   (with the dev database running, e.g. `npm run dev` in another terminal)
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { productSchema } from '../src/models/Schema';

const products = [
  { slug: 'paket-starter', name: 'Paket Starter', description: 'Paket produk pemula, cocok untuk mencoba.', priceIdr: 450000, stock: 100 },
  { slug: 'paket-keluarga', name: 'Paket Keluarga', description: 'Paket hemat untuk kebutuhan keluarga.', priceIdr: 1200000, stock: 50 },
  { slug: 'paket-premium', name: 'Paket Premium', description: 'Paket lengkap dengan produk pilihan.', priceIdr: 3000000, stock: 20 },
];

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

await db.insert(productSchema).values(products).onConflictDoNothing({ target: productSchema.slug });
await pool.end();
console.info(`Seeded ${products.length} products (existing slugs were skipped).`);
