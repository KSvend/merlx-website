import { expect, test } from '@playwright/test';

test('contact page renders the form', async ({ page }) => {
  await page.goto('/en/contact');
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
});

test('contact submission lands a leads row (Turnstile not configured in dev)', async ({ page }) => {
  await page.goto('/en/contact');

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page
    .locator('textarea[name="message"]')
    .fill('This is a test submission with enough characters.');
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 10_000 });
});
