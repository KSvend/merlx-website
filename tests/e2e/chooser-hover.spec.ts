import { expect, test } from '@playwright/test';

test('chooser renders both halves', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('.chooser-half--studio')).toBeVisible();
  await expect(page.locator('.chooser-half--network')).toBeVisible();
  await expect(page.getByRole('link', { name: /MERLx Studio/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Network/i })).toBeVisible();
});

test('hovering studio expands its width', async ({ page }) => {
  await page.goto('/en');
  const studio = page.locator('.chooser-half--studio');

  const baseBox = await studio.boundingBox();
  await studio.hover();
  await page.waitForTimeout(700);
  const hoverBox = await studio.boundingBox();

  expect(baseBox).not.toBeNull();
  expect(hoverBox).not.toBeNull();
  if (baseBox && hoverBox) {
    expect(hoverBox.width).toBeGreaterThan(baseBox.width);
  }
});

test('hovering studio pushes network rightward', async ({ page }) => {
  await page.goto('/en');
  const studio = page.locator('.chooser-half--studio');
  const network = page.locator('.chooser-half--network');

  const baseNetworkBox = await network.boundingBox();
  await studio.hover();
  await page.waitForTimeout(700);
  const hoverNetworkBox = await network.boundingBox();

  expect(baseNetworkBox).not.toBeNull();
  expect(hoverNetworkBox).not.toBeNull();
  if (baseNetworkBox && hoverNetworkBox) {
    expect(hoverNetworkBox.x).toBeGreaterThan(baseNetworkBox.x);
  }
});

test('hovering network does NOT push studio', async ({ page }) => {
  await page.goto('/en');
  const studio = page.locator('.chooser-half--studio');
  const network = page.locator('.chooser-half--network');

  const baseStudioBox = await studio.boundingBox();
  await network.hover();
  await page.waitForTimeout(700);
  const hoverStudioBox = await studio.boundingBox();

  expect(baseStudioBox).not.toBeNull();
  expect(hoverStudioBox).not.toBeNull();
  if (baseStudioBox && hoverStudioBox) {
    expect(hoverStudioBox.x).toBe(baseStudioBox.x);
  }
});
