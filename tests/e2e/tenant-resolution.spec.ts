import { expect, test } from '@playwright/test';

test('proxy attaches tenant kind header', async ({ request }) => {
  const res = await request.get('/tenant-debug', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.kind).toBe('studio');
  expect(json.subdomain).toBe('studio');
});

test('proxy resolves nilex.localhost.test as node', async ({ request }) => {
  const res = await request.get('/tenant-debug', {
    headers: { host: 'nilex.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.kind).toBe('node');
  expect(json.subdomain).toBe('nilex');
});

test('proxy resolves localhost.test as group', async ({ request }) => {
  const res = await request.get('/tenant-debug', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.kind).toBe('group');
});

test('rendered page reflects tenant kind via data-tenant attribute', async ({ request }) => {
  // We can't reliably override the Host header for page.goto() (chromium
  // strips/overrides it), so use an APIRequestContext fetch and parse the HTML.
  const res = await request.get('/en', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toMatch(/<html[^>]*data-tenant="studio"/);
});
