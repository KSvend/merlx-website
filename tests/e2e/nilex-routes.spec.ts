import { expect, test } from '@playwright/test';

const NILEX_HOST = 'nilex.localhost.test';

test.describe('nilex node tenant', () => {
  test('home renders NilexHome', async ({ request }) => {
    const res = await request.get('/en', { headers: { host: NILEX_HOST } });
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('Sudan-rooted MERL');
    expect(html).toContain('NileX');
  });

  test('walkthrough — home → deployments → news → about → contact', async ({ request }) => {
    const deployments = await request.get('/en/deployments', { headers: { host: NILEX_HOST } });
    expect(deployments.status()).toBe(200);
    expect(await deployments.text()).toContain('OASIS');

    const news = await request.get('/en/news', { headers: { host: NILEX_HOST } });
    expect(news.status()).toBe(200);

    const about = await request.get('/en/about', { headers: { host: NILEX_HOST } });
    expect(about.status()).toBe(200);
    expect(await about.text()).toContain('About NileX');

    const contact = await request.get('/en/contact', { headers: { host: NILEX_HOST } });
    expect(contact.status()).toBe(200);
  });
});

test.describe('nilex tenant gating', () => {
  test('group host 404s on /deployments', async ({ request }) => {
    const res = await request.get('/en/deployments', { headers: { host: 'localhost.test' } });
    expect(res.status()).toBe(404);
  });

  test('studio host 404s on /deployments', async ({ request }) => {
    const res = await request.get('/en/deployments', {
      headers: { host: 'studio.localhost.test' },
    });
    expect(res.status()).toBe(404);
  });

  test('group host 404s on /news', async ({ request }) => {
    const res = await request.get('/en/news', { headers: { host: 'localhost.test' } });
    expect(res.status()).toBe(404);
  });

  test('nilex host 404s on /optics', async ({ request }) => {
    const res = await request.get('/en/optics', { headers: { host: NILEX_HOST } });
    expect(res.status()).toBe(404);
  });

  test('nilex host 404s on /nodes', async ({ request }) => {
    const res = await request.get('/en/nodes', { headers: { host: NILEX_HOST } });
    expect(res.status()).toBe(404);
  });
});
