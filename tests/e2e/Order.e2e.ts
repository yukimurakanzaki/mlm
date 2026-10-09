import { expect, test } from '@playwright/test';

// Requires the sample products from `npm run db:seed` (the Playwright web server runs it).

test.describe('Ordering', () => {
  test('a guest can order in installments, then track the order', async ({ page }) => {
    await page.goto('/catalog/paket-starter');

    await page.getByLabel('Nama lengkap').fill('Budi Santoso');
    await page.getByLabel('Nomor HP / WhatsApp').fill('0812-3456-7890');
    await page.getByLabel('Alamat pengiriman').fill('Jl. Merdeka No. 10, Bandung');
    await page.getByLabel('Skema pembayaran').selectOption('3');
    await page.getByRole('button', { name: 'Buat pesanan' }).click();

    // Redirected to the tracking page with the new order
    await expect(page).toHaveURL(/\/track$/);
    expect(page.url()).not.toContain('6281234567890');
    await expect(page.getByText('Menunggu konfirmasi')).toBeVisible();
    await expect(page.getByText('Cicilan 1 dari 3')).toBeVisible();
    await expect(page.getByText('Cicilan 3 dari 3')).toBeVisible();
    await expect(page.getByText(/Terbayar Rp\s0 dari Rp\s450\.000/)).toBeVisible();
  });

  test('tracking requires the matching phone number', async ({ page }) => {
    await page.goto('/track');
    await page.getByLabel('Kode pesanan').fill('MLM-000000-AAAAAA');
    await page.getByLabel('Nomor HP').fill('081234567890');
    await page.getByRole('button', { name: 'Cari' }).click();

    await expect(page.getByText('Pesanan tidak ditemukan')).toBeVisible();
  });

  test('rejects an invalid phone number', async ({ page }) => {
    await page.goto('/catalog/paket-starter');

    await page.getByLabel('Nama lengkap').fill('Budi Santoso');
    await page.getByLabel('Nomor HP / WhatsApp').fill('12345');
    await page.getByLabel('Alamat pengiriman').fill('Jl. Merdeka No. 10, Bandung');
    await page.getByRole('button', { name: 'Buat pesanan' }).click();

    await expect(page.getByText(/nomor HP Indonesia yang valid/)).toBeVisible();
  });

  test('the chatbot answers a question', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Chat' }).click();
    await page.getByLabel('Pesan Anda').fill('Bisa bayar cicilan?');
    await page.getByRole('button', { name: 'Kirim' }).click();

    await expect(page.getByText(/memilih bayar lunas atau cicilan bulanan/)).toBeVisible();
  });
});
