import { expect, test } from '@playwright/test';

test('bare / redirects to /en', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  await expect(page).toHaveURL(/\/en$/);
});

test('/en serves English chrome strings', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByText('Tenant')).toBeVisible();
});

test('/fr serves French chrome strings', async ({ page }) => {
  await page.goto('/fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByText('Locataire')).toBeVisible();
});

test('/ar serves Arabic + RTL', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByText('المستأجر')).toBeVisible();
});
