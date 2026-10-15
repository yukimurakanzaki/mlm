import { expect, test } from '@playwright/test';
import { AppConfig } from '../../src/utils/AppConfig';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from Indonesian to English', async ({ page }) => {
      await page.goto('/');

      if (AppConfig.comingSoon) {
        await page.getByRole('link', { name: 'English', exact: true }).click();

        await expect(page.getByRole('heading', { name: /Our next chapter/ })).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      } else {
        await page.getByRole('button', { name: 'Ganti bahasa' }).click();
        await page.getByText('English').click();

        await expect(page).toHaveURL(/\/en$/);
      }
    });

    test('should show the English catalog from the URL', async ({ page }) => {
      await page.goto('/en/catalog');

      if (AppConfig.comingSoon) {
        await expect(page).toHaveURL(/\/en$/);
        await expect(page.getByRole('heading', { name: /Our next chapter/ })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: 'Product catalog' })).toBeVisible();
      }
    });
  });
});
