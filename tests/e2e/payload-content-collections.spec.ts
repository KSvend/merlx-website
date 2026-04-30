import { expect, test } from '@playwright/test';

test.describe('content collections respond via REST', () => {
  test('insights-posts', async ({ request }) => {
    const res = await request.get('/api/insights-posts?depth=0&limit=1');
    expect(res.status()).toBe(200);
    expect(await res.json()).toHaveProperty('docs');
  });

  test('publications', async ({ request }) => {
    const res = await request.get('/api/publications?depth=0&limit=1');
    expect(res.status()).toBe(200);
    expect(await res.json()).toHaveProperty('docs');
  });
});
