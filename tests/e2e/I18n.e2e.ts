import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from Indonesian to English using dropdown', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /Pesan produk Anda dengan mudah/ })).toBeVisible();

      await page.getByRole('button', { name: 'Ganti bahasa' }).click();
      await page.getByText('English').click();

      await expect(page.getByRole('heading', { name: /Order your products easily/ })).toBeVisible();
    });

    test('should show the English catalog from the URL', async ({ page }) => {
      await page.goto('/en/catalog');

      await expect(page.getByRole('heading', { name: 'Product catalog' })).toBeVisible();
    });
  });
});
