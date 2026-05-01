import { expect, test } from '@playwright/test';

test('pages collection responds via REST', async ({ request }) => {
  const res = await request.get('/api/pages?depth=0&limit=1');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('docs');
  expect(Array.isArray(json.docs)).toBe(true);
});
