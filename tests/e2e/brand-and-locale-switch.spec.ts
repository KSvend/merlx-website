import { expect, test } from '@playwright/test';

test('brand mark renders inline SVG with three brand colors', async ({ page }) => {
  await page.goto('/en');
  const svg = page.locator('header svg[role="img"][aria-label="MERLx"]');
  await expect(svg).toBeVisible();
  await expect(svg.locator('rect[fill="#1a3a34"]')).toHaveCount(1);
  await expect(svg.locator('rect[fill="#ca5d0f"]')).toHaveCount(1);
  await expect(svg.locator('path[fill="#4a3f6b"]')).toHaveCount(1);
});

test('locale switch navigates between en/fr/ar', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'fr' }).click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.getByRole('button', { name: 'ar' }).click();
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
