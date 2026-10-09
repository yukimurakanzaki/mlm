import { expect, test } from '@playwright/test';

// `*.check.e2e.ts` files can also be run against deployed environments by a monitoring tool.
// Keep them read-only: no orders may be created here.

test.describe('Sanity', () => {
  test.describe('Static pages', () => {
    test('should display the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /Pesan produk Anda dengan mudah/ })).toBeVisible();
    });

    test('should display the catalog page', async ({ page }) => {
      await page.goto('/catalog');

      await expect(page.getByRole('heading', { name: 'Katalog produk' })).toBeVisible();
    });
  });
});
