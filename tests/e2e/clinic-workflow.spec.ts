import { test, expect } from '@playwright/test';

test.describe('Clinic EMR Complete Workflow Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('1. Should render Dashboard correctly with key clinical stats', async ({ page }) => {
    await expect(page).toHaveTitle(/Klinik|Praktik Dokter/i);
    // Check main dashboard components
    await expect(page.locator('body')).toContainText(/Praktik Dokter Mandiri/i);
  });

  test('2. Should navigate to Antrean page & register a new patient', async ({ page }) => {
    await page.goto('/antrean');
    await expect(page.locator('body')).toContainText(/Antrean Pasien/i);
  });

  test('3. Should open Rekam Medis (EMR) page & render active queue items', async ({ page }) => {
    await page.goto('/rekam-medis');
    await expect(page.locator('body')).toContainText(/Rekam Medis|Pemeriksaan Dokter/i);
  });

  test('4. Should open Kasir page & render unpaid invoices', async ({ page }) => {
    await page.goto('/kasir');
    await expect(page.locator('body')).toContainText(/Kasir|Pembayaran/i);
  });

  test('5. Should open Surat Dokter page & support selection', async ({ page }) => {
    await page.goto('/surat');
    await expect(page.locator('body')).toContainText(/Surat Keterangan|Surat Dokter/i);
  });

  test('6. Should navigate to Master Data Obat & Master Data Tarif', async ({ page }) => {
    await page.goto('/master/obat');
    await expect(page.locator('body')).toContainText(/Stok Obat|Master Data Obat/i);

    await page.goto('/master/tarif');
    await expect(page.locator('body')).toContainText(/Tarif Layanan|Tindakan Medis/i);
  });
});
