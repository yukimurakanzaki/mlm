import { expect, test } from '@playwright/test';
import { AppConfig } from '../../src/utils/AppConfig';

test.describe('Coming soon', () => {
  test.skip(!AppConfig.comingSoon, 'Only applies before the catalog launch.');

  test('provides company contact without sales or unsupported approval claims', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Langkah berikutnya,');
    await expect(page.getByRole('link', { name: 'Hubungi perusahaan', exact: true })).toHaveAttribute('href', /^https:\/\/wa.me\/6281266854415\?text=/);
    await expect(page.getByRole('link', { name: 'admin@mitralaboramedika.com' })).toHaveAttribute('href', 'mailto:admin@mitralaboramedika.com');
    await expect(page.locator('a[href*="/catalog"]')).toHaveCount(0);
    await expect(page.getByText('Setiap produk terdaftar di Kementerian Kesehatan.')).toHaveCount(0);
    await expect(page.locator('.coming-soon-petal img').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('pauses and resumes petal motion', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Jeda animasi' }).click();

    await expect(page.locator('.coming-soon')).toHaveAttribute('data-motion', 'paused');
    await expect(page.locator('.coming-soon-petal').first()).toHaveCSS('animation-play-state', 'paused');

    await page.getByRole('button', { name: 'Putar animasi' }).click();

    await expect(page.locator('.coming-soon')).toHaveAttribute('data-motion', 'playing');
  });

  test('respects reduced motion and stays light in dark system mode', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('.coming-soon-petal').first()).toHaveCSS('animation-name', 'none');
    await expect(page.getByRole('button', { name: 'Jeda animasi' })).toBeHidden();
    await expect(page.locator('.coming-soon')).toHaveCSS('background-color', 'rgb(240, 235, 225)');
  });

  for (const path of ['/catalog/paket-starter', '/catalog/sample.with-dot', '/track', '/en/catalog/paket-starter', '/en/track']) {
    test(`keeps the sales entry ${path} unavailable`, async ({ page }) => {
      await page.goto(path);

      await expect(page).toHaveURL(path.startsWith('/en/') ? /\/en$/ : /\/$/);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(path.startsWith('/en/') ? 'Our next chapter' : 'Langkah berikutnya');
      await expect(page.locator('input[name="customerName"]')).toHaveCount(0);
    });
  }

  test('fits a narrow mobile viewport and supports keyboard navigation', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.keyboard.press('Tab');

    await expect(page.getByRole('link', { name: 'Lewati ke konten utama' })).toBeFocused();

    await page.keyboard.press('Enter');

    await expect(page.getByRole('main')).toBeFocused();
    await expect(page.getByRole('link', { name: 'Hubungi perusahaan', exact: true })).toBeVisible();
  });
});
