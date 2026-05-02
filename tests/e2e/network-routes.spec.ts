import { expect, test } from '@playwright/test';

const NETWORK_HOST = 'network.localhost.test';

test.describe('network walkthrough', () => {
  test('home → nodes → nilex → services → become-a-node → contact', async ({ request }) => {
    const home = await request.get('/en', { headers: { host: NETWORK_HOST } });
    expect(home.status()).toBe(200);
    const homeHtml = await home.text();
    expect(homeHtml).toContain('A federation of locally owned MERL cooperatives');

    const nodes = await request.get('/en/nodes', { headers: { host: NETWORK_HOST } });
    expect(nodes.status()).toBe(200);
    expect(await nodes.text()).toContain('NileX');

    const nilex = await request.get('/en/nodes/nilex', { headers: { host: NETWORK_HOST } });
    expect(nilex.status()).toBe(200);
    const nilexHtml = await nilex.text();
    expect(nilexHtml).toContain('NileX');
    expect(nilexHtml).toContain('Sudan');

    const services = await request.get('/en/services', { headers: { host: NETWORK_HOST } });
    expect(services.status()).toBe(200);

    const merl = await request.get('/en/services/merl', { headers: { host: NETWORK_HOST } });
    expect(merl.status()).toBe(200);

    const becomeNode = await request.get('/en/become-a-node', { headers: { host: NETWORK_HOST } });
    expect(becomeNode.status()).toBe(200);

    const contact = await request.get('/en/contact', { headers: { host: NETWORK_HOST } });
    expect(contact.status()).toBe(200);
  });

  test('principles renders network variant', async ({ request }) => {
    const res = await request.get('/en/principles', { headers: { host: NETWORK_HOST } });
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('Network principles');
    expect(html).toContain('Locally owned');
    expect(html).toContain('The MERL Guild');
  });

  test('about page renders network-tenant doc', async ({ request }) => {
    const res = await request.get('/en/about', { headers: { host: NETWORK_HOST } });
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('About the Network');
  });
});

test.describe('network tenant gating', () => {
  test('group host 404s on /nodes', async ({ request }) => {
    const res = await request.get('/en/nodes', { headers: { host: 'localhost.test' } });
    expect(res.status()).toBe(404);
  });

  test('group host 404s on /services', async ({ request }) => {
    const res = await request.get('/en/services', { headers: { host: 'localhost.test' } });
    expect(res.status()).toBe(404);
  });

  test('group host 404s on /become-a-node', async ({ request }) => {
    const res = await request.get('/en/become-a-node', { headers: { host: 'localhost.test' } });
    expect(res.status()).toBe(404);
  });

  test('studio host 404s on /nodes', async ({ request }) => {
    const res = await request.get('/en/nodes', { headers: { host: 'studio.localhost.test' } });
    expect(res.status()).toBe(404);
  });

  test('network host 404s on /optics', async ({ request }) => {
    const res = await request.get('/en/optics', { headers: { host: NETWORK_HOST } });
    expect(res.status()).toBe(404);
  });

  test('network host gets 200 on /', async ({ request }) => {
    const res = await request.get('/en', { headers: { host: NETWORK_HOST } });
    expect(res.status()).toBe(200);
  });
});
