import { expect, test } from '@playwright/test';

test('studio host gets 404 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('network host gets 404 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'network.localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('node host gets 404 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'nilex.localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('group host gets 200 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(200);
});
