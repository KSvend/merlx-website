import { expect, test } from '@playwright/test';

test('studio host now renders StudioHome on / (200)', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain('Optics Suite');
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

test('group host gets 404 on /optics (studio-only)', async ({ request }) => {
  const res = await request.get('/en/optics', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('group host gets 404 on /optics/prism (studio-only)', async ({ request }) => {
  const res = await request.get('/en/optics/prism', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('group host gets 404 on /engage (studio-only)', async ({ request }) => {
  const res = await request.get('/en/engage', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('group host gets 404 on /principles (studio-only)', async ({ request }) => {
  const res = await request.get('/en/principles', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('studio host gets 200 on /optics with all six tools', async ({ request }) => {
  const res = await request.get('/en/optics', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const html = await res.text();
  for (const name of ['PRISM', 'IRIS', 'Aperture', 'ToC Tester', 'OASIS', 'ECHO']) {
    expect(html).toContain(name);
  }
});

test('studio host gets 200 on each per-tool page', async ({ request }) => {
  for (const slug of ['prism', 'iris', 'aperture', 'toc-tester', 'oasis', 'echo']) {
    const res = await request.get(`/en/optics/${slug}`, {
      headers: { host: 'studio.localhost.test' },
    });
    expect(res.status(), `optics/${slug}`).toBe(200);
  }
});

test('studio host gets 200 on each engagement-model page', async ({ request }) => {
  for (const slug of ['hosted', 'pilot', 'build-with', 'advisory']) {
    const res = await request.get(`/en/engage/${slug}`, {
      headers: { host: 'studio.localhost.test' },
    });
    expect(res.status(), `engage/${slug}`).toBe(200);
  }
});
