import { expect, test } from '@playwright/test';

test('bare / redirects to /en', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  await expect(page).toHaveURL(/\/en$/);
});

test('/en serves English landing', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByText(/Advanced analytics for humanitarian/i)).toBeVisible();
});

test('/fr loads with lang=fr', async ({ page }) => {
  await page.goto('/fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('/ar loads with RTL', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
