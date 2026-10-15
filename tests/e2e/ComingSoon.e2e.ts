import { expect, test } from '@playwright/test';
import { AppConfig } from '../../src/utils/AppConfig';

test.describe('Coming soon', () => {
  test.skip(!AppConfig.comingSoon, 'Only applies before the catalog launch.');

  test('provides WhatsApp, email and phone ordering without third-party or licensing copy', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Langkah berikutnya,');

    const salesContact = page.locator('.coming-soon-button');

    await expect(salesContact).toContainText('Hubungi sales');

    const destination = new URL((await salesContact.getAttribute('href'))!);

    expect(destination.hostname).toBe('wa.me');
    expect(destination.pathname).toBe(`/${AppConfig.contact.whatsapp}`);
    expect(destination.searchParams.get('text')).toContain('saya ingin memesan alat atau reagen bank darah');
    expect(destination.searchParams.get('text')).not.toMatch(/Panji Prima Dinamika/i);
    await expect(page.locator('body')).not.toContainText(/Panji Prima Dinamika|perizinan|licensing|pemesanan belum tersedia/i);
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', /Panji Prima Dinamika|perizinan/i);
    await expect(page.getByRole('link', { name: 'admin@mitralaboramedika.com' })).toHaveAttribute('href', 'mailto:admin@mitralaboramedika.com');
    await expect(page.getByRole('link', { name: '0812-6685-4415' })).toHaveAttribute('href', 'tel:+6281266854415');
    await expect(page.locator('a[href*="/catalog"]')).toHaveCount(0);
    await expect(page.getByText('Setiap produk terdaftar di Kementerian Kesehatan.')).toHaveCount(0);
    await expect(page.locator('.coming-soon-petal img').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('keeps English ordering copy and contact messages neutral', async ({ page }) => {
    await page.goto('/en');

    await expect(page.locator('body')).not.toContainText(/Panji Prima Dinamika|licensing/i);
    await expect(page.locator('.coming-soon-status')).toHaveText('Orders can be placed by email or phone.');
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content', /Panji Prima Dinamika|licensing/i);

    const destination = new URL((await page.locator('.coming-soon-button').getAttribute('href'))!);

    expect(destination.searchParams.get('text')).toContain('I would like to order blood bank equipment or reagents');
    expect(destination.searchParams.get('text')).not.toMatch(/Panji Prima Dinamika/i);
    await expect(page.getByRole('link', { name: '0812-6685-4415' })).toHaveAttribute('href', 'tel:+6281266854415');
  });

  test('rotates with the nearby cursor and follows it across a full turn', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto('/');
    const frame = page.locator('.coming-soon-kawung');
    const rotor = page.locator('.coming-soon-rotor');
    const bounds = (await frame.boundingBox())!;
    const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    const radius = bounds.width * 0.27;
    const rotation = () => rotor.evaluate(element => Number((element as HTMLElement).style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] ?? 0));

    await page.mouse.move(center.x + radius, center.y);

    await expect(frame).toHaveAttribute('data-following', 'true');

    for (const [x, y, threshold] of [
      [center.x, center.y + radius, 60],
      [center.x - radius, center.y, 150],
      [center.x, center.y - radius, 240],
      [center.x + radius, center.y, 330],
    ]) {
      await page.mouse.move(x!, y!, { steps: 8 });

      await expect.poll(rotation).toBeGreaterThan(threshold!);
    }

    await page.mouse.move(0, 0);

    await expect(frame).toHaveAttribute('data-following', 'false');
    await expect.poll(async () => Math.abs((await rotation()) - 360)).toBeLessThan(1);
    await expect(page.getByRole('button', { name: /animasi|animation/i })).toHaveCount(0);
  });

  test('respects reduced motion and stays light in dark system mode', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('.coming-soon-petal').first()).toHaveCSS('animation-name', 'none');

    const frame = page.locator('.coming-soon-kawung');
    const bounds = (await frame.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height * 0.8);

    await expect(frame).toHaveAttribute('data-following', 'false');
    await expect(page.locator('.coming-soon-rotor')).toHaveCSS('transform', 'none');
    await expect(page.getByRole('button', { name: /animasi|animation/i })).toHaveCount(0);
    await expect(page.locator('.coming-soon')).toHaveCSS('background-color', 'rgb(240, 235, 225)');
  });

  test('stays still for touch input and after reduced motion changes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 });
    await page.goto('/');
    const frame = page.locator('.coming-soon-kawung');
    const bounds = (await frame.boundingBox())!;
    const point = { clientX: bounds.x + bounds.width * 0.75, clientY: bounds.y + bounds.height / 2 };
    await frame.dispatchEvent('pointermove', { ...point, pointerType: 'touch' });

    await expect(frame).toHaveAttribute('data-following', 'false');

    await page.mouse.move(point.clientX, point.clientY);

    await expect(frame).toHaveAttribute('data-following', 'true');

    await page.emulateMedia({ reducedMotion: 'reduce' });

    await expect(frame).toHaveAttribute('data-following', 'false');
    await expect(page.locator('.coming-soon-rotor')).toHaveCSS('transform', 'none');

    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await expect(frame).toHaveAttribute('data-following', 'false');
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
    await expect(page.locator('.coming-soon-button')).toBeVisible();
  });
});
