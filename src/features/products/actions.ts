'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { isAdmin } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { productSchema } from '@/models/Schema';
import { slugify } from '@/utils/Orders';

const productInput = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).default(''),
  priceIdr: z.coerce.number().int().min(1000).max(1_000_000_000),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  isActive: z.preprocess(value => value === 'on', z.boolean()),
});

/** Admin only: creates a product, or updates it when `id` is present. Existing slugs never change, so links stay valid. */
export async function saveProduct(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error('Forbidden');
  }

  const { id, ...input } = productInput.parse({ ...Object.fromEntries(formData), id: formData.get('id') || undefined });

  if (id) {
    await db.update(productSchema).set(input).where(eq(productSchema.id, id));
  } else {
    const base = slugify(input.name) || 'produk';
    // Retry with a random suffix if the slug is taken
    const slug = (await db.select({ id: productSchema.id }).from(productSchema).where(eq(productSchema.slug, base)).limit(1)).length
      ? `${base}-${Math.random().toString(36).slice(2, 6)}`
      : base;

    await db.insert(productSchema).values({ ...input, slug });
  }

  revalidatePath('/', 'layout');
}
