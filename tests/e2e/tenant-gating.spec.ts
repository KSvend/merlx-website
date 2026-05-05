import { expect, test } from '@playwright/test';

// Visual rebuild pending — these tests assert proxy / tenant-resolution
// only. Content-specific assertions and route-level tenant gating tests
// will return when the new design lands.

test('group host returns 200 on /', async ({ request }) => {
  const res = await request.get('/en', { headers: { host: 'localhost.test' } });
  expect(res.status()).toBe(200);
});

test('studio host returns 200 on /', async ({ request }) => {
  const res = await request.get('/en', { headers: { host: 'studio.localhost.test' } });
  expect(res.status()).toBe(200);
});

test('network host returns 200 on /', async ({ request }) => {
  const res = await request.get('/en', { headers: { host: 'network.localhost.test' } });
  expect(res.status()).toBe(200);
});

test('nilex host returns 200 on /', async ({ request }) => {
  const res = await request.get('/en', { headers: { host: 'nilex.localhost.test' } });
  expect(res.status()).toBe(200);
});

test('unknown node host 404s on /', async ({ request }) => {
  const res = await request.get('/en', { headers: { host: 'unknownnode.localhost.test' } });
  expect(res.status()).toBe(404);
});
