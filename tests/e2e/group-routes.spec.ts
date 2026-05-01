import { expect, test } from '@playwright/test';

test('about page renders the seeded title', async ({ page }) => {
  await page.goto('/en/about');
  await expect(page.getByRole('heading', { level: 1, name: 'About MERLx' })).toBeVisible();
});

test('legal/privacy renders', async ({ page }) => {
  await page.goto('/en/legal/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible();
});

test('legal/terms renders', async ({ page }) => {
  await page.goto('/en/legal/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of Use' })).toBeVisible();
});

test('legal/cookies renders', async ({ page }) => {
  await page.goto('/en/legal/cookies');
  await expect(page.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeVisible();
});

test('legal/unknown 404s', async ({ page }) => {
  const response = await page.goto('/en/legal/unknown', { waitUntil: 'commit' });
  expect(response?.status()).toBe(404);
});

test('insights index renders', async ({ page }) => {
  await page.goto('/en/insights');
  await expect(page.getByRole('heading', { level: 1, name: 'Insights' })).toBeVisible();
});

test('publications index renders', async ({ page }) => {
  await page.goto('/en/publications');
  await expect(page.getByRole('heading', { level: 1, name: 'Publications' })).toBeVisible();
});
