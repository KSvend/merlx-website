import { expect, test } from '@playwright/test';

test('world landing renders the MERLx wordmark and tagline', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1, name: /MERLx/ })).toBeVisible();
  await expect(page.getByText(/Advanced analytics for humanitarian/i)).toBeVisible();
});

test('world landing has Studio + Network CTAs and Contact link', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('link', { name: /Studio/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Network/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Contact/ }).first()).toBeVisible();
});
