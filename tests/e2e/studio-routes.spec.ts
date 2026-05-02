import { expect, test } from '@playwright/test';

const STUDIO_HOST = 'studio.localhost.test';

test.describe('studio walkthrough — donor flow', () => {
  test('home → optics → tool detail → engage → contact', async ({ request }) => {
    const home = await request.get('/en', { headers: { host: STUDIO_HOST } });
    expect(home.status()).toBe(200);
    const homeHtml = await home.text();
    expect(homeHtml).toContain('Open analytical tools for fragile contexts.');
    expect(homeHtml).toContain('Optics Suite');

    const optics = await request.get('/en/optics', { headers: { host: STUDIO_HOST } });
    expect(optics.status()).toBe(200);
    const opticsHtml = await optics.text();
    expect(opticsHtml).toContain('Six tools, one thesis');

    const prism = await request.get('/en/optics/prism', { headers: { host: STUDIO_HOST } });
    expect(prism.status()).toBe(200);
    const prismHtml = await prism.text();
    expect(prismHtml).toContain('PRISM');
    expect(prismHtml).toContain('Launch tool');
    expect(prismHtml).toContain('Request a demo');

    const engage = await request.get('/en/engage', { headers: { host: STUDIO_HOST } });
    expect(engage.status()).toBe(200);
    expect(await engage.text()).toContain('Four ways to work with the Studio');

    const hosted = await request.get('/en/engage/hosted', { headers: { host: STUDIO_HOST } });
    expect(hosted.status()).toBe(200);
    expect(await hosted.text()).toContain('Hosted');

    const contact = await request.get('/en/contact', { headers: { host: STUDIO_HOST } });
    expect(contact.status()).toBe(200);
  });

  test('principles renders both columns', async ({ request }) => {
    const res = await request.get('/en/principles', { headers: { host: STUDIO_HOST } });
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('Commitments');
    expect(html).toContain('Beliefs');
    expect(html).toContain('Open by default');
    expect(html).toContain('Better evidence wins better arguments');
  });

  test('about + legal pages render the studio-tenant doc', async ({ request }) => {
    const about = await request.get('/en/about', { headers: { host: STUDIO_HOST } });
    expect(about.status()).toBe(200);
    expect(await about.text()).toContain('About the Studio');

    const privacy = await request.get('/en/legal/privacy', { headers: { host: STUDIO_HOST } });
    expect(privacy.status()).toBe(200);
    expect(await privacy.text()).toContain('Studio Privacy Policy');
  });
});

test.describe('tool subdomain rewrite', () => {
  test('prism.merlx.org / renders the PRISM marketing page', async ({ request }) => {
    const res = await request.get('/', { headers: { host: 'prism.localhost.test' } });
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('PRISM');
    expect(html).toContain('Launch tool');
  });

  test('all six tool subdomains rewrite cleanly', async ({ request }) => {
    const subdomains = ['prism', 'iris', 'aperture', 'toctester', 'oasis', 'echo'];
    for (const sub of subdomains) {
      const res = await request.get('/', { headers: { host: `${sub}.localhost.test` } });
      expect(res.status(), sub).toBe(200);
    }
  });
});
