import { expect, test } from '@playwright/test';
import { AppConfig } from '../../src/utils/AppConfig';

// `*.check.e2e.ts` files can also be run against deployed environments by a monitoring tool.
// Keep them read-only: no orders may be created here.

test.describe('Sanity', () => {
  test.describe('Static pages', () => {
    test('should display the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: AppConfig.comingSoon ? /Langkah berikutnya/ : /Perlengkapan bank darah/ })).toBeVisible();
    });

    test('should display the catalog page', async ({ page }) => {
      await page.goto('/catalog');

      if (AppConfig.comingSoon) {
        await expect(page).toHaveURL(/\/$/);
        await expect(page.getByText('Katalog dan pemesanan belum tersedia.', { exact: false })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: 'Katalog produk' })).toBeVisible();
      }
    });
  });
});
