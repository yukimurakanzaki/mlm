'use server';

import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { isAdmin } from '@/libs/Auth';
import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { productSchema } from '@/models/Schema';
import { slugify } from '@/utils/Orders';
import { parseProductCsv } from '@/utils/ProductImport';

const checkbox = z.preprocess(value => value === 'on', z.boolean());
const optionalText = (max: number) => z.string().trim().max(max).transform(v => v || null);

const productInput = z.object({
  id: z.coerce.number().int().positive().optional(),
  sku: optionalText(60),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).default(''),
  category: optionalText(80),
  brand: optionalText(80),
  packaging: optionalText(120),
  unit: optionalText(40),
  // Empty means "price on request"
  priceIdr: z.preprocess(value => (value === '' ? null : value), z.coerce.number().int().min(1000).max(1_000_000_000).nullable()),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  showPrice: checkbox,
  trackStock: checkbox,
  isActive: checkbox,
});

const uniqueSlug = (base: string, taken: Set<string>, sku: string) => {
  const root = base || 'produk';
  const candidate = taken.has(root) ? `${root}-${slugify(sku) || Math.random().toString(36).slice(2, 6)}` : root;
  taken.add(candidate);

  return candidate;
};

/** Admin only: creates a product, or updates it when `id` is present. Existing slugs never change, so links stay valid. */
export async function saveProduct(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error('Forbidden');
  }

  const { id, ...input } = productInput.parse({ ...Object.fromEntries(formData), id: formData.get('id') || undefined });
  // A product without a price can never show one
  const values = { ...input, showPrice: input.showPrice && input.priceIdr !== null };

  if (id) {
    await db.update(productSchema).set(values).where(eq(productSchema.id, id));
  } else {
    const taken = new Set((await db.select({ slug: productSchema.slug }).from(productSchema)).map(row => row.slug));

    await db.insert(productSchema).values({ ...values, slug: uniqueSlug(slugify(input.name), taken, input.sku ?? '') });
  }

  revalidatePath('/', 'layout');
}

export type ImportState = {
  done?: boolean;
  created?: number;
  updated?: number;
  errors?: { row: number; field: string }[];
  failed?: boolean;
};

/**
 * Admin only: imports a catalog sheet (CSV). Products are matched by SKU, so re-uploading an updated sheet
 * updates prices and details. Stock, stock tracking and page links of existing products are left alone.
 */
export async function importProducts(_prev: ImportState, formData: FormData): Promise<ImportState> {
  if (!(await isAdmin())) {
    throw new Error('Forbidden');
  }

  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0 || file.size > 1_000_000) {
    return { failed: true, errors: [{ row: 1, field: 'file' }] };
  }

  const { rows, errors } = parseProductCsv(await file.text());

  if (rows.length === 0) {
    return { failed: true, errors };
  }

  try {
    const result = await db.transaction(async (tx) => {
      const existing = await tx.select({ id: productSchema.id, sku: productSchema.sku }).from(productSchema).where(inArray(productSchema.sku, rows.map(r => r.sku)));
      const idBySku = new Map(existing.map(p => [p.sku, p.id]));
      const taken = new Set((await tx.select({ slug: productSchema.slug }).from(productSchema)).map(p => p.slug));
      let created = 0;
      let updated = 0;

      // Sequential so new products keep the order of the sheet
      for (const row of rows) {
        const existingId = idBySku.get(row.sku);

        if (existingId) {
          await tx.update(productSchema).set(row).where(eq(productSchema.id, existingId));
          updated++;
        } else {
          // The sheet has no stock figures, so new products are not stock-limited until an admin turns that on
          await tx.insert(productSchema).values({ ...row, slug: uniqueSlug(slugify(row.name), taken, row.sku), trackStock: false });
          created++;
        }
      }

      return { created, updated };
    });

    revalidatePath('/', 'layout');

    return { done: true, ...result, errors };
  } catch (error) {
    logger.error(`importProducts failed: ${error instanceof Error ? error.message : String(error)}`);

    return { failed: true, errors: [{ row: 0, field: 'database' }] };
  }
}
